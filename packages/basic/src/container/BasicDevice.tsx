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
import {deleteSelectMenuState, setSelectMenuStateChange} from "shared/src/reducer/menuSelectState";
import {useDispatch} from "react-redux";

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

  useEffect(() => {
    // setOptionIndex(option)
    if(keyword){
      SearchBasic(keyword, optionIndex, pageInfo.page).then(() => {
        Notiflix.Loading.remove()
      })
    }else{
      LoadBasic(pageInfo.page).then(() => {
        Notiflix.Loading.remove()
      })
    }
  }, [pageInfo.page, keyword, typesState])

  useEffect(() => {
    dispatch(setSelectMenuStateChange({main:"주변장치 기준정보",sub:""}))
    return (() => {
      dispatch(deleteSelectMenuState())
    })
  },[])

  const loadAllSelectItems = async (column: IExcelHeaderType[]) => {
    let tmpColumn = column.map(async (v: any) => {
      if(v.selectList && v.selectList.length === 0){
        let tmpKey = v.key


        let res: any
        res = await RequestMethod('get', `${tmpKey}List`,{
          path: {
            page: 1,
            renderItem: MAX_VALUE,
          }
        })


        let pk = "";

        res.info_list && res.info_list.length && Object.keys(res.info_list[0]).map((v) => {
          if(v.indexOf('_id') !== -1){
            pk = v
          }
        })
        return {
          ...v,
          selectList: [...res.info_list.map((value: any) => {
            return {
              ...value,
              name: tmpKey === 'model' ? value.model : value.name,
              pk: value[pk]
            }
          })]
        }

      }else{
        if(v.selectList){
          return {
            ...v,
            pk: v.unit_id,
            result: changeTypesState
          }
        }else{
          return v
        }
      }
    })

    Promise.all(tmpColumn).then(res => {
      setColumn([...res.map(v=> {
        return {
          ...v,
          name: v.moddable ? v.name+'(필수)' : v.name
        }
      })])
    })
  }

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
                photo: row?.photo?.uuid ?? row?.photo,
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
        Notiflix.Report.success('저장되었습니다.','','확인');
        if(keyword){
          SearchBasic(keyword, optionIndex, pageInfo.page).then(() => {
            Notiflix.Loading.remove()
          })
        }else{
          LoadBasic(pageInfo.page).then(() => {
            Notiflix.Loading.remove()
          })
        }
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


  const LoadBasic = async (page?: number) => {
    Notiflix.Loading.circle()
    const res = await RequestMethod('get', `deviceList`,{
      path: {
        page: (page || page !== 0) ? page : 1,
        renderItem: 18,
      },
      params:
          typesState !== null ?
          {
            types:typesState
          }
          :
          {

          }

    })

    if(res){
      setPageInfo({
        ...pageInfo,
        page: res.page,
        total: res.totalPages
      })
      cleanUpData(res)
    }

    setSelectList(new Set())

  }

  const SearchBasic = async (keyword: any, option: number, isPaging?: number) => {
    Notiflix.Loading.circle()
    if(!isPaging){
      setOptionIndex(option)
    }
    const res = await RequestMethod('get', `deviceSearch`,{
      path: {
        page: isPaging ?? 1,
        renderItem: 18,
      },
      params: typesState ?
          {
            keyword: keyword ?? '',
            opt: option ?? 0,
            types:typesState
          }
          :
          {
            keyword: keyword ?? '',
            opt: option ?? 0,
          }
    })

    if(res){
      setPageInfo({
        ...pageInfo,
        page: res.page,
        total: res.totalPages
      })
      cleanUpData(res)
    }

    setSelectList(new Set())
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

    let additionalMenus = res.menus ? res.menus.map((menu:any) => {
      if(menu.colName === null && !menu.hide){
        return {
          id: menu.mi_id,
          name: menu.title,
          width: menu.width,
          // key: menu.title,
          key: menu.mi_id,
          editor: TextEditor,
          type: 'additional',
          unit: menu.unit,
          tab: menu.tab,
          version: menu.version,
          colName: menu.mi_id,
        }
      }
    }).filter((v: any) => v) : []


    tmpRow = res.info_list

    loadAllSelectItems( [
      ...tmpColumn,
      ...additionalMenus
    ] )


    let selectKey = ""
    let additionalData: any[] = []
    tmpColumn.map((v: any) => {
      if(v.selectList){
        selectKey = v.key
      }
    })

    additionalMenus.map((v: any) => {
      if(v.type === 'additional'){
        additionalData.push(v.key)
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
        id: `mold_${random_id}`,
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
      LoadBasic(1)
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
            id: `process_${random_id}`,
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
    <div>
        <PageHeader
          isSearch
          searchKeyword={keyword}
          onChangeSearchKeyword={(keyword) => {
            setKeyword(keyword)
            setPageInfo({page:1, total:1})
          }}
          searchOptionList={optionList}
          onChangeSearchOption={(option) => {
            setOptionIndex(option)
          }}
          optionIndex={optionIndex}
          title={"주변장치 기준정보"}
          buttons={
            ['', '', '항목관리', '행추가', '저장하기', '삭제']
          }
          buttonsOnclick={onClickHeaderButton}
        />
        <ExcelTable
          editable
          resizable
          headerList={[
            SelectColumn,
            ...column
          ]}
          row={basicRow}
          // setRow={setBasicRow}
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
          setSelectRow={setSelectRow}
          selectList={selectList}
          //@ts-ignore
          setSelectList={setSelectList}
          height={basicRow.length * 40 >= 40*18+56 ? 40*19 : basicRow.length * 40 + 56}
        />
        <PaginationComponent
          currentPage={pageInfo.page}
          totalPage={pageInfo.total}
          setPage={(page) => {
            setPageInfo({...pageInfo,page:page})
          }}
        />
      {/*<ExcelDownloadModal*/}
      {/*  isOpen={excelOpen}*/}
      {/*  column={column}*/}
      {/*  basicRow={basicRow}*/}
      {/*  filename={`금형기준정보`}*/}
      {/*  sheetname={`금형기준정보`}*/}
      {/*  selectList={selectList}*/}
      {/*  tab={'ROLE_BASE_07'}*/}
      {/*  setIsOpen={setExcelOpen}*/}
      {/*/>*/}
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
