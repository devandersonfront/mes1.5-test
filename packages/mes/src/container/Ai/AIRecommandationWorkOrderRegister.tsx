import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";

import {
  ExcelTable,
  Header as PageHeader,
  columnlist,
  IExcelHeaderType,
  RootState,
  RequestMethod
} from 'shared'

// @ts-ignore
import { SelectColumn } from 'react-data-grid'

import moment from 'moment'
import Notiflix from "notiflix";
import { TransferCodeToValue } from 'shared/src/common/TransferFunction'
import { SearchModalResult, SearchResultSort } from "shared/src/Functions/SearchResultSort";



function AIRecommandationWorkOrderRegister() {
  const [pageInfo, setPageInfo] = useState<{ page: number, total: number }>({
    page: 1,
    total: 1
  })

  const [selectList, setSelectList] = useState<Set<number>>(new Set())
  const [codeCheck, setCodeCheck] = useState<boolean>(true)
  const [column, setColumn] = useState<Array<IExcelHeaderType>>(columnlist["operationCodeRegisterV2"])
  // const [basicRow, setBasicRow] = useState<Array<any>>([{
  //     id: `operation_${Math.random() * 1000}`, date: moment().format('YYYY-MM-DD'),
  //     deadline: moment().format('YYYY-MM-DD'), first: true
  // }])
  // const [basicRow, setBasicRow] = useState(dummy_rows);
  const [basicRow, setBasicRow] = useState<Array<any>>([])


  const loadGraphSheet = async (product_id: string, object?: any) => {
    Notiflix.Loading.circle()
    const res = await RequestMethod('get', `sheetGraphList`, {
      path: { product_id }
    })
    if (res) {
      let tmp: Set<any> = selectList
      setSelectList(new Set())

      return [{
        ...object,
        contract_id: codeCheck ? "-" : object.contract_id,
        goal: codeCheck ? 0 : object.contract.amount,
        cm_id: object.cm_id ?? '-',
        process_id: object.product?.process?.name ?? '-',
        name: object.product_name ?? '-',
        date: object?.date ?? moment().format('YYYY-MM-DD'),
        deadline: object?.deadline ?? moment().format('YYYY-MM-DD'),
        first: true,
      }, ...res.map(v => {
        if (v.type === 2) {
          let random_id = Math.random() * 1000;
          tmp.add("operation_" + random_id)

          return {
            ...v,
            contract_id: codeCheck ? "-" : object.contract_id,
            id: "operation_" + random_id,
            bom_root_id: v.child_product.bom_root_id,
            product: v.child_product,
            date: moment().format('YYYY-MM-DD'),
            deadline: moment().format('YYYY-MM-DD'),
            customer_id: v.child_product.customer?.name,
            cm_id: v.child_product.model?.model,
            name: v.child_product.name ?? v.product_name,
            product_id: v.child_product.code,
            code: v.child_product.code,
            type: TransferCodeToValue(v.child_product.type, 'product'),
            unit: v.child_product.unit,
            goal: codeCheck ? 0 : object.contract.amount,
            process_id: v.child_product.process?.name ?? '-',
            readonly: true,
          }
        }
      }).filter(v => v)

      ]
    }
  }

  const cleanUpData = (res: any) => {
    
    let tmpRow = []
    
    tmpRow = res.info_list
    console.log("res.info_list data at AIRecommandationWorkOrderRegister : ", res.info_list);

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
        customer_id: row.customer?.name,
        customerArray: row.customer,
        cm_id: row.model?.model ?? "-",
        modelArray: row.model,
        process_id: row.process?.name,
        processArray: row.process,
        type_id: row.type,
        // type: column[4].selectList[row.type].name,
        id: `mold_${random_id}`,
      }
    })

    setBasicRow(prev => [...prev, ...tmpBasicRow])

  }

  const LoadBasic = async (page?: number) => {

    const res = await RequestMethod('get', `productSearch`, {
      path: {
        page:  page ?? 1,
        renderItem: 22,
      },
      params: {
        keyword: '',
        opt: 0

      }
    })

    if (res) {
      if (res.totalPages < page) {
        LoadBasic(page - 1)
      } else {
        setPageInfo({
          ...pageInfo,
          page: res.page,
          total: res.totalPages
        })
      }
      cleanUpData(res)
    }
    setSelectList(new Set())
  }

  useEffect(() => {
    LoadBasic(pageInfo.page).then(() => { })
  }, [pageInfo.page])

  return (
    <>
      <PageHeader
        title={"Ai 작업지시서 등록"}

      />
      <ExcelTable
        editable
        selectList={selectList}
          // @ts-ignore
        setSelectList={setSelectList}
        headerList={[
          SelectColumn,                  // react-data-grid 에서 제공하는 row 에 대한 select column 설정을 위한 props 
          ...column                      // 헤더 컬럼, 포매터등의 옵션으로 row 의 기본 형식 지정 옵션도 포함
        ]}
        row={basicRow}
        rowHeight={32}
        height={400}
        scrollEnd={(value) => {
          if(value){
            if(pageInfo.total > pageInfo.page){
              setPageInfo({...pageInfo, page:pageInfo.page+1})
            }
          } else {

          }

        }}
        setRow = {(e)=> {
          let tmp: Set<any> = selectList;
          e.map(v => {
            if (v.isChange) tmp.add(v.id);
          })
          // setSelectList(tmp)
          setSelectList(tmp)

          // setSelectList()
        }}
        onRowClick = {(e) => {
        }}

        onSelectedRowsChange = {(e) => {
        }}

      />
    </>
  )
}


export { AIRecommandationWorkOrderRegister };