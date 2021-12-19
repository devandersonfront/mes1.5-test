import React, {useEffect, useRef, useState} from 'react'
import styled from "styled-components";
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
  IExcelHeaderType, IItemMenuType, setModifyInitData, searchModalList
} from 'shared'
// @ts-ignore
import {SelectColumn} from 'react-data-grid'
import Notiflix from "notiflix";
import {useRouter} from 'next/router'
import {loadAll} from 'react-cookies'
import {NextPageContext} from 'next'
import moment from 'moment'
import {useDispatch} from 'react-redux'
import {TransferCodeToValue} from 'shared/src/common/TransferFunction'

interface IProps {
  children?: any
  page?: number
  keyword?: string
  option?: number
}

let now = moment().format('YYYY-MM-DD')

const MesOrderList = ({page, keyword, option}: IProps) => {
  const router = useRouter()
  const dispatch = useDispatch()

  const [excelOpen, setExcelOpen] = useState<boolean>(false)

  const [basicRow, setBasicRow] = useState<Array<any>>([{
    order_num: '-', operation_num: '20210401-013'
  }])
  const [column, setColumn] = useState<Array<IExcelHeaderType>>( columnlist["orderList"])
  const [selectList, setSelectList] = useState<Set<number>>(new Set())
  const [optionList, setOptionList] = useState<string[]>(['수주 번호', '거래처명', '모델', 'CODE', '품명', '지시 고유 번호'])
  const [optionIndex, setOptionIndex] = useState<number>(0)
  const [selectDate, setSelectDate] = useState<{from:string, to:string}>({
    from: moment(new Date()).startOf("month").format('YYYY-MM-DD') ,
    to:  moment(new Date()).endOf("month").format('YYYY-MM-DD')
  });

  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
    page: 1,
    total: 1
  })

  const [ref, setRef] = useState<any>();
  const loadingBar = useRef(null);

  useEffect(() => {
    // setOptionIndex(option)
    if(searchKeyword){
      SearchBasic(searchKeyword, optionIndex, pageInfo.page).then(() => {
        Notiflix.Loading.remove()
      })
    }else{
      LoadBasic(pageInfo.page).then(() => {
        Notiflix.Loading.remove()
      })
    }

  }, [pageInfo.page, searchKeyword, option])

  useEffect(()=>{
    const scroll = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        console.log(entry)
        if(entry.intersectionRatio > 0){
          if(pageInfo.total > pageInfo.page){
            Notiflix.Loading.circle()
            setTimeout(()=>{
              setPageInfo({...pageInfo, page:pageInfo.page+1})
              document.querySelector(".ScrollBox").scrollTop = 0;
            },1000)
            Notiflix.Loading.remove(300);
          // }
          }else{
          }
        }
      })
    })
    if(loadingBar.current !== null && ref != undefined){
      scroll.observe(ref);
    }
  },[ref, pageInfo.page])

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
    const res = await RequestMethod('get', `contractList`,{
      path: {
        page: pageInfo.page ?? 1,
        renderItem: 22,
      }
    })
    if(res){
      setPageInfo({
        ...pageInfo,
        page: res.page,
        total: res.totalPages
      })
      cleanUpData(res)
      setRef(document.querySelector(".Next"));
    }else if (res === 401) {
      Notiflix.Report.failure('불러올 수 없습니다.', '권한이 없습니다.', '확인', () => {
        router.back()
      })
    }

  }

  const SearchBasic = async (keyword: any, option: number, isPaging?: number) => {
    Notiflix.Loading.circle()
    if(!isPaging){
      setOptionIndex(option)
    }
    const res = await RequestMethod('get', `contractSearch`,{
      path: {
        page: isPaging ?? 1,
        renderItem: 22,
      },
      params: {
        keyword: keyword ?? '',
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
      setRef(document.querySelector(".Next"));
    }
  }

  const cleanUpData = (res: any) => {
    let tmpColumn = columnlist["orderList"];
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
          ...menuData
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

    // tmpRow.push({id:"next"})

    loadAllSelectItems( [
      ...tmpColumn,
      ...additionalMenus
    ] )


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
        customer_id: row.product.customer?.name,
        cm_id: row.product.model?.model,
        modelArray: row.model,
        process_id: row.product.process?.name,
        product_id: row.product.code,
        name: row.product.name,
        type: TransferCodeToValue(row.product.type, 'material'),
        unit: row.product.unit,
        processArray: row.process,
        id: `mold_${random_id}`,
      }
    })
    setBasicRow([...tmpBasicRow])
  }

  const DeleteBasic = async () => {
    const res = await RequestMethod('delete', `contractDelete`,
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
        // if(Number(page) === 1){
          LoadBasic(1).then(() => {
            Notiflix.Loading.remove()
          })
        // }else{
          // if(keyword){
          //   router.push(`/mes/basic/customer?page=1&keyword=${keyword}&opt=${option}`)
          // }else{
          //   router.push(`/mes/basic/customer?page=1`)
          // }
        // }
      })
    }
  }

  return (
    <div>
      <PageHeader
        isSearch
        isCalendar
        searchKeyword={""}
        searchOptionList={optionList}
        onChangeSearchKeyword={(keyword) => {
          // SearchBasic(keyword, option, 1)
          console.log("keyword : ", keyword);
          setSearchKeyword(keyword);
          setPageInfo({page:1, total:1})

        }}
        onChangeSearchOption={(option) => {
          // SearchBasic(keyword, option, 1)
          setOptionIndex(option)
        }}
        calendarTitle={'납품 기한'}
        calendarType={'period'}
        selectDate={selectDate}
        //@ts-ignore
        setSelectDate={(date) => setSelectDate(date)}
        title={"수주 현황"}
        buttons={
          ['', '수정하기', '삭제']
        }
        buttonsOnclick={
          (e) => {
            switch(e) {
              case 1:
                dispatch(setModifyInitData({
                  modifyInfo: basicRow.map(v => {
                    if (selectList.has(v.id)) {
                      return v
                    }
                  }).filter(v => v),
                  type: 'order'
                }))
                router.push('/mes/order/modify')
                break;
              case 2:
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
      <ExcelTableBox className={"ScrollBox"}>
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
        <div className={"Next"} ref={loadingBar} style={{width:"100%", height:"50px",display:"flex", justifyContent:"center", alignItems:"center"}} >
          Loading...
        </div>
      </ExcelTableBox>
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

const ExcelTableBox = styled.div`
  height:720px;
  overflow:scroll;
::-webkit-scrollbar{
    display:none;
    width:${(props:any)=> props.theme};
    height:8px;
  }

  ::-webkit-scrollbar-thumb{
    background:#484848;
  }

  ::-webkit-scrollbar-track{
    background:none;
  }

  ::-webkit-scrollbar-corner{
    display:none;
  }
`;

export {MesOrderList};
