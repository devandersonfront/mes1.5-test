import React, {useEffect, useState} from 'react'
import {
    columnlist,
    ExcelDownloadModal,
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
import {useDispatch} from "react-redux";
import {deleteSelectMenuState, setSelectMenuStateChange} from "shared/src/reducer/menuSelectState";

interface IProps {
  children?: any
  page?: number
  search?: string
  option?: number
}

const MesFinishList = ({page, search, option}: IProps) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [basicRow, setBasicRow] = useState<Array<any>>([])
  const [column, setColumn] = useState<Array<IExcelHeaderType>>( columnlist["finishListV2"])
  const [selectList, setSelectList] = useState<Set<number>>(new Set())
  const [optionList, setOptionList] = useState<string[]>(['지시고유번호', '거래처', '모델', 'code',  '품명'])
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
  useEffect(() => {
    if(getMenus()){
      if(keyword){
        SearchBasic(keyword, optionIndex, pageInfo.page).then(() => {
          Notiflix.Loading.remove()
        })
      }else{

        LoadBasic(pageInfo.page).then(() => {
          Notiflix.Loading.remove()
        })
      }
    }
  }, [pageInfo.page, selectDate])

  useEffect(() => {
    dispatch(setSelectMenuStateChange({main:"생산관리 등록",sub:router.pathname}))
    return(() => {
      dispatch(deleteSelectMenuState())
    })
  },[])

  const getMenus = async () => {
    let res = await RequestMethod('get', `loadMenu`, {
      path: {
        tab: 'ROLE_PROD_06'
      }
    })

    return !!res
  }

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
    const res = await RequestMethod('get', `sheetList`,{
      path: {
        page: pageInfo.page ?? 1,
        renderItem: 22,
      },
      params: {
        status: 2,
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

  const SearchBasic = async (keyword: any, option: number, isPaging?: number) => {
    Notiflix.Loading.circle()
    if(!isPaging){
      setOptionIndex(option)
    }
    const res = await RequestMethod('get', `operationSearch`,{
      path: {
        page: isPaging ?? 1,
        renderItem: 22,
      },
      params: {
        keyword: keyword ?? '',
        opt: optionIndex ?? 0,
        status : 2,
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

  const cleanUpData = (res: any) => {
    let tmpColumn = columnlist["finishListV2"];
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

    Notiflix.Loading.remove()
    if(pageInfo.total > pageInfo.page){
      setSelectList(new Set)
      setBasicRow([...basicRow,...tmpBasicRow])
    }else{
      setSelectList(new Set)
      setBasicRow([...tmpBasicRow])
    }
  }

  const settingHeight = (length:number) => {
    switch (length){
      case 0:
        return 90
      default :
        return basicRow.length * 40 + 56
    }
  }

  return (
    <div>
      <PageHeader
        isSearch
        isCalendar
        searchKeyword={keyword}
        searchOptionList={optionList}
        optionIndex={optionIndex}
        onChangeSearchKeyword={(keyword) => {
          setSelectList(new Set)
          // setKeyword(keyword)
          // setPageInfo({page:1, total:1})
          SearchBasic(keyword, optionIndex, 1).then(() => {
            Notiflix.Loading.remove();
          });
        }}
        onChangeSearchOption={(option) => {
          setOptionIndex(option)
        }}
        calendarTitle={'작업 기한'}
        calendarType={'period'}
        selectDate={selectDate}
        //@ts-ignore
        setSelectDate={(date) => {
          setSelectList(new Set)
          setSelectDate(date as { from:string, to:string })
          setPageInfo({page:1, total:1})
        }}
        title={"작업 완료 리스트"}
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
          let tmpRes = e.map(v => {
            if(v.isChange) {
                            tmp.add(v.id)
                            v.isChange = false
                        }
            if(v.update || v.finish){
              if(keyword){
                SearchBasic(keyword, optionIndex, pageInfo.page).then(() => {
                  Notiflix.Loading.remove()
                })
              }else{
                LoadBasic(pageInfo.page).then(() => {
                  Notiflix.Loading.remove()
                })
              }
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
        height={settingHeight(basicRow.length)}
        scrollEnd={(value) => {
          if(value){
            if(pageInfo.total > pageInfo.page){
              setSelectList(new Set)
              setPageInfo({...pageInfo, page:pageInfo.page+1})
            }
          }
        }}

      />
      {/* <ExcelDownloadModal
        isOpen={excelOpen}
        column={column}
        basicRow={basicRow}
        filename={`금형기준정보`}
        sheetname={`금형기준정보`}
        selectList={selectList}
        tab={'ROLE_BASE_07'}
        setIsOpen={setExcelOpen}
      /> */}
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
