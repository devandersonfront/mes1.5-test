import React, {useEffect, useState} from 'react'
import {
  columnlist,
  excelDownload,
  ExcelTable,
  Header as PageHeader,
  IExcelHeaderType,
  PaginationComponent,
  RequestMethod,
  TextEditor
} from 'shared'
// @ts-ignore
import {SelectColumn} from 'react-data-grid'
import Notiflix from "notiflix";
import {useRouter} from 'next/router'
import {NextPageContext} from 'next'
import {useDispatch} from "react-redux";
import {deleteMenuSelectState, setMenuSelectState} from "shared/src/reducer/menuSelectState";
import {getTableSortingOptions, setExcelTableHeight} from 'shared/src/common/Util'
import {TableSortingOptionType} from "shared/src/@types/type";

export interface IProps {
  children?: any
  page?: number
  keyword?: string
  option?: number
}

const title = '공정 종류 관리'
const optList = ['공정명']
const BasicProcess = ({}: IProps) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [excelOpen, setExcelOpen] = useState<boolean>(false)
  const [excelUploadOpen, setExcelUploadOpen] = useState<boolean>(false)

  const [top, setTop] = useState<number>(0)
  const [basicRow, setBasicRow] = useState<Array<any>>([])
  const [column, setColumn] = useState<Array<IExcelHeaderType>>(columnlist.process)
  const [sortingOptions, setSortingOptions] = useState<TableSortingOptionType>({orders:[], sorts:[]})
  const [selectList, setSelectList] = useState<Set<number>>(new Set())
  const [optionList, setOptionList] = useState<string[]>(optList)
  const [optionIndex, setOptionIndex] = useState<number>(0)
  const [selectRow , setSelectRow] = useState<number>(0);
  const [keyword, setKeyword] = useState<string>();
  const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
    page: 1,
    total: 1
  })

  const reload = (keyword?:string, sortingOptions?: TableSortingOptionType) => {
    setKeyword(keyword)
    if(pageInfo.page > 1) {
      setPageInfo({...pageInfo, page: 1})
    } else {
      getData(undefined, keyword, sortingOptions)
    }
  }

  useEffect(() => {
    getData(pageInfo.page, keyword, sortingOptions)
  }, [pageInfo.page]);

  useEffect(() => {
    dispatch(setMenuSelectState({main:"공정 관리",sub:router.pathname}))
    return (() => {
      dispatch(deleteMenuSelectState())
    })
  },[])

  const loadAllSelectItems = async (column: IExcelHeaderType[], keyword?:string) => {
    const changeOrder = (sort:string, order:string) => {
      const _sortingOptions = getTableSortingOptions(sort, order, sortingOptions)
      setSortingOptions(_sortingOptions)
      reload(keyword, _sortingOptions)
    }
    let tmpColumn = column.map((v: any) => {
      const sortIndex = sortingOptions.sorts.findIndex(value => value === v.key)
      return {
        ...v,
        pk: v.unit_id,
        sortOption: sortIndex !== -1 ? sortingOptions.orders[sortIndex] : v.sortOption ?? null,
        sorts: v.sorts ? sortingOptions : null,
        result: v.sortOption ? changeOrder : null,
      }
    });

    Promise.all(tmpColumn).then(res => {
      setColumn([...res.map(v=> {
        return {
          ...v,
          name: v.moddable ? v.name+'(필수)' : v.name
        }
      })])
    })
    // }
  }
  const SaveBasic = async () => {
    const existence = valueExistence()

    if (selectList.size === 0) {
      return Notiflix.Report.warning(
          '경고',
          '선택된 정보가 없습니다.',
          '확인',
      );
    }


    if (!existence) {

      const searchAiID = (rowAdditional: any[], index: number) => {
        let result: number = undefined;
        rowAdditional?.map((addi, i) => {
          if (index === i) {
            result = addi.ai_id;
          }
        })
        return result;
      }
      let res = await RequestMethod('post', `processSave`,
          basicRow.map((row, i) => {
            if (selectList.has(row.id)) {

              let additional: any[] = []
              column.map((v) => {

                if (v.type === "additional") {
                  additional.push(v)
                }
              })
              let selectData: any = {}

              return {
                ...row,
                ...selectData,
                additional: [
                  ...additional.map((v, index) => {
                    //if(!row[v.colName]) return undefined;
                    return {
                      mi_id: v.id,
                      title: v.name,
                      value: row[v.colName] ?? "",
                      unit: v.unit,
                      ai_id: searchAiID(row.additional, index) ?? undefined,
                      version: row?.additional[index]?.version ?? undefined
                    }
                  }).filter((v) => v)
                ],
              }

            }
          }).filter((v) => v)
      ).catch((error) => {
        return error.data && Notiflix.Report.warning("경고", `${error.data.message}`, "확인");
      })


      if (res) {
        Notiflix.Report.success('저장되었습니다.', '', '확인', () => reload());
      }
    } else {
      return Notiflix.Report.warning(
          '경고',
          `"${existence}"은 필수적으로 들어가야하는 값 입니다.`,
          '확인',
      );
    }
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
      if(row.process_id){
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

      deletable = await RequestMethod('delete','processDelete', haveIdRows.map((row) => (
          {...row , customer: row.customerArray, additional : [...additional.map(v => {
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

  const getRequestParams = (keyword?: string, _sortingOptions?: TableSortingOptionType) => {
    let params = {}
    if(keyword) {
      params['keyword'] = keyword
      params['opt'] = optionIndex
    }
    if(sortingOptions.orders.length > 0){
      params['orders'] = _sortingOptions ? _sortingOptions.orders : sortingOptions.orders
      params['sorts'] = _sortingOptions ? _sortingOptions.sorts : sortingOptions.sorts
    }
    return params
  }

  const getData = async (page: number = 1, keyword?: string, _sortingOptions?: TableSortingOptionType) => {
    Notiflix.Loading.circle()
    const res = await RequestMethod('get', keyword ? 'processSearch' : 'processList',{
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
        cleanUpData(res, keyword)
      }
    }
    setSelectList(new Set())
    Notiflix.Loading.remove()
  }

  const changeRow = (row: any) => {
    let tmpData = {}

    if(row.additional && row.additional.length) {
      row.additional.map(v => {
        tmpData = {
          ...tmpData,
          [v.key]: v.value
        }
      })
    }

    return {
      process_id: row.process_id,
      name: row.name,
      version: row.version,
      ...tmpData
    }
  }

  const cleanUpData = (res: any, keyword?:string) => {
    let tmpColumn = columnlist.process
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

    loadAllSelectItems( [...tmpColumn, ...additionalMenus], keyword)

    tmpRow = res.info_list

    let tmpBasicRow = tmpRow.map((row: any, index: number) => {
      let realTableData: any = changeRow(row)
      let appendAdditional: any = {}
      row.additional && row.additional.map((v: any) => {
        appendAdditional = {
          ...appendAdditional,
          [v.mi_id]: v.value
        }
      })

      const random_id = Math.random()*1000

      return {
        ...row,
        ...realTableData,
        ...appendAdditional,
        id: `process_${random_id}`,
      }
    })

    setBasicRow([...tmpBasicRow])
  }

  const downloadExcel = () => {
    let tmpSelectList: boolean[] = []
    basicRow.map(row => {
      tmpSelectList.push(selectList.has(row.id))
    })
    excelDownload(column, basicRow, `process`, 'process', tmpSelectList)
  }

  const onClickHeaderButton = (index: number) => {
    switch(index){
      case 0:
        setExcelUploadOpen(true)
        break;
      case 1:
        setExcelOpen(true)
        break;
      case 2:
        router.push(`/mes/item/manage/process`)
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

  const valueExistence = () => {

    const selectedRows = filterSelectedRows()

    // 내가 선택을 했는데 새롭게 추가된것만 로직이 적용되어야함
    if(selectedRows.length > 0){

      const nameCheck = selectedRows.every((data)=> data.name)

      if(!nameCheck){
        return '공정명'
      }

    }

    return false;

  }

  const competeProcess = (rows) => {

    const tempRow = [...rows]
    const spliceRow = [...rows]
    spliceRow.splice(selectRow, 1)

    if(spliceRow){
      if(spliceRow.some((row)=> row.name === tempRow[selectRow].name && row.name !== null && row.name !== '')){
        return Notiflix.Report.warning(
            '공정명 경고',
            `중복된 공정명을 입력할 수 없습니다`,
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
        onSearch={reload}
        searchOptionList={optionList}
        onChangeSearchOption={(option) => {
          setOptionIndex(option)
        }}
        title={title}
        buttons={['','', '항목관리', '행 추가', '저장하기', '삭제']}
        buttonsOnclick={onClickHeaderButton}
      />
      <ExcelTable
        editable
        resizable
        resizeSave
        pageInfo={pageInfo}
        selectable
        headerList={[
          SelectColumn,
          ...column
        ]}
        top={top}
        setTop={setTop}
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
          // setBasicRow(e)
          competeProcess(e)
        }}
        selectList={selectList}
        //@ts-ignore
        setSelectList={setSelectList}
        onRowClick={(clicked) => {const e = basicRow.indexOf(clicked)
              setSelectRow(e)}}
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

export {BasicProcess};
