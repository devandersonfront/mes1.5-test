import React, {useEffect, useState} from 'react'
import {
    columnlist,
    excelDownload,
    ExcelDownloadModal,
    ExcelTable,
    Header as PageHeader,
    IExcelHeaderType,
    MAX_VALUE,
    PaginationComponent,
    RequestMethod,
    TextEditor
} from 'shared'
// @ts-ignore
import {SelectColumn} from 'react-data-grid'
import Notiflix from "notiflix";
import {useRouter} from 'next/router'
import {NextPageContext} from 'next'
import moment from 'moment'
import {deleteMenuSelectState, setMenuSelectState} from "shared/src/reducer/menuSelectState";
import {useDispatch} from "react-redux";
import {additionalMenus, getTableSortingOptions, loadAllSelectItems, setExcelTableHeight} from 'shared/src/common/Util';
import {TableSortingOptionType} from "shared/src/@types/type";
import addColumnClass from '../../../main/common/unprintableKey'
export interface IProps {
  children?: any
  page?: number
  keyword?: string
  option?: number
}

const deviceList = [
  {pk: 0, name: "선택없음"},
  {pk: 1, name: "미스피드 검출장치"},
  {pk: 2, name: "하사점 검출장치"},
  {pk: 3, name: "로드모니터"},
  {pk: 4, name: "앵글시퀀서"},
  {pk: 5, name: "엔코더"},
  {pk: 6, name: "통관센서"},
  {pk: 7, name: "유틸리티 센서"},
]

const BasicDevice = ({}: IProps) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [excelOpen, setExcelOpen] = useState<boolean>(false)
  const [basicRow, setBasicRow] = useState<Array<any>>([])
  const [column, setColumn] = useState<Array<IExcelHeaderType>>( columnlist["device"])
  const [sortingOptions, setSortingOptions] = useState<TableSortingOptionType>({orders:[], sorts:[]})
  const [selectList, setSelectList] = useState<Set<number>>(new Set())
  const [optionList, setOptionList] = useState<string[]>(["장치 제조사", "장치 이름", "제조 번호", "담당자"])
  const [optionIndex, setOptionIndex] = useState<number>(0)
  const [selectRow , setSelectRow] = useState<number>(0);
  const [keyword, setKeyword] = useState<string>();
  const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
    page: 1,
    total: 1
  })

  const [typesState, setTypesState] = useState<number>(null);

  const changeTypesState = (value:number) => {
    setPageInfo({page:1, total:1})
    setTypesState(value);
  }

  const reload = (keyword?:string, sortingOptions?: TableSortingOptionType) => {
    setKeyword(keyword)
    if(pageInfo.page > 1) {
      setPageInfo({...pageInfo, page: 1})
    } else {
      getData(undefined, keyword, sortingOptions)
    }
  }

  useEffect(() => {
    getData(pageInfo.page, keyword)
  }, [pageInfo.page, typesState]);

  useEffect(() => {
    dispatch(setMenuSelectState({main:"주변장치 기준정보",sub:"/mes/basic/device"}))
    return (() => {
      dispatch(deleteMenuSelectState())
    })
  },[])

  // const loadAllSelectItems = async (column: IExcelHeaderType[]) => {
  //   const changeOrder = (sort:string, order:string) => {
  //     const _sortingOptions = getTableSortingOptions(sort, order, sortingOptions)
  //     setSortingOptions(_sortingOptions)
  //     reload(null, _sortingOptions)
  //   }
  //   let tmpColumn = column.map((v: any) => {
  //     const sortIndex = sortingOptions.sorts.findIndex(value => value === v.key)
  //     return {
  //       ...v,
  //       pk: v.unit_id,
  //       sortOption: sortIndex !== -1 ? sortingOptions.orders[sortIndex] : v.sortOption ?? null,
  //       sorts: v.sorts ? sortingOptions : null,
  //       result: v.sortOption ? changeOrder : v.selectList ? changeTypesState : null,
  //     }
  //   });
  //
  //   Promise.all(tmpColumn).then(res => {
  //     setColumn([...res.map(v=> {
  //       return {
  //         ...v,
  //         name: v.moddable ? v.name+'(필수)' : v.name
  //       }
  //     })])
  //   })
  // }

  const valueExistence = () => {

    const selectedRows = filterSelectedRows()

    if(selectedRows.length > 0){

      const nameCheck = selectedRows.every((data)=> data.mfrCode)

      if(!nameCheck){
        return '제조 번호'
      }

    }

    return false;

  }

  const SaveBasic = async () => {

    const existence = valueExistence()

    if(selectList.size === 0){
      return Notiflix.Report.warning(
        '경고',
        '선택된 정보가 없습니다.',
        '확인',
        );
    }

    if(!existence){
      const searchAiID = (rowAdditional:any[], index:number) => {
        let result:number = undefined;
        rowAdditional.map((addi, i)=>{
          if(index === i){
            result = addi.ai_id;
          }
        })
        return result;
      }

      let pass = true;
      basicRow.map((value)=>{
        if(selectList.has(value.id) && value.mfrCode === undefined || value.mfrCode === ""){
          pass = false;
          return Notiflix.Report.failure("경고", "제조 번호를 입력해주세요.", "확인")
        }
      })
      if(pass){
      let res: any
      res = await RequestMethod('post', `deviceSave`,
        basicRow.map((row, i) => {
            if(selectList.has(row.id)){
              let selectKey: string[] = []
              let additional:any[] = []
              column.map((v) => {
                if(v.selectList){
                  selectKey.push(v.key)
                }

                if(v.type === 'additional'){
                  additional.push(v)
                }
              })

              let selectData: any = {}

              Object.keys(row).map(v => {
                if(v.indexOf('PK') !== -1) {
                  selectData = {
                    ...selectData,
                    [v.split('PK')[0]]: row[v]
                  }
                }

                if(v === 'unitWeight') {
                  selectData = {
                    ...selectData,
                    unitWeight: Number(row['unitWeight'])
                  }
                }

                if(v === 'tmpId') {
                  selectData = {
                    ...selectData,
                    id: row['tmpId']
                  }
                }
              })
              return {
                ...row,
                ...selectData,
                type:row.type_id,
                manager: row.user?.user_id ? row.user : null,
                factory: row.factory?.factory_id ? row.factory : null,
                subFactory: row?.subFactory?.sf_id ? {...row?.subFactory, manager:row?.subFactory?.manager_info} : null,
                photo: row.photo?.uuid ?? row.photo,
                qualify: row.qualify?.uuid ?? row.qualify,
                guideline: row.guideline?.uuid ?? row.guideline,
                capacity: row.capacity?.uuid ?? row.capacity,
                additional: [
                  ...additional.map((v, index)=>{
                    //if(!row[v.colName]) return undefined;
                    return {
                      mi_id: v.id,
                      title: v.name,
                      value: row[v.colName] ?? "",
                      unit: v.unit,
                      ai_id: searchAiID(row.additional, index) ?? undefined,
                      version:row.additional[index]?.version ?? undefined
                    }
                  }).filter((v) => v)
                ]
              }

            }
          }).filter((v) => v)).catch((error)=>{
            return error.data && Notiflix.Report.warning("경고",`${error.data.message}`,"확인");
          })



      if(res){
        Notiflix.Report.success('저장되었습니다.','','확인', () => reload());
      }
    }
    }else{
      return Notiflix.Report.warning(
        '경고',
        `"${existence}"은 필수적으로 들어가야하는 값 입니다.`,
        '확인',
      );
    }
  }

  const getRequestParams = (keyword?: string, _sortingOptions?: TableSortingOptionType) => {
    let params = {}
    if(keyword) {
      params['keyword'] = keyword
      params['opt'] = optionIndex
    }
    //이 부분 해제하면됨
    if(sortingOptions.orders.length > 0){
      params['orders'] = _sortingOptions ? _sortingOptions.orders : sortingOptions.orders
      params['sorts'] = _sortingOptions ? _sortingOptions.sorts : sortingOptions.sorts
    }
    if(typesState) params['types'] = typesState
    return params
  }


  const getData = async (page: number = 1, keyword?: string, _sortingOptions?: TableSortingOptionType) => {
    Notiflix.Loading.circle()
    const res = await RequestMethod('get', keyword ? 'deviceSearch' : 'deviceList',{
      path: {
        page: page ?? 1,
        renderItem: 18,
      },
      params: getRequestParams(keyword, _sortingOptions)
    })

    if(res){
      if (res.totalPages > 0 && res.totalPages < res.page) {
        reload();
      } else {
        setPageInfo({
          ...pageInfo,
          page: res.page,
          total: res.totalPages
        })
        cleanUpData(res)
      }
    }
    setSelectList(new Set())
    Notiflix.Loading.remove()
  }

  const cleanUpData = (res: any) => {
    let tmpColumn = columnlist["device"];
    let tmpRow = []
    tmpColumn = tmpColumn.map((column: any) => {
      let menuData: object | undefined;
      res.menus && res.menus.map((menu: any) => {
        if(!menu.hide){
          if(menu.colName === column.key){
            menuData = {
              id: menu.mi_id,
              name: menu.title,
              width: menu.width,
              tab:menu.tab,
              unit:menu.unit,
              moddable: !menu.moddable,
              version: menu.version,
              sequence: menu.sequence,
              hide: menu.hide
            }
          } else if(menu.colName === 'id' && column.key === 'tmpId'){
            menuData = {
              id: menu.mi_id,
              name: menu.title,
              width: menu.width,
              tab:menu.tab,
              unit:menu.unit,
              moddable: !menu.moddable,
              version: menu.version,
              sequence: menu.sequence,
              hide: menu.hide
            }
          }
        }
      })

      if(menuData){
        return {
          ...column,
          ...menuData
        }
      }
    }).filter((v:any) => v)


    tmpRow = res.info_list

    loadAllSelectItems({column:tmpColumn.concat(additionalMenus(res)), sortingOptions, setSortingOptions, reload, setColumn, changeSetTypesState:changeTypesState});


    let selectKey = ""
    tmpColumn.map((v: any) => {
      if(v.selectList){
        selectKey = v.key
      }
    })


    let pk = "";
    Object.keys(tmpRow).map((v) => {
      if(v.indexOf('_id') !== -1){
        pk = v
      }
    })

    let tmpBasicRow = tmpRow.map((row: any, index: number) => {

      let appendAdditional: any = {}

      row.additional && row.additional.map((v: any) => {
        appendAdditional = {
          ...appendAdditional,
          [v.mi_id]: v.value
        }
      })

      let random_id = Math.random()*1000;
      return {
        ...row,
        ...appendAdditional,
        factory_id: row?.factory?.name,
        factory_info:row?.factory,
        affiliated_id: row?.subFactory?.name,
        subFactory_info:row?.subFactory,
        type_id: row?.type,
        type: deviceList[row.type]?.name,
        user: row?.manager,
        id: `device_${random_id}`,
      }
    })

    setBasicRow([...tmpBasicRow])
  }

  const downloadExcel = () => {
    let tmpSelectList: boolean[] = []
    basicRow.map(row => {
      tmpSelectList.push(selectList.has(row.id))
    })
    excelDownload(column, basicRow, `mold`, "mold", tmpSelectList)
  }

  const setAdditionalData = () => {

    const addtional = []
    basicRow.map((row)=>{
      if(selectList.has(row.id)){
        column.map((v) => {
          if(v.type === 'additional'){
              addtional.push(v)
            }
          })
      }
    })

    return addtional;
  }


  const convertDataToMap = () => {
    const map = new Map()
    basicRow.map((v)=>map.set(v.id , v))
    return map
  }

  const filterSelectedRows = () => {
    return basicRow.map((row)=> selectList.has(row.id) && row).filter(v => v)
  }

  const classfyNormalAndHave = (selectedRows) => {

    const haveIdRows = []

    selectedRows.map((row : any)=>{
      if(row.device_id){
        haveIdRows.push(row)
      }
    })

    return haveIdRows
  }

  const DeleteBasic = async () => {

    const map = convertDataToMap()
    const selectedRows = filterSelectedRows()
    const haveIdRows = classfyNormalAndHave(selectedRows)
    const additional = setAdditionalData()
    let deletable = true

    if(haveIdRows.length > 0){

      deletable = await RequestMethod('delete','deviceDelete', haveIdRows.map((row) => (
          {...row , type : row.type_id, additional : [...additional.map(v => {
            if(row[v.name]) {
              return {id : v.id, title: v.name, value: row[v.name] , unit: v.unit}
            }
          }).filter(v => v)
          ]}
      )))
      reload()
    }else{

      selectedRows.forEach((row)=>{map.delete(row.id)})
      setBasicRow(Array.from(map.values()))
      setPageInfo({page: pageInfo.page, total: pageInfo.total})
      setSelectList(new Set())
    }

    if(deletable){
      Notiflix.Report.success('삭제되었습니다.','','확인');
    }

  }

  const onClickHeaderButton = (index: number) => {
    switch(index){
      case 0:
        // setExcelUploadOpen(true)
        break;
      case 1:
        setExcelOpen(true)
        break;
      case 2:
        router.push(`/mes/item/manage/device`)
        break;
      case 3:
        let items = {}

        column.map((value) => {
          if(value.selectList && value.selectList.length){
            items = {
              ...value.selectList[0],
              [value.key] : value.selectList[0].name,
              [value.key+'PK'] : value.selectList[0].pk, //여기 봐야됨!
              ...items,
            }
          }
        })

        const random_id = Math.random()*1000

        setBasicRow([
          {
            ...items,
            id: `device_${random_id}`,
            name: null,
            additional: [],
            madeAt: moment().format("YYYY-MM-DD")
          },
          ...basicRow
        ])
        break;

      case 4:
        SaveBasic()

        break;
      case 5:

        if(selectList.size === 0){
          return Notiflix.Report.warning(
        '경고',
        '선택된 정보가 없습니다.',
        '확인',
        );
        }

        Notiflix.Confirm.show("경고","삭제하시겠습니까?(기존 데이터를 삭제할 경우 저장하지 않은 데이터는 모두 사라집니다.)","확인","취소",
          ()=>{DeleteBasic()},
          ()=>{}
        )
        break;
    }
  }


  const competeDevice = (rows) => {

    const tempRow = [...rows]
    const spliceRow = [...rows]
    spliceRow.splice(selectRow, 1)
    const isCheck = spliceRow.some((row)=> row.mfrCode === tempRow[selectRow].mfrCode && row.mfrCode !== undefined && row.mfrCode !== '')

    if(spliceRow){
      if(isCheck){
        return Notiflix.Report.warning(
          '제조번호 경고',
          `중복된 제조 번호를 입력할 수 없습니다`,
          '확인'
        );
      }
    }

    setBasicRow(rows)
  }

  return (
    <div className={'excelPageContainer'}>
        <PageHeader
          isSearch
          searchKeyword={keyword}
          onSearch={reload}
          searchOptionList={optionList}
          onChangeSearchOption={(option) => {
            setOptionIndex(option)
          }}
          optionIndex={optionIndex}
          title={"주변장치 기준정보"}
          buttons={
            ['', '엑셀', '항목관리', '행추가', '저장하기', '삭제']
          }
          buttonsOnclick={onClickHeaderButton}
        />
        <ExcelTable
          editable
          resizable
          resizeSave
          selectable
          headerList={[
            SelectColumn,
            ...addColumnClass(column)
          ]}
          row={basicRow}
          setRow={(e) => {
            let tmp: Set<any> = selectList
            e.map(v => {
              if(v.isChange) {
                tmp.add(v.id)
                v.isChange = false
              }
            })
            setSelectList(tmp)
            competeDevice(e)
          }}
          onRowClick={(clicked) => {const e = basicRow.indexOf(clicked)
              setSelectRow(e)}}
          selectList={selectList}
          //@ts-ignore
          setSelectList={setSelectList}
          width={1576}
          height={setExcelTableHeight(basicRow.length)}
        />
        <PaginationComponent
          currentPage={pageInfo.page}
          totalPage={pageInfo.total}
          setPage={(page) => {
            setPageInfo({...pageInfo,page:page})
          }}
        />
      <ExcelDownloadModal
        isOpen={excelOpen}
        category={"device"}
        title={"주변장치 기준정보"}
        setIsOpen={setExcelOpen}
        resetFunction={() => reload()}
      />
    </div>
  );
}

export const getServerSideProps = (ctx: NextPageContext) => {
  return {
    props: {
      page: ctx.query.page ?? 1,
      keyword: ctx.query.keyword ?? "",
      option: ctx.query.opt ?? 0,
    }
  }
}

export {BasicDevice};
