import React, { useEffect, useState } from 'react'
import { IExcelHeaderType } from '../../@types/type'
import styled from 'styled-components'
import Modal from 'react-modal'
import { POINT_COLOR } from '../../common/configset'
//@ts-ignore
import IcSearchButton from '../../../public/images/ic_search.png'
//@ts-ignore
import IcX from '../../../public/images/ic_x.png'
import { ExcelTable } from '../Excel/ExcelTable'
import { searchModalList } from '../../common/modalInit'
//@ts-ignore
import Search_icon from '../../../public/images/btn_search.png'
import { RequestMethod } from '../../common/RequestFunctions'
import Notiflix from 'notiflix'
import { TransferCodeToValue } from '../../common/TransferFunction'
import moment from 'moment'
import lodash from 'lodash'
import Big from 'big.js'
import { getBomObject, isNil, ParseResponse } from '../../common/Util'
import { UploadButton } from '../../styles/styledComponents'
import { LineBorderContainer } from '../Formatter/LineBorderContainer'
import { TextEditor } from '../InputBox/ExcelBasicInputBox'
import { UnitContainer } from '../Unit/UnitContainer'
import { alertMsg } from '../../common/AlertMsg'
import Tooltip from 'rc-tooltip'
import 'rc-tooltip/assets/bootstrap_white.css'
import { getHeaderItems, InputListHeaders, InputModalHeaderItems } from '../../common/inputMaterialInfo'

interface IProps {
  column: IExcelHeaderType
  row: any
  onRowChange: (e: any) => void
}

//작업일보 등록/수정 투입 자재 모달

const InputMaterialListModal = ({column, row, onRowChange}: IProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [headerItemsValue, setHeaderItemsValue] = useState<any>({})
  const [selected, setSelected] = useState<{index: number | null, product:string, type:string, productType:string}>({
    index: null,
    product: '',
    type: '',
    productType:''
  })
  const [inputMaterialList, setInputMaterialList] = useState<any[]>([])
  const [lotList, setLotList] = useState<any[]>([])
  const [inputMaterial, setInputMaterial] = useState<any>()
  const isModify = column.action === 'modify'
  const isAIModal = column.type === 'ai'
  const isOutsourcing = column.type === 'outsourcing'
  const cavity = row.molds?.filter(mold => mold?.mold?.setting === 1)?.[0]?.mold?.mold?.cavity ?? 1
  useEffect(() => {
    if(isOpen){
      getInputMaterialList(row.product.bom_root_id, isAIModal ? row.operation_sheet?.os_id : row.osId)
      setHeaderItemsValue(getHeaderItems(row, column.type))
    }
  },[isOpen])

  useEffect(() => {
    if(inputMaterial) {
      const newInput = {...inputMaterial}
      setLotList(toLotList(newInput))
      delete newInput.lotList
      let tmpInput = inputMaterialList.slice()
      tmpInput[selected.index] = inputMaterial
      setInputMaterialList(tmpInput)
    }
  }, [ inputMaterial ])

  const getInputMaterialList = async (key: string, os_id?: number | string) => {
    try{
      if(key){
        if(!row.identification) throw("작업지시서(지시고유번호)를 선택해주세요.")
        const pathVar = isOutsourcing ? [key] : { os_id: os_id, bom: 'bom', key: key, }
        //(!row.bom && isAIModal)
        //isOutsourcing  ? "bomLoad" :
        const res = await RequestMethod('get',  `sheetBomLoad`,{
          path: pathVar
        })
        if(
            res && res.length > 0
            // res && Object.keys(res).length === 0 && res.constructor === Object
        ){
          const inputMaterialList = toInputMaterialList(res)
          setInputMaterialList(inputMaterialList)
        } else {
          Notiflix.Report.warning("경고","작업지시서(지시고유번호)를 선택해주세요.","확인",() => {
                isOutsourcing && onRowChange({...row, bomChecked: true})
                setIsOpen(false)
              }
          )}
      }else throw(alertMsg.noBom)
    }catch (err) {
      Notiflix.Report.warning("경고",err,"확인",() => setIsOpen(false))
    }
  }

  const getBomLotMap = () => {
    const bomIdMap = new Map<string, any[]>()
    row.bom?.map((bom) => {
      const restoredLot = {...bom.lot, amount: new Big(bom.lot.amount).times(row?.originalCavity ?? 1).toNumber() }
      const bomObject = getBomObject(bom.bom)
      if(bomIdMap.has(bomObject.bomKey)){
        bomIdMap.get(bomObject.bomKey).push(restoredLot)
        bomIdMap.set(bomObject.bomKey, bomIdMap.get(bomObject.bomKey))
      } else {
        bomIdMap.set(bomObject.bomKey, [restoredLot])
      }
    })
    return bomIdMap
  }

  const toInputMaterialList = (sheetBom: any) => {
    //array
    const inputMaterialList = ParseResponse(sheetBom)
    const firstModify = !!!row.bom_info && isModify
    const bomIdAndLotMap = firstModify && getBomLotMap()
    const sumQuantity = isOutsourcing ? row.order_quantity ?? 0 : row.sum ?? 0
    return inputMaterialList.map((inputMaterial, index) => {
      const bom = getBomObject( inputMaterial)
      let bom_info, originalBom
      switch(bom.typeName){
        case 'rawMaterial':{
          if(!!row.bom_info) {
            bom_info = row.bom_info.filter(bom => bom[0].rmId === inputMaterial.childRmId)?.[0]
          } else if (firstModify)
          {
            bom_info = bomIdAndLotMap.get(`rm${inputMaterial.childRmId}`)?.map((lots) => ({...lots.child_lot_rm, amount: lots.amount}))
          }
          originalBom = row.originalBom ? row.originalBom.filter(bom => bom?.[0]?.rmId === inputMaterial.childRmId)?.[0] ?? bom_info : bom_info
          break;
        }
        case 'subMaterial':{
          if(!!row.bom_info) {
            bom_info = row.bom_info.filter(bom => bom[0].smId === inputMaterial.childSmId)?.[0]
          } else if (firstModify)
          {
            bom_info = bomIdAndLotMap.get(`sm${inputMaterial.childSmId}`)?.map((lots) => ({...lots.child_lot_sm, amount: lots.amount}))
          }
          originalBom = row.originalBom ? row.originalBom.filter(bom => bom?.[0]?.smId === inputMaterial.childSmId)?.[0] ?? bom_info : bom_info
          break;
        }
        case 'product':{
          const outsource = bom.detail.type > 2
          if(!!row.bom_info) {
            bom_info = row.bom_info.filter(bom => {
              const productId = outsource ? bom[0].product?.product_id : bom[0].operation_sheet?.productId
              return productId === inputMaterial.childProductId
            })?.[0]
          } else if (firstModify)
          {
            bom_info = bomIdAndLotMap.get(`p${inputMaterial.childProductId}`)?.map((lots) => (outsource ? {...lots.child_lot_outsourcing, amount: lots.amount} :{...lots.child_lot_record, amount: lots.amount}))
          }
          originalBom = row.originalBom ? row.originalBom.filter(bom => {
            const productId = outsource ? bom?.[0]?.product?.product_id : bom?.[0]?.operation_sheet?.productId
            return productId === inputMaterial.childProductId
          })?.[0] ?? bom_info : bom_info
          break;
        }
      }
      const totalAmount = sumQuantity == '0' ? new Big(0) : new Big(sumQuantity).div(cavity)
      const totalUsage = totalAmount.times(bom.usage)
      let stock = bom.detail?.stock ? new Big(bom.detail.stock) : new Big(0)
      const modifyAndNoStock = isModify && bom.detail.stock === 0
      const action = isModify && bom.detail.stock === 0 ? 'modifyAndNoStock' : column.action
      if(isModify)
      {
        const originalAmount = new Big(row.originalSum ?? row.sum).div(row?.originalCavity ?? 1).times(bom.usage)
        stock = stock.plus(originalAmount)
      }
      return {
        ...bom,
        ...bom.detail,
        seq: index + 1,
        type_name: TransferCodeToValue(bom.detail?.type, bom.typeName),
        product_type: bom.typeName === 'product' ? TransferCodeToValue(bom.detail?.type, 'productType') : '-',
        cavity,
        real_disturbance: totalUsage.toNumber(),
        disturbance: sumQuantity ?? 0,
        stock: stock.minus(totalUsage).toNumber(),
        // stock: bom.stock,
        process: bom?.detail?.process?.name ?? null,
        bom_info: bom_info ?? null,
        tab: bom.type,
        product: bom.typeName === 'product' ? {
          ...bom.detail,
        } : null,
        originalBom: originalBom ?? null,
        // originalStock : isModify ? row.originalQty ? new Big(row.originalQty).times(bom.usage).plus(bom.detail.stock).toNumber() : bom.detail.stock : bom.detail.stock,
        originalStock: stock.toNumber(),
        action,
        bom: modifyAndNoStock ? row.bom : isOutsourcing ? inputMaterial : null,
        page: 1,
        total: 1
      }
    })
  }

  const getBomKey = (type:0 | 1 | 2, lot:any) => {
    switch(type){
      case 0: return lot.lot_rm_id
      case 1: return lot.lot_sm_id
      case 2: return !isNil(lot.osId) ? lot.record_id : lot.osi_id
      default: return
    }
  }

  const toLotList = (input) => {
    const lotAmountChanged : boolean = input.lots
    const bomSaved: boolean = input.bom_info
    const bomSavedAndUnChanged: boolean = bomSaved && !lotAmountChanged
    const lotNumAndLotMap = new Map()
    const originalLotNumAndLotMap = new Map()
    input.originalBom && Array.isArray(input.originalBom) && input.originalBom.map((lot) => originalLotNumAndLotMap.set(getBomKey(input.tab, lot), lot))
    if(lotAmountChanged){
      input.lots.map((lot) => lotNumAndLotMap.set(getBomKey(input.tab, lot), lot))
    }
    if(bomSavedAndUnChanged){
      input.bom_info.map((lot) => lotNumAndLotMap.set(getBomKey(input.tab, lot), lot))
    }
    return input.lotList.map((lot,lotIdx) => {
      const lotAmount = lotNumAndLotMap.get(getBomKey(input.tab, lot))?.amount ?? "0"
      const originalAmount = originalLotNumAndLotMap.get(getBomKey(input.tab, lot))?.originalAmount ?? originalLotNumAndLotMap.get(getBomKey(input.tab, lot))?.amount ?? "0"
      const totalUsage = lotAmount === '0' ? new Big(0) : new Big(Number(lotAmount)).div(cavity).times(input.usage)
      const originalTotalUsage = originalAmount === '0' ? new Big(0) : new Big(originalAmount).div(row?.originalCavity ?? 1).times(input.usage)
      const actualCurrent = isModify && !isAIModal ? new Big(lot.current).plus(originalTotalUsage) : new Big(lot.current)
      const maxAmount = Math.floor(new Big(actualCurrent).div(input.usage).times(cavity).toNumber())
      return {
          ...lot,
          seq: lotIdx + 1,
          usage: input.usage,
          date: lot.date ?? moment(lot.osId ? lot.end : lot.import_date).format("YYYY-MM-DD"),
          warehousing: lot.warehousing ?? lot.good_quantity,
          amount: lotAmount,
          unit: input.unit,
          originalAmount,
          originalCurrent: Number(lot.current),
          actualCurrent: actualCurrent.toNumber(),
          current: new Big(actualCurrent).minus(totalUsage).toNumber(),
          isComplete: isModify ? lot.current !== 0 && lot.is_complete ? '사용완료' : '-' : lot.is_complete ? '사용완료' : '-' ,
          is_complete: isModify && lot.current === 0 && lot.is_complete ? false: lot.is_complete,
          maxAmount
        }
    })
  }

  const getHeaderItemValue = (headerItem) => {
    return headerItemsValue[headerItem.key] ?? '-'
  }

  const ModalContents = () => (
        <UploadButton onClick={() => {
          if(isOutsourcing && !!!row.product?.product_id){
            return Notiflix.Report.warning('경고', alertMsg.noProduct, '확인')
          }
          setIsOpen(true)
        }} hoverColor={POINT_COLOR} haveId status={column.modalType ? "modal" : "table"}>
          <p>{isAIModal ? row.good_quantity : '자재 보기'}</p>
        </UploadButton>
    )


  const onConfirm = () => {
    let bomToSave = []
    let disturbance = 0
    let quantity = 0
    const inputBomIdMap = new Map()
    const originalBom = row.originalBom ?? inputMaterialList.map((v) => {
      return v.bom_info
    }).filter(v => v)
    const bomList = isOutsourcing ? inputMaterialList.map(input => ({bom: input.bom})) :  isAIModal ? row.bom : row.input_bom
    bomList?.map((bom) => {
      const bomObject = getBomObject(bom.bom)
      inputBomIdMap.set(bomObject.bomKey, bom)
    })
    inputMaterialList.map((bom, index) => {
      let totalAmount = 0
      const bomInfo = bom.lots !== undefined ? bom.lots : bom.bom_info
      bomInfo?.map(lot => {
        if (Number(lot.amount)) {
          totalAmount += Number(lot.amount)
          const lotObjectKey = bom.tab === 0 ? 'child_lot_rm' : bom.tab === 1 ? 'child_lot_sm' : bom.type < 3 ? 'child_lot_record' : 'child_lot_outsourcing'
          bomToSave.push({
            ...inputBomIdMap.get(bom.bomKey),
            record_id: undefined,
            bom: {...bom, type:bom.tab},
            lot: {
              elapsed: lot.elapsed,
              type: bom.tab,
              [lotObjectKey]:{...lot, current: lot.originalCurrent ?? lot.current},
              warehousing: lot.warehousing,
              date: lot.date,
              current: lot.originalCurrent ?? lot.current,
              amount: lot.amount,
              version: lot?.version ?? undefined,
              actualCurrent: lot.actualCurrent ?? lot.current
            }
          })
        }})
      const defectTotal = lodash.sum(row.defect_reasons?.filter((reason) => !!reason.amount).map((reason)=> Number(reason.amount)))
      if(totalAmount < defectTotal) {
        Notiflix.Report.warning("생산량은 불량 수량보다 작을 수 없습니다.", "", "확인")
        disturbance += 1
      }
      if(totalAmount !== bom.disturbance){
        disturbance += 1
      }
      quantity = totalAmount
    })

    const disturbanceArray = inputMaterialList.map((v)=>v.disturbance)
    const allEqual = arr => arr.every( v => v === arr[0] )
    if(disturbance === 0){
      if(disturbanceArray.every((value) => value === 0)){
        Notiflix.Report.warning(`BOM의 LOT생산량을 입력해주세요.`, '', '확인')
      }else if(allEqual(disturbanceArray)){
        let bomLotInfo
        bomLotInfo = inputMaterialList.map((v) => {
          return v.lots ?? v.bom_info
        })
        const newRow = {
          ...row,
          bom: bomToSave,
          bom_info: bomLotInfo,
          originalBom: originalBom,
        }
        if(isOutsourcing){
          newRow['order_quantity'] = quantity
          newRow['bomChecked'] = true
          newRow['isChange'] = true
          newRow['originalSum'] = row.originalSum ?? row.order_quantity
        }else{
          newRow['quantity'] = quantity,
          newRow['good_quantity'] = quantity,
          newRow['count'] = quantity,
          newRow['originalSum'] = row.originalSum ?? row.sum
        }
        onRowChange(newRow)
        setIsOpen(false)
        setLotList([])
      }else {
        Notiflix.Report.warning(`각 BOM의 생산량을 일치시켜 주세요.`, '', '확인')
      }
    }else{
      Notiflix.Report.warning(`소요량과 생산량 합계를 일치시켜 주세요`, '', '확인')
    }

  }


  const ModalButtons = () => {
    return <div style={{ height: 56, display: 'flex', alignItems: 'flex-end'}}>
      <div
        onClick={onCancelEvent}
        style={{width: '50%', height: 40, backgroundColor: '#E7E9EB', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <p>취소</p>
      </div>
      <div
        onClick={onConfirm}
        style={{width: "50%", height: 40, backgroundColor: POINT_COLOR, display: 'flex', justifyContent: 'center', alignItems: 'center'}}
      >
        <p>{'선택 완료'}</p>
      </div>
    </div>
  }

  const onCancelEvent = () => {
    setLotList([])
    setSelected({
      index: null,
      product: '',
      type: '',
      productType: '',
    })
    setInputMaterialList([])
    setIsOpen(false)
  }

  const isProduct = ['반제품', '재공품', '완제품'].includes(selected.type)
  const isOutsource = selected.productType === '외주품'

  const LotListColumns = () => {
    const defaultColumns = isProduct ? isOutsource ? searchModalList.OutsourceLotReadonlyInfo : searchModalList.ProductLotReadonlyInfo : searchModalList.InputLotReadonlyInfo
    const extraCols:any[] = [{key: 'maxAmount', name: '최대 생산가능수량', formatter: UnitContainer, textAlign: 'center', unitData:'EA', placeholder: "0", textType:"Modal"}]
    isModify && extraCols.push({ key: 'isComplete', name: '사용완료 상태', formatter: LineBorderContainer, textAlign: 'center'})
    return defaultColumns?.map(column =>
      column.key === 'amount' ?
        {...column, name: isOutsourcing ? '발주량' : column.name, editor: TextEditor, textType: 'Modal', placeholder: '생산량 입력', inputType:'number', disabledCase: isModify ? [{key:'is_complete', value: true}] : []}
       : column).concat(extraCols)
  }

  return (
      <SearchModalWrapper >
        { ModalContents() }
        <Modal isOpen={isOpen} style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            padding: 0
          },
          overlay: {
            background: 'rgba(0,0,0,.6)',
            zIndex: 5
          }
        }}>
          <div style={{
            width: 1776,
            height: 800
          }}>
            <div style={{
              margin: '24px 16px 16px',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <p style={{
                color: 'black',
                fontSize: 22,
                fontWeight: 'bold',
                margin: 0,
              }}>투입 자재 정보 (해당 제품을 만드는 데 사용할 자재는 아래와 같습니다)</p>
              <div style={{display: 'flex'}}>

                <div style={{cursor: 'pointer', marginLeft: 20}} onClick={onCancelEvent}>
                  <img style={{width: 20, height: 20}} src={IcX}/>
                </div>
              </div>
            </div>
            {
              InputModalHeaderItems(column.type).map((infos, index) => {
                return (
                    <HeaderTable>
                      {
                        infos.map(info => {
                          return (
                              <>
                                <HeaderTableTitle>
                                  <HeaderTableText style={{fontWeight: 'bold'}}>{info.title}</HeaderTableText>
                                </HeaderTableTitle>
                                <HeaderTableTextInput style={{width: info.infoWidth}}>
                                  <Tooltip placement={'rightTop'}
                                           overlay={
                                             <div style={{fontWeight : 'bold'}}>
                                               {getHeaderItemValue(info)}
                                             </div>
                                           } arrowContent={<div className="rc-tooltip-arrow-inner"></div>}>
                                    <HeaderTableText>{getHeaderItemValue(info)}</HeaderTableText>
                                  </Tooltip>
                                  {info.unit && <div style={{marginRight:8, fontSize: 15}}>{info.unit}</div>}
                                </HeaderTableTextInput>
                              </>
                          )
                        })
                      }
                    </HeaderTable>
                )
              })
            }
            <div style={{display: 'flex', justifyContent: 'space-between', height: 64}}>
              <div style={{height: '100%', display: 'flex', alignItems: 'flex-end', paddingLeft: 16,}}>
                <div style={{ display: 'flex', width: 1200}}>
                  <p style={{fontSize: 22, padding: 0, margin: 0}}>투입 자재 리스트</p>
                </div>
              </div>
              <div style={{display: 'flex', justifyContent: 'flex-end', margin: '24px 48px 8px 0'}}>

              </div>
            </div>
            <div style={{padding: '0 16px', width: 1776}}>
              <ExcelTable
                  headerList={InputListHeaders(isOutsourcing, false)}
                  row={inputMaterialList ?? [{}]}
                  setRow={(inputMaterials, idx) => {
                    let tmp = inputMaterials.map((input, inputIdx) => {
                      if(input.lotList && idx === inputIdx ){
                        setSelected({index: idx, type: input.type_name, product: input.code, productType: input.product_type})
                        const rowLotList = toLotList(input)
                        setLotList(rowLotList)
                      }
                      delete input.lotList
                      return input
                    })
                    setInputMaterialList(tmp)
                  }}
                  width={1746}
                  rowHeight={32}
                  height={288}
                  onRowClick={(clicked) => {const e = inputMaterialList.indexOf(clicked)
                    const tmpInputMaterialList = inputMaterialList.slice()
                    tmpInputMaterialList[e] = {
                      ...tmpInputMaterialList[e],
                      page: 1,
                      total: 1
                    }
                    setInputMaterialList(tmpInputMaterialList)
                  }}
                  type={'searchModal'}
                  headerAlign={'center'}
              />
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', height: 64}}>
              <div style={{height: '100%', display: 'flex', alignItems: 'flex-end', paddingLeft: 16,}}>
                <div style={{ display: 'flex', width: 1200}}>
                  <p style={{fontSize: 22, padding: 0, margin: 0}}> LOT 리스트 ({selected.product}) </p>
                  {
                    isModify && selected.type === '원자재' &&
                    <p style={{color: 'red',fontSize: 13, paddingLeft: 20, paddingTop:5, margin:0}}> *사용완료 처리된 원자재는 수정할 수 없습니다. </p>
                  }
                </div>
              </div>
              <div style={{display: 'flex', justifyContent: 'flex-end', margin: '24px 48px 8px 0'}}>

              </div>
            </div>
            <div style={{padding: '0 16px', width: 1776}}>
              <ExcelTable
                  headerList={LotListColumns()}
                  row={lotList ?? []}
                  setRow={(lots) => {
                    try{
                      let newInputMaterialList = inputMaterialList.slice()
                      let sumOfTotalUsage = 0, sumOfAmount = 0
                      const newLotList = lots.map(lot => {
                        let actualCurrent = new Big(lot.actualCurrent)
                        let current = actualCurrent
                        // let current = new Big(lot.originalCurrent)
                        // const originalTotalUsage = new Big(lot.originalAmount).div(row.originalCavity).times(lot.usage)
                        if(!!lot.amount)
                        {
                          if(!Number.isInteger(Number(lot.amount))) throw(alertMsg.onlyInteger)
                          const totalUsage = new Big(lot.amount).div(cavity).times(lot.usage)
                          if(actualCurrent.lt(totalUsage)) throw(alertMsg.overStock)
                          sumOfTotalUsage += totalUsage.toNumber()
                          sumOfAmount += Number(lot.amount)
                          current = current.minus(totalUsage)
                        }
                        return {
                          ...lot,
                          current: current.toNumber(),
                          actualCurrent: actualCurrent.toNumber()
                        }
                      })
                      const originalAllAmount = isModify ? lodash.sum(inputMaterialList[selected.index]?.originalBom?.map(lot => Number(lot.amount))) : null
                      const originalTotalUsage = isModify ? new Big(originalAllAmount).div(cavity).times(inputMaterialList[selected.index].usage) : null
                      const totalUsage = new Big(sumOfAmount).div(cavity).times(inputMaterialList[selected.index].usage)
                      newInputMaterialList[selected.index] = {
                        ...newInputMaterialList[selected.index],
                        disturbance: sumOfAmount,
                        real_disturbance: sumOfTotalUsage,
                        stock: new Big(newInputMaterialList[selected.index].originalStock).minus(sumOfTotalUsage).toNumber(),
                        lots: newLotList,
                      }
                      setInputMaterialList(newInputMaterialList)
                      setLotList(newLotList)
                    }catch (errMsg) {
                      console.log(errMsg)
                      Notiflix.Report.warning("경고", errMsg, "확인")
                    }
                  }}
                  width={1746}
                  rowHeight={32}
                  height={192}
                  type={'searchModal'}
                  headerAlign={'center'}
                  scrollEnd={(value) => {
                    if(value){
                      if(inputMaterialList[selected.index].total > inputMaterialList[selected.index].page){
                        if(selected.index >= 0) {
                          let selectedMaterial = inputMaterialList[selected.index]
                          selectedMaterial.loadMaterialLot(selectedMaterial.tab, selectedMaterial.page+1, selectedMaterial.action, selectedMaterial, setInputMaterial)
                        }
                      }
                    }
                  }}
              />
            </div>
            {
              ModalButtons()
            }
          </div>
        </Modal>
      </SearchModalWrapper>
  )
}

const SearchModalWrapper = styled.div`
  width: 100%;
  height:100%;
  display: flex;
  justify-content:center;
  align-items:center;
`

const HeaderTable = styled.div`
  width: 1744px;
  height: 32px;
  margin: 0 16px;
  background-color: #F4F6FA;
  border: 0.5px solid #B3B3B3;
  display: flex
`

const HeaderTableTextInput = styled.div`
  background-color: #ffffff;
  padding-left: 3px;
  height: 27px;
  border: 0.5px solid #B3B3B3;
  margin-top:2px;
  margin-right: 70px;
  display: flex;
  align-items: center;
`

const HeaderTableText = styled.p`
  margin: 0;
  font-size: 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const HeaderTableTitle = styled.div`
  width: 99px;
  padding: 0 8px;
  display: flex;
  align-items: center;
`

export {InputMaterialListModal}
