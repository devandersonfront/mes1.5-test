import React, {useEffect, useState} from 'react'
import ExcelTable from '../../../component/Excel/ExcelTable'
import MenuNavigation from '../../../component/MenuNav/MenuNavigation'
import ProfileHeader from '../../../component/Profile/ProfileHeader'
import PageHeader from '../../../component/Header/Header'
// @ts-ignore
import {SelectColumn} from 'react-data-grid'
import {IExcelHeaderType, IItemMenuType} from '../../../common/@types/type'
import {RequestMethod} from '../../../common/RequestFunctions'
import {columnlist} from "../../../common/columnInit";
import Notiflix from "notiflix";
import {useRouter} from 'next/router'
import {MAX_VALUE} from '../../../common/configset'
import DropDownEditor from '../../../component/Dropdown/ExcelBasicDropdown'
import TextEditor from '../../../component/InputBox/ExcelBasicInputBox'
import {excelDownload} from '../../../common/excelDownloadFunction'
import {loadAll} from 'react-cookies'
import PaginationComponent from '../../../component/Pagination/PaginationComponent'
import {NextPageContext} from 'next'
import ExcelDownloadModal from '../../../component/Modal/ExcelDownloadMoadal'
import moment from 'moment'

interface IProps {
  children?: any
  page?: number
  keyword?: string
  option?: number
}

const title = '원자재 재고 관리'
const optList = ['고객사명', '모델명', 'CODE', '품명', 'Lot번호']

const BasicContainer = ({page, keyword, option}: IProps) => {
  const router = useRouter()

  const [excelOpen, setExcelOpen] = useState<boolean>(false)

  const [basicRow, setBasicRow] = useState<Array<any>>([{
    name: "", id: ""
  }])

  const [nzState, setNzState] = useState<boolean>(false);

  const changeNzState = (value:boolean) => {
    setNzState(value);
  }

  const [column, setColumn] = useState<Array<IExcelHeaderType>>(columnlist.rawstock)
  const [selectList, setSelectList] = useState<Set<number>>(new Set())
  const [optionList, setOptionList] = useState<string[]>(optList)
  const [optionIndex, setOptionIndex] = useState<number>(0)

  const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
    page: 1,
    total: 1
  })

  const [selectDate, setSelectDate] = useState<{from:string, to:string}>({
    from: moment().subtract(5,"month").startOf("month").format("YYYY-MM-DD"),
    to: moment().endOf('month').format('YYYY-MM-DD')
  });

  useEffect(() => {
    setOptionIndex(option)
    if(keyword){
      SearchBasic(keyword, option, page)
    }else{
      LoadBasic(page).then(() => {})
    }
  }, [page, keyword, option, selectDate, nzState])

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
            pk: v.unit_id,
            result: changeNzState
          }
        }else{
          return v
        }
      }
    })

    Promise.all(tmpColumn).then(res => {
      setColumn([...res])
    })
  }

  const SaveBasic = async () => {
    let res = await RequestMethod('post', `rawinSave`,
      {
        warehousing: basicRow.map((row, i) => {
          if(selectList.has(row.id)){
            let additional:any[] = []
            column.map((v) => {
              if(v.type === 'additional'){
                additional.push(v)
              }
            })

            let selectData: any = {}

            return {
              ...row,
              ...selectData,
              current: row.exhaustionPK ? 0 : row.current,
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
        LoadBasic(pageInfo.page)
      }
    }
  }

  const LoadBasic = async (page?: number) => {
    const res = await RequestMethod('get', `rawinList`,{
      path: {
        page: (page || page !== 0) ? page : 1,
        renderItem: 18,
      },
      params: {
        tab: 'ROLE_RMAT_02',
        nz:nzState,
        from: selectDate.from,
        to: selectDate.to,
      }
    })

    if(res && res.status === 200){
      if(res.results.totalPages < page){
        LoadBasic(page - 1)
      }else{
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
    }else if (res.state === 401) {
      Notiflix.Report.failure('불러올 수 없습니다.', '권한이 없습니다.', '확인', () => {
        router.back()
      })
    }
  }

  const SearchBasic = async (keyword: any, option: number, isPaging?: number) => {
    if(!isPaging){
      setOptionIndex(option)
    }

    const res = await RequestMethod('get', `rawinSearch`,{
      path: {
        page: isPaging ?? 1,
        renderItem: 18,
      },
      params: {
        keyword: keyword ?? '',
        opt: option ?? 0,
        nz:nzState,
        tab: 'ROLE_RMAT_02',
        from: selectDate.from,
        to: selectDate.to,
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
    let tmpColumn = columnlist.rawstock
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
      let appendAdditional: any = {}

      row.additional && row.additional.map((v: any) => {
        appendAdditional = {
          ...appendAdditional,
          [v.title]: v.value
        }
      })

      const random_id = Math.random()*1000

      return {
        exhaustion: row.current === 0 ? '사용완료' : '-',
        exhaustionPK: row.current === 0,
        ln_id: row.ln_id,
        rm_id: row.raw_material.rm_id,
        customer_id: row.raw_material.model.customer.name,
        cm_id: row.raw_material.model.model,
        code: row.raw_material.code,
        name: row.raw_material.name,
        texture: row.raw_material.texture,
        depth: row.raw_material.depth,
        width: row.raw_material.width,
        height: row.raw_material.height,
        type: row.raw_material.type,
        amount: row.amount,
        date: row.date,
        number: row.number,
        blanking: row.blanking,
        current: row.current,
        ...appendAdditional,
        id: `rowstack_${random_id}`,
      }
    })

    setBasicRow([...tmpBasicRow])
  }

  const downloadExcel = () => {
    let tmpSelectList: boolean[] = []
    basicRow.map(row => {
      tmpSelectList.push(selectList.has(row.id))
    })
    excelDownload(column, basicRow, `원자재 재고 관리`, 'rawmaterial_input', tmpSelectList)
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
      <MenuNavigation pageType={'MES'} subType={1}/>
      <div style={{paddingBottom: 40}}>
        <ProfileHeader/>
        <PageHeader
          isSearch
          searchKeyword={keyword}
          onChangeSearchKeyword={(keyword) => {
            if(keyword){
              router.push(`/mes/rawmaterial/stock?page=1&keyword=${keyword}&opt=${optionIndex ?? 0}`)
            }else{
              router.push(`/mes/rawmaterial/stock?page=1&keyword=`)
            }
          }}
          searchOptionList={optionList}
          onChangeSearchOption={(option) => {
            setOptionIndex(option)
          }}
          isCalendar
          calendarType={'period'}
          selectDate={selectDate}
          optionIndex={optionIndex}
          //@ts-ignore
          setSelectDate={setSelectDate}
          title={title}
          buttons={['','저장하기']}
          buttonsOnclick={onClickHeaderButton}
          dataLimit={true}

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
          disableVirtualization={true}
          height={basicRow.length * 40 >= 40*18+56 ? 40*19 : basicRow.length * 40 + 56}
        />
        <PaginationComponent
          currentPage={pageInfo.page}
          totalPage={pageInfo.total}
          setPage={(page) => {
            if(keyword){
              router.push(`/mes/rawmaterial/stock?page=${page}&keyword=${keyword}&opt=${option}`)
            }else{
              router.push(`/mes/rawmaterial/stock?page=${page}`)
            }
          }}
        />
      </div>
      <ExcelDownloadModal
        isOpen={excelOpen}
        column={column}
        basicRow={basicRow}
        filename={`원자재재고관리`}
        sheetname={`원자재재고관리`}
        selectList={selectList}
        tab={'ROLE_RMAT_02'}
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
