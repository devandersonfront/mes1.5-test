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

const dummyDate = moment().subtract(10, 'days')

const MesRawMaterialStock = ({page, keyword, option}: IProps) => {
  const router = useRouter()

  const [excelOpen, setExcelOpen] = useState<boolean>(false)

  const [basicRow, setBasicRow] = useState<Array<any>>([{
    date: dummyDate.format('YYYY-MM-DD'), useDate: 10,
    code: 'SUS-111', name: 'SUS360', texture: 'SUS360', depth: '1.2', width: 3000, height: 3000, type: 'COIL', amount: 1000,
    number: `${dummyDate.format('YYMMDD')}-01-01`, current: 1000, customer: '한국상사',
  }])
  const [column, setColumn] = useState<Array<IExcelHeaderType>>( columnlist["rawstockV1u"])
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
    res = await RequestMethod('post', `moldSave`,
      {
        ['molds']: basicRow.map((row, i) => {
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
        }).filter((v) => v)
      })


    if(res){
      if(res.status === 200){
        Notiflix.Report.success('저장되었습니다.','','확인');
        if(keyword){
          SearchBasic(keyword, option, page).then(() => {
            Notiflix.Loading.remove()
          })
        }else{
          LoadBasic(page).then(() => {
            Notiflix.Loading.remove()
          })
        }
      }
    }
  }


  const LoadBasic = async (page?: number) => {
    Notiflix.Loading.circle()
    const res = await RequestMethod('get', `moldList`,{
      path: {
        page: (page || page !== 0) ? page : 1,
        renderItem: 18,
      }
    })

    if(res && res.status === 200){
      setPageInfo({
        ...pageInfo,
        page: res.results.page,
        total: res.results.totalPages
      })
      cleanUpData(res)
    }else if (res.state === 401) {
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
    const res = await RequestMethod('get', `moldSearch`,{
      path: {
        page: isPaging ?? 1,
        renderItem: 18,
      },
      params: {
        keyword: keyword ?? '',
        opt: option ?? 0
      }
    })

    if(res && res.status === 200){
      setPageInfo({
        ...pageInfo,
        page: res.results.page,
        total: res.results.totalPages
      })
      cleanUpData(res)
    }
  }

  const cleanUpData = (res: any) => {
    let tmpColumn = columnlist["mold"];
    let tmpRow = []
    tmpColumn = tmpColumn.map((column: any) => {
      let menuData: object | undefined;
      res.results.menus && res.results.menus.map((menu: any) => {
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

    let additionalMenus = res.results.menus ? res.results.menus.map((menu:any) => {
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


    tmpRow = res.results.info_list


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
        cm_id:(index === 0 || row.ppd.seq === 1) ? row.product.raw_material.model.model : undefined,
        cm_idPK:row.product.raw_material.model.cm_id,
        mold_id:row.mold_id,
        mold_name:row.ppd.mold_name,
        limit:row.limit,
        inspect:row.inspect,
        current:row.current,
        customer_id: (index === 0 || row.ppd.seq === 1) ? row.product.raw_material.model.customer.name : undefined,
        customer_idPK: row.product.raw_material.model.customer.customer_id,
        code: (index === 0 || row.ppd.seq === 1) ? row.product.raw_material.code : undefined,
        name: (index === 0 || row.ppd.seq === 1) ? row.product.raw_material.name : undefined,
        seq: row.ppd.seq,
        cavity: row.ppd.cavity,
        spm: row.spm,
        slideHeight: row.slideHeight,
        process_id: row.ppd.process.name,
        ...appendAdditional,
        id: `mold_${random_id}`,
      }
    })

    setBasicRow([...tmpBasicRow])
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
        setExcelOpen(true)
        break;
      case 1:

        router.push(`/mes/item/manage/mold`)

        break;
      case 2:
        SaveBasic()
        break;
    }
  }

  return (
    <div>
      <PageHeader
        isSearch
        searchKeyword={keyword}
        onChangeSearchKeyword={(keyword) => {
          if(keyword){
            router.push(`/mes/rawmaterial/input?page=1&keyword=${keyword}&opt=${optionIndex}`)
          }else{
            router.push(`/mes/rawmaterial/input?page=1&keyword=`)
          }
        }}
        searchOptionList={optionList}
        onChangeSearchOption={(option) => {
          setOptionIndex(option)
        }}
        calendarTitle={'입고일'}
        optionIndex={optionIndex}
        isCalendar
        calendarType={'period'}
        selectDate={selectDate}
        //@ts-ignore
        setSelectDate={setSelectDate}
        title={"원자재 재고 현황"}
        buttons={
          [ '수정하기', '저장하기', '삭제']
        }
        buttonsOnclick={
          (e) => {
            switch(e) {
              case 0:
                router.push('/mes/rawmaterialV1u/modify')
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

export {MesRawMaterialStock};
