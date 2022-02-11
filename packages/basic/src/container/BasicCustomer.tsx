import React, {useEffect, useState} from 'react'
import {
    columnlist,
    excelDownload,
    ExcelTable,
    Header as PageHeader,
    IExcelHeaderType,
    PaginationComponent,
    RequestMethod,
    TextEditor,
} from 'shared'
// @ts-ignore
import {SelectColumn} from 'react-data-grid'
import Notiflix from "notiflix";
import {useRouter} from 'next/router'
import styled from 'styled-components'

export interface IProps {
  children?: any
  page?: number
  keyword?: string
  option?: number
}

const BasicCustomer = ({page, keyword, option}: IProps) => {
  const router = useRouter()

  const [excelOpen, setExcelOpen] = useState<boolean>(false)
  const [excelUploadOpen, setExcelUploadOpen] = useState<boolean>(false);
  const [basicRow, setBasicRow] = useState<Array<any>>([{
    name: "", id: ""
  }])
  const [column, setColumn] = useState<Array<IExcelHeaderType>>(columnlist["customer"]);
  const [selectList, setSelectList] = useState<Set<number>>(new Set())
  const [optionList, setOptionList] = useState<string[]>(['거래처명', '대표자명', '담당자명', '전화 번호','휴대폰 번호', '팩스 번호', '주소', '사업자 번호'])
  const [optionIndex, setOptionIndex] = useState<number>(option)

  const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
    page: 1,
    total: 1
  })
  const [selectRow , setSelectRow] = useState<number>(0);

  useEffect(() => {
    if(keyword){
      SearchBasic(keyword, option, page).then(() => {
        Notiflix.Loading.remove()
      })
    }else{
      LoadBasic(page).then(() => {
        Notiflix.Loading.remove()
      }).then(() => {
        Notiflix.Loading.remove()
      })
    }
  }, [page, keyword, option])

  const SaveBasic = async () => {

    if(selectList.size === 0){
      return Notiflix.Notify.warning('선택된 정보가 없습니다.')
    }

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
    res = await RequestMethod('post', `customerSave`,
      basicRow.map((row, i) => {
          if(selectList.has(row.id)){
            let selectKey: string[] = []
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
    
    const res = await RequestMethod('delete', `customerDelete`,
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
          if(row.customer_id){
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

        }
      }).filter((v) => v))

    if(res) {
      Notiflix.Report.success('삭제 성공!', '', '확인', () => {
        if(Number(page) === 1){
          LoadBasic(1).then(() => {
            Notiflix.Loading.remove()
          })
        }
      })
    }
  }

  const LoadBasic = async (page?: number) => {
    Notiflix.Loading.circle()
    const res = await RequestMethod('get', `customerList`, {
      path: {
        page: (page || page !== 0) ? page : 1,
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

    setSelectList(new Set())
  }


  const SearchBasic = async (keyword: any, option: number, isPaging?: number) => {
    Notiflix.Loading.circle()
    if(!isPaging){
      setOptionIndex(option)
    }

    const res = await RequestMethod('get', `customerSearch`,{
      path: {
        page: isPaging ?? 1,
        renderItem: 18,
      },
      params: {
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

    setSelectList(new Set())
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
        ...row,
        customer_id: row.customer_id,
        name: row.name,
        rep: row.rep,
        telephone: row.telephone,
        manager: row.manager,
        cellphone: row.cellphone,
        fax: row.fax,
        photo: row.photo,
        crn: row.crn,
        address: row.address,
        password: '-',
        ...appendAdditional,
        id: `customer_${random_id}`,
      }
    })
    setBasicRow([...tmpBasicRow])
  }
  const cleanUpData = async(res: any) => {
    let tmpColumn = columnlist["customer"]
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

    setColumn([...tmpColumn.map(v=> {
      return {
        ...v,
        name: v.moddable ? v.name+'(필수)' : v.name
      }
    }), ...additionalMenus])

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
        customer_id: row.customer_id,
        name: row.name,
        rep: row.rep,
        telephone: row.telephone,
        manager: row.manager,
        cellphone: row.cellphone,
        fax: row.fax,
        photo: row.photo,
        crn: row.crn,
        address: row.address,
        password: '-',
        ...appendAdditional,
        id: `customer_${random_id}`,
      }
    })


    setBasicRow([...tmpBasicRow])
  }

  const downloadExcel = () => {
    let tmpSelectList: boolean[] = []
    basicRow.map(row => {
      tmpSelectList.push(selectList.has(row.id))
    })
    excelDownload(column, basicRow, `${"customer"}`, "customer", tmpSelectList)
  }

  const onClickHeaderButton = (index: number) => {
    switch (index) {
      case 0:
        setExcelUploadOpen(true)
        break;
      case 1:
        setExcelOpen(true)
        break;
      case 2:

        router.push(`/mes/item/manage/customer`)

        break;
      case 3:
        let items = {}
        let random_id = Math.random()*1000;
        column.map((value) => {
          if (value.selectList && value.selectList.length) {
            items = {
              ...value.selectList[0],
              [value.key]: value.selectList[0].name,
              [value.key + 'PK']: value.selectList[0].pk,//여기 봐야됨!
              ...items,
            }
          }
        })

        setBasicRow([
          {
            ...items,
            id: `customer_${random_id}`,
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
        
        if(selectList.size === 0){
          return Notiflix.Notify.warning('선택된 정보가 없습니다.')
        }

        Notiflix.Confirm.show("경고","삭제하시겠습니까?","확인","취소",
          ()=>{DeleteBasic()}
          ,()=>{}
        )
        break;

    }
  }

  const competeCustom = (rows) => {

    const tempRow = [...rows]
    const spliceRow = [...rows]
    spliceRow.splice(selectRow, 1)

    if(spliceRow){
      if(spliceRow.some((row)=> row.name === tempRow[selectRow].name)){
        return Notiflix.Report.warning(
          '거래처명 경고',
          `중복된 거래처명을 입력할 수 없습니다`,
          'Okay'
        );
      }
    }

    setBasicRow(rows)
    
  }

  return (
    <div>
      <PageHeader
        isSearch
        searchKeyword={keyword}
        onChangeSearchKeyword={(keyword) => {
          if(keyword){
            router.push(`/mes/basic/customer?page=1&keyword=${keyword}&opt=${optionIndex}`)
          }else{
            router.push(`/mes/basic/customer?page=1&keyword=`)
          }
        }}
        searchOptionList={optionList}
        onChangeSearchOption={(option) => {
          setOptionIndex(option)
        }}
        optionIndex={optionIndex}
        title={"거래처 정보 관리"}
        buttons={
          ["",'', '항목관리', '행 추가', '저장하기', '삭제']
          // ["",'엑셀로 받기', '항목관리', '행 추가', '저장하기', '삭제']
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
          competeCustom(e)
        }}
        selectList={selectList}
        //@ts-ignore
        setSelectList={setSelectList}
        setSelectRow={setSelectRow}
        height={basicRow.length * 40 >= 40*18+56 ? 40*19 : basicRow.length * 40 + 56}
      />
      <PaginationComponent
        currentPage={pageInfo.page}
        totalPage={pageInfo.total}
        setPage={(page) => {
          if(keyword){
            router.push(`/mes/basic/customer?page=${page}&keyword=${keyword}&opt=${option}`)
          }else{
            router.push(`/mes/basic/customer?page=${page}`)
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

export {BasicCustomer};
