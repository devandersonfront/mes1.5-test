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
    RootState,
    setModifyInitData
} from 'shared'
// @ts-ignore
import {SelectColumn} from 'react-data-grid'
import Notiflix from "notiflix";
import {useRouter} from 'next/router'
import {NextPageContext} from 'next'
import moment from 'moment'
import {useDispatch, useSelector} from 'react-redux'

interface IProps {
  children?: any
  page?: number
  keyword?: string
  option?: number
}

// const dummyDate = moment().subtract(10, 'days')

const MesRawMaterialStockModify = ({page, keyword, option}: IProps) => {
  const router = useRouter()

  const selector = useSelector((state:RootState) => state.modifyInfo);
  const dispatch = useDispatch();

  const [excelOpen, setExcelOpen] = useState<boolean>(false)

  const [basicRow, setBasicRow] = useState<Array<any>>([])
  const [column, setColumn] = useState<Array<IExcelHeaderType>>( columnlist["rawstockModify"])
  const [selectList, setSelectList] = useState<Set<number>>(new Set())
  const [optionList, setOptionList] = useState<string[]>(['원자재 CODE', '원자재 품명', '재질', '원자재 LOT 번호', '거래처'])
  const [optionIndex, setOptionIndex] = useState<number>(0)

  const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
    page: 1,
    total: 1
  })

  const [selectDate, setSelectDate] = useState<{from:string, to:string}>({
    from: moment().startOf('isoWeek').format('YYYY-MM-DD'),
    to: moment().endOf('isoWeek').format('YYYY-MM-DD')
  });

  // useEffect(() => {
  //   setOptionIndex(option)
  //   if(keyword){
  //     SearchBasic(keyword, option, page).then(() => {
  //       Notiflix.Loading.remove()
  //     })
  //   }else{
  //     LoadBasic(page).then(() => {
  //       Notiflix.Loading.remove()
  //     })
  //   }
  // }, [page, keyword, option])

  useEffect(() => {
    if(selector && selector.modifyInfo){
      setBasicRow([
        ...selector.modifyInfo
      ])
    }
  }, [selector])

  const loadAllSelectItems = async (column: IExcelHeaderType[]) => {
    let tmpColumn = column.map(async (v: any) => {
      if(v.selectList && v.selectList.length === 0) {
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

  const SaveBasic = async () => {
    let res: any
    res = await RequestMethod('post', `lotRmSave`,
      basicRow.map((row, i) => {
        if(selectList.has(row.id)){
          let selectKey: string[] = []
          let additional:any[] = []
          column.map((v) => {
            if(v.selectList){
              selectKey.push(v.key)
            }

            if(v.type === 'additional') {
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
      Notiflix.Report.success('수정되었습니다.','','확인', () => {
        dispatch(setModifyInitData({
          modifyInfo: [],
          type: undefined
        }))
        router.back()
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
        SaveBasic()
        break;
      case 1:
        break;
    }
  }

  return (
    <div>
      <PageHeader
        title={"원자재 입고 (수정)"}
        buttons={
          ['저장하기', '삭제']
        }
        buttonsOnclick={
          // () => {}
          onClickHeaderButton
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

export {MesRawMaterialStockModify};
