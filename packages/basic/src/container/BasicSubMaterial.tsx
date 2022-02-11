import React, {useEffect, useState} from 'react'
import {
    columnlist,
    excelDownload,
    ExcelDownloadModal,
    ExcelTable,
    Header as PageHeader,
    IExcelHeaderType,
    MAX_VALUE,
    PaginationComponent,
    RequestMethod,
    TextEditor
} from 'shared'
// @ts-ignore
import {SelectColumn} from 'react-data-grid'
import Notiflix from "notiflix";
import {useRouter} from 'next/router'
import {NextPageContext} from 'next'

export interface IProps {
  children?: any
  page?: number
  search?: string
  option?: number
}

const BasicSubMaterial = ({page, search, option}: IProps) => {
  const router = useRouter()

  const [excelOpen, setExcelOpen] = useState<boolean>(false)

  const [basicRow, setBasicRow] = useState<Array<any>>([{
    name: "", id: "", unit: 'EA'
  }])
  const [column, setColumn] = useState<Array<IExcelHeaderType>>( columnlist["submaterial"])
  const [selectList, setSelectList] = useState<Set<number>>(new Set())
  const [optionList, setOptionList] = useState<string[]>(['부자재 CODE', '부자재 품명', '거래처'])
  const [optionIndex, setOptionIndex] = useState<number>(0)
  const [keyword, setKeyword] = useState<string>();

  const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
    page: 1,
    total: 1
  })

  useEffect(() => {
    if(keyword){
      SearchBasic(keyword, optionIndex, pageInfo.page).then(() => {
        Notiflix.Loading.remove()
      })
    }else{
      LoadBasic(pageInfo.page).then(() => {
        Notiflix.Loading.remove()
      })
    }
  }, [pageInfo.page, keyword])


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
    let selectCheck = false
    let codeCheck = true
    const searchAiID = (rowAdditional:any[], index:number) => {
      let result:number = undefined;
      rowAdditional.map((addi, i)=>{
        if(index === i){
          result = addi.ai_id;
        }
      })
      return result;
    }
    let result = basicRow.map((row, i) => {
      if(selectList.has(row.id)){
        selectCheck = true
        if(!row.code) codeCheck = false
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
          // customer: row.customerArray,
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
    }).filter((v) => v)

    if(selectCheck && codeCheck){
      let res = await RequestMethod('post', `subMaterialSave`, result)

      if(res){
        Notiflix.Report.success('저장되었습니다.','','확인');
        if(keyword){
          SearchBasic(keyword, optionIndex, pageInfo.page).then(() => {
            Notiflix.Loading.remove()
          })
        }else{
          LoadBasic(pageInfo.page).then(() => {
            Notiflix.Loading.remove()
          })
        }
      }
    }else if(!selectCheck){
      Notiflix.Report.warning("경고","데이터를 선택해주세요.","확인")
    }else if(!codeCheck){
      Notiflix.Report.warning("경고","CODE를 입력해주세요.","확인")
    }
  }

  const DeleteBasic = async () => {
    let selectCheck = false
    const result =  basicRow.map((row, i) => {
      if(selectList.has(row.id)){
        selectCheck = true
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
        if(row.sm_id){
          return {
            ...row,
            ...selectData,
            // customer: row.customerArray,
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
    }).filter((v) => v)

    if(selectCheck){
      Notiflix.Confirm.show("경고","삭제하시겠습니까?","확인","취소",
          async()=>{
            const res = await RequestMethod('delete', `subMaterialDelete`, result)

            if(res) {
              Notiflix.Report.success('삭제되었습니다.','','확인', () =>{
                if(keyword){
                  SearchBasic(keyword, optionIndex, pageInfo.page).then(() => {
                    Notiflix.Loading.remove()
                  })
                }else{
                  LoadBasic(pageInfo.page).then(() => {
                    Notiflix.Loading.remove()
                  })
                }
              });
            }

          },
          ()=>{}
      )
    }else{
      Notiflix.Report.warning("경고","데이터를 선택해주세요.","확인");
    }


  }


  const LoadBasic = async (page?: number) => {
    Notiflix.Loading.circle()
    const res = await RequestMethod('get', `subMaterialList`,{
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
    const res = await RequestMethod('get', `submaterialSearch`,{
      path: {
        page: isPaging ?? 1,
        renderItem: 18,
      },
      params: {
        keyword: keyword ?? '',
        opt: option ?? 0
      }
    })

    if(res ){
      setPageInfo({
        ...pageInfo,
        page: res.page,
        total: res.totalPages
      })
      cleanUpData(res)
    }
  }

  const cleanUpData = (res: any) => {
    let tmpColumn = columnlist["submaterial"];
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
        // customer_id: row.customer?.name ?? "",
        customer_id: row.customer && row.customer.name,
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
        // setExcelUploadOpen(true)
        break;
      case 1:
        setExcelOpen(true)
        break;
      case 2:
        router.push(`/mes/item/manage/submaterial`)
        break;
      case 3:
        let items = {}

        column.map((value) => {
          if(value.selectList && value.selectList.length){
            items = {
              ...value.selectList[0],
              [value.key] : value.selectList[0].name,
              [value.key+'PK'] : value.selectList[0].pk, //여기 봐야됨!
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
        DeleteBasic()
        break;

    }
  }
  return (
    <div>
        <PageHeader
          isSearch
          searchKeyword={keyword}
          onChangeSearchKeyword={(keyword) => {
            setKeyword(keyword);
          }}
          searchOptionList={optionList}
          onChangeSearchOption={(option) => {
            setOptionIndex(option)
          }}
          optionIndex={optionIndex}
          title={"부자재 기준정보"}
          buttons={
            ['', '', '항목관리', '행추가', '저장하기', '삭제']
          }
          buttonsOnclick={
            // () => {}
            onClickHeaderButton
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
            e.map((value, index)=>{
              if(value.customerArray){
                basicRow[index].customer = value;
              }
            })

            // setBasicRow([...basicRow])
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
            setPageInfo({...pageInfo, page:page})
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

export {BasicSubMaterial};
