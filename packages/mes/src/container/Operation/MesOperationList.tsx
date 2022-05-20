import React, {useEffect, useState} from 'react'
import {
    columnlist,
    ExcelTable,
    Header as PageHeader,
    IExcelHeaderType,
    MAX_VALUE,
    RequestMethod,
    setModifyInitData,
    TextEditor
} from 'shared'
// @ts-ignore
import {SelectColumn} from 'react-data-grid'
import Notiflix from "notiflix";
import {useRouter} from 'next/router'
import {NextPageContext} from 'next'
import moment from 'moment'
import {TransferCodeToValue} from 'shared/src/common/TransferFunction'
import {useDispatch} from 'react-redux'
import {deleteSelectMenuState, setSelectMenuStateChange} from "shared/src/reducer/menuSelectState";

interface IProps {
  children?: any
  page?: number
  search?: string
  option?: number
}

let now = moment().format('YYYY-MM-DD')

const MesOperationList = ({page, search, option}: IProps) => {
  const router = useRouter()
  const dispatch = useDispatch()

  const [excelOpen, setExcelOpen] = useState<boolean>(false)

  const [basicRow, setBasicRow] = useState<Array<any>>([])
  const [column, setColumn] = useState<Array<IExcelHeaderType>>( columnlist["operationListV2"])
  const [selectList, setSelectList] = useState<Set<number>>(new Set())
  const [optionList, setOptionList] = useState<string[]>(['지시 고유 번호', '거래처명', '모델', 'CODE', '품명'])
  const [optionIndex, setOptionIndex] = useState<number>(0)
  const [order, setOrder] = useState<number>(0);
  const [selectDate, setSelectDate] = useState<{from:string, to:string}>({
    from: moment().subtract(1,'month').format('YYYY-MM-DD'),
    to: moment().format('YYYY-MM-DD')
  });



  const [keyword, setKeyword] = useState<string>("");
  const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
    page: 1,
    total: 1
  })
  const changeOrder = (value:number) => {
    setPageInfo({page:1,total:1})
    setOrder(value);
  }

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
  }, [pageInfo.page, keyword, selectDate, order])

  useEffect(() => {
    dispatch(setSelectMenuStateChange({main:"생산관리 등록",sub:router.pathname}))
    return(() => {
      dispatch(deleteSelectMenuState())
    })
  },[])

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

  const LoadBasic = async (page?: number) => {
    Notiflix.Loading.circle()
    const res = await RequestMethod('get', `sheetList`,{
      path: {
        page: pageInfo.page ?? 1,
        renderItem: 22,
      },
      params: order == 0 ?
          {
            from: selectDate.from,
            to: selectDate.to,
            status: '0,1'
          }
          :
          {
            sorts: 'date',
            order: order == 1 ? 'ASC' : 'DESC',
            from: selectDate.from,
            to: selectDate.to,
            status: '0,1'
          }
    })


    if(res){
      setPageInfo({
        ...pageInfo,
        page: res.page,
        total: res.totalPages
      })
      cleanUpData(res)
    }else{
    }
  }

  const SearchBasic = async (keyword: any, option: number, isPaging?: number) => {
    Notiflix.Loading.circle()
    if(!isPaging){
      setOptionIndex(option)
    }
    const res = await RequestMethod('get', `operationSearch`,{
      path: {
        page: pageInfo.page ?? 1,
        renderItem: 22,
      },
      params: order == 0 ?
          {
            from: selectDate.from,
            to: selectDate.to,
            keyword: keyword ?? '',
            status: '0,1',
            opt: option ?? 0
          }
          :
          {
            sorts: 'date',
            order: order == 1 ? 'ASC' : 'DESC',
            from: selectDate.from,
            to: selectDate.to,
            keyword: keyword ?? '',
            status: '0,1',
            opt: option ?? 0
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
      Notiflix.Report.success('삭제 성공!', '', '확인', () => {
        setSelectList(new Set)
        LoadBasic(1).then(() => {
          Notiflix.Loading.remove(3000)
        })
      })
    }
  }

  const cleanUpData = (res: any) => {
    let tmpColumn = columnlist["operationListV2"];
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
        status: TransferCodeToValue(row.status, 'workStatus'),
        status_no: row.status,
        contract_id: row.contract?.identification ?? '-' ,
        bom_root_id: row.product?.bom_root_id,
        // operation_sheet: row.
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
      }
    })
    setSelectList(new Set)
    Notiflix.Loading.remove()
    setBasicRow([...tmpBasicRow])
  }


  return (
    <div>
      <PageHeader
        isSearch
        isCalendar
        searchKeyword={keyword}
        searchOptionList={optionList}
        optionIndex={optionIndex}
        calendarTitle={'작업 기한'}
        calendarType={'period'}
        selectDate={selectDate}
        onChangeSearchKeyword={(keyword) => {
          setSelectList(new Set)
          setKeyword(keyword);
          SearchBasic(keyword, optionIndex, 1).then(() => {
            Notiflix.Loading.remove();
          });
          // setPageInfo({page:1, total:1})
        }}
        onChangeSearchOption={(option) => {
          setOptionIndex(option)
        }}
        //@ts-ignore
        setSelectDate={(date) => {
          setSelectList(new Set)
          setSelectDate(date as {from:string, to:string })
          setPageInfo({page:1, total:1})
        }}
        title={"작업지시서 리스트"}
        buttons={
          ['', '수정하기', '삭제']
        }
        buttonsOnclick={
          (e) => {
            switch(e) {
              case 1:
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
              case 2:
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
      height={basicRow.length * 40 >= 40*18+56 ? 40*19 : basicRow.length * 40 + 56}
      scrollEnd={(value) => {
        if(value){
          if(pageInfo.total > pageInfo.page){
            setSelectList(new Set)
            setPageInfo({...pageInfo, page:pageInfo.page+1})
            setSelectList(new Set)
          }
        }
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
