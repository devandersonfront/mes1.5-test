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
import {deleteMenuSelectState, setMenuSelectState} from "shared/src/reducer/menuSelectState";
import {getTableSortingOptions, setExcelTableHeight} from 'shared/src/common/Util';
import { BarcodeDataType } from "shared/src/common/barcodeType";
import {QuantityModal} from "shared/src/components/Modal/QuantityModal";
import {TableSortingOptionType} from "shared/src/@types/type";

export interface IProps {
  children?: any
  page?: number
  keyword?: string
  option?: number
}

type ModalType = {
  type : 'barcode' | 'quantity'
  isVisible : boolean
}


const BasicProduct = ({}: IProps) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [excelOpen, setExcelOpen] = useState<boolean>(false)
  const [basicRow, setBasicRow] = useState<Array<any>>([])
  const [sortingOptions, setSortingOptions] = useState<TableSortingOptionType>({orders:[], sorts:[]})
  const [column, setColumn] = useState<Array<IExcelHeaderType>>( columnlist["productV1u"])
  const [selectList, setSelectList] = useState<Set<number>>(new Set())
  const [optionList, setOptionList] = useState<string[]>(['거래처', '모델', '코드', '품명'])
  const [optionIndex, setOptionIndex] = useState<number>(0)
  const [selectRow , setSelectRow ] = useState<any>(0)
  const [keyword, setKeyword] = useState<string>();
  const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
    page: 1,
    total: 1
  })
  const [modal , setModal] = useState<ModalType>({
    type : 'barcode',
    isVisible : false
  })
  const [barcodeData , setBarcodeData] = useState<BarcodeDataType[]>([])

  const reload = (keyword?:string, sortingOptions?: TableSortingOptionType) => {
    setKeyword(keyword)
    if(pageInfo.page > 1) {
      setPageInfo({...pageInfo, page: 1})
    } else {
      getData(undefined, keyword, sortingOptions)
    }
  }

  useEffect(() => {
    getData(pageInfo.page, keyword)
  }, [pageInfo.page]);

  useEffect(() => {
    dispatch(setMenuSelectState({main:"제품 등록 관리",sub:""}))
    return (() => {
      dispatch(deleteMenuSelectState())
    })
  },[])


  const loadAllSelectItems = async (column: IExcelHeaderType[]) => {
    const changeOrder = (sort:string, order:string) => {
      const _sortingOptions = getTableSortingOptions(sort, order, sortingOptions)
      setSortingOptions(_sortingOptions)
      reload(null, _sortingOptions)
    }
    let tmpColumn = column.map((v: any) => {
      const sortIndex = sortingOptions.sorts.findIndex(value => value === v.key)
      return {
        ...v,
        pk: v.unit_id,
        sortOption: sortIndex !== -1 ? sortingOptions.orders[sortIndex] : v.sortOption ?? null,
        sorts: v.sorts ? sortingOptions : null,
        result: v.sortOption ? changeOrder : null,
      }
    });

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

    Notiflix.Loading.standard();
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
          // setting: row?.typePK ?? row.setting,
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
          work_standard_image:row.work_standard_image?.uuid,
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
        Notiflix.Report.success('저장되었습니다.','','확인', () => reload());
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

      reload()
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

  const getRequestParams = (keyword?: string, _sortingOptions?: TableSortingOptionType) => {
    let params = {}
    if(keyword) {
      params['keyword'] = keyword
      params['opt'] = optionIndex
    }
    if(sortingOptions.orders.length > 0){
      params['orders'] = _sortingOptions ? _sortingOptions.orders : sortingOptions.orders
      params['sorts'] = _sortingOptions ? _sortingOptions.sorts : sortingOptions.sorts
      params['sorts'] = params['sorts']?.map(sort => sort === 'process_id' ? 'pc.name' : sort)

    }
    return params
  }

  const getData = async (page: number = 1, keyword?: string, _sortingOptions?: TableSortingOptionType) => {
    Notiflix.Loading.circle()
    const res = await RequestMethod('get', keyword ? 'productSearch' : 'productList',{
      path: {
        page: page ?? 1,
        renderItem: 18,
      },
      params: getRequestParams(keyword, _sortingOptions)
    })

    if(res){
      if (res.totalPages > 0 && res.totalPages < res.page) {
        reload();
      } else {
        setPageInfo({
          ...pageInfo,
          page: res.page,
          total: res.totalPages
        })
        cleanUpData(res);
      }
    }
    setSelectList(new Set())
    Notiflix.Loading.remove()
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


    loadAllSelectItems( [...tmpColumn, ...additionalMenus])


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
        cm_id: row.model?.model,
        modelArray: row.model,
        process_id: row.process?.name,
        processArray: row.process,
        type_id: row.type,
        type: column[4].selectList[row.type].name,
        id: `product_${random_id}`,
        reload
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
        if(selectList.size === 0){
          return Notiflix.Report.warning('오류',
              '선택을 하셔야 합니다.',
              'Okay',)
        }
        setModal({type : 'quantity' , isVisible : true})
        break;
      case 1:
        router.push(`/mes/item/manage/product`)
        break;
      case 2:
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
            id: `product_${random_id}`,
            name: null,
            additional: [],

          },
          ...basicRow
        ])
        break;

      case 3:
        if(selectList.size > 1){
          return Notiflix.Report.warning('경고','저장은 한 개만 하실수 있습니다.','확인')
        }
        SaveBasic()

        break;
      case 4:
        if(selectList.size === 0){
          return Notiflix.Report.warning(
              '경고',
              '선택된 정보가 없습니다.',
              '확인',
          );
        }

        if(selectList.size > 1){
          return Notiflix.Report.warning('경고','삭제는 한 개만 하실수 있습니다.','확인')
        }

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

  const handleBarcode = async (dataurl : string, clientIP : string) => {
    Notiflix.Loading.circle()
    const data = {
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

  const handleModal = (type : 'barcode',isVisible) => {
    setModal({type , isVisible})
  }

  const convertBarcodeData = (quantityData) => {

    return [{
      material_id: quantityData.product_id,
      material_type: 2,
      material_lot_id : 0,
      material_lot_number: '0',
      material_quantity : quantityData.quantity,
      material_name: quantityData.name ?? "-",
      material_code: quantityData.code,
      material_customer: quantityData.customer?.name ?? "-",
      material_model: quantityData.model?.model ?? "-",
    }]
  }


  const getCheckItems= () => {
    const tempList = []
    basicRow.map((data) => selectList.has(data.id) && tempList.push(data))
    return tempList
  }

  const onClickQuantity = (quantity) => {
    const items = getCheckItems()
    const item = items[0]
    const convertedData = convertBarcodeData({...item , quantity})
    setBarcodeData(convertedData)
    setModal({isVisible : true , type : 'barcode'})
  }

  const onCloseQuantity = () => {
    setModal({isVisible : false , type : 'quantity'})
  }

  return (
      <div>
        <PageHeader
            isSearch
            searchKeyword={keyword}
            onSearch={(keyword) => reload(keyword, sortingOptions)}
            searchOptionList={optionList}
            onChangeSearchOption={(option) => {
              setOptionIndex(option)
            }}
            optionIndex={optionIndex}
            title={"제품 등록 관리"}
            pageHelper={"제품 등록, 삭제는 하나씩 가능"}
            buttons={[ (selectList.size === 1 && "바코드 미리보기"), "항목관리", "행추가", "저장하기", "삭제", ]}
            buttonsOnclick={onClickHeaderButton}
        />
        <ExcelTable
            editable
            resizable
            resizeSave
            selectable
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
            onRowClick={(clicked) => {const e = basicRow.indexOf(clicked)
              setSelectRow(e)}}
            width={1576}
            height={setExcelTableHeight(basicRow.length)}
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
            type={'product'}
            data={barcodeData}
            isVisible={modal.type === 'barcode' && modal.isVisible}
        />

        <QuantityModal
            onClick={onClickQuantity}
            onClose={onCloseQuantity}
            isVisible={modal.type === 'quantity' && modal.isVisible}
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
