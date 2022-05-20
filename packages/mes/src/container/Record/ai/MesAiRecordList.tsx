import React, { useEffect, useState } from 'react'
import {
  ExcelTable,
  Header as PageHeader,
  columnlist,
} from 'shared'
import { AIRecordList } from 'shared/src/Strings/titles'
import moment from 'moment'
//@ts-ignore
import { SelectColumn } from 'react-data-grid'

const dummyData = [
  {
    'seq':1,
    'contract_id': null,
    'date': '2021.04.01',
    'deadline': '2021.05.18',
    'customer_id': '진주상사',
    'cm_id': '한국사',
    'product_id': 'SU-20210701-1',
    'name': 'SU900-1',
    'type': '완제품',
    'unit': 'EA',
    'process_id': '코팅',
    'goal': '50',
    'totalWaitRecord': 2,
  },
  {
    'seq':2,
    'contract_id': null,
    'date': '2021.04.01',
    'deadline': '2021.05.18',
    'customer_id': null,
    'cm_id': null,
    'product_id': 'SU-20210701-2',
    'name': 'SU900-2',
    'type': '반제품',
    'unit': 'EA',
    'process_id': '프레스',
    'goal': '50',
    'totalWaitRecord': 1,
  },
  {
    'seq':3,
    'contract_id': null,
    'date': '2021.04.01',
    'deadline': '2021.05.18',
    'customer_id': null,
    'cm_id': null,
    'product_id': 'SU-20210701-3',
    'name': 'SU900-3',
    'type': '재공품',
    'unit': 'EA',
    'process_id': 'BL',
    'goal': '50',
    'totalWaitRecord': 1,
  },
]
const dummyRecord = [
  {
    'start':'22.04.01 00:00:00',
    'end':'22.04.01 00:00:00',
    'mfrName': '대한기계',
    'name':'프레스 200',
    'type':'프레스',
    'mfrCode':'112-011',
    'total_quantity':70,
    'good_quantity':65,
  },
  {
    'start':'22.04.01 00:00:00',
    'end':'22.04.01 00:00:00',
    'mfrName': '대한기계',
    'name':'프레스 300',
    'type':'프레스',
    'mfrCode':'85-775-113',
    'total_quantity':70,
    'good_quantity':65,
  }
]

const MesAiRecordList = () => {
  const [searchKeyword, setSearchKeyword] = useState<string>("")
  const [searchOptionIndex, setSearchOptionIndex] = useState<number>(0)
  const [selectDate, setSelectDate] = useState<{from:string, to:string}>({
    from: moment().subtract(1,'month').format('YYYY-MM-DD'),
    to: moment().format('YYYY-MM-DD')
  })
  const [records, setRecords] = useState<any>([])
  const [sheets, setSheets] = useState<any>([])
  const [selectedList, setSelectedList] = useState<Set<number>>(new Set())
  const [selectedRowIdx, setSelectedRowIdx] = useState<number>(undefined)

  useEffect(() => {
    setSheets(dummyData.map((data, dataIdx) => ({...data, selectedRow: dataIdx === selectedRowIdx})))
    if(selectedRowIdx === 0) setRecords(dummyRecord)
    else setRecords([])
  }
  , [selectedRowIdx])

  return <div>
    <PageHeader
      isSearch
      isCalendar
      searchKeyword={searchKeyword}
      onChangeSearchKeyword={(keyword) => {
        setSearchKeyword(keyword)
      }}
      searchOptionList={['모델','Code','품명']}
      onChangeSearchOption={(index) => {
        setSearchOptionIndex(index)
      }}
      optionIndex={searchOptionIndex}
      title={AIRecordList}
      calendarTitle={'작업 기한'}
      calendarType={'period'}
      selectDate={selectDate}
      setSelectDate={(date) => {
        setSelectDate(date as {from:string, to:string})
      }}
    />
    <ExcelTable
      editable
      resizable
      headerList={columnlist.aiRecordSheetList}
      row={sheets}
      setRow={(row) => {
      }}
      setSelectRow={setSelectedRowIdx}
      selectList={selectedList}
      //@ts-ignore
      setSelectList={setSelectedList}
      width={1576}
      height={40*7+56}
    />
    <PageHeader
        title={'AI 예측 작업 일보'}
        buttons={['저장하기','삭제']}
        buttonsOnclick={()=>{}}
    />
    <ExcelTable
      editable
      resizable
      headerList={[SelectColumn, ...columnlist.aiRecordList]}
      row={records}
      setRow={(row) => {
      }}
      selectList={new Set}
      setSelectList={() => {}}
      width={1576}
      height={40*7+56}
    />
  </div>
}

export {MesAiRecordList}
