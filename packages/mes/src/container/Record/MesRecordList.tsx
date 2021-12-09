import React, {useEffect, useState} from 'react'
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
  IExcelHeaderType, IItemMenuType
} from 'shared'
// @ts-ignore
import {SelectColumn} from 'react-data-grid'
import Notiflix from "notiflix";
import {useRouter} from 'next/router'
import {loadAll} from 'react-cookies'
import {NextPageContext} from 'next'
import moment from 'moment'
import {TransferCodeToValue} from 'shared/src/common/TransferFunction'
import {WorkModifyModal} from '../../../../shared/src/components/Modal/WorkModifyModal'

interface IProps {
  children?: any
  page?: number
  keyword?: string
  option?: number
}

let now = moment().format('YYYY-MM-DD')

const MesRecordList = ({page, keyword, option}: IProps) => {
  const router = useRouter()

  const [excelOpen, setExcelOpen] = useState<boolean>(false)

  const [basicRow, setBasicRow] = useState<Array<any>>([{
    order_num: '-', operation_num: '20210401-01',
    start: now, end: now, lot: '20210518-001', worker: '잭슨',
    code: 'SU-20210701-3', product: 'SU900-1', type: '완제품', unit: 'EA', process: '프레스',
    goal: '50', total: '0', good: '0', uph: '14'
  }, {
    order_num: '-', operation_num: '20210401-02',
    start: now, end: now, lot: '20210518-001', worker: '토니',
    code: 'SU-20210701-3', product: 'SU900-1', type: '반제품', unit: 'EA', process: '프레스',
    goal: '50', total: '0', good: '0', uph: '14'
  },])
  const [column, setColumn] = useState<Array<IExcelHeaderType>>( columnlist["recordListV2"])
  const [selectList, setSelectList] = useState<Set<number>>(new Set())
  const [optionList, setOptionList] = useState<string[]>(['수주번호', '지시 고유 번호', 'CODE', '품명', 'LOT 번호', '작업자'])
  const [optionIndex, setOptionIndex] = useState<number>(0)
  const [selectDate, setSelectDate] = useState<{from:string, to:string}>({
    from: moment(new Date()).startOf("month").format('YYYY-MM-DD') ,
    to:  moment(new Date()).endOf("month").format('YYYY-MM-DD')
  });

  const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
    page: 1,
    total: 1
  })

  useEffect(() => {
    setOptionIndex(option)
    if(keyword){
      // SearchBasic(keyword, option, page).then(() => {
      //   Notiflix.Loading.remove()
      // })
    }else{
      LoadBasic(page).then(() => {
        Notiflix.Loading.remove()
      })
    }
  }, [page, keyword, option])

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
    const res = await RequestMethod('get', `recordList`,{
      path: {
        page: (page || page !== 0) ? page : 1,
        renderItem: 18,
      },
      params: {
        status: 2
      }
    })

    if(res){
      setPageInfo({
        ...pageInfo,
        page: res.page,
        total: res.totalPages
      })
      cleanUpData(res)
    }else if (res.state === 401) {
      Notiflix.Report.failure('불러올 수 없습니다.', '권한이 없습니다.', '확인', () => {
        router.back()
      })
    }

  }

  const cleanUpData = (res: any) => {
    let tmpColumn = columnlist["recordListV2"];
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

      let random_id = Math.random()*1000;

      return {
        ...row,
        ...appendAdditional,
        contract_id: row.operation_sheet?.contract?.identification ?? '-' ,
        identification: row.operation_sheet?.identification ?? '-',
        product_id: row.operation_sheet?.product?.code ?? '-',
        name: row.operation_sheet?.product?.name ?? '-',
        type: row.operation_sheet?.product?.type ? TransferCodeToValue(row.operation_sheet.product.type, 'material') : '-',
        unit: row.operation_sheet?.product?.unit,
        process_id: row.operation_sheet?.product?.process?.name,
        user: row.worker,
        worker: row.worker?.name ?? '-',
        id: `sheet_${random_id}`,
      }
    })

    console.log(tmpBasicRow)

    setBasicRow([...tmpBasicRow])
  }

  return (
    <div>
      <PageHeader
        isSearch
        isCalendar
        searchKeyword={""}
        searchOptionList={optionList}
        calendarTitle={'종료일'}
        calendarType={'period'}
        selectDate={selectDate}
        //@ts-ignore
        setSelectDate={(date) => setSelectDate(date)}
        title={"작업 일보 리스트"}
        buttons={
          ['엑셀로 받기', '수정하기']
        }
        buttonsOnclick={
          (e) => {
            switch(e) {
              case 1: {
                setExcelOpen(true)
              }
            }
          }
          // onClickHeaderButton
        }
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
      <WorkModifyModal
        row={[...basicRow.map(v =>{
          if(selectList.has(v.id)){
            console.log(v)
            return {
              ...v,
              worker: v.user,
              worker_name: v.user.name,
              sum: v.poor_quantity+v.good_quantity,
              input_bom: v.operation_sheet.input_bom,
            }
          }
        }).filter(v => v)]}
        onRowChange={() => {}}
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
