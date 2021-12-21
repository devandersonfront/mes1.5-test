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
import TreeViewTable from '../../../main/component/TreeView/TreeView'
import {IMenu} from '../../../main/common/@types/type'
import {AUTHORITY_LIST} from '../../../main/common/configset'
import {AxiosResponse} from 'axios'
import styled from 'styled-components'

export interface IProps {
  children?: any
  page?: number
  keyword?: string
  option?: number
}

const title = '권한 관리'

const BasicModel = ({page, keyword, option}: IProps) => {
  const router = useRouter()

  const [excelOpen, setExcelOpen] = useState<boolean>(false)
  const [excelUploadOpen, setExcelUploadOpen] = useState<boolean>(false)

  const [basicRow, setBasicRow] = useState<Array<any>>([{
    name: "", id: ""
  }])
  const [column, setColumn] = useState<Array<IExcelHeaderType>>(columnlist["model"])
  const [selectList, setSelectList] = useState<Set<number>>(new Set())
  const [optionList, setOptionList] = useState<string[]>(['거래처명','사업자 번호', '모델명'])
  const [optionIndex, setOptionIndex] = useState<number>(0)

  const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
    page: 1,
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
              name: value.name,
              // name: tmpKey === 'model' ? value.model : value.name,
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
      setColumn([...res.map(v=> {
        return {
          ...v,
          name: v.moddable ? v.name+'(필수)' : v.name
        }
      })])
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
    res = await RequestMethod('post', `modelSave`,
      basicRow.map((row, i) => {
          if(selectList.has(row.id)){
            let additional:any[] = []
            column.map((v) => {
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
              customer: row.customerArray ?? row.customer,
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
    const res = await RequestMethod('delete', `modelDelete`,
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
            customer: row.customerArray,
            // customer_iu: row.customer_id,
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
        if(Number(page) === 1){
          LoadBasic(1).then(() => {
            Notiflix.Loading.remove()
          })
        }else{
          if(keyword){
            router.push(`/mes/basic/customer/model?page=1&keyword=${keyword}&opt=${option}`)
          }else{
            router.push(`/mes/basic/customer/model?page=1`)
          }
        }
      })
    }
  }

  const LoadBasic = async (page?: number) => {
    Notiflix.Loading.circle()
    const res = await RequestMethod('get', `modelList`,{
      path: {
        page: (page || page !== 0) ? page : 1,
        renderItem: 19,
      },
      params:{
        sorts:"created"
      }
    })

    if(res){
      if(res.totalPages < page){
        LoadBasic(page - 1).then(() => {
          Notiflix.Loading.remove()
        })
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

  const SearchBasic = async (keyword: any, option: number, isPaging?: string | string[] | number) => {
    Notiflix.Loading.circle()
    if(!isPaging){
      setOptionIndex(option)
    }

    const res = await RequestMethod('get', `modelSearch`,{
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
  const cleanUpBasicData = (res:any) => {
    let tmpRow = res.data.results.info_list;

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
        cm_id:row.cm_id,
        customer: row.customer.name,
        customer_id: row.customer.name,
        customer_idPK: row.customer.customer_id,
        customerPK: row.customer.customer_id,
        model:row.model,
        crn:row.customer.crn,
        ...appendAdditional,
        id: `model_${random_id}`,

      }
    })
    setBasicRow([...tmpBasicRow])
  }

  const cleanUpData = (res: any) => {
    let tmpColumn = columnlist["model"];
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
    }).filter((v: any) => v) : []


    tmpRow = res.info_list

    loadAllSelectItems( [
      ...tmpColumn,
      ...additionalMenus
    ] )


    // let selectKey = ""
    // let additionalData: any[] = []
    // tmpColumn.map((v: any) => {
    //   if(v.selectList){
    //     selectKey = v.key
    //   }
    // })

    // additionalMenus.map((v: any) => {
    //   if(v.type === 'additional'){
    //     additionalData.push(v.key)
    //   }
    // })

    // let pk = "";
    // Object.keys(tmpRow).map((v) => {
    //   if(v.indexOf('_id') !== -1){
    //     pk = v
    //   }
    // })


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
        cm_id:row.cm_id,
        customerArray: row.customer,
        customer_id: row.customer.name,
        customer_idPK: row.customer.customer_id,
        customerPK: row.customer.customer_id,
        model:row.model,
        crn:row.customer.crn,
        ...appendAdditional,
        id: `model_${random_id}`,

      }
    })

    setBasicRow([...tmpBasicRow])
  }

  const downloadExcel = () => {
    let tmpSelectList: boolean[] = []
    basicRow.map(row => {
      tmpSelectList.push(selectList.has(row.id))
    })
    excelDownload(column, basicRow, `model`, "model", tmpSelectList)
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
        router.push(`/mes/item/manage/model`)
        break;
      case 3:
        let items = {}

        column.map((value) => {
          if(value.selectList && value.selectList.length){
            if(value.key === 'customer') {
              items = {
                ...value.selectList[0],
                [value.key] : value.selectList[0].name,
                [value.key+'PK'] : value.selectList[0].customer_id,//여기 봐야됨!
                ...items,
              }
            }

          }

          if(value.key === 'seq') {
            items = {
              [value.key]: basicRow.length+1
            }
          }

          if(value.key === 'id') {
            items = {
              tmpId: "",
            }
          }

        })
        let random_id = Math.random()*1000;
        setBasicRow([
          {
            ...items,
            id: `model_${random_id}`,
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
          } ,
          ()=>{},
        )
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
            router.push(`/mes/basic/customer/model?page=1&keyword=${keyword}&opt=${optionIndex}`)
          }else{
            router.push(`/mes/basic/customer/model?page=1&keyword=`)
          }
        }}
        searchOptionList={optionList}
        onChangeSearchOption={(option) => {
          setOptionIndex(option)
        }}
        optionIndex={optionIndex}
        title={"모델 관리"}
        buttons={
          ['','', '항목관리', '행 추가', '저장하기', '삭제']
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
            router.push(`/mes/basic/customer/model?page=${page}&keyword=${keyword}&opt=${option}`)
          }else{
            router.push(`/mes/basic/customer/model?page=${page}`)
          }
        }}
      />
    </div>
  );
}

const HeaderButton = styled.button`
    height:32px;
    color:white;
    border-radius:6px;
    font-size:15px;
    font-weight:bold;
    background:#717C90;
    padding: 0 20px;
    cursor: pointer;
    display:flex;
    margin-left: 16px;
    justify-content:center;
    align-items:center;
`;

export {BasicModel};
