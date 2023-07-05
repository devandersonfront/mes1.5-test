import React, {useEffect, useState} from 'react'
import {
  columnlist,
  ExcelTable,
  Header as PageHeader,
  IExcelHeaderType,
  MAX_VALUE, PaginationComponent,
  RequestMethod,
  TextEditor
} from 'shared'
import {NextPageContext} from 'next'
// @ts-ignore
import {SelectColumn} from 'react-data-grid'
import Notiflix from "notiflix";
import {useRouter} from 'next/router'
import moment from 'moment'
import {TransferCodeToValue} from 'shared/src/common/TransferFunction'
import {useDispatch} from 'react-redux'
import {additionalMenus, getTableSortingOptions, loadAllSelectItems, setExcelTableHeight} from 'shared/src/common/Util'
import { setModifyInitData } from 'shared/src/reducer/modifyInfo'
import {deleteMenuSelectState, setMenuSelectState} from "shared/src/reducer/menuSelectState";
import { TableSortingOptionType } from 'shared/src/@types/type'
import addColumnClass from '../../../../main/common/unprintableKey'
import EditListModal from "shared/src/components/Modal/EditModal/EditListModal";
interface IProps {
  children?: any
  page?: number
  search?: string
  option?: number
  todayOnly?: boolean
}

const optionList = ['지시 고유 번호', '거래처명', '모델', 'CODE', '품명']

const MesOperationList = ({todayOnly}: IProps) => {
  const router = useRouter()
  const dispatch = useDispatch()

  const [basicRow, setBasicRow] = useState<Array<any>>([])
  const [column, setColumn] = useState<Array<IExcelHeaderType>>( columnlist["operationListV2"])
  const [selectList, setSelectList] = useState<Set<number>>(new Set())
  const [optionIndex, setOptionIndex] = useState<number>(0)
  const [sortingOptions, setSortingOptions] = useState<TableSortingOptionType>({orders:[], sorts:[]})
  const [selectDate, setSelectDate] = useState<{from:string, to:string}>({
    from: todayOnly ?  moment().format('YYYY-MM-DD') : moment().subtract(1,'month').format('YYYY-MM-DD'),
    to: moment().format('YYYY-MM-DD')
  })
  const [keyword, setKeyword] = useState<string>("");
  const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
    page: 1,
    total: 1
  })
  const [sheetModalOpen, setSheetModalOpen] = useState<boolean>(false)

  const onSelectDate = (date: {from:string, to:string}) => {
    const _date = todayOnly ? {from: moment().format('YYYY-MM-DD'), to:moment().format('YYYY-MM-DD')} : date
    setSelectDate(_date)
    reload(null, null, _date)
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
    params['status'] = '0,1'
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
  };


  const DeleteBasic = async () => {
    const res = await RequestMethod('delete', `sheetDelete`,
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
            type: row.type_id,
            status: row.status_no,
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
      Notiflix.Report.success('삭제 성공!', '', '확인', () => reload())
    }
  }

  const cleanUpData = (res: any, date?: {from:string, to:string}) => {

    loadAllSelectItems({column:additionalMenus(columnlist["operationListV2"], res), sortingOptions, setSortingOptions, reload, setColumn});



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
        status: TransferCodeToValue(row.status, 'workStatus'),
        status_no: row.status,
        contract_id: row.contract?.identification ?? '-' ,
        bom_root_id: row.product?.bom_root_id,
        total_counter: row.total_good_quantity+row.total_poor_quantity,
        customer_id: row.product.customer?.name ?? '-',
        cm_id: row.product.model?.model ?? '-',
        product_id: row.product.code ?? '-',
        code: row.product.code ?? '-',
        name: row.product.name ?? '-',
        type: TransferCodeToValue(row.product.type, 'product'),
        unit: row.product?.unit ?? '-',
        process_id: row.product?.process?.name ?? '-',
        id: `sheet_${random_id}`,
        reload,
      }
    })
    setSelectList(new Set)
    setBasicRow([...tmpBasicRow])
  }

  return (
    <div className={'excelPageContainer'}>
      <EditListModal open={sheetModalOpen} setOpen={setSheetModalOpen} onRowChange={reload} />
        <PageHeader
            isSearch
            isCalendar
            searchOptionList={optionList}
            optionIndex={optionIndex}
            calendarTitle={'작업 기한'}
            calendarType={'period'}
            selectDate={selectDate}
            searchKeyword={keyword}
            onSearch={reload}
            onChangeSearchOption={(option) => {
              setOptionIndex(option)
            }}
            //@ts-ignore
            setSelectDate={onSelectDate}
            //실제사용
            title={`${todayOnly ? '금일 ' : ''}작업지시서 리스트`}
            buttons={
              ['추천 작업지시서', todayOnly ? '' : '항목 관리', '수정하기', '삭제']
            }
            buttonsOnclick={
              (e) => {
                switch(e) {
                  case 0:
                    setSheetModalOpen(true)
                    break
                  case 1:
                    router.push(`/mes/item/manage/operationV1u`);
                    break;
                  case 2:
                    if(selectList.size === 0){
                      Notiflix.Report.warning("경고","데이터를 선택해주시기 바랍니다.","확인");
                    }else if(selectList.size === 1){
                      dispatch(setModifyInitData({
                        modifyInfo: basicRow.map(v => {
                          if (selectList.has(v.id)) {
                            return v
                          }
                        }).filter(v => v),
                        type: 'order'
                      }))
                      router.push('/mes/operationV1u/modify')
                    }else{
                      Notiflix.Report.warning("경고","데이터를 하나만 선택해주시기 바랍니다.","확인");
                    }
                    break;
                  case 3:
                    if(selectList.size <= 0) {
                      return  Notiflix.Report.warning("경고","데이터를 선택해 주시기 바랍니다.","확인" )
                    }
                    Notiflix.Confirm.show("경고","삭제하시겠습니까?","확인","취소",
                        ()=>{
                          DeleteBasic()
                        },
                        ()=>{}
                    )
                    break;
                }

              }
              // onClickHeaderButton
            }
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
      // setRow={setBasicRow}
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
      width={'1576px'}
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

export {MesOperationList};
