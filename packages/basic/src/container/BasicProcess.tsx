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

  const [excelOpen, setExcelOpen] = useState<boolean>(false)
  const [excelUploadOpen, setExcelUploadOpen] = useState<boolean>(false)

  const [top, setTop] = useState<number>(0)
  const [basicRow, setBasicRow] = useState<Array<any>>([])
  const [column, setColumn] = useState<Array<IExcelHeaderType>>(columnlist.process)
  const [selectList, setSelectList] = useState<Set<number>>(new Set())
  const [optionList, setOptionList] = useState<string[]>(optList)
  const [optionIndex, setOptionIndex] = useState<number>(0)
  const [keyword, setKeyword] = useState<string>('')
  const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
    page: 1,
    total: 1
  })
  const [selectRow , setSelectRow] = useState<number>(0);

  useEffect(() => {
    if(keyword){
      SearchBasic(keyword, optionIndex, pageInfo.page).then(() => {
        Notiflix.Loading.remove()
      })
    }else{
      LoadBasic(pageInfo.page).then(() => {
        Notiflix.Loading.remove()
      })
    }
  }, [pageInfo.page, keyword])

  const loadAllSelectItems = async (column: IExcelHeaderType[]) => {
    let tmpColumn = column.map(async (v: any) => {
      if(v.selectList && v.selectList.length === 0){
        let tmpKey = v.key
        // let res: any

        const res = await RequestMethod('get', `${v.key}All`, )

        // res = await RequestMethod('get', `${tmpKey}List`,{
        //   path: {
        //     page: 1,
        //     renderItem: MAX_VALUE,
        //   }
        // })


        // let pk = "";
        //
        // res.info_list && res.info_list.length && Object.keys(res.info_list[0]).map((v) => {
        //   if(v.indexOf('_id') !== -1){
        //     pk = v
        //   }
        // })

        return {
          ...v,
          selectList: [...res.result.map((value: any) => {
            return {
              ...value,
              // name: value.name,
              // name: tmpKey === 'model' ? value.model : value.name,
              pk: value.ca_id
            }
          })]
        }


      }else{
        if(v.selectList){
          return {
            ...v,
            pk: v.unit_id
          }
        }else{
          return v
        }
      }
    })

    // if(type !== 'productprocess'){
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

  const SaveBasic = async () => {

    const existence = valueExistence()

    if(!existence){
    if(selectList.size === 0){
      return Notiflix.Report.warning(
        '경고',
        '선택된 정보가 없습니다.',
        '확인',
        );
    }

    const searchAiID = (rowAdditional:any[], index:number) => {
      let result:number = undefined;
      rowAdditional?.map((addi, i)=>{
        if(index === i){
          result = addi.ai_id;
        }
      })
      return result;
    }
    let res = await RequestMethod('post', `processSave`,
      basicRow.map((row, i) => {
          if(selectList.has(row.id)){

            let additional:any[] = []
            column.map((v) => {

              if(v.type === "additional"){
                additional.push(v)
              }
            })
            let selectData: any = {}

            return {
              ...row,
              ...selectData,
              additional: [
                ...additional.map((v, index)=>{
                  //if(!row[v.colName]) return undefined;
                  return {
                    mi_id: v.id,
                    title: v.name,
                    value: row[v.colName] ?? "",
                    unit: v.unit,
                    ai_id: searchAiID(row.additional, index) ?? undefined,
                    version:row?.additional[index]?.version ?? undefined
                  }
                }).filter((v) => v)
              ],
            }

          }
        }).filter((v) => v)
    ).catch((error)=>{
      return error.data && Notiflix.Notify.failure(error.data.message);
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
  }else{
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

    const normalRows = []
    const haveIdRows = []

    selectedRows.map((row : any)=>{
      if(row.process_id){
        haveIdRows.push(row)
      }else{
        normalRows.push(row)
      }
    })

    return [normalRows , haveIdRows]
  }


  const DeleteBasic = async () => {


    const map = convertDataToMap()
    const selectedRows = filterSelectedRows()
    const [normalRows , haveIdRows] = classfyNormalAndHave(selectedRows)
    const additional = setAdditionalData()

    if(haveIdRows.length > 0){

      if(normalRows.length !== 0) selectedRows.forEach((nRow)=>{ map.delete(nRow.id)})

      await RequestMethod('delete','processDelete', haveIdRows.map((row) => (
          {...row , customer: row.customerArray, additional : [...additional.map(v => {
            if(row[v.name]) {
              return {id : v.id, title: v.name, value: row[v.name] , unit: v.unit}
            }
          }).filter(v => v)
          ]}
      )))

    }

    Notiflix.Report.success('삭제되었습니다.','','확인');
    selectedRows.forEach((nRow)=>{ map.delete(nRow.id)})
    setBasicRow(Array.from(map.values()))
    setSelectList(new Set())


    // const res = await RequestMethod('delete', `processDelete`,

    //     basicRow.map((row, i) => {
    //       if(selectList.has(row.id)){
    //         let selectKey: string[] = []
    //         let additional:any[] = []
    //         column.map((v) => {
    //           if(v.selectList){
    //             selectKey.push(v.key)
    //           }

    //           if(v.type === 'additional'){
    //             additional.push(v)
    //           }
    //         })

    //         let selectData: any = {}
    //         if(row.process_id){
    //           return {
    //             ...row,
    //             ...selectData,
    //             additional: additional.map(v => {
    //               if(row[v.name]) {
    //                 return {
    //                   id: v.id,
    //                   title: v.name,
    //                   value: row[v.name],
    //                   unit: v.unit
    //                 }
    //               }
    //             }).filter((v) => v)
    //           }
    //         }

    //       }
    //     }).filter((v) => v)
    //   )

    // if(res) {

    //     Notiflix.Report.success('삭제 성공!', '공정 데이터를 삭제하였습니다.', '확인', () => {
    //       if(Number(page) === 1){
    //         LoadBasic(1).then(() => {
    //           Notiflix.Loading.remove()
    //         })
    //       }else{
    //         if(keyword){
    //           router.push(`/mes/basic/process?page=1&keyword=${keyword}&opt=${option}`)
    //         }else{
    //           router.push(`/mes/basic/process?page=1`)
    //         }
    //       }
    //     })

    // }
  }

  const LoadBasic = async (page?: number) => {
    Notiflix.Loading.circle()
    const res = await RequestMethod('get', `processList`,{
      path: {
        page: (page || page !== 0) ? page : 1,
        renderItem: 18,
      }
    })

    if(res){
      if(res.totalPages < page){
        LoadBasic(page - 1).then(() => {
          Notiflix.Loading.remove()
        })
      }else{
        setPageInfo({
          ...pageInfo,
          page: res.page,
          total: res.totalPages
        })
        cleanUpData(res)
      }
    }

    setSelectList(new Set())
  }

  const SearchBasic = async (keyword: any, option: number, isPaging?: number) => {
    if(!isPaging){
      setOptionIndex(option)
    }

    const res = await RequestMethod('get', `processSearch`,{
      path: {
        page: isPaging ?? 1,
        renderItem: 18,
      },
      params: {
        keyword: keyword ?? '',
        opt: option ?? 0
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
  const cleanUpBasicData = (res:any) => {
    let tmpRow = res.data.results.info_list;

    let tmpBasicRow = tmpRow.map((row: any, index: number) => {
      let realTableData: any = changeRow(row)
      let appendAdditional: any = {}

      row.additional && row.additional.map((v: any) => {
        appendAdditional = {
          ...appendAdditional,
          [v.title]: v.value
        }
      })

      const random_id = Math.random()*1000

      return {
        ...realTableData,
        ...appendAdditional,
        id: `process_${random_id}`,
      }
    })
    setBasicRow([...tmpBasicRow])
  }
  const cleanUpData = (res: any) => {
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

    loadAllSelectItems( [
      ...tmpColumn,
      ...additionalMenus
    ] )

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

        Notiflix.Confirm.show("경고","삭제하시겠습니까?","확인","취소",
          ()=>{DeleteBasic()},
          ()=>{}
        )

        break;

    }
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
        onChangeSearchKeyword={(keyword) => {
          setKeyword(keyword)
        }}
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
        pageInfo={pageInfo}
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
            if(v.isChange) tmp.add(v.id)
          })
          setSelectList(tmp)
          // setBasicRow(e)
          competeProcess(e)
        }}
        selectList={selectList}
        //@ts-ignore
        setSelectList={setSelectList}
        setSelectRow={setSelectRow}
        loadEvent={LoadBasic}
        height={basicRow.length * 40 >= 40*18+56 ? 40*19 : basicRow.length * 40 + 56}
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
