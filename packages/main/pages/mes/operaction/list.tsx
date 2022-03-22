import React, {useEffect, useState} from 'react'
import ExcelTable from '../../../component/Excel/ExcelTable'
import MenuNavigation from '../../../component/MenuNav/MenuNavigation'
import ProfileHeader from '../../../component/Profile/ProfileHeader'
import PageHeader from '../../../component/Header/Header'
// @ts-ignore
import {SelectColumn} from 'react-data-grid'
import {IExcelHeaderType} from '../../../common/@types/type'
import {RequestMethod} from '../../../common/RequestFunctions'
import {columnlist} from "../../../common/columnInit";
import Notiflix from "notiflix";
import {useRouter} from 'next/router'
import {MAX_VALUE} from '../../../common/configset'
import TextEditor from '../../../component/InputBox/ExcelBasicInputBox'
import {excelDownload} from '../../../common/excelDownloadFunction'
import PaginationComponent from '../../../component/Pagination/PaginationComponent'
import {NextPageContext} from 'next'
import ExcelDownloadModal from '../../../component/Modal/ExcelDownloadMoadal'
import moment from 'moment'

const title = '작업지시서 리스트'
const optList = ['거래처명', '모델명', 'CODE', '품명', '공정', '기계', 'Lot번호']

interface IProps {
  children?: any
  page?: number
  keyword?: string
  option?: number
}

const statusList = ['시작 전', '작업중', '일시정지', '작업종료', '미완료']

const BasicContainer = ({page, keyword, option}: IProps) => {
  const router = useRouter()

  const [excelOpen, setExcelOpen] = useState<boolean>(false)

  const [basicRow, setBasicRow] = useState<Array<any>>([{
    name: "", id: ""
  }])

  const [headerStatus, setHeaderStatus] = useState<number | string>("");

  const [column, setColumn] = useState<Array<IExcelHeaderType>>(columnlist.operationList)
  const [selectList, setSelectList] = useState<Set<number>>(new Set())
  const [optionList, setOptionList] = useState<string[]>(optList)
  const [optionIndex, setOptionIndex] = useState<number>(0)

  const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
    page: 1,
    total: 1
  })

  const [selectDate, setSelectDate] = useState<{from:string, to:string}>({
    from: moment().startOf('isoWeek').format('YYYY-MM-DD'),
    to: moment().endOf('isoWeek').format('YYYY-MM-DD')
  });

  const changeHeaderStatus = (value:number) => {
    setHeaderStatus(value);
  }

  const checkStatus = (value:number) => {
      if(value === -1){
        return "/1,2,3,4/"
      }else{
        return value
      }
  }

  useEffect(() => {
    setOptionIndex(option)
    if(keyword){
      SearchBasic(keyword, option, page).then(() => {
        Notiflix.Loading.remove()
      })
    }else{
      LoadBasic(page).then(() => {
        Notiflix.Loading.remove()
      })
    }
  }, [page, keyword, option, selectDate, headerStatus])

  const loadAllSelectItems = async (column: IExcelHeaderType[]) => {
    let tmpColumn = column.map(async (v: any) => {

      if(v.selectList && v.selectList.length === 0){
        let tmpKey = v.key

        if(tmpKey === 'customer_id'){
          tmpKey = 'customer'
        } else if(tmpKey === 'cm_id'){
          tmpKey = 'model'
        }


        const res = await RequestMethod('get', `${tmpKey}List`,{
          path: {
            page: 1,
            renderItem: MAX_VALUE,
          }
        })

        return {
          ...v,
          selectList: [...res.results.info_list.map((value: any) => {
            return {
              ...value,
              pk: value.ca_id
            }
          })]
        }
      }else{
        if(v.selectList){
          return {
            ...v,
            pk: v.unit_id
          }
        }else if(v.key === "status"){
          return {
            ...v,
            result: changeHeaderStatus
          }
        } else{
          return v
        }
      }
    })

    Promise.all(tmpColumn).then(res => {
      setColumn([...res.map(v=> {
        return {
          ...v,
          name: v.moddable ? v.name+'(필수)' : v.name
        }
      })])
    })
  }

  const SaveBasic = async () => {
    let res = await RequestMethod('put', `operationModify`,
      {
        sheets: basicRow.map((row, i) => {
          if(selectList.has(row.id)){

            let selectData: any = {}

            return {
              ...row,
              ...selectData,
              ln_id: row.ln_idPK,
              machine_id: row.machine_idPK,
              process_id: row.process_idPK,
              mold_id: row.mold?.mold_id,
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

  const DeleteBasic = async () => {
    const res = await RequestMethod('delete', `operationDelete`,
      {
        sheets: basicRow.map((row, i) => {
          if(selectList.has(row.id)){
            return row.osd_id
          }
        }).filter((v) => v)
      })

    if(res) {
      if(res.status === 200){
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
    const res = await RequestMethod('get', `operactionList`,{
      path: {
        page: (page || page !== 0) ? page : 1,
        renderItem: 18,
        status:headerStatus
      },
      params: {
        from: selectDate.from,
        to: selectDate.to
      }
    })

    if(res && res.status === 200){
      if(res.results.totalPages !== 0 && res.results.totalPages < page){
        LoadBasic(page - 1).then(() => {
          Notiflix.Loading.remove()
        })
      }else{
        setPageInfo({
          ...pageInfo,
          page: res.results.page,
          total: res.results.totalPages,
        })
        cleanUpData(res)
      }
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
        renderItem: 18,
        status:headerStatus
      },
      params: {
        keyword: keyword ?? '',
        opt: option ?? 0,
        from: selectDate.from,
        to: selectDate.to
      }
    })

    if(res && res.status === 200) {
      setPageInfo({
        ...pageInfo,
        page: res.results.page,
        total: res.results.totalPages
      })
      cleanUpData(res)
    }
  }

  const changeRow = (row: any) => {
    let tmpData = {}

    return {
      ...row,
      identification: row.identification,
      date: row.date,
      customer_id: row.product?.raw_material.model.customer.name,
      customer_idPK: row.product?.raw_material.model.customer.customer_id,
      cm_id: row.product?.raw_material.model.model,
      cm_idPK: row.product?.raw_material.model.cm_id,
      code: row.product?.raw_material.code,
      rm_id: row.product?.raw_material.rm_id,
      name: row.product?.raw_material.name,
      texture: row.product?.raw_material.texture,
      process_id: row.process?.name,
      process_idPK: row.process?.process_id,
      seq: row.seq,
      mold_id: row.mold?.name,
      machine_id: row.machine?.name,
      machine_idPK: row.machine?.machine_id,
      goal: row.goal,
      ln_id: row.lot_number?.number ?? undefined,
      ln_idPK: row.lot_number?.ln_id ?? undefined,
      status: statusList[row.status],
      ...tmpData
    }
  }

  const cleanUpData = (res: any) => {
    let tmpColumn = columnlist.operationList
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
            unit:menu.unit,
            moddable: !menu.moddable
          }
        } else if(menu.colName === 'id' && column.key === 'tmpId'){
          menuData = {
            id: menu.id,
            name: menu.title,
            width: menu.width,
            tab:menu.tab,
            unit:menu.unit,
            moddable: !menu.moddable
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

    loadAllSelectItems(tmpColumn)

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

    let additionalData: any[] = []

    additionalMenus.map((v: any) => {
      if(v.type === 'additional'){
        additionalData.push(v.key)
      }
    })

    let tmpBasicRow = tmpRow.map((row: any, index: number) => {
      let realTableData: any = changeRow(row)
      let appendAdditional: any = {}

      row.additional && row.additional.map((v: any) => {
        appendAdditional = {
          ...appendAdditional,
          [v.title]: v.value
        }
      })

      const random_id = Math.random()*1000

      return {
        // ...row,
        ...realTableData,
        ...appendAdditional,
        id: `rawinput_${random_id}`,
      }
    })

    setBasicRow([...tmpBasicRow])
  }

  const downloadExcel = () => {
    let tmpSelectList: boolean[] = []
    basicRow.map(row => {
      tmpSelectList.push(selectList.has(row.id))
    })
    excelDownload(column, basicRow, `원자재 입고 관리`, 'rawmaterial_input', tmpSelectList)
  }

  const onClickHeaderButton = (index: number) => {
    switch(index){
      case 0:
        setExcelOpen(true)
        break;
      case 1:
        router.push(`/mes/item/manage/operation`)
        break;
      case 2:
        SaveBasic()
        break;
      case 3:
        DeleteBasic()
        break;
    }
  }

  return (
    <div style={{display: 'flex', }}>
      <MenuNavigation pageType={'MES'} subType={0}/>
      <div style={{paddingBottom: 40}}>
        <ProfileHeader/>
        <PageHeader
          isSearch
          searchKeyword={keyword}
          onChangeSearchKeyword={(keyword) => {
            if(keyword){
              router.push(`/mes/operaction/list?page=1&keyword=${keyword}&opt=${optionIndex}`)
            }else{
              router.push(`/mes/operaction/list?page=1&keyword=`)
            }
          }}
          searchOptionList={optionList}
          optionIndex={optionIndex}
          onChangeSearchOption={(option) => {
            setOptionIndex(option)
          }}
          isCalendar
          calendarType={'period'}
          selectDate={selectDate}
          //@ts-ignore
          setSelectDate={setSelectDate}
          title={title}
          buttons={['', '항목관리', '저장하기', '삭제']}
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
              router.push(`/mes/operaction/list?page=${page}&keyword=${keyword}&opt=${option}`)
            }else{
              router.push(`/mes/operaction/list?page=${page}`)
            }
          }}
        />
      </div>
      <ExcelDownloadModal
        isOpen={excelOpen}
        column={column}
        basicRow={basicRow}
        filename={`작업지시서리스트`}
        sheetname={`작업지시서리스트`}
        selectList={selectList}
        tab={'ROLE_PROD_02'}
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

// BasicContainer.getInitialProps = async ({ query }) => {
//   let { page, keyword, opt } = query
//   if (typeof page === 'string')
//     page = parseInt(page);
//   if (typeof opt === 'string')
//     opt = parseInt(opt);
//   return { page, keyword, option: opt };
// }

export default BasicContainer;
