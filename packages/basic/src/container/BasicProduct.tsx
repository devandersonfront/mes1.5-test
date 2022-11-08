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
import {useDispatch, useSelector} from "react-redux";
import {deleteMenuSelectState, setMenuSelectState} from "shared/src/reducer/menuSelectState";
import {getTableSortingOptions, setExcelTableHeight} from 'shared/src/common/Util';
import { BarcodeDataType } from "shared/src/common/barcodeType";
import {QuantityModal} from "shared/src/components/Modal/QuantityModal";
import {TableSortingOptionType} from "shared/src/@types/type";
import renewalColumn from '../../../main/common/unprintableKey'
import { alertMsg } from 'shared/src/common/AlertMsg'
import {insert_productList} from "shared/src/reducer/ProductSelect";
import {selectUserInfo} from "shared/src/reducer/userInfo";

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
  const userInfo = useSelector(selectUserInfo)
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
  const [productType, setProductType] = useState<string>('0');
  const [typeIndex, setTypeIndex] = useState<number>(0);
  const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
    page: 1,
    total: 1
  })
  const [modal , setModal] = useState<ModalType>({
    type : 'barcode',
    isVisible : false
  })
  const [barcodeData , setBarcodeData] = useState<BarcodeDataType[]>([])
  const typeOptions = [
    [ {status: undefined, name: '품목 종류'},
      {status: '0,3', name: '반제품'},
      {status: '1', name: '재공품'},
      {status: '2,4', name: '완제품'}],
    [ {status: undefined, name: '품목 종류'},
      {status: '0', name: '반제품'},
      {status: '1', name: '재공품'},
      {status: '2', name: '완제품'}],
    [ {status: undefined, name: '품목 종류'},
      {status: '3', name: '반제품'},
      {status: '4', name: '완제품'}],
    ]

  const onColumnFilter = (value:number | string, key:string, index:number) => {
    switch(key){
      case 'product_type':
        if(typeof value === 'string') {
          setProductType(value);}
        break;
      case 'type':
        setTypeIndex(index)
        break;
    }
    setPageInfo({page:1, total:1})
  }

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
  }, [pageInfo.page, productType, typeIndex]);

  useEffect(() => {
    dispatch(setMenuSelectState({main:"제품 등록 관리",sub:""}))
    return (() => {
      dispatch(deleteMenuSelectState())
    })
  },[])

  const validate = (row) => {
    if(!!!row.code) throw('CODE는 필수입니다.')
    if(!!!row.product_id && !!!row.bom && Number(row.type_id) < 3 ) throw('BOM은 필수입니다.')
    if(!!!row.process_id) throw('생산 공정은 필수입니다.')
  }

  const SaveBasic = async () => {
    try {
      if(!!!selectList.size) throw(alertMsg.noSelectedData)
      const addedColumn = column.filter(col => col.type === 'additional')
      const postBody = basicRow.filter(row => selectList.has(row.id)).map(row => {
        validate(row)
        return {
          ...row,
          customer: row?.customerArray?.customer_id ? row.customerArray : null,
          customer_id: undefined,
          model: row?.modelArray?.cm_id ? row.modelArray : null,
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
                  ...machine.machine,
                  type : machine.machine.type_id,
                  weldingType : machine.machine.weldingType_id,
                }
              }
            }).filter((machine) => machine.machine.machine_id)?? []
          ],
          work_standard_image:row.work_standard_image?.uuid,
          type: row.type_id,
          safety_stock : Number(row.safety_stock),
          safety_stock_id : Number(row.safety_stock_id) == 0 ? null : Number(row.safety_stock_id),
          additional: addedColumn.map((col, colIdx)=> ({
                mi_id: col.id,
                title: col.name,
                value: row[col.key] ?? "",
                unit: col.unit,
                ai_id: row.additional[colIdx]?.ai_id ?? undefined,
                version:row.additional[colIdx]?.version ?? undefined
              }))
        }
      })
      Notiflix.Loading.circle();
      const res = await RequestMethod('post', `productSave`,postBody)
      if(res){
        Notiflix.Report.success('저장되었습니다.','','확인', () => reload());
      }
      Notiflix.Loading.remove()
    } catch(errMsg) {
      Notiflix.Report.warning('경고', errMsg, '확인')
    }
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

  const setNewColumn = (menus:any[]) => {
    const changeOrder = (sort:string, order:string) => {
      const _sortingOptions = getTableSortingOptions(sort, order, sortingOptions)
      setSortingOptions(_sortingOptions)
      reload(null, _sortingOptions)
    }
    let addedCols = []
    const menuMap = menus?.reduce((map, menu) => {
      if(false === menu.hide){
        if(menu.colName){
          map.set(menu.colName, menu)
        }else {
          addedCols.push({
            id: menu.mi_id,
            name: menu.title,
            width: menu.width,
            key: menu.mi_id,
            editor: TextEditor,
            type: 'additional',
            unit: menu.unit,
            tab: menu.tab,
            version: menu.version,
            colName: menu.mi_id,
          })
        }
      }
      return map
    }, new Map())
    let newCols =column.filter(col => menuMap.has(col.key)).map(col => {
      const menu = menuMap.get(col.key)
      const sortIndex = sortingOptions.sorts.findIndex(sort => sort ===col.key)
      return {
        ...col,
        id: menu.mi_id,
        name: !menu.moddable ? `${menu.title}(필수)`: menu.title,
        width: menu.width,
        tab:menu.tab,
        unit:menu.unit,
        moddable: !menu.moddable,
        version: menu.version,
        sequence: menu.sequence,
        hide: menu.hide,
        sortOption: sortIndex !== -1 ? sortingOptions.orders[sortIndex] : col.sortOption ?? null,
        sorts: col.sorts ? sortingOptions : null,
        result: col.sortOption ? changeOrder : col.options ? onColumnFilter : null,
        options: col.options ? col.key === 'type' ? typeOptions[productType] as {status:number | string, name:string}[] : col.options : undefined
      }
    })
    setColumn(newCols.concat(addedCols))
  }

  const cleanUpData = (res: any) => {
    res.menus?.length && setNewColumn(res.menus)
    const newRows = res.info_list.map((row: any) => {
      let additionalData = {}
      row.additional.map(add => {
        additionalData[add.mi_id] = add.value
      })
      let random_id = Math.random()*1000;
      return {
        ...row,
        ...additionalData,
        customer_id: row.customer?.name,
        customerArray: row.customer,
        cm_id: row.model?.model,
        modelArray: row.model,
        process_id: row.process?.name,
        processArray: row.process,
        type_id: row.type,
        type: column.filter(col => col.key === 'type')?.[0]?.selectList[row.type < 3 ? 0 : 1][row.type > 2 ? row.type - 3 : row.type].name,
        product_type: column.filter(col => col.key === 'product_type')?.[0]?.selectList[row.type < 3 ? 0 : 1].name,
        id: `product_${random_id}`,
        readonly: row.type > 2,
        safety_stock : Number(row.safety_stock),
        safety_stock_id : Number(row.safety_stock_id),
        reload
      }
    })
    setBasicRow(newRows)
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
    if(productType !== undefined) params['outsourcing'] = productType
    if(typeIndex !== 0 && typeOptions[productType][typeIndex] !== undefined) params['types'] = typeOptions[productType][typeIndex]?.status.split(',') ?? undefined
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
        setExcelOpen(true)
        break;
      case 2:
        router.push(`/mes/item/manage/product`)
        break;
      case 3:
        let items = {}

        column.map((col) => {
          if(col.selectList && col.selectList.length){
            const selectList = col.key === 'type' ? col.selectList[0][0] : col.selectList[0]
            items = {
              ...selectList,
              [col.key] : selectList.name,
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

      case 4:
        const hasIds = getCheckItems().every((item)=>item.product_id)
        if(!hasIds){
          if(selectList.size > 1){
            return Notiflix.Report.warning('경고','저장은 한 개만 하실수 있습니다.','확인')
          }else{
            SaveBasic()
          }
        }else{
          SaveBasic()
        }
        break;
      case 5:
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

  const materialTypeOfCompany = (data) => {
    switch (data.type) {
      case '완제품' :
        return 6
      case '반제품':
      case '재공품':
        return 7
      default :
        return 2
    }
  }

  const convertBarcodeData = (quantityData) => {

    const mainMachine = quantityData.machines?.filter((machine)=>(machine.machine.type === 1))

    return [{
      material_id: quantityData.product_id,
      material_type: userInfo.companyCode === '2SZ57L' ? materialTypeOfCompany(quantityData) : 2,
      material_lot_id : 0,
      material_lot_number: '0',
      material_quantity : quantityData.quantity,
      material_name: quantityData.name ?? "-",
      material_code: quantityData.code,
      material_customer: quantityData.customer?.name ?? "-",
      material_model: quantityData.model?.model ?? "-",
      material_machine_name : mainMachine.length > 0 ? mainMachine[0]?.machine.name : null,
      material_size : null,
      material_texture : null,
      material_unit : null,

      material_texture_type : null,
      material_import_date : null,
      material_bom_lot: null,
    }]
  }

  const routeToProductBatchRegister = () => {
    router.push('/mes/basic/product/batch')
  }

  const onClickMoreButton = (buttonIdx: number) => {
    if(selectList.size <= 1){
      dispatch(insert_productList(basicRow[selectRow]))
      switch(buttonIdx){
        case 0: routeToProductBatchRegister()
      }
    }else{
      Notiflix.Report.warning("경고","하나의 데이터만 선택해주세요.","확인")
    }
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
      <div className={'excelPageContainer'}>
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
            buttons={[ (selectList.size <= 1 && "바코드 미리보기"),"엑셀","항목관리", "행추가", "저장하기", "삭제", ]}
            buttonsOnclick={onClickHeaderButton}
            moreButtons={['제품 BOM 일괄 등록']}
            onClickMoreButton={onClickMoreButton}

        />
        <ExcelTable
            editable
            resizable
            resizeSave
            selectable
            headerList={[
              SelectColumn,
            ...renewalColumn(column)
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

        <ExcelDownloadModal
            isOpen={excelOpen}
            category={"product"}
            title={"제품 등록 관리"}
            setIsOpen={setExcelOpen}
            resetFunction={() => reload()}
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

export {BasicProduct};
