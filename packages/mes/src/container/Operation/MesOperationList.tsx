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

interface IProps {
  children?: any
  page?: number
  keyword?: string
  option?: number
}

let now = moment().format('YYYY-MM-DD')

const MesOperationList = ({page, keyword, option}: IProps) => {
  const router = useRouter()

  const [excelOpen, setExcelOpen] = useState<boolean>(false)

  const [basicRow, setBasicRow] = useState<Array<any>>([{
    status: '시작전', order_num: '-', operation_num: '20210401-01',
    start_date: now, limit_date: now, customer: '진주상사', model: '한국차',
    code: 'SU-20210701-1', product: 'SU900', type: '완제품', unit: 'EA', process: '코팅',
    goal: '50', total: '0', totalCurrent: '0', totalBad: '0',
  },{
    status: '시작전', order_num: '-', operation_num: '20210401-02',
    start_date: now, limit_date: now, customer: '-', model: '-',
    code: 'SU-20210701-2', product: 'SU900-2', type: '반제품', unit: 'EA', process: '세척',
    goal: '50', total: '0', totalCurrent: '0', totalBad: '0',
  },{
    status: '시작전', order_num: '-', operation_num: '20210401-03',
    start_date: now, limit_date: now, customer: '-', model: '-',
    code: 'SU-20210701-3', product: 'SU900', type: '반제품', unit: 'EA', process: '프레스',
    goal: '50', total: '0', totalCurrent: '0', totalBad: '0',
  },])
  const [column, setColumn] = useState<Array<IExcelHeaderType>>( columnlist["operationListV2"])
  const [selectList, setSelectList] = useState<Set<number>>(new Set())
  const [optionList, setOptionList] = useState<string[]>(['지시 고유 번호', '고객사명', '모델', 'CODE', '품명'])
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
    Notiflix.Loading.remove()
  }, [])

  return (
    <div>
      <PageHeader
        isSearch
        isCalendar
        searchKeyword={""}
        searchOptionList={optionList}
        calendarTitle={'작업 기한'}
        calendarType={'period'}
        selectDate={selectDate}
        //@ts-ignore
        setSelectDate={(date) => setSelectDate(date)}
        title={"작업지시서 리스트"}
        buttons={
          ['엑셀로 받기', '수정하기']
        }
        buttonsOnclick={
          (e) => {
            switch(e){
              case 1:
                router.push('/mes/operationV1u/modify')
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

export {MesOperationList};
