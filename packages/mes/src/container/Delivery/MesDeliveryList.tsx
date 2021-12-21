import React, {useEffect, useRef, useState} from 'react'
import {
  ExcelTable,
  Header as PageHeader,
  RequestMethod,
  columnlist,
  MAX_VALUE,
  DropDownEditor,
  TextEditor,
  excelDownload,
  PaginationComponent,
  ExcelDownloadModal,
  IExcelHeaderType, IItemMenuType, setModifyInitData
} from 'shared'
// @ts-ignore
import {SelectColumn} from 'react-data-grid'
import Notiflix from "notiflix";
import {useRouter} from 'next/router'
import {loadAll} from 'react-cookies'
import {NextPageContext} from 'next'
import moment from 'moment'
import {TransferCodeToValue} from 'shared/src/common/TransferFunction'
import {useDispatch} from 'react-redux'
import styled from "styled-components";

interface IProps {
  children?: any
  page?: number
  keyword?: string
  option?: number
}

const MesDeliveryList = ({page, keyword, option}: IProps) => {
  const dispatch = useDispatch()
  const router = useRouter()

  const [excelOpen, setExcelOpen] = useState<boolean>(false)

  const [basicRow, setBasicRow] = useState<Array<any>>([{
    name: "", id: "", start_date: moment().format('YYYY-MM-DD'),
    limit_date: moment().format('YYYY-MM-DD')
  }])
  const [column, setColumn] = useState<Array<IExcelHeaderType>>( columnlist["deliveryList"])
  const [selectList, setSelectList] = useState<Set<number>>(new Set())
  const [optionList, setOptionList] = useState<string[]>(['납품 번호', '수주 번호', '거래처', '모델', 'CODE', '품명'])
  const [optionIndex, setOptionIndex] = useState<number>(0)
  const [selectDate, setSelectDate] = useState<{from:string, to:string}>({
    from: moment(new Date()).startOf("month").format('YYYY-MM-DD') ,
    to:  moment(new Date()).endOf("month").format('YYYY-MM-DD')
  });

  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
    page: 1,
    total: 1
  })



  useEffect(() => {
    // setOptionIndex(option)
    if(searchKeyword !== ""){
      SearchBasic(searchKeyword, optionIndex, pageInfo.page).then(() => {
        Notiflix.Loading.remove()
      })
    }else{
      LoadBasic(pageInfo.page).then(() => {
        Notiflix.Loading.remove()
      })
    }
  }, [pageInfo.page, searchKeyword, option, selectDate])


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
            pk: v.unit_id
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
    const res = await RequestMethod('get', `shipmentList`,{
      path: {
        page: pageInfo.page ?? 1,
        renderItem: 22,
      },
      params: {
        from: selectDate.from,
        to: selectDate.to,
      }

    })

    if(res){
      setPageInfo({
        ...pageInfo,
        page: res.page,
        total: res.totalPages
      })
      cleanUpData(res)
    }else if (res === 401) {
      Notiflix.Report.failure('불러올 수 없습니다.', '권한이 없습니다.', '확인', () => {
        router.back()
      })
    }

  }

  const SearchBasic = async (keyword: any, option: number, isPaging?: number) => {
    Notiflix.Loading.circle()
    if(!isPaging){
      setOptionIndex(option)
    }
    const res = await RequestMethod('get', `shipmentSearch`,{
      path: {
        page: isPaging ?? 1,
        renderItem: 22,
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
  }

  const cleanUpData = (res: any) => {
    let tmpColumn = columnlist["deliveryList"];
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
          ...menuData,
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
    ])


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

      const reducer = (accumulator, curr) => {
        return accumulator.amount + curr.amount;
      }

      let random_id = Math.random()*1000;
      let tmpAmount = 0
      if(row.lots && row.lots.length){
        tmpAmount = row.lots.length > 1 ? row.lots.reduce(reducer) : row.lots[0].amount
      }
      return {
        ...row,
        ...appendAdditional,
        status: TransferCodeToValue(row.status, 'workStatus'),
        status_no: row.status,
        contract_id: row.contract?.identification ?? '-' ,
        // operation_sheet: row.
        customer_id: row.product.customer?.name ?? '-',
        cm_id: row.product.model?.model ?? '-',
        product_id: row.product.code ?? '-',
        code: row.product.code ?? '-',
        name: row.product.name ?? '-',
        type: TransferCodeToValue(row.product.type, 'material'),
        unit: row.product?.unit ?? '-',
        process_id: row.product?.process?.name ?? '-',
        amount: tmpAmount,
        id: `sheet_${random_id}`,
      }
    })

    Notiflix.Loading.remove()
    setBasicRow([...tmpBasicRow])
  }

  return (
    <div>
      <PageHeader
        isSearch
        isCalendar
        searchKeyword={""}
        searchOptionList={optionList}
        onChangeSearchKeyword={(keyword) => {
          console.log("keyword : ", keyword);
          setSearchKeyword(keyword);
          setPageInfo({page:1, total:1})
        }}
        onChangeSearchOption={(option) => {
          setOptionIndex(option)
        }}
        calendarTitle={'납품 날짜'}
        calendarType={'period'}
        selectDate={selectDate}
        //@ts-ignore
        setSelectDate={(date) => setSelectDate(date)}
        title={"납품 현황"}
        buttons={
          ['', '수정하기']
        }
        buttonsOnclick={
          (e) => {
            switch(e){
              case 1:
                dispatch(setModifyInitData({
                  modifyInfo: basicRow.map(v => {
                    if (selectList.has(v.id)) {
                      return v
                    }
                  }).filter(v => v),
                  type: 'delivery'
                }))
                router.push('/mes/delivery/modify')
            }
          }
          // onClickHeaderButton
        }
      />
      <ExcelTable
        editable
        // resizable
        headerList={[
          SelectColumn,
          ...column
        ]}
        row={basicRow}
        // setRow={setBasicRow}
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
        scrollEnd={(value) => {
          if(value){
            if(pageInfo.total > pageInfo.page){
              setPageInfo({...pageInfo, page:pageInfo.page+1})
            }
          }
        }}
      />
      {/*<PaginationComponent*/}
      {/*  currentPage={pageInfo.page}*/}
      {/*  totalPage={pageInfo.total}*/}
      {/*  setPage={(page) => {*/}
      {/*    if(keyword){*/}
      {/*      router.push(`/mes/basic/mold?page=${page}&keyword=${keyword}&opt=${option}`)*/}
      {/*    }else{*/}
      {/*      router.push(`/mes/basic/mold?page=${page}`)*/}
      {/*    }*/}
      {/*  }}*/}
      {/*/>*/}
      <ExcelDownloadModal
        isOpen={excelOpen}
        column={column}
        basicRow={basicRow}
        filename={`금형기본정보`}
        sheetname={`금형기본정보`}
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

export {MesDeliveryList};
