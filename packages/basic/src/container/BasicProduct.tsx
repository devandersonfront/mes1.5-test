import React, {useEffect, useState} from 'react'
import {
  BarcodeModal,
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
import axios from 'axios';
import {useDispatch} from "react-redux";
import {deleteSelectMenuState, setSelectMenuStateChange} from "shared/src/reducer/menuSelectState";

export interface IProps {
  children?: any
  page?: number
  keyword?: string
  option?: number
}

const BasicProduct = ({}: IProps) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [excelOpen, setExcelOpen] = useState<boolean>(false)

  const [basicRow, setBasicRow] = useState<Array<any>>([])
  const [column, setColumn] = useState<Array<IExcelHeaderType>>( columnlist["productV1u"])
  const [selectList, setSelectList] = useState<Set<number>>(new Set())
  const [optionList, setOptionList] = useState<string[]>(['거래처', '모델', '코드', '품명'])
  const [optionIndex, setOptionIndex] = useState<number>(0)
  const [barcodeOpen , setBarcodeOpen] = useState<boolean>(false)
  const [selectRow , setSelectRow ] = useState<any>(0)
  const [keyword, setKeyword] = useState<string>();
  const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
    page: 1,
    total: 1
  })


  const [buttonList , setButtonList ] = useState<string[]>([])


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

  useEffect(() => {
    dispatch(setSelectMenuStateChange({main:"제품 등록 관리",sub:""}))
    return (() => {
      dispatch(deleteSelectMenuState())
    })
  },[])

  const selectedData = () => {

    let tmpSelectList : any[] = []
    basicRow.map(row => {
      if(selectList.has(row.id)){
        tmpSelectList.push(row)
      }
    })
    setSelectRow(tmpSelectList[0])

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
    let processCheck = true
    let bom = true
    const searchAiID = (rowAdditional:any[], index:number) => {
      let result:number = undefined;
      rowAdditional.map((addi, i)=>{
        if(index === i){
          result = addi.ai_id;
        }
      })
      return result;
    }

    Notiflix.Loading.circle();
    let result = basicRow.map((row, i) => {

      if(selectList.has(row.id)){
        selectCheck = true;
        if(!row.code) codeCheck = false
        if(!row.bom) bom = false
        if(!row.process_id) processCheck = false
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
          customer: row?.customerArray?.customer_id ? row.customerArray : null,
          // customer_id: row.customerArray.customer_id,
          customer_id: undefined,
          model: row?.modelArray?.cm_id ? row.modelArray : null,
          // standard_uph: row.uph,
          molds:row?.molds?.map((mold)=>{
            return { setting:mold.setting , mold : {...mold.mold } , sequence : mold.sequence }
          }).filter((mold) => mold.mold.mold_id) ?? [],
          tools:[
            ...row?.tools?.map((tool) => {
              return {...tool,
                tool:{tool_id:tool.tool.tool_id, code: tool.tool.code, name: tool.tool.name, customer:tool.tool.customerData, additional:tool.tool.additional},
                setting:tool.setting}
            }).filter((tool) => tool.tool.tool_id) ?? [],
          ],
          machines:[
            ...row?.machines?.map((machine)=>{
              // console.log(machine,'machinemachine')
              return {
                sequence : machine.sequence,
                setting: machine.setting,
                // machine:{...machine.machine, type:machine.machine.type_id, weldingType:machine.machine.weldingType_id}
                machine : {
                  machine_id : machine.machine.machine_id,
                  mfrName : machine.machine.mfrName,
                  name : machine.machine.name,
                  type : machine.machine.type_id,
                  weldingType : machine.machine.weldingType_id,
                  madeAt:machine.machine.madeAt,
                  mfrCode:machine.machine.mfrCode,
                  manager:machine.machine.manager,
                  photo:machine.machine.photo,
                  capacity:machine.machine.capacity,
                  qualify:machine.machine.qualify,
                  guideline:machine.machine.guideline,
                  interwork:machine.machine.interwork,
                  devices:machine.machine.devices,
                  factory:machine.machine.factory,
                  subFactory:machine.machine.subFactory,
                  additional :machine.machine.additional,
                }
              }
            }).filter((machine) => machine.machine.machine_id)?? []
          ],
          // tools:[
          //     ...row.tools?.map((tool)=>{
          //       return {
          //         ...tool,
          //         setting:tool.tool.setting,
          //         tool:{
          //           ...tool.tool,
          //           customer:tool.tool.customerArray
          //         }
          //       }
          //     })
          // ],
          type:row.type_id ?? row.typeId ?? row.typePK,
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
    }).filter((v) => v)

    if(selectCheck && codeCheck && processCheck && (bom || basicRow[selectRow].bom_root_id)){
      let res = await RequestMethod('post', `productSave`,result).catch((error)=>{
        return error.data && Notiflix.Report.warning("경고",`${error.data.message}`,"확인");
      })

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
      Notiflix.Loading.remove()
      Notiflix.Report.warning("경고","데이터를 선택해주시기 바랍니다.","확인");
    }else if(!codeCheck){
      Notiflix.Loading.remove()
      Notiflix.Report.warning("경고","CODE를 입력해주시기 바랍니다.","확인");
    }else if(!bom){
      Notiflix.Loading.remove()
      Notiflix.Report.warning("경고","BOM을 등록해주시기 바랍니다.","확인");
    }
    else if(!processCheck){
      Notiflix.Loading.remove()
      Notiflix.Report.warning("경고","생산공정을 입력해주시기 바랍니다.","확인");
    }
    // else if(!bomCheck){
    //   Notiflix.Loading.remove()
    //   Notiflix.Report.warning("경고","BOM을 등록해주시기 바랍니다.","확인");
    // }

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
      if(row.product_id){
        haveIdRows.push(row)
      }
    })

    return haveIdRows
  }
  const DeleteBasic = async() => {

    const map = convertDataToMap()
    const selectedRows = filterSelectedRows()
    const haveIdRows = classfyNormalAndHave(selectedRows)
    let deletable = true

    if(haveIdRows.length > 0){

      deletable = await RequestMethod('delete','productDelete', haveIdRows.map((row) => (
          {...row , type : row.type_id}
      )))

      LoadBasic(1)
      setKeyword('')

    }else{

      selectedRows.forEach((row)=>{map.delete(row.id)})
      setBasicRow(Array.from(map.values()))
      setPageInfo({page: pageInfo.page, total: pageInfo.total})
      setSelectList(new Set())
    }

    if(deletable){
      Notiflix.Report.success('삭제되었습니다.','','확인');
    }

  }


  const LoadBasic = async (page?: number) => {
    // Notiflix.Loading.circle()
    const res = await RequestMethod('get', `productList`,{
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
    // Notiflix.Loading.circle()
    if(!isPaging){
      setOptionIndex(option)
    }
    const res = await RequestMethod('get', `productSearch`,{
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
    let tmpColumn = columnlist["productV1u"];
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
        customer_id: row.customer?.name,
        customerArray: row.customer,
        cm_id: row.model?.model ?? "-",
        modelArray: row.model,
        process_id: row.process?.name,
        processArray: row.process,
        type_id: row.type,
        type: columnlist["productV1u"][4].selectList[row.type].name,
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
    switch(buttonList[index]){

      case '바코드 미리보기' :
        case '바코드 미리보기':
        if(selectList.size === 0){
          return Notiflix.Report.warning('오류',
          '선택을 하셔야 합니다.',
          'Okay',)
        }
        setBarcodeOpen(true)
        selectedData()
        break;
      case '항목관리':
        router.push(`/mes/item/manage/product`)
        break;
      case '행추가':
        let items = {}

        column.map((value) => {
          if(value.selectList && value.selectList.length){
            items = {
              ...value.selectList[0],
              [value.key] : value.selectList[0].name,
              [value.key+'PK'] : value.selectList[0].pk, //여기 봐야됨!
              type_id : '0',
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
        // if(selectList.size > 1){
        //   return Notiflix.Report.warning('경고','저장은 한 개만 하실수 있습니다.','확인')
        // }
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

        // if(selectList.size > 1){
        //   return Notiflix.Report.warning('경고','삭제는 한 개만 하실수 있습니다.','확인')
        // }

        Notiflix.Confirm.show("경고","삭제하시겠습니까?(기존 데이터를 삭제할 경우 저장하지 않은 데이터는 모두 사라집니다.)","확인","취소",
            ()=>{DeleteBasic()}
            ,()=>{}
        )
        break;

    }
  }

  const competeProductV1u = (rows) => {

    const tempRow = [...rows]
    const spliceRow = [...rows]
    spliceRow.splice(selectRow, 1)
    const isCheck = spliceRow.some((row)=> row.code === tempRow[selectRow]?.code && row.code !==undefined && row.code !=='')

    if(spliceRow){
      if(isCheck){
        return Notiflix.Report.warning(
          '경고',
          `중복된 코드가 존재합니다.`,
          '확인'
        );
      }
    }

    setBasicRow(rows)
  }

  const handleBarcode = async (dataurl : string , id : string , clientIP : string) => {
    Notiflix.Loading.circle()
    const data = {
      "id":id,
      "functions":
          {"func0":{"checkLabelStatus":[]},
            "func1":{"clearBuffer":[]},
            "func2":{"drawBitmap":[dataurl,20,0,800,0]},
            "func3":{"printBuffer":[]}
          }
    }

    await fetch(`http://${clientIP}:18080/WebPrintSDK/Printer1`,{
      method : 'POST',
      headers : {
        'Content-Type' : 'application/x-www-form-urlencoded'
      },
      body : JSON.stringify(data)
    }).then((res)=>{
      Notiflix.Loading.remove(2000)
    }).catch((error) => {
      Notiflix.Loading.remove()
      if(error){
        Notiflix.Report.failure('서버 에러', '서버 에러입니다. 관리자에게 문의하세요', '확인')
        return false
      }
    })

  }

  const handleModal = (open:boolean) => {
    setBarcodeOpen(!open)
  }


  React.useEffect(()=>{
    if(selectList.size > 1){
      return setButtonList(['항목관리', '행추가', '저장하기', '삭제'])
    }
    return setButtonList(['바코드 미리보기','항목관리', '행추가', '저장하기', '삭제'])
  },[selectList.size])


  return (
      <div>
        <PageHeader
          isSearch
          searchKeyword={keyword}
          onChangeSearchKeyword={(keyword) => {
            setKeyword(keyword)
            setPageInfo({...pageInfo,page:1})
          }}
          searchOptionList={optionList}
          onChangeSearchOption={(option) => {
            setOptionIndex(option)
          }}
          optionIndex={optionIndex}
          title={"제품 등록 관리"}
          pageHelper={"제품 등록, 삭제는 하나씩 가능"}
          buttons={buttonList}
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
              if(v.isChange) {
                tmp.add(v.id)
                v.isChange = false
              }
            })
            setSelectList(tmp)
            competeProductV1u(e)
          }}
          selectList={selectList}
          //@ts-ignore
          setSelectList={ (p) => {
            setSelectList(p as any)
          }}
          setSelectRow={setSelectRow}
          width={1576}
          height={basicRow.length * 40 >= 40*18+56 ? 40*19 : basicRow.length * 40 + 56}
        />
        <PaginationComponent
            currentPage={pageInfo.page}
            totalPage={pageInfo.total}
            setPage={(page) => {
              setPageInfo({...pageInfo,page:page})
            }}
        />

        <BarcodeModal
              title={'바코드 미리보기'}
              handleBarcode={handleBarcode}
              handleModal={handleModal}
              isOpen={barcodeOpen}
              type={'product'}
              data={selectRow}
              />

      {/* <ExcelDownloadModal
        isOpen={excelOpen}
        column={column}
        basicRow={basicRow}
        filename={`금형기준정보`}
        sheetname={`금형기준정보`}
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

export {BasicProduct};
