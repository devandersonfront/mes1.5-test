import React, {useEffect, useState} from 'react'
import lodash from "lodash";
import {
  columnlist,
  ExcelDownloadModal,
  ExcelTable,
  Header as PageHeader,
  IExcelHeaderType, InputMaterialViewModal,
  RequestMethod, RootState,
} from 'shared'
// @ts-ignore
import {SelectColumn} from 'react-data-grid'
import Notiflix from "notiflix";
import {useRouter} from 'next/router'
import {NextPageContext} from 'next'
import moment from 'moment'
import {TransferCodeToValue, TransferValueToCode} from 'shared/src/common/TransferFunction'
import {useDispatch, useSelector} from "react-redux";
import {SearchModalResult, SearchResultSort} from "shared/src/Functions/SearchResultSort";
import {delete_operation_searchKey} from "shared/src/reducer/operationRegisterState";
import {deleteMenuSelectState, setMenuSelectState} from "shared/src/reducer/menuSelectState";
import {NoneSelectedValidation, RequiredValidation, NoAmountValidation} from "shared/src/validations/Validation";
import addColumnClass from '../../../../main/common/unprintableKey'
import { ParseResponse } from 'shared/src/common/Util'
import {insert_summary_info} from "shared/src/reducer/infoModal";
import {TransferType} from "shared/src/@types/type";

interface IProps {
  page?: number
  keyword?: string
  option?: number
}

type ModalType = {
  type : string
  isVisible : boolean
}

const initRow ={ id: undefined, date: moment().format('YYYY-MM-DD'), deadline: moment().format('YYYY-MM-DD'), first:true }
const MesOperationRegister = ({page, keyword, option}: IProps) => {
  const router = useRouter()
  const dispatch = useDispatch();
  // const receiveKey = useSelector((root:RootState) => root.OperationRegisterState);
  //처음인지 확인하는 state 하나 필요
  const [firstCheck, setFirstCheck] = useState<boolean>(true)
  const [codeCheck, setCodeCheck] = useState<boolean>(true)
  const [parentProduct, setParentProduct] = useState<any>(undefined)
  const [basicRow, setBasicRow] = useState<Array<any>>([initRow])
  const [column, setColumn] = useState<Array<IExcelHeaderType>>(columnlist["operationCodeRegisterV2"])
  const [selectList, setSelectList] = useState<Set<any>>(new Set())
  const [modal , setModal] = useState<ModalType>({
    type : 'inputMaterial',
    isVisible : false
  })

  const [inputBom , setInputBom] = useState<boolean>()

  useEffect(() => {
    if(router.query.contractId !== undefined && firstCheck){
      setCodeCheck(false)
      // setColumn(columnlist["operationIdentificationRegisterV2"])
      makeSheetFromOrder()
    }else{
      getColumns()
    }
    setFirstCheck(false)
  }, [codeCheck])

  useEffect(() => {
    dispatch(setMenuSelectState({main:"생산관리 등록",sub:router.pathname}))
    return(() => {
      dispatch(delete_operation_searchKey())
      dispatch(deleteMenuSelectState())
    })
  },[])

  useEffect(() => {
    if(parentProduct) loadGraphSheet(parentProduct)
  }, [parentProduct])

  useEffect(()=> {
    (async () => {
      if (basicRow.every((row)=>row.bom_root_id) && inputBom) {
        let failList = []
        const result = await Promise.all(basicRow.map(async (row) => {
          const rowData = await SearchBasic(row);
          if(rowData == undefined){
            failList.push(row.code)
            row.searchList = null
          }
          return rowData ?? row
        }))

        if(failList.length > 0) {
          Notiflix.Report.warning("경고", `BOM이 없는 제품이 있습니다.(${failList})`, "확인",)
        }
        setBasicRow(result)
        setInputBom(false)
      }
    })();
  },[inputBom])

  const haveBasicValidation = (searchList) => {

    let rawMaterialBasic = [] ;
    let subMaterialBasic = [] ;
    let productBasic = [];

    let haveRawMaterialBasic;
    let haveSubMaterialBasic;
    let haveProductBasic;

    searchList.map((list)=>{
      if(list.tab === 0){
        rawMaterialBasic.push({type : list.setting})
      }else if(list.tab === 1){
        subMaterialBasic.push({type : list.setting})
      }else if(list.tab === 2){
        productBasic.push({type : list.setting})
      }
    })

    if(rawMaterialBasic.length !== 0){
      haveRawMaterialBasic = rawMaterialBasic.some((v) => v.type === 1)
    }else{
      haveRawMaterialBasic = true
    }

    if(subMaterialBasic.length !== 0){
      haveSubMaterialBasic = subMaterialBasic.some((v) => v.type === 1)
    }else{
      haveSubMaterialBasic = true
    }

    if(productBasic.length !== 0){
      haveProductBasic = productBasic.some((v) => v.type === 1)
    }else{
      haveProductBasic = true
    }
    if(haveRawMaterialBasic && haveSubMaterialBasic && haveProductBasic){
      return true
    }

    return false

  }

  const executeValidation = (searchList) => {

    let isValidation = false
    const haveBasic = haveBasicValidation(searchList)

    if(!haveBasic){
      isValidation = true
      Notiflix.Report.warning("경고",`BOM이 없습니다.(추후 문구 변경 필요)`,"확인",)
    }

    return isValidation
  }

  const SearchBasic = async (row) => {
    Notiflix.Loading.circle()
    const res = await RequestMethod('get', `bomLoad`,{path: { key: row.bom_root_id }})
    if(res && !!res) {
      let searchList = changeRow(res)
      const isValidation = executeValidation(searchList)
      if (!isValidation) {
        return {
          ...row,
          input_bom: [
            ...searchList.map((v, i) => {
              // if(v.spare === '여'){
              return {
                bom: {
                  seq: i + 1,
                  type: v.tab,
                  parent: v.parent,
                  child_product: v.tab === 2 ? {...v.product} : null,
                  child_rm: v.tab === 0 ? {
                    ...v.raw_material,
                    unit: TransferValueToCode(v.raw_material.unit, 'rawMaterialUnit')
                  } : null,
                  child_sm: v.tab === 1 ? {...v.sub_material} : null,
                  key: v.parent?.bom_root_id,
                  setting: v.setting,
                  usage: v.usage,
                }
              }
              // }
            }).filter(v => v)
          ],
          searchList : searchList,
          name: row.name,
          isChange: true,
        }
      }
    }
  }

  const changeRow = (tmpRow) => {
    const parsedRes = ParseResponse(tmpRow)
    return parsedRes.map((v, i) => {
      const bomDetail:{childData:any, bomType: TransferType, objectKey: string} = {
        childData: {},
        bomType: undefined,
        objectKey: undefined
      }
      switch(v.type){
        case 0:{
          const childData = {...v.child_rm}
          childData.unit = TransferCodeToValue(childData.unit, 'rawMaterialUnit')
          bomDetail['childData'] = childData
          bomDetail['bomType'] = 'rawMaterial'
          bomDetail['objectKey'] = 'raw_material'
          break;
        }
        case 1:{
          bomDetail['childData'] = v.child_sm
          bomDetail['bomType'] = 'subMaterial'
          bomDetail['objectKey'] = 'sub_material'
          break;
        }
        case 2:{
          bomDetail['childData'] = v.child_product
          bomDetail['bomType'] = 'product'
          bomDetail['objectKey'] = 'product'
          break;
        }
      }

      return {
        ...bomDetail.childData,
        seq: i+1,
        code: bomDetail.childData.code,
        type: TransferCodeToValue(bomDetail.childData?.type, bomDetail.bomType),
        tab: v.type,
        product_type: v.type !== 2 ? '-' : TransferCodeToValue(bomDetail.childData?.type, 'productType'),
        type_name: TransferCodeToValue(bomDetail.childData?.type, bomDetail.bomType),
        unit: bomDetail.childData.unit,
        parent: v.parent,
        usage: v.usage,
        version: v.version,
        setting: v.setting,
        isDefault: v.setting == 1 ? '기본' : '스페어',
        stock: bomDetail.childData.stock,
        // disturbance: Number(basicRow[i]?.goal) * Number(v.usage),
        processArray: bomDetail.childData.process ?? null,
        process: bomDetail.childData.process ? bomDetail.childData.process.name : '-',
        // spare:'부',
        bom_root_id: bomDetail.childData.bom_root_id,
        [bomDetail.objectKey]: {...bomDetail.childData},
      }
    })
  }

  const getColumns = async () => {
    let res = await RequestMethod('get', `loadMenu`, {
      path: {
        tab: 'ROLE_PROD_01'
      }
    })

    if(res){
      let tmpColumn = codeCheck ?  columnlist["operationCodeRegisterV2"]() : columnlist['operationIdentificationRegisterV2']()

      tmpColumn = tmpColumn.map((column: any) => {
        let menuData: object | undefined;
        res.bases && res.bases.map((menu: any) => {
          if(menu.colName === column.key){
            menuData = {
              id: menu.id,
              name: menu.title,
              width: menu.width,
              tab:menu.tab,
              unit:menu.unit,
              moddable: menu.moddable,
            }
          } else if(menu.colName === 'id' && column.key === 'tmpId'){
            menuData = {
              id: menu.id,
              name: menu.title,
              width: menu.width,
              tab:menu.tab,
              unit:menu.unit,
              moddable: menu.moddable,
            }
          }
        })

        if(menuData){
          return {
            ...column,
            ...menuData,
          }
        }
      }).filter((v:any) => v)

      setColumn([...tmpColumn.map(v=> {
        if(v.name === '수주 번호' && !codeCheck){
          return {
            ...v,
            name:  v.name+'(필수)'
          }
        }else if(v.name === 'CODE' && codeCheck){
          return {
            ...v,
            name: v.name+'(필수)'
          }
        }else {
          return {
            ...v,
            name: !v.moddable ? v.name+'(필수)' : v.name
          }
        }
      })])
    }
  }

  const makeSheetFromOrder = async () => {
    const res = await RequestMethod("get", "contractLoad", {
      path:{
        contract_id:router.query.contractId,
      }
    })
    if(res) {
      setParentProduct(SearchModalResult(SearchResultSort([res], "contract")[0], "receiveContract"))
    }
  }

  const validateSaveRequest = (selectedData: any[]) => {
    return NoneSelectedValidation(selectedData) ||
        RequiredValidation('product_id', selectedData,"CODE OR 수주번호를 선택해주세요.") ||
        RequiredValidation('input_bom', selectedData,"자재 보기를 눌러 BOM 등록을 해주세요.") ||
        NoAmountValidation('goal', selectedData, "목표 생산량을 입력해 주세요.")
  }

  const SaveBasic = async (selectedData: any[]) => {
    if(validateSaveRequest(selectedData)) return
    let res: any
    res = await RequestMethod('post', `sheetSave`,
        selectedData.map((row, i) => {
          let selectKey: string[] = []
          column.map((v) => {
            if (v.selectList) {
              selectKey.push(v.key)
            }
          })
          let selectData: any = {}

          Object.keys(row).map(v => {
            if (v.indexOf('PK') !== -1) {
              selectData = {
                ...selectData,
                [v.split('PK')[0]]: row[v]
              }
            }

          })
          return {
            ...row,
            ...selectData,
            contract: selectedData[0].contract,
            os_id: undefined,
            version: undefined,
            // input_bom: null,
            status: 1,
          }
        }))
    if (res) {
      Notiflix.Report.success('저장되었습니다.', '', '확인', () => {
        router.push('/mes/operationV1u/list')
      });
    }
  }

  const loadGraphSheet = async (object?: any) => {
    Notiflix.Loading.circle()
    let newSelectList = new Set()
    let parentProduct = [{
      ...object,
      index : 0,
      id: object.product?.product_id,
      contract_id: object.contract_id ?? '-',
      goal: object.contract?.amount ?? 0,
      cm_id: object.cm_id ?? '-',
      process_id: object.product?.process?.name ?? '-',
      name: object.product_name ?? '-',
      date: object?.date ?? moment().format('YYYY-MM-DD'),
      deadline: object?.deadline ?? moment().format('YYYY-MM-DD'),
      first:true,
    }]
    newSelectList.add(object.product?.product_id)
    const res=  await RequestMethod('get', `sheetGraphList`,{
      path: { product_id: object.product?.product_id }, params:{product_only: 1}
    })

    if(res) {
      const parsedRes = ParseResponse(res)
      const childProducts = parsedRes.filter(row => row.type === 2 && row.child_product?.type < 3).map((row,index) => {
        let random_id = Math.random() * 1000;
        const id= row.child_product?.product_id ?? 'operation' + random_id
        newSelectList.add(id)
        return {
          ...row,
          index : index + 1,
          contract_id: object.contract_id ?? '-',
          id,
          bom_root_id: row.child_product.bom_root_id,
          product: row.child_product,
          date: object?.date ?? moment().format('YYYY-MM-DD'),
          deadline: object?.deadline ?? moment().format('YYYY-MM-DD'),
          customer_id: row.child_product.customer?.name,
          cm_id: row.child_product.model?.model,
          name: row.child_product.name ?? row.product_name,
          product_id: row.child_product.code,
          code: row.child_product.code,
          type: TransferCodeToValue(row.child_product.type, 'product'),
          unit: row.child_product.unit,
          goal: object.contract?.amount ?? 0,
          process_id: row.child_product.process?.name ?? '-',
          readonly: true,
        }
      })
      parentProduct = parentProduct.concat(childProducts)
    }
    setSelectList(newSelectList)
    setBasicRow(parentProduct)
    setInputBom(true)
    return parentProduct
  }

  const onClickHeaderButton = async(index: number) => {
    switch(index){
      case 0:
      try{
        const notHasSearchList = []
        basicRow.filter(row => {
          if (selectList.has(row.id) && !row.searchList) {
            notHasSearchList.push(row.code)
            // throw (row.code)
          }
        })
        if(notHasSearchList.length > 0){
          throw(`${notHasSearchList}의 BOM이 없습니다.`)
        }
        setModal({...modal, isVisible : true})
      }catch(e){
        Notiflix.Report.warning("경고",`${e}`,"확인",)
      }
        break;
    }
  }

  const textMultiInput = (index : number , value : number) => {
    setBasicRow(basicRow.map(row => (row.index >= index ? {...row, goal: value} : {...row})))
  }

  return (
      <div className={'excelPageContainer'}>
        <PageHeader
            radioButtons={['CODE로 등록', '수주번호로 등록']}
            onChangeRadioIndex={(index) => {
              setCodeCheck(!!!index)
              setBasicRow([{
                id: undefined,
                date: basicRow[0].date?? moment().format('YYYY-MM-DD'),
                deadline: basicRow[0].deadline?? moment().format('YYYY-MM-DD'), first:true
              }])
            }}
            radioIndex={Number(!!!codeCheck)}
            title={"작업지시서 등록"}
            buttons={['저장하기']}
            buttonsOnclick={onClickHeaderButton}
        />
        <ExcelTable
            editable
            resizable
            selectable
            headerList={[
              SelectColumn,
              ...addColumnClass(codeCheck ? [...columnlist["operationCodeRegisterV2"](textMultiInput)] : columnlist['operationIdentificationRegisterV2'](textMultiInput))
            ]}
            row={basicRow}
            setRow={async (row) => {
              if(row.length > 0)
              {
                if(parentProduct ? codeCheck ? row?.[0].product?.product_id !== parentProduct?.product?.product_id : row?.[0].contract_id !== parentProduct.contract_id : true) {
                  setParentProduct(row?.[0])
                } else {
                  const newSelectList = new Set(selectList)
                  const newRow = row.map(row => {
                    const id = row.product?.product_id
                    if(row.isChange) newSelectList.add(id)
                    return {
                      ...row,
                      id,
                      isChange: false
                    }
                  })
                  setSelectList(newSelectList)
                  setBasicRow(newRow)
                }
              }
            }}
            selectList={selectList}
            //@ts-ignore
            setSelectList={setSelectList}
            width={1576}
            height={basicRow.length * 40 >= 40*18+56 ? 40*19 : basicRow.length * 40 + 56}
        />
        {
            modal.isVisible && modal.type === 'inputMaterial' &&
            <InputMaterialViewModal
                isOpen={modal.isVisible}
                isClose={()=>{
                  setModal({
                    ...modal,
                    isVisible : false
                  })
                }}
                onClick={() => SaveBasic(basicRow.filter(row => selectList.has(row.id)))}
                data={basicRow.filter(row => selectList.has(row.id))}
            />
        }
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

export {MesOperationRegister};
