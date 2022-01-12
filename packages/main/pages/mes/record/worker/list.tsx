import React, {useEffect, useState} from 'react'
import ExcelTable from '../../../../component/Excel/ExcelTable'
import MenuNavigation from '../../../../component/MenuNav/MenuNavigation'
import ProfileHeader from '../../../../component/Profile/ProfileHeader'
import PageHeader from '../../../../component/Header/Header'
// @ts-ignore
import {SelectColumn} from 'react-data-grid'
import {IExcelHeaderType} from '../../../../common/@types/type'
import {RequestMethod} from '../../../../common/RequestFunctions'
import {columnlist} from "../../../../common/columnInit";
import Notiflix from "notiflix";
import {useRouter} from 'next/router'
import TextEditor from '../../../../component/InputBox/ExcelBasicInputBox'
import {excelDownload} from '../../../../common/excelDownloadFunction'
import PaginationComponent from '../../../../component/Pagination/PaginationComponent'
import {NextPageContext} from 'next'
import ExcelDownloadModal from '../../../../component/Modal/ExcelDownloadMoadal'
import moment from 'moment'

interface IProps {
  children?: any
  page?: number
  keyword?: string
  option?: number
}

const title = '작업완료 리스트(작업자용)'
const optList = ['고객사명', '모델명','CODE','품명',]

const BasicContainer = ({page, keyword, option}: IProps) => {
  const router = useRouter()

  const [excelOpen, setExcelOpen] = useState<boolean>(false)

  const [top, setTop] = useState<number>(0)
  const [basicRow, setBasicRow] = useState<Array<any>>([])
  const [column, setColumn] = useState<Array<IExcelHeaderType>>(columnlist.workerRecordList)
  const [selectList, setSelectList] = useState<Set<number>>(new Set())
  const [optionList, setOptionList] = useState<string[]>(optList)
  const [optionIndex, setOptionIndex] = useState<number>(0)
  // const [keyword, setKeyword] = useState<string>('')
  const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
    page: page,
    total: 1
  })
  const [selectDate, setSelectDate] = useState<{from:string, to:string}>({
    from: moment().startOf('isoWeek').format('YYYY-MM-DD'),
    to: moment().endOf('isoWeek').format('YYYY-MM-DD')
  });

  useEffect(() => {
    if(keyword){
      SearchBasic(keyword, option, page)
    }else{
      LoadBasic(page).then(() => {})
    }
  }, [page, keyword, option, selectDate])

  const loadPoorQunatity = async (or_id: number) => {
    let res = await RequestMethod('get', `recordDefect`,{ path: { or_id } })

    if(res){
      return res.results.poor_quantities.map(v => {
        return {
          ord_id: v.ord_id,
          pdr_id: v.pdr.pdr_id,
          amount: v.amount
        }
      })
    }
    return
  }

  const loadPauseTimes = async (or_id: number) => {
    let res = await RequestMethod('get', `recordPause`,{ path: { or_id } })

    if(res){
      return res.results.paused_times.map(v => {
        return {
          ord_id: v.ord_id,
          ppr_id: v.ppr.ppr_id,
          start: v.start,
          end: v.end,
          amount: v.amount
        }
      })
    }
    return
  }

  const SaveBasic = async () => {

    const tmpRows = basicRow.map(async (row, i) => {
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

        return {
          ...row,
          ...selectData,
          customer_id: row.customer_idPK,
          cm_id: row.cm_idPK,
          ln_id: row.ln_idPK,
          mold_id: row.mold_idPK,
          process_id: row.process_idPK,
          machine_id: row.machine_idPK,
          good_quantity: Number(row.good_quantity),
          user_id: row.user_idPK,
          poor_quantities: row.poor_quantities ?? await loadPoorQunatity(row.or_id),
          paused_times: row.paused_times ?? await loadPauseTimes(row.or_id),
          paused_time: row.paused_timePK,
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
    })

    Promise.all(tmpRows).then(async (v) => {
      let res = await RequestMethod('post', `recordSave`,
        {
          records: v.filter((v)=>v)
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
    })
  }

  const DeleteBasic = async () => {
    const res = await RequestMethod('delete', `processDelete`,
      {
        processes: basicRow.map((row, i) => {
          if(selectList.has(row.id)){
            let pk = ""
            Object.keys(row).map((v:string) => {
              if(v.indexOf("_id") !== -1){
                pk = v
              }
            })

            return row[pk]
          }
        }).filter((v) => v)
      })

    if(res) {
      if(res.status === 200){
        if(keyword){
          router.push(`/mes/record/list?page=1&keyword=${keyword}&opt=${option}`)
        }else{
          router.push(`/mes/record/list?page=1`)
        }
      }
    }
  }

  const LoadBasic = async (page?: number) => {
    const res: any = await RequestMethod('get', `recordList`,{
      path: {
        page: (page || page !== 0) ? page : 1,
        renderItem: 18,
      },
      params: {
        from: selectDate.from,
        to: selectDate.to,
      }
    })

    if(res && res.status === 200){
      if(res.results.totalPages < page){
        LoadBasic(page - 1)
      }else{
        setPageInfo({
          ...pageInfo,
          page: res.results.page,
          total: res.results.totalPages
        })
        cleanUpData(res)
      }
    }
  }

  const SearchBasic = async (keyword: any, option: number, isPaging?: number) => {
    if(!isPaging){
      setOptionIndex(option)
    }

    const res = await RequestMethod('get', `recordSearch`,{
      path: {
        page: isPaging ?? 1,
        renderItem: 18,
      },
      params: {
        keyword: keyword ?? '',
        opt: option ?? 0,
        from: selectDate.from,
        to: selectDate.to
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

  const changeRow = (row: any) => {
    let tmpData = {}

    if(row.additional && row.additional.length) {
      row.additional.map(v => {
        tmpData = {
          ...tmpData,
          [v.key]: v.value
        }
      })
    }

    return {
      ...row,
      identification: row.osd?.identification,
      osd_id: row.osd?.osd_id,
      date: row.date,
      customer_id: row.product.raw_material.model.customer.name,
      customer_idPK: row.product.raw_material.model.customer.customer_id,
      cm_id: row.product.raw_material.model.model,
      cm_idPK: row.product.raw_material.model.cm_id,
      code: row.product.raw_material.code,
      name: row.product.raw_material.name,
      texture: row.product.raw_material.texture,
      product_id: row.product.product_id,
      seq: row.seq,
      process_id: row.process.name,
      process_idPK: row.process.process_id,
      mold_id: row.mold?.name,
      mold_idPK: row.mold?.mold_id,
      machine_id: row.machine?.name,
      machine_idPK: row.machine?.machine_id,
      goal: row.goal,
      ln_id: row.lot_number?.number,
      ln_idPK: row.lot_number?.ln_id,
      uph: Math.round(Number(row.uph) * 10) / 10,
      good_quantity: row.good_quantity,
      poor_quantity: row.poor_quantity,
      poor_count: row.confirm_quantity ?? 0,
      achievement: row.achievement_rate,
      user_id: row.worker.name,
      user_idPK: row.worker.user_id,
      worker: row.worker.name,
      ...tmpData
    }
  }

  const cleanUpData = (res: any) => {
    let tmpColumn = columnlist.recordList
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

    setColumn([...tmpColumn.map(v=> {
      return {
        ...v,
        name: v.moddable ? v.name+'(필수)' : v.name
      }
    }), ...additionalMenus])

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

      let tmpPauseTime = ''

      if(row.paused_time || row.paused_time === 0){
        let seconds = Number(row.paused_time)
        let hour = Math.floor(seconds/3600) < 10 ? '0'+ Math.floor(seconds/3600) :Math.floor(seconds/3600)
        let min = Math.floor((seconds%3600)/60) < 10 ? '0'+ Math.floor((seconds%3600)/60) : Math.floor((seconds%3600)/60)
        let sec = Math.floor(seconds%60) < 10 ? '0'+Math.floor(seconds%60) : Math.floor(seconds%60)

        tmpPauseTime = hour+":"+min+":"+sec
      }

      const random_id = Math.random()*1000

      return {
        ...realTableData,
        ...appendAdditional,
        paused_time: tmpPauseTime,
        paused_timePK: row.paused_time,
        id: `process_${random_id}`,
      }
    })

    setBasicRow([...tmpBasicRow])
  }

  const downloadExcel = () => {
    let tmpSelectList: boolean[] = []
    basicRow.map(row => {
      tmpSelectList.push(selectList.has(row.id))
    })
    excelDownload(column, basicRow, `process`, 'process', tmpSelectList)
  }

  const onClickHeaderButton = (index: number) => {
    switch(index){
      case 0:
        setExcelOpen(true)
        break;
      case 1:
        SaveBasic()
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
              router.push(`/mes/record/list?page=1&keyword=${keyword}&opt=${optionIndex}`)
            }else{
              router.push(`/mes/record/list?page=1&keyword=`)
            }
          }}
          searchOptionList={optionList}
          onChangeSearchOption={(option) => {
            setOptionIndex(option)
          }}
          optionIndex={optionIndex}
          isCalendar
          calendarType={'period'}
          selectDate={selectDate}
          //@ts-ignore
          setSelectDate={setSelectDate}
          title={title}
          buttons={['', '수정 하기']}
          buttonsOnclick={onClickHeaderButton}
        />
        <ExcelTable
          editable
          resizable
          pageInfo={pageInfo}
          headerList={[
            SelectColumn,
            ...column
          ]}
          top={top}
          setTop={setTop}
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
          loadEvent={LoadBasic}
          height={basicRow.length * 40 >= 40*18+56 ? 40*19 : basicRow.length * 40 + 56}
        />
        <PaginationComponent
          currentPage={pageInfo.page}
          totalPage={pageInfo.total}
          setPage={(page) => {
            if(keyword){
              router.push(`/mes/record/list?page=${page}&keyword=${keyword}&opt=${option}`)
            }else{
              router.push(`/mes/record/list?page=${page}`)
            }
          }}
        />
      </div>
      <ExcelDownloadModal
        isOpen={excelOpen}
        column={column}
        basicRow={basicRow}
        filename={`작업완료리스트`}
        sheetname={`작업완료리스트`}
        selectList={selectList}
        tab={'ROLE_PROD_06'}
        setIsOpen={setExcelOpen}
      />
    </div>
  );
}

export const getServerSideProps = (ctx: NextPageContext) => {
  return {
    props: {
      page: ctx.query.page,
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
