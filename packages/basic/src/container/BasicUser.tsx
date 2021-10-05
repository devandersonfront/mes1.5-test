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
import ExcelUploadModal from '../../../main/component/Modal/ExcelUploadModal'

export interface IProps {
  children?: any
  page?: number
  keyword?: string
  option?: number
}

const title = '유저 관리'
const optList = ['사용자명', '이메일', '직책명', '전화번호', '권한명']

const BasicUser = ({page, keyword, option}: IProps) => {
  const router = useRouter()

  const [excelDownOpen, setExcelDownOpen] = useState<boolean>(false)
  const [excelUploadOpen, setExcelUploadOpen] = useState<boolean>(false);

  const [basicRow, setBasicRow] = useState<Array<any>>([{
    name: "", id: ""
  }])
  const [column, setColumn] = useState<Array<IExcelHeaderType>>(columnlist.member)
  const [selectList, setSelectList] = useState<Set<any>>(new Set())
  const [optionList, setOptionList] = useState<string[]>(optList)
  const [optionIndex, setOptionIndex] = useState<number>(0)

  const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
    page: 1,
    total: 1
  })

  useEffect(() => {
    if(keyword){
      SearchBasic(keyword, option, page)
    }else{
      LoadBasic(page).then(() => {})
    }
  }, [page, keyword, option])

  const loadAllSelectItems = async (column: IExcelHeaderType[]) => {
    let tmpColumn = column.map(async (v: any) => {
      if(v.selectList && v.selectList.length === 0){
        const res = await RequestMethod('get', `${v.key}All`, )

        return {
          ...v,
          selectList: [...res.results.map((value: any) => {
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
        }else{
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
    let res = await RequestMethod('post', `memberSave`,
      {
        members: basicRow.map((row, i) => {
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
              id: row.tmpId,
              authority: row.authorityPK,
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

    const res = await RequestMethod('delete', `memberDelete`,
      {
        members: basicRow.map((row, i) => {
          if(selectList.has(row.id)){

            return row.tmpId
          }
        }).filter((v) => v)
      })

    if(res) {
      if(res.status === 200){
        Notiflix.Report.success('삭제되었습니다.','','확인');
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
    const res = await RequestMethod('get', `memberList`,{
      path: {
        page: (page || page !== 0) ? page : 1,
        renderItem: 18,
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
    const res = await RequestMethod('get', `memberSearch`,{
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
      user_id: row.user_id,
      name: row.name,
      appointment: row.appointment,
      telephone: row.telephone,
      email: row.email,
      authority: row.authority.name,
      authorityPK: row.authority.ca_id,
      tmpId: row.id,
      password: null,
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
        ...row,
        ...realTableData,
        ...appendAdditional,
        id: `process_${random_id}`,
      }
    })
    setBasicRow([...tmpBasicRow])
  }

  const cleanUpData = (res: any) => {
    let tmpColumn = columnlist.member
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
    tmpRow = res.results.info_list

    loadAllSelectItems([...tmpColumn, ...additionalMenus])

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
        ...row,
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
      case 0 :
        setExcelUploadOpen(true)
        break;
      case 1:
        setExcelDownOpen(true)
        break;
      case 2:
        router.push(`/mes/item/manage/member`)
        break;
      case 3:
        let items = {}

        column.map((value) => {
          if(value.selectList && value.selectList.length){
            items = {
              ...value.selectList[0],
              [value.key] : value.selectList[0].name,
              [value.key+'PK'] : value.selectList[0].ca_id,//여기 봐야됨!
              ...items,
            }
          }
        })

        const random_id = Math.random()*1000

        setBasicRow([
          {
            ...items,
            id: `member_${random_id}`,
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
          ()=>{
            DeleteBasic()
          }
          ,
          ()=>{});
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
            router.push(`/mes/basic/user?page=1&keyword=${keyword}&opt=${optionIndex}`)
          }else{
            router.push(`/mes/basic/user?page=1&keyword=`)
          }
        }}
        searchOptionList={optionList}
        onChangeSearchOption={(option) => {
          setOptionIndex(option)
        }}
        optionIndex={optionIndex}
        title={title}
        buttons={["엑셀로 등록",'엑셀로 받기', '항목관리', '행 추가', '저장하기', '삭제']}
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
        height={basicRow.length * 40 >= 40*18+40 ? 40*19+16 : basicRow.length * 40 + 56}
      />
      <PaginationComponent
        currentPage={pageInfo.page}
        totalPage={pageInfo.total}
        setPage={(page) => {
          if(keyword){
            router.push(`/mes/basic/user?page=${page}&keyword=${keyword}&opt=${option}`)
          }else{
            router.push(`/mes/basic/user?page=${page}`)
          }
        }}
      />
      <ExcelDownloadModal
        isOpen={excelDownOpen}
        column={column}
        basicRow={basicRow}
        filename={`유저관리`}
        sheetname={`유저관리`}
        selectList={selectList}
        tab={'ROLE_HR_01'}
        setIsOpen={setExcelDownOpen}
      />
      <ExcelUploadModal
        isOpen={excelUploadOpen}
        setIsOpen={setExcelUploadOpen}
        tab={'ROLE_HR_01'}
        cleanUpBasicData={cleanUpBasicData}
      />
    </div>
  );
}

export {BasicUser};
