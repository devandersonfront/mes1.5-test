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

export interface IProps {
  children?: any
  page?: number
  keyword?: string
  option?: number
}

const BasicFactory = ({page, keyword, option}: IProps) => {
  const router = useRouter()

  const [excelOpen, setExcelOpen] = useState<boolean>(false)

  const [basicRow, setBasicRow] = useState<Array<any>>([
    {name: "", id: ""},
    // {name: "드랑금속", id: "", address: '인천시 연수구 송도미래로125 송도타워 123동 11-10호', manager: '차지훈', appointment: '실장', cellphone: '02)777-1235',},
  ])
  const [column, setColumn] = useState<Array<IExcelHeaderType>>( columnlist["factory"])
  const [selectList, setSelectList] = useState<Set<number>>(new Set())
  const [optionList, setOptionList] = useState<string[]>(['공장명','주소', '담당자명', '담당자 직책', '담당자 휴대폰 번호'])
  const [optionIndex, setOptionIndex] = useState<number>(0)

  const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
    page: 1,
    total: 1
  })
  console.log("basicRow : ", basicRow)
  useEffect(() => {
    // setOptionIndex(option)
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
    const searchAiID = (rowAdditional:any[], index:number) => {
      let result:number = undefined;
      rowAdditional.map((addi, i)=>{
        if(index === i){
          result = addi.ai_id;
        }
      })

      return result;
    }

    let res: any
    res = await RequestMethod('post', `factorySave`,
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
            manager: row.user,
            version: row.version ?? null,
            additional: [
              ...additional.map((v, index)=>{
                if(!row[v.colName]) return undefined;
                // result.push(
                return {
                  mi_id: v.id,
                  title: v.name,
                  value: row[v.colName] ?? "",
                  unit: v.unit,
                  ai_id: searchAiID(row.additional, index) ?? undefined,
                  version:row.additional[index]?.version ?? undefined
                }
                // )
              }).filter((v) => v)
            ]
          }

          }
        }).filter((v) => v))


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

    const res = await RequestMethod('delete', `factoryDelete`,
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
          if(row.factory_id){
            return {
              ...row,
              manager: row.user,
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
    Notiflix.Loading.circle()
    const res = await RequestMethod('get', `factoryList`,{
      path: {
        page: (page || page !== 0) ? page : 1,
        renderItem: 18,
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
    const res = await RequestMethod('get', `factorySearch`,{
      path: {
        page: isPaging ?? 1,
        renderItem: 18,
      },
      params: {
        sorts:"created",
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
    }
  }

  const cleanUpData = (res: any) => {
    let tmpColumn = columnlist["factory"];
    let tmpRow = []
    tmpColumn = tmpColumn.map((column: any) => {
      let menuData: object | undefined;
      res.menus && res.menus.map((menu: any) => {
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
    }).filter((v: any) => v) : []


    tmpRow = res.info_list


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
          [v.mi_id]: v.value
        }
      })

      let random_id = Math.random()*1000;
      return {
        ...row,
        ...appendAdditional,
        user: row.manager ?? undefined,
        managerPk: row.manager ? row.manager.user_id : '',
        manager: row.manager ? row.manager.name : '',
        appointment: row.manager ? row.manager.appointment : '',
        telephone: row.manager ? row.manager.telephone : '',
        id: `factory_${random_id}`,
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

        router.push(`/mes/item/manage/factory`)

        break;
      case 2:
        // SaveBasic()
        router.push(`/mes/item/manage/factory`)
        break;
      case 3:
        const random_id = Math.random()*1000

        setBasicRow([
          {
            id: `factory_${random_id}`,
            additional: [],
          },
          ...basicRow
        ])
        break;
      case 4:
        SaveBasic();
        break;
      case 5:
        DeleteBasic();
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
              router.push(`/mes/basic/factory?page=1&keyword=${keyword}&opt=${optionIndex}`)
            }else{
              router.push(`/mes/basic/factory?page=1&keyword=`)
            }
          }}
          searchOptionList={optionList}
          onChangeSearchOption={(option) => {
            setOptionIndex(option)
          }}
          optionIndex={optionIndex}
          title={"공장 기준정보"}
          buttons={
            ['', '', '항목관리', '행추가', '저장하기', '삭제']
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
            e.map(v => {
              if(v.isChange) tmp.add(v.id)
            })
            setSelectList(tmp)
            setBasicRow([...e])
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
              router.push(`/mes/basic/factory?page=${page}&keyword=${keyword}&opt=${option}`)
            }else{
              router.push(`/mes/basic/factory?page=${page}`)
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

// BasicContainer.getInitialProps = async ({ query }) => {
//     let { page, keyword, opt } = query
//     if (typeof page === 'string')
//         page = parseInt(page);
//     if (typeof opt === 'string')
//         opt = parseInt(opt);
//     return { page, keyword, option: opt };
// }

export {BasicFactory};
