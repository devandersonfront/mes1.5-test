import React, {useEffect, useState} from 'react'
import {
  ExcelTable,
  Header as PageHeader,
  RequestMethod,
  V_columnlist,
  MAX_VALUE,
  DropDownEditor,
  TextEditor,
  excelDownload,
  PaginationComponent,
  ExcelDownloadModal,
  IExcelHeaderType, IItemMenuType, BarcodeModal
} from 'shared'
// @ts-ignore
import {SelectColumn} from 'react-data-grid'
import Notiflix from "notiflix";
import {useRouter} from 'next/router'
import {loadAll} from 'react-cookies'
import {NextPageContext} from 'next'
import axios from 'axios';
import { SF_ENDPOINT_BARCODE } from 'shared/src/common/configset';

export interface IProps {
  children?: any
  page?: number
  keyword?: string
  option?: number
}



const BasicRawMaterial = ({}: IProps) => {
  const router = useRouter()

  const [excelOpen, setExcelOpen] = useState<boolean>(false)
  const [barcodeOpen , setBarcodeOpen] = useState<boolean>(false)
  const [basicRow, setBasicRow] = useState<Array<any>>([{
    name: "", id: "", type: 'COIL'
  }])
  const [column, setColumn] = useState<Array<IExcelHeaderType>>( V_columnlist["rawmaterial"])
  const [selectList, setSelectList] = useState<Set<number>>(new Set())
  const [optionList, setOptionList] = useState<string[]>(['원자재 CODE', '원자재 품명', '재질', '거래처'])
  const [optionIndex, setOptionIndex] = useState<number>(0)
  const [keyword, setKeyword] = useState<string>();
  const [selectRow , setSelectRow ] = useState<any>(undefined)
  const [buttonList , setButtonList ] = useState<string[]>([])

  const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
    page: 1,
    total: 1
  })


  useEffect(() => {
    setOptionIndex(optionIndex)
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


  const settingType = (type:any) => {
    switch (type){
      case 1:
        return "COIL"

      case 2:
        return "SHEET"

      case "COIL" :
        return 1

      case "SHEET" :
        return 2

      default:
        break;
    }
  }

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
        })

        return {
          ...row,
          ...selectData,
          type:settingType(row.type),
          // customer: row.customerArray,
          additional: [
            ...additional.map((v, index)=>{
              //if(!row[v.colName]) return undefined;
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
    }).filter((v) => v);

    const searchAiID = (rowAdditional:any[], index:number) => {
      let result:number = undefined;
      rowAdditional.map((addi, i)=>{
        if(index === i){
          result = addi.ai_id;
        }
      })
      return result;
    }

    if(selectCheck && codeCheck){
      let res = await RequestMethod('post', `rawMaterialSave`, result).catch((error)=>{
        return error.data && Notiflix.Report.warning("경고",`${error.data.message}`,"확인");
      })

      if (res) {
        Notiflix.Report.success('저장되었습니다.', '', '확인');
        if (keyword) {
          SearchBasic(keyword, optionIndex, pageInfo.page).then(() => {
            Notiflix.Loading.remove()
          })
        } else {
          LoadBasic(pageInfo.page).then(() => {
            Notiflix.Loading.remove()
          })
        }
      }
    }else if(!selectCheck){
      Notiflix.Report.warning("경고","데이터를 선택해주시기 바랍니다.","확인")
    }else if(!codeCheck){
      Notiflix.Report.warning("경고","CODE를 입력해주시기 바랍니다.","확인")
    }
  }


  const LoadBasic = async (page?: number) => {
    Notiflix.Loading.circle()
    const res = await RequestMethod('get', `rawMaterialList`,{
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
    setSelectList(new Set())
  }

  const SearchBasic = async (keyword: any, option: number, isPaging?: number) => {
    Notiflix.Loading.circle()
    if(!isPaging){
      setOptionIndex(option)
    }
    const res = await RequestMethod('get', `rawmaterialSearch`,{
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

  const cleanUpData = (res: any) => {
    let tmpColumn = V_columnlist["rawmaterial"];
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
        type: settingType(row.type) ,
        customer_id: row.customer && row.customer.name,
        id: `rawmaterial_${random_id}`,
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




  const setAdditionalData = () => {

    const addtional = []
    basicRow.map((row)=>{
      if(selectList.has(row.id)){
        column.map((v) => {
          if(v.type === 'additional'){
              addtional.push(v)
            }
          })
      }
    })

    return addtional;
  }

  const convertDataToMap = () => {
    const map = new Map()
    basicRow.map((v)=>map.set(v.id , v))
    return map
  }

  const filterSelectedRows = () => {
    return basicRow.map((row)=> selectList.has(row.id) && row).filter(v => v)
  }

  const classfyNormalAndHave = (selectedRows) => {

    const haveIdRows = []

    selectedRows.map((row : any)=>{
      if(row.rm_id){
        haveIdRows.push(row)
      }
    })

    return haveIdRows
  }

  const DeleteBasic = async () => {

    const map = convertDataToMap()
    const selectedRows = filterSelectedRows()
    const haveIdRows = classfyNormalAndHave(selectedRows)
    const additional = setAdditionalData()
    let deletable = true

    if(haveIdRows.length > 0){

      deletable = await RequestMethod('delete','rawMaterialDelete', haveIdRows.map((row) => (
          {...row , customer: row.customerArray, additional : [...additional.map(v => {
            if(row[v.name]) {
              return {id : v.id, title: v.name, value: row[v.name] , unit: v.unit}
            }
          }).filter(v => v)
          ], type:settingType(row.type)}
      )))
    }

    if(deletable){
      selectedRows.forEach((row)=>{ map.delete(row.id)})
      Notiflix.Report.success('삭제되었습니다.','','확인');
      setBasicRow(Array.from(map.values()))
      setSelectList(new Set())
    }

  }

  const onClickHeaderButton = (index: number) => {
        if(selectList.size === 0){
          return Notiflix.Report.failure('선택을 하셔야 합니다.',
          '선택을 하셔야지 바코드를 보실수 있습니다.',
          'Okay')
        }
        setBarcodeOpen(true)
        selectedData()

    switch(buttonList[index]){
      case '항목관리':
        router.push(`/mes/item/manage/rawmaterial`)
        break;
      case '행추가':
        let items = {}

        column.map((value) => {
          if(value.selectList && value.selectList.length){
            items = {
              ...value.selectList[0],
              [value.key] : value.selectList[0].name,
              [value.key+'PK'] : value.selectList[0].pk,
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
      case '저장하기':
        SaveBasic()

        break;
      case '삭제':
        if(selectList.size === 0){
          return Notiflix.Report.warning(
        '경고',
        '선택된 정보가 없습니다.',
        '확인',
        );
        }

        Notiflix.Confirm.show("경고","삭제하시겠습니까?","확인","취소",
          ()=>{DeleteBasic()}
          ,()=>{}
        )
        break;

    }
  }
  const handleModal = (open:boolean) => {

    setBarcodeOpen(!open)

  }

  const selectedData = () => {

    let tmpSelectList : any[] = []
    basicRow.map(row => {
      if(selectList.has(row.id)){
        tmpSelectList.push(row)
      }
    })

    setSelectRow(tmpSelectList[0])

  }

  const handleBarcode = async (dataurl , id) => {

    await axios.post(`${SF_ENDPOINT_BARCODE}/WebPrintSDK/Printer1`,
                {
                  "id":id,
                  "functions":
                  {"func0":{"checkLabelStatus":[]},
                    "func1":{"clearBuffer":[]},
                    "func2":{"drawBitmap":[dataurl,20,0,800,0]},
                    "func3":{"printBuffer":[]}
                  }
                },
                {
                  headers : {
                    'Content-Type' : 'application/x-www-form-urlencoded'
                  }
                }
    ).catch((error) => {

      if (error) {
        Notiflix.Report.failure('서버 에러', '서버 에러입니다. 관리자에게 문의하세요', '확인')
        return false
      }
    })
  }

  React.useEffect(()=>{

     return setButtonList(['항목관리', '행추가', '저장하기', '삭제'])

  },[selectList.size])

  const competeRawMaterial = (rows) => {

    const tempRow = [...rows]
    const spliceRow = [...rows]
    spliceRow.splice(selectRow, 1)
    const isCheck = spliceRow.some((row)=> row.code === tempRow[selectRow].code && row.code !== undefined && row.code !== '')
    if(spliceRow){
      if(isCheck){
        return Notiflix.Report.warning(
          '코드 경고',
          `중복된 코드를 입력할 수 없습니다`,
          '확인'
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
            setKeyword(keyword)
          }}
          searchOptionList={optionList}
          onChangeSearchOption={(option) => {
            setOptionIndex(option)
          }}
          optionIndex={optionIndex}
          title={"원자재 기준정보"}
          buttons={buttonList}
          buttonsOnclick={
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
            competeRawMaterial(e)
          }}
          selectList={selectList}
          setSelectRow={setSelectRow}
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

          <BarcodeModal
          title={'바코드 미리보기'}
          handleBarcode={handleBarcode}
          handleModal={handleModal}
          isOpen={barcodeOpen}
          type={'rawMaterial'}
          data={selectRow}
        />

      {/* <ExcelDownloadModal
        isOpen={excelOpen}
        column={column}
        basicRow={basicRow}
        filename={`원자재 기준정보`}
        sheetname={`원자재 기준정보`}
        selectList={selectList}
        tab={'ROLE_BASE_07'}
        setIsOpen={setExcelOpen}
      /> */}
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

export {BasicRawMaterial};
