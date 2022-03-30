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
    setModifyInitData,
    TextEditor
} from 'shared'
// @ts-ignore
import {SelectColumn} from 'react-data-grid'
import Notiflix from "notiflix";
import {useRouter} from 'next/router'
import {NextPageContext} from 'next'
import moment from 'moment'
import {useDispatch} from 'react-redux'

interface IProps {
  children?: any
  page?: number
  keyword?: string
  option?: number
}

const dummyDate = moment().subtract(10, 'days')

const MesSubMaterialStock = ({page, keyword, option}: IProps) => {
  const router = useRouter()
  const dispatch = useDispatch()

  const [excelOpen, setExcelOpen] = useState<boolean>(false)

  const [basicRow, setBasicRow] = useState<Array<any>>([{
    date: dummyDate.format('YYYY-MM-DD'), useDate: 10,
    code: 'SUS-111', name: 'SUS360', texture: 'SUS360', depth: '1.2', width: 3000, height: 3000, type: 'COIL', amount: 1000,
    number: `${dummyDate.format('YYMMDD')}-01-01`, current: 1000, customer: '한국상사',
  }])
  const [column, setColumn] = useState<Array<IExcelHeaderType>>( columnlist["substockV1u"])
  const [selectList, setSelectList] = useState<Set<number>>(new Set())
  const [optionList, setOptionList] = useState<string[]>(['부자재 CODE', '부자재 품명',  '부자재 LOT 번호', '거래처'])
  const [optionIndex, setOptionIndex] = useState<number>(0)
  const [order, setOrder] = useState<number>(0);
  const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
    page: 1,
    total: 1
  })

  const [selectDate, setSelectDate] = useState<{from:string, to:string}>({
    from: moment().subtract(1,'month').format('YYYY-MM-DD'),
    to: moment().format('YYYY-MM-DD')
  });

  const [nzState, setNzState] = useState<boolean>(false);
  const [first, setFirst] = useState<boolean>(true);
  const changeNzState = (value:boolean) => {
    setNzState(value);
  }
  const changeOrder = (value: string) => {
    setOrder(Number(value));
    setPageInfo({page:1,total:1})
  }

  useEffect(() => {
    setOptionIndex(option)
    if(keyword){
      SearchBasic(keyword, option, page).then(() => {
        Notiflix.Loading.remove()
      })
    }else{
      LoadBasic(page).then(() => {
        Notiflix.Loading.remove()
      })
    }
  }, [pageInfo.page, keyword, option, nzState, selectDate, order])


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

        res.results.info_list && res.results.info_list.length && Object.keys(res.results.info_list[0]).map((v) => {
          if(v.indexOf('_id') !== -1){
            pk = v
          }
        })
        return {
          ...v,
          selectList: [...res.results.info_list.map((value: any) => {
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
            result: changeOrder
          }
        }else{
          return v
        }
      }
    })

    // if(type !== 'productprocess'){
    Promise.all(tmpColumn).then(res => {
      setColumn([...res])
    })
    // }
  }


  const LoadBasic = async (page?: number) => {
    Notiflix.Loading.circle()
    const res = await RequestMethod('get', `subInList`,{
      path: {
        page: (page || page !== 0) ? page : 1,
        renderItem: 18,
      },
      params: order == 0 ?
          {
            nz:nzState,
            from:selectDate.from,
            to:selectDate.to
          }
          :
          {
            sorts: 'date',
            order: order == 1 ? 'ASC' : 'DESC',
            from:selectDate.from,
            to:selectDate.to
          }
    })

    if(res){
      setFirst(false);
      setPageInfo({
        ...pageInfo,
        page: res.page,
        total: res.totalPages
      })
      cleanUpData(res)
    }

  }

  const SearchBasic = async (keyword: any, option: number, isPaging?: number) => {
    Notiflix.Loading.circle()
    if(!isPaging){
      setOptionIndex(option)
    }
    const res = await RequestMethod('get', `lotSmSearch`,{
      path: {
        page: isPaging ?? 1,
        renderItem: 18,
      },
      params: order == 0 ?
          {
            keyword: keyword ?? '',
            opt: option ?? 0,
            nz:nzState,
            from:selectDate.from,
            to:selectDate.to
          }
          :
          {
            sorts: 'date',
            order: order == 1 ? 'ASC' : 'DESC',
            keyword: keyword ?? '',
            opt: option ?? 0,
            nz:nzState,
            from:selectDate.from,
            to:selectDate.to
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
  }

  const cleanUpData = (res: any) => {
    let tmpColumn = columnlist["substockV1u"];
    let tmpRow = []
    tmpColumn = tmpColumn.map((column: any) => {
      let menuData: object | undefined;
      res.menus && res.menus.map((menu: any) => {
        if(menu.colName === column.key){
          menuData = {
            id: menu.id,
            name: menu.title,
            width: menu.width,
            tab:menu.tab,
            unit:menu.unit
          }
        } else if(menu.colName === 'id' && column.key === 'tmpId'){
          menuData = {
            id: menu.id,
            name: menu.title,
            width: menu.width,
            tab:menu.tab,
            unit:menu.unit
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
      if(menu.colName === null){
        return {
          id: menu.id,
          name: menu.title,
          width: menu.width,
          key: menu.title,
          editor: TextEditor,
          type: 'additional',
          unit: menu.unit
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
          [v.title]: v.value
        }
      })

      let random_id = Math.random()*1000;
      return {
        ...row,
        wip_id: row.sub_material.code,
        unit: row.sub_material.unit,
        name: row.sub_material.name,
        customer_id: row.sub_material?.customer?.name ?? "-",
        ...appendAdditional,
        id: `rawin_${random_id}`,
      }
    })
    setSelectList(new Set)
    setBasicRow([...tmpBasicRow])
  }

  const DeleteBasic = async () => {
    Notiflix.Loading.circle()

    const res = await RequestMethod('delete', `subinDelete`,
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

          return {
            ...row,
            additional: [
              ...additional.map(v => {
                if(row[v.name]) {
                  return {
                    id: v.id,
                    title: v.name,
                    value: row[v.name],
                    unit: v.unit
                  }
                }
              }).filter((v) => v)
            ]
          }

        }
      }).filter((v) => v))

    if(res) {
      Notiflix.Loading.remove(200)
      Notiflix.Report.success('삭제되었습니다.','','확인',()=>{
        if(keyword){
          SearchBasic(keyword, option, page).then(() => {
            Notiflix.Loading.remove()
          })
        }else{
          LoadBasic(page).then(() => {
            Notiflix.Loading.remove()
          })
        }
      });
    }

  }

  const downloadExcel = () => {
    let tmpSelectList: boolean[] = []
    basicRow.map(row => {
      tmpSelectList.push(selectList.has(row.id))
    })
    excelDownload(column, basicRow, `mold`, "mold", tmpSelectList)
  }

  const onClickHeaderButton = (index: number) => {
    switch(index){
      case 0:
        if(selectList.size <= 0){
          Notiflix.Report.warning("데이터를 선택해주세요.","","확인")
          return
        }
        dispatch(setModifyInitData({
          modifyInfo: [
            ...basicRow.map(v => {
              if (selectList.has(v.id)) {
                return v
              }
              return false
            }).filter(v => v)
          ],
          type: "subin"
        }))
        router.push('/mes/submaterialV1u/modify')
        break;
      case 2:
        router.push(`/mes/item/manage/mold`)
        break;
      case 1:
        if(selectList.size === 0) {
          return  Notiflix.Report.warning("경고","데이터를 선택해 주시기 바랍니다.","확인" )
        }
        Notiflix.Confirm.show("경고","삭제하시겠습니까?","확인","취소", () => {
          DeleteBasic()
        }, () =>{})
        break;
    }
  }

  return (
    <div>
      <PageHeader
        isSearch
        searchKeyword={keyword}
        onChangeSearchKeyword={(keyword) => {
          setSelectList(new Set)
          if(keyword){
            router.push(`/mes/submaterialV1u/stock?page=1&keyword=${keyword}&opt=${optionIndex}`)
          }else{
            router.push(`/mes/submaterialV1u/stock?page=1&keyword=`)
          }
          setSelectList(new Set)
        }}
        searchOptionList={optionList}
        onChangeSearchOption={(option) => {
          setOptionIndex(option)
        }}
        calendarTitle={'입고일'}
        optionIndex={optionIndex}
        isCalendar
        calendarType={'period'}
        selectDate={selectDate}
        //@ts-ignore
        setSelectDate={(date) => {
          setSelectList(new Set)
          setSelectDate(date as {from:string, to:string})
        }}
        title={"부자재 재고 현황"}
        buttons={
          ['수정하기', '삭제']
        }
        buttonsOnclick={onClickHeaderButton}
      />
      <ExcelTable
        editable
        // resizable
        headerList={[
          SelectColumn,
          ...column
        ]}
        row={basicRow}
        setRow={(e) => {
          let tmp: Set<any> = selectList
          e.map(v => {
            if(v.isChange) tmp.add(v.id)
          })
          setSelectList(tmp)
          setBasicRow(e)
        }}
        selectList={selectList}
        //@ts-ignore
        setSelectList={setSelectList}
        height={basicRow.length * 40 >= 40*18+56 ? 40*19 : basicRow.length * 40 + 56}
      />
      <PaginationComponent
        currentPage={pageInfo.page}
        totalPage={pageInfo.total}
        setPage={(page) => {
          setSelectList(new Set)
          if(keyword){
            router.push(`/mes/submaterialV1u/stock?page=${page}&keyword=${keyword}&opt=${option}`)
          }else{
            router.push(`/mes/submaterialV1u/stock?page=${page}`)
          }
        }}
      />
      <ExcelDownloadModal
        isOpen={excelOpen}
        column={column}
        basicRow={basicRow}
        filename={`금형기준정보`}
        sheetname={`금형기준정보`}
        selectList={selectList}
        tab={'ROLE_BASE_07'}
        setIsOpen={setExcelOpen}
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

export {MesSubMaterialStock};
