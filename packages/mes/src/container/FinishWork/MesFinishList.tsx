import React, {useEffect, useState} from 'react'
import {
  columnlist,
  ExcelDownloadModal,
  ExcelTable,
  Header as PageHeader,
  IExcelHeaderType,
  MAX_VALUE, PaginationComponent,
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
import {useDispatch} from "react-redux";
import {deleteMenuSelectState, setMenuSelectState} from "shared/src/reducer/menuSelectState";
import {additionalMenus, getTableSortingOptions, loadAllSelectItems, setExcelTableHeight} from 'shared/src/common/Util'
import { TableSortingOptionType } from 'shared/src/@types/type'
import addColumnClass from '../../../../main/common/unprintableKey'
interface IProps {
  children?: any
  page?: number
  search?: string
  option?: number
}

const optionList = ['지시고유번호', '거래처', '모델', 'code',  '품명']

const MesFinishList = ({page, search, option}: IProps) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [basicRow, setBasicRow] = useState<Array<any>>([])
  const [column, setColumn] = useState<Array<IExcelHeaderType>>( columnlist["finishListV2"])
  const [selectList, setSelectList] = useState<Set<number>>(new Set())
  const [optionIndex, setOptionIndex] = useState<number>(0)
  const [selectDate, setSelectDate] = useState<{from:string, to:string}>({
    from: moment().subtract(1,'month').format('YYYY-MM-DD'),
    to: moment().format('YYYY-MM-DD')
  });
  const [sortingOptions, setSortingOptions] = useState<{orders:string[], sorts:string[]}>({orders:[], sorts:[]})
  const [keyword, setKeyword] = useState<string>("");
  const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
    page: 1,
    total: 1
  })

  const onSelectDate = (date: {from:string, to:string}) => {
    setSelectDate(date)
    reload(null, null, date)
  }

  const reload = (keyword?:string, sortingOptions?: TableSortingOptionType, date?:{from:string, to:string},) => {
    setKeyword(keyword)
    if(pageInfo.page > 1) {
      setPageInfo({...pageInfo, page: 1})
    } else {
      getData(undefined, keyword, date, sortingOptions)
    }
  }

  useEffect(() => {
    getData(pageInfo.page, keyword)
  }, [pageInfo.page]);

  useEffect(() => {
    dispatch(setMenuSelectState({main:"생산관리 등록",sub:router.pathname}))
    return(() => {
      dispatch(deleteMenuSelectState())
    })
  },[])


  const getRequestParams = (keyword?: string, date?: {from:string, to:string},  _sortingOptions?: TableSortingOptionType) => {
    let params = {}
    if(keyword) {
      params['keyword'] = keyword
      params['opt'] = optionIndex
    }
    params['from'] = date ? date.from: selectDate.from
    params['to'] = date ? date.to : selectDate.to
    params['order'] = _sortingOptions ? _sortingOptions.orders : sortingOptions.orders
    params['sorts'] = _sortingOptions ? _sortingOptions.sorts : sortingOptions.sorts
    params['status'] = 2
    return params
  }

  const getData = async (page: number = 1, keyword?: string, date?: {from:string, to:string}, _sortingOptions?: TableSortingOptionType) => {
    Notiflix.Loading.circle();
    const res = await RequestMethod("get", keyword ? 'sheetSearch' : 'sheetList', {
      path: {
        page: page,
        renderItem: 18,
      },
      params: getRequestParams(keyword, date, _sortingOptions)
    });
    if(res){
      if (res.totalPages > 0 && res.totalPages < res.page) {
        reload();
      } else {
        setPageInfo({
          page: res.page,
          total: res.totalPages
        })
        cleanUpData(res, date)
      }
    }
    Notiflix.Loading.remove()
  }

  const cleanUpData = (res: any, date?: {from:string, to:string}) => {

    loadAllSelectItems({column:additionalMenus(columnlist["finishListV2"] ,res), sortingOptions, setSortingOptions, reload, setColumn, date});


    let tmpBasicRow = res.info_list.map((row: any, index: number) => {

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
        total_counter: row.total_good_quantity + row.total_poor_quantity ?? '-',
        contract_id: row.contract?.identification ?? '-' ,
        customer_id: row.product?.customer?.name ?? '-',
        cm_id: row.product?.model?.model ?? '-',
        product_id: row.product?.code ?? '-',
        name: row.product?.name ?? '-',
        type: typeof row.product?.type !== 'undefined' ? TransferCodeToValue(row.product.type, 'product') : '-',
        unit: row.product?.unit ?? '-',
        process_id: row.product?.process?.name ?? "-",
        id: `sheet_${random_id}`,
        code: row.product?.code ?? '-',
        avg_uph : row.product?.standard_uph
      }
    })

    setSelectList(new Set)
    setBasicRow([...tmpBasicRow])
  }

  return (
    <div className={'excelPageContainer'}>
      <PageHeader
        isSearch
        isCalendar
        searchOptionList={optionList}
        optionIndex={optionIndex}
        searchKeyword={keyword}
        onSearch={reload}
        onChangeSearchOption={(option) => {
          setOptionIndex(option)
        }}
        calendarTitle={'작업 기한'}
        calendarType={'period'}
        selectDate={selectDate}
        //@ts-ignore
        setSelectDate={onSelectDate}
        title={"작업 완료 리스트"}
        buttons={["항목관리"]}
        buttonsOnclick={(index) => {
          switch (index) {
            case 0:
              router.push(`/mes/item/manage/finishV2`);
              break
            default:
              break
          }
        }}
      />
      <ExcelTable
        editable
        resizable
        resizeSave
        selectable
        headerList={[
          SelectColumn,
        ...addColumnClass(column)
        ]}
        row={basicRow}
        setRow={(e) => {
          let tmp: Set<any> = selectList
          let tmpRes = e.map(v => {
            if(v.isChange) {
                            tmp.add(v.id)
                            v.isChange = false
                        }
            if(v.update || v.finish){
              reload()
              return {
                ...v,
                update: undefined,
                finish: undefined,
              }
            }
            return { ...v, }
          })

          setSelectList(tmp)
          setBasicRow([...tmpRes])
        }}
        selectList={selectList}
        //@ts-ignore
        setSelectList={setSelectList}
        width={1576}
        height={setExcelTableHeight(basicRow.length)}
      />
      <PaginationComponent
          currentPage={pageInfo.page}
          totalPage={pageInfo.total}
          setPage={(page) => {
            setPageInfo({...pageInfo, page: page})
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

export {MesFinishList};
