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
  IExcelHeaderType, IItemMenuType, RootState
} from 'shared'
// @ts-ignore
import {SelectColumn} from 'react-data-grid'
import Notiflix from "notiflix";
import {useRouter} from 'next/router'
import {loadAll} from 'react-cookies'
import {NextPageContext} from 'next'
import moment from 'moment'
import {useSelector} from 'react-redux'

interface IProps {
  children?: any
  page?: number
  keyword?: string
  option?: number
}

const MesDeliveryModify = ({page, keyword, option}: IProps) => {
  const router = useRouter()

  const selector = useSelector((state: RootState) => state.modifyInfo)

  const [excelOpen, setExcelOpen] = useState<boolean>(false)

  const [basicRow, setBasicRow] = useState<Array<any>>([{
    name: "", id: "", start_date: moment().format('YYYY-MM-DD'),
    delivery_date: moment().format('YYYY-MM-DD')
  }])
  const [column, setColumn] = useState<Array<IExcelHeaderType>>( columnlist["deliveryModify"])
  const [selectList, setSelectList] = useState<Set<number>>(new Set())
  const [optionList, setOptionList] = useState<string[]>(['납품 번호', '수주 번호', '거래처', '모델', 'CODE', '품명'])
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
    setBasicRow([...selector.modifyInfo])
  }, [selector])

  const SaveBasic = async () => {
    let res: any
    res = await RequestMethod('post', `shipmentSave`,
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
          })

          return {
            ...row,
            ...selectData,
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


    if(res){
      Notiflix.Report.success('저장되었습니다.','','확인', () => {
        router.push('/mes/delivery/list')
      });
    }
  }

  const onClickHeaderButton = (index: number) => {
    switch(index){
      case 0:
        // console.log(basicRow)
        SaveBasic()
        break;
      case 1:
        Notiflix.Confirm.show("경고","삭제하시겠습니까?","확인","취소",
          ()=>{},
          ()=>{}
        )
        break;
    }
  }

  return (
    <div>
      <PageHeader
        isSearch
        isCalendar
        searchKeyword={""}
        searchOptionList={optionList}
        calendarTitle={'납품 날짜'}
        calendarType={'period'}
        selectDate={selectDate}
        //@ts-ignore
        setSelectDate={(date) => setSelectDate(date)}
        title={"납품 정보 (수정)"}
        buttons={
          ['저장하기', '삭제']
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
          if(keyword){
            router.push(`/mes/basic/mold?page=${page}&keyword=${keyword}&opt=${option}`)
          }else{
            router.push(`/mes/basic/mold?page=${page}`)
          }
        }}
      />
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

export {MesDeliveryModify};
