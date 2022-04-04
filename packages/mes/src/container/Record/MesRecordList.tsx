import React, {useEffect, useState} from 'react'
import {
  columnlist,
  ExcelTable,
  Header as PageHeader,
  IExcelHeaderType,
  MAX_VALUE,
  RequestMethod,
  TextEditor
} from 'shared'
// @ts-ignore
import {SelectColumn} from 'react-data-grid'
import Notiflix from "notiflix";
import {useRouter} from 'next/router'
import {NextPageContext} from 'next'
import moment from 'moment'
import {TransferCodeToValue} from 'shared/src/common/TransferFunction'
import {WorkModifyModal} from '../../../../shared/src/components/Modal/WorkModifyModal'

interface IProps {
  children?: any
  page?: number
  search?: string
  option?: number
}

let now = moment().format('YYYY-MM-DD')

const MesRecordList = ({page, search, option}: IProps) => {

  const [excelOpen, setExcelOpen] = useState<boolean>(false)

  const [basicRow, setBasicRow] = useState<Array<any>>([])
  const [column, setColumn] = useState<Array<IExcelHeaderType>>( columnlist["cncRecordListV2"])
  const [selectList, setSelectList] = useState<Set<number>>(new Set())
  const [optionList, setOptionList] = useState<string[]>(['수주번호', '지시 고유 번호', 'CODE', '품명', 'LOT 번호', '작업자'])
  const [optionIndex, setOptionIndex] = useState<number>(0)
  const [selectDate, setSelectDate] = useState<{from:string, to:string}>({
    from: moment().subtract(1,'month').format('YYYY-MM-DD'),
    to: moment().format('YYYY-MM-DD')
  });

  const [keyword, setKeyword] = useState<string>("");
  const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
    page: 1,
    total: 1
  })
  const [order, setOrder] = useState<number>(0);
  const changeOrder = (value:number) => {
    setPageInfo({page:1,total:1})
    setOrder(value);
  }

  useEffect(()=>{
  },[basicRow])
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
  }, [pageInfo.page, keyword, selectDate,order])

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

  const SearchBasic = async (keyword, opt, page?: number) => {
    Notiflix.Loading.circle()
    const res = await RequestMethod('get', `cncRecordSearch`,{
      path: {
        page: (page || page !== 0) ? page : 1,
        renderItem: 22,
      },
      params:
          order == 0 ?
              {
                keyword: keyword,
                opt: optionIndex,
                from: selectDate.from,
                to: selectDate.to,
              }
              :
              {
                sorts: 'end',
                order: order == 1 ? 'asc' : 'desc',
                keyword: keyword,
                opt: optionIndex,
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
    }

  }

  const LoadBasic = async (page?: number) => {
    Notiflix.Loading.circle()
    const res = await RequestMethod('get', `cncRecordList`,{
      path: {
        page: (page || page !== 0) ? page : 1,
        renderItem: 22,
      },
      params:
          order == 0 ?
              {
                from: selectDate.from,
                to: selectDate.to,
              }
              :
              {
                sorts: 'end',
                order: order == 1 ? 'asc' : 'desc',
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
    }

  }

  const DeleteBasic = async () => {
    let res = await RequestMethod('delete', `cncRecordeDelete`, basicRow.map((row, i) => {
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
              worker: row.user,
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
      Notiflix.Report.success('삭제 성공!', '', '확인', () => {
        setSelectList(new Set)
        LoadBasic(1).then(() => {
          Notiflix.Loading.remove()
        })
      })
    }
  }

  const cleanUpData = (res: any) => {
    let tmpColumn = columnlist["cncRecordListV2"];
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


    if(pageInfo.page > 1){
      tmpRow = [...basicRow,...res.info_list]
    }else{
      tmpRow = res.info_list
    }


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

      let random_id = Math.random()*1000;

      let worker

      if(typeof row.worker === 'string'){
        worker = row.worker
      }else if(typeof row.worker === "object"){
        worker = row.worker?.name
      }else {
        worker = "-"
      }

      return {
        ...row,
        ...appendAdditional,
        product: row.operation_sheet?.product ?? null,
        goal: row.operation_sheet?.goal ?? '-',
        contract_id: row.operation_sheet?.contract?.identification ?? '-' ,
        input_bom: row.operation_sheet?.input_bom ?? [],
        identification: row.operation_sheet?.identification ?? '-',
        product_id: row.operation_sheet?.product?.code ?? '-',
        name: row.operation_sheet?.product?.name ?? '-',
        type: row.operation_sheet?.product?.type !== null ? TransferCodeToValue(row.operation_sheet.product.type, 'product') : '-',
        unit: row.operation_sheet?.product?.unit,
        process_id: row.operation_sheet?.product?.process?.name ?? '-',
        user: row.worker,
        sic_id: row.inspection_category,
        worker: worker,
        worker_object: row.worker_object ?? row.worker,
        id: `sheet_${random_id}`,
      }
    })
    setSelectList(new Set)
    setBasicRow([...tmpBasicRow])
  }


  return (
    <div>
      <PageHeader
        isSearch
        isCalendar
        searchKeyword={keyword}
        searchOptionList={optionList}
        onChangeSearchOption={(e) => {
          setOptionIndex(e)
        }}
        onChangeSearchKeyword={(keyword) =>{
          setSelectList(new Set)
          setKeyword(keyword)
          setPageInfo({page:1, total:1})
        }}
        calendarTitle={'종료일'}
        calendarType={'period'}
        selectDate={selectDate}
        //@ts-ignore
        setSelectDate={(date) => {
          setSelectList(new Set)
          setSelectDate(date as {from:string, to:string})
          setPageInfo({page:1, total:1})
        }}
        title={"작업 일보 리스트"}
        buttons={
          ['', '수정하기', '삭제']
        }
        buttonsOnclick={
          (e) => {
            switch(e) {
              case 1: {
                if(selectList.size === 1) {
                  setExcelOpen(true)
                }else{
                  Notiflix.Report.warning("경고","작업일보는 한 개씩만 수정 가능합니다.","확인")
                }
                break
              }
              case 2: {
                if(selectList.size === 0) {
                  return  Notiflix.Report.warning("경고","데이터를 선택해 주시기 바랍니다.","확인" )
                }
                Notiflix.Confirm.show("경고","삭제하시겠습니까?","확인","취소",()=>DeleteBasic())
                break
              }
            }

            // switch (e) {
            //   case 1: {
            //     if (selectList.size === 1) {
            //       setExcelOpen(true)
            //     } else {
            //       Notiflix.Report.warning("경고", "작업일보는 한 개씩만 수정 가능합니다.", "확인")
            //     }
            //   }
            //     // onClickHeaderButton
            // }
          }
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
                  setSelectList(new Set)
                  setPageInfo({...pageInfo, page:pageInfo.page+1})
                }
              }
            }}
        />

        <WorkModifyModal
            row={[...basicRow.map(v =>{
              if(selectList.has(v.id)){
                return {
                  ...v,
                  worker: v.user,
                  worker_name: v.user.name,
                  sum: v.poor_quantity+v.good_quantity,
                  input_bom: v.operation_sheet.input_bom,
                }
              }
            }).filter(v => v)]}
            onRowChange={() => {
              setOptionIndex(option)
              if(keyword){
                // SearchBasic(keyword, option, page).then(() => {
                //   Notiflix.Loading.remove()
                // })
              }else{
                LoadBasic(page).then(() => {
                  Notiflix.Loading.remove();
                  setSelectList(new Set())
                })
              }}
            }
            isOpen={excelOpen}
            setIsOpen={setExcelOpen}/>
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

export {MesRecordList};
