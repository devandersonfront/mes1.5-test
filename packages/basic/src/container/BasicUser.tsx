import React, {useEffect, useState} from 'react'
import {
    columnlist,
    excelDownload,
    ExcelDownloadModal,
    ExcelTable,
    Header as PageHeader,
    IExcelHeaderType,
    PaginationComponent,
    RequestMethod,
    TextEditor
} from 'shared'
// @ts-ignore
import {SelectColumn} from 'react-data-grid'
import Notiflix from "notiflix";
import {useRouter} from 'next/router'
import ExcelUploadModal from '../../../main/component/Modal/ExcelUploadModal'

export interface IProps {
  children?: any
  page?: number
  keyword?: string
  option?: number
}

const title = '유저 관리'
const optList = ['성명', '이메일', '직책명', '전화번호',]

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

    const searchAiID = (rowAdditional:any[], index:number) => {
      let result:number = undefined;
      rowAdditional.map((addi, i)=>{
        if(index === i){
          result = addi.ai_id;
        }
      })
      return result;
    }

    let res = await RequestMethod('post', `memberSave`,
      basicRow.map((row, i) => {
          if(selectList.has(row.id)){
            let additional:any[] = []
            column.map((v) => {
              if(v.type === 'additional'){
                additional.push(v)
              }
            })
            return {
              ...row,
              id: row.tmpId,
              authority: row.authorityPK,
              // user_id: row.tmpId,
              version: row.version ?? null,
              additional: [
              ...additional.map((v, index)=>{
                if(!row[v.colName]) return undefined;
                   return {
                    mi_id: v.id,
                    title: v.name,
                    value: row[v.colName] ?? "",
                    unit: v.unit,
                    ai_id: searchAiID(row.additional, index) ?? undefined,
                    version:row.additional[index]?.version ?? undefined
                  }
                }).filter((v) => v)
              ]
            }

          }
        }).filter((v) => v))
    //
    if(res){
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

  const DeleteBasic = async () => {
    const res = await RequestMethod('delete', `memberDelete`,
      basicRow.map((row, i) => {
        if(selectList.has(row.id)){
          let additional:any[] = []
          column.map((v) => {
            if(v.type === 'additional'){
              additional.push(v)
            }
          })
          let selectData: any = {}
          if(row.user_id){
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

        }
      }).filter((v) => v))

    if(res) {
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

  const LoadBasic = async (page?: number) => {
    const res = await RequestMethod('get', `memberList`,{
      path: {
        page: page ?? 1,
        renderItem: 18,
      }
    })

    if(res){
      if(res.totalPages < page){
        LoadBasic(page - 1)
      }else{
        setPageInfo({
          ...pageInfo,
          page: res.page,
          total: res.totalPages
        })
        cleanUpData(res)
      }
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
        opt: option ?? 0,
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
      res.menus && res.menus.map((menu: any) => {
        if(!menu.hide){
          if(menu.colName === column.key){
            menuData = {
              id: menu.mi_id,
              name: menu.title,
              width: menu.width,
              tab:menu.tab,
              unit:menu.unit,
              moddable: !menu.moddable,
              version: menu.version,
              sequence: menu.sequence,
              hide: menu.hide
            }
          } else if(menu.colName === 'id' && column.key === 'tmpId'){
            menuData = {
              id: menu.mi_id,
              name: menu.title,
              width: menu.width,
              tab:menu.tab,
              unit:menu.unit,
              moddable: !menu.moddable,
              version: menu.version,
              sequence: menu.sequence,
              hide: menu.hide
            }
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
      if(menu.colName === null && !menu.hide){
        return {
          id: menu.mi_id,
          name: menu.title,
          width: menu.width,
          // key: menu.title,
          key: menu.mi_id,
          editor: TextEditor,
          type: 'additional',
          unit: menu.unit,
          tab: menu.tab,
          version: menu.version,
          colName: menu.mi_id,
        }
      }
    }).filter((v: any) => v) : [];
    // let additionalData: any[] = []

    // additionalMenus.map((v: any) => {
    //   if(v.type === 'additional'){
    //     additionalData.push(v.key)
    //   }
    // })

    tmpRow = res.info_list
    loadAllSelectItems([...tmpColumn, ...additionalMenus])

    let tmpBasicRow = tmpRow.map((row: any, index: number) => {
      let realTableData: any = changeRow(row)
      let appendAdditional: any = {}

      row.additional && row.additional.map((v: any) => {
        appendAdditional = {
          ...appendAdditional,
          [v.mi_id]: v.value
        }
      })

      const random_id = Math.random()*1000
      return {
        ...row,
        ...realTableData,
        ...appendAdditional,
        authority: row.ca_id.name,
        authorityPK: row.ca_id.ca_id,
        id: `user_${random_id}`,
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
        buttons={
          ["",'', '항목관리', '행 추가', '저장하기', '삭제']
          // ["",'', '항목관리', '행 추가', '저장하기', '삭제']
        }
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

          e.map((v, i) => {
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
        tab={'ROLE_HR_02'}
        setIsOpen={setExcelDownOpen}
      />
      <ExcelUploadModal
        isOpen={excelUploadOpen}
        setIsOpen={setExcelUploadOpen}
        tab={'ROLE_HR_02'}
        cleanUpBasicData={cleanUpBasicData}
      />
    </div>
  );
}

export {BasicUser};
