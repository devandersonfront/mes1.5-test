import React, {useEffect, useState} from 'react'
import ExcelTable from '../../../../component/Excel/ExcelTable'
import MenuNavigation from '../../../../component/MenuNav/MenuNavigation'
import ProfileHeader from '../../../../component/Profile/ProfileHeader'
import PageHeader from '../../../../component/Header/Header'
// @ts-ignore
import {SelectColumn} from 'react-data-grid'
import {IExcelHeaderType, IItemMenuType} from '../../../../common/@types/type'
import {RequestMethod} from '../../../../common/RequestFunctions'
import {columnlist} from "../../../../common/columnInit";
import Notiflix from "notiflix";
import {useRouter} from 'next/router'
import {MAX_VALUE} from '../../../../common/configset'
import DropDownEditor from '../../../../component/Dropdown/ExcelBasicDropdown'
import TextEditor from '../../../../component/InputBox/ExcelBasicInputBox'
import {excelDownload} from '../../../../common/excelDownloadFunction'
import {loadAll} from 'react-cookies'
import { makeStyles, createStyles } from '@material-ui/core/styles';
import PaginationComponent from '../../../../component/Pagination/PaginationComponent'
import {NextPageContext} from 'next'
import ExcelDownloadModal from '../../../../component/Modal/ExcelDownloadMoadal'
import ExcelUploadModal from "../../../../component/Modal/ExcelUploadModal";
import {BasicProcess} from '../../../../../basic'

interface IProps {
  children?: any
  page?: number
  keyword?: string
  option?: number
}

const title = '공정 종류 관리'
const optList = ['공정명']

const BasicContainer = ({page, keyword, option}: IProps) => {
  const router = useRouter()

  const [excelOpen, setExcelOpen] = useState<boolean>(false)
  const [excelUploadOpen, setExcelUploadOpen] = useState<boolean>(false)

  const [top, setTop] = useState<number>(0)
  const [basicRow, setBasicRow] = useState<Array<any>>([])
  const [column, setColumn] = useState<Array<IExcelHeaderType>>(columnlist.process)
  const [selectList, setSelectList] = useState<Set<number>>(new Set())
  const [optionList, setOptionList] = useState<string[]>(optList)
  const [optionIndex, setOptionIndex] = useState<number>(0)
  // const [keyword, setKeyword] = useState<string>('')
  const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
    page: page,
    total: 1
  })

  useEffect(() => {
    if(keyword){
      SearchBasic(keyword, option, page).then(() => {
        Notiflix.Loading.remove()
      })
    }else{
      LoadBasic(page).then(() => {
        Notiflix.Loading.remove()
      })
    }
  }, [page, keyword, option])

  const SaveBasic = async () => {
    let res = await RequestMethod('post', `processSave`,
    {
      processes: basicRow.map((row, i) => {
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
        Notiflix.Report.success('삭제 성공!', '공정 데이터를 삭제하였습니다.', '확인', () => {
          if(Number(page) === 1){
            LoadBasic(1).then(() => {
              Notiflix.Loading.remove()
            })
          }else{
            if(keyword){
              router.push(`/mes/basic/process?page=1&keyword=${keyword}&opt=${option}`)
            }else{
              router.push(`/mes/basic/process?page=1`)
            }
          }
        })
      }
    }
  }

  const LoadBasic = async (page?: number) => {
    Notiflix.Loading.circle()
    const res = await RequestMethod('get', `processList`,{
      path: {
        page: (page || page !== 0) ? page : 1,
        renderItem: 18,
      }
    })

    if(res && res.status === 200){
      if(res.results.totalPages < page){
        LoadBasic(page - 1).then(() => {
          Notiflix.Loading.remove()
        })
      }else{
        setPageInfo({
          ...pageInfo,
          page: res.results.page,
          total: res.results.totalPages
        })
        cleanUpData(res)
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

    const res = await RequestMethod('get', `processSearch`,{
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
      process_id: row.process_id,
      name: row.name,
      ...tmpData
    }
  }
  const cleanUpBasicData = (res:any) => {
    let tmpRow = res.data.results.info_list;

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
        ...realTableData,
        ...appendAdditional,
        id: `process_${random_id}`,
      }
    })
    setBasicRow([...tmpBasicRow])
  }
  const cleanUpData = (res: any) => {
    let tmpColumn = columnlist.process
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

      const random_id = Math.random()*1000

      return {
        ...realTableData,
        ...appendAdditional,
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
        setExcelUploadOpen(true)
        break;
      case 1:
        setExcelOpen(true)
        break;
      case 2:
          router.push(`/mes/item/manage/process`)
        break;
      case 3:
        let items = {}

        column.map((value) => {
          if(value.selectList && value.selectList.length){
            items = {
              ...value.selectList[0],
              [value.key] : value.selectList[0].name,
              [value.key+'PK'] : value.selectList[0].pk,//여기 봐야됨!
              ...items,
            }
          }
        })

        const random_id = Math.random()*1000

        setBasicRow([
          {
            ...items,
            id: `process_${random_id}`,
            name: null,
            additional: [],
          },
          ...basicRow
        ])
        break;

      case 4:
        SaveBasic()

        break;
      case 5:
        Notiflix.Confirm.show("경고","삭제하시겠습니까?","확인","취소",
            ()=>{DeleteBasic()},
            ()=>{}
        )

        break;

    }
  }

  return (
    <div style={{display: 'flex', }}>
      <MenuNavigation pageType={'BASIC'} subType={2}/>
      <div style={{paddingBottom: 40}}>
        <ProfileHeader/>
        <BasicProcess keyword={keyword} page={page} option={option}/>
      </div>
    </div>
  );
}

export const getServerSideProps = (ctx: NextPageContext) => {
  return {
    props: {
      page: ctx.query.page,
      keyword: ctx.query.keyword ?? "",
      option: ctx.query.option ?? 0,
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
