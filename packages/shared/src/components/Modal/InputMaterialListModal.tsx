import React, {useEffect, useRef, useState} from 'react'
import {IExcelHeaderType} from '../../common/@types/type'
import styled from 'styled-components'
import Modal from 'react-modal'
import {POINT_COLOR} from '../../common/configset'
//@ts-ignore
import IcSearchButton from '../../../public/images/ic_search.png'
//@ts-ignore
import IcX from '../../../public/images/ic_x.png'
import {ExcelTable} from '../Excel/ExcelTable'
import {searchModalList} from '../../common/modalInit'
//@ts-ignore
import Search_icon from '../../../public/images/btn_search.png'
import {RequestMethod} from '../../common/RequestFunctions'
import Notiflix from 'notiflix'
import {TransferCodeToValue} from '../../common/TransferFunction'
import moment from "moment"
import lodash from 'lodash'
import Big from 'big.js'
import { getBomObject, ParseResponse } from '../../common/Util'
import {UploadButton} from "../../styles/styledComponents";
import { LineBorderContainer } from '../Formatter/LineBorderContainer'
import { TextEditor } from '../InputBox/ExcelBasicInputBox'

interface IProps {
  column: IExcelHeaderType
  row: any
  onRowChange: (e: any) => void
}

//작업일보 등록/수정 투입 자재 모달
const headerItems: {title: string, infoWidth: number, key: string, unit?: string}[][] = [
  [
    {title: '지시 고유번호', infoWidth: 144, key: 'identification'},
    {title: 'LOT 번호', infoWidth: 144, key: 'lot_number'},
    {title: '거래처', infoWidth: 144, key: 'customer'},
    {title: '모델', infoWidth: 144, key: 'model'},
  ],
  [
    {title: 'CODE', infoWidth: 144, key: 'code'},
    {title: '품명', infoWidth: 144, key: 'name'},
    {title: '품목 종류', infoWidth: 144, key: 'type'},
    {title: '생산 공정', infoWidth: 144, key: 'process'},
  ],
  [
    {title: '단위', infoWidth: 144, key: 'unit'},
    {title: '목표 생산량', infoWidth: 144, key: 'goal'},
    {title: '작업자', infoWidth: 144, key: 'worker_name'},
    {title: '양품 수량', infoWidth: 144, key: 'good_quantity'},
    {title: '불량 수량', infoWidth: 144, key: 'poor_quantity'},
  ],
]



const InputMaterialListModal = ({column, row, onRowChange}: IProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [headerItemsValue, setHeaderItemsValue] = useState<any>({})
  const [selected, setSelected] = useState<{index: number | null, product:string, type:string}>({
    index: null,
    product: '',
    type: ''
  })
  const [inputMaterialList, setInputMaterialList] = useState<any[]>([])
  const [lotList, setLotList] = useState<any[]>([])
  const [inputMaterial, setInputMaterial] = useState<any>()
  const isModify = column.action === 'modify'

  console.log(inputMaterialList)
  useEffect(() => {
    if(isOpen){
      getInputMaterialList(row.osId, row.bom_root_id)
      setHeaderItemsValue({
        identification: row.identification,
        lot_number: row.lot_number ?? '-',
        customer: row.product?.customer?.name,
        model: row.product?.model?.model,
        code: row.product?.code,
        name: row.product?.name,
        type: Number(row.product?.type) >= 0 ? TransferCodeToValue(row.product.type, 'productType') : "-",
        process: row.product?.process?.name,
        unit: row.product?.unit,
        goal: row.goal,
        worker_name: row?.worker?.name ?? row?.worker ?? '-',
        good_quantity: row.good_quantity ?? 0,
        poor_quantity: row.poor_quantity ?? 0,
      })
    }
  },[isOpen])

  useEffect(() => {
    if(inputMaterial) {
      setLotList(toLotList(inputMaterial))
      delete inputMaterial.lotList
      let tmpInput = inputMaterialList
      tmpInput[selected.index] = inputMaterial
      setInputMaterialList(tmpInput)
    }
  }, [ inputMaterial ])

  const getInputMaterialList = async (os_id: number | string, key: string) => {
    const res = await RequestMethod('get', `sheetBomLoad`,{
      path: {
        os_id: os_id,
        bom: 'bom',
        key: key,
      },
    })

    if(res){
      const inputMaterialList = toInputMaterialList(res)
      setInputMaterialList(inputMaterialList)
    }
  }

  const getBomLotMap = () => {
    const bomIdMap = new Map<string, any[]>()
    row.bom?.map((bom) => {
      const bomObject = getBomObject(bom.bom)
      if(bomIdMap.has(bomObject.bomKey)){
        bomIdMap.get(bomObject.bomKey).push(bom.lot)
        bomIdMap.set(bomObject.bomKey, bomIdMap.get(bomObject.bomKey))
      } else {
        bomIdMap.set(bomObject.bomKey, [bom.lot])
      }
    })
    return bomIdMap
  }

  const toInputMaterialList = (sheetBom: any) => {
    const inputMaterialList = ParseResponse(sheetBom)
    const sumQuantity = row.sum
    const firstModify = !!!row.bom_info && isModify
    const bomIdAndLotMap = firstModify && getBomLotMap()
    return inputMaterialList.map((inputMaterial, index) => {
      const bom = getBomObject(inputMaterial)
      let bom_info, originalBom
      switch(bom.typeName){
        case 'rawmaterial':{
          if(!!row.bom_info) {
            bom_info = row.bom_info.filter(bom => bom[0].rmId === inputMaterial.childRmId)?.[0]
          } else if (firstModify)
          {
            bom_info = bomIdAndLotMap.get(`rm${inputMaterial.childRmId}`)?.map((lots) => ({...lots.child_lot_rm, amount: lots.amount}))
          }
          originalBom = row.originalBom ? row.originalBom.filter(bom => bom[0].rmId === inputMaterial.childRmId)?.[0] : bom_info
          break;
        }
        case 'submaterial':{
          if(!!row.bom_info) {
            bom_info = row.bom_info.filter(bom => bom[0].smId === inputMaterial.childSmId)?.[0]
          } else if (firstModify)
          {
            bom_info = bomIdAndLotMap.get(`sm${inputMaterial.childSmId}`)?.map((lots) => ({...lots.child_lot_sm, amount: lots.amount}))
          }
          originalBom = row.originalBom ? row.originalBom.filter(bom => bom[0].smId === inputMaterial.childSmId)?.[0] : bom_info
          break;
        }
        case 'product':{
          if(!!row.bom_info) {
            bom_info = row.bom_info.filter(bom => bom[0].operation_sheet?.productId === inputMaterial.childProductId)?.[0]
          } else if (firstModify)
          {
            bom_info = bomIdAndLotMap.get(`p${inputMaterial.childProductId}`)?.map((lots) => ({...lots.child_lot_record, amount: lots.amount}))
          }
          originalBom = row.originalBom ? row.originalBom.filter(bom => bom[0].operation_sheet?.productId === inputMaterial.childProductId)?.[0] : bom_info
          break;
        }
      }

      const modifyAndNoStock = isModify && bom.detail.stock === 0
      const typeName = TransferCodeToValue(bom.detail?.type, bom.typeName)
      const totalUsage = new Big(sumQuantity).times(bom.usage).toNumber()
      return {
        ...bom,
        ...bom.detail,
        seq: index+1,
        type_name: typeName,
        bom_info: bom_info ?? null,
        tab: bom.type,
        process: bom.detail.process ? bom.detail.process.name : null,
        product: bom.typeName === 'product' ?{
          ...bom.detail,
        }: null,
        disturbance: sumQuantity ?? 0,
        real_disturbance: isNaN(totalUsage) ? 0 : totalUsage,
        originalBom : originalBom ?? null,
        originalStock : isModify ? row.originalQty ? new Big(row.originalQty).times(bom.usage).plus(bom.detail.stock).toNumber() : bom.detail.stock : bom.detail.stock,
        stock : isModify ? row.originalQty ? new Big(row.originalQty).times(bom.usage).plus(bom.detail.stock).minus(totalUsage).toNumber() : bom.detail.stock : new Big(bom.detail.stock).minus(totalUsage).toNumber(),
        action : modifyAndNoStock ? 'modifyAndNoStock' : column.action,
        bom: modifyAndNoStock ? row.bom : null,
        page: 1,
        total: 1
      }
    })
  }

  const toLotList = (input) => {
    const lotAmountChanged : boolean = input.lots
    const bomSaved: boolean = input.bom_info
    const bomSavedAndUnChanged: boolean = bomSaved && !lotAmountChanged
    const lotNumAndLotMap = new Map()
    const originalLotNumAndLotMap = new Map()
    input.originalBom && input.originalBom.map((lot) => originalLotNumAndLotMap.set(lot.lot_number, lot))
    if(lotAmountChanged){
      input.lots.map((lot) => lotNumAndLotMap.set(lot.lot_number, lot))
    }
    if(bomSavedAndUnChanged){
      input.bom_info.map((lot) => lotNumAndLotMap.set(lot.lot_number, lot))
    }
    return input.lotList.map((lot,lotIdx) => {
      const lotAmount = lotNumAndLotMap.get(lot.lot_number)?.amount ?? "0"
      const originalAmount = originalLotNumAndLotMap.get(lot.lot_number)?.amount ?? "0"
      const totalUsage = new Big(Number(lotAmount)).times(input.usage)
      const originalTotalUsage = new Big(Number(originalAmount)).times(input.usage)
      return bomSavedAndUnChanged ? {
          ...lot,
          seq: lotIdx + 1,
          usage: input.usage,
          date: lot.date ?? moment(lot.end).format("YYYY-MM-DD"),
          warehousing: lot.warehousing ?? lot.good_quantity,
          amount: lotAmount,
          originalAmount: originalAmount,
          originalCurrent: Number(lot.current),
          current: isModify? new Big(Number(lot.current)).plus(originalTotalUsage).minus(totalUsage).toNumber() : new Big(Number(lot.current)).minus(totalUsage).toNumber(),
          isComplete: lot.is_complete ? '사용완료' : '-'
        }
        : {
          ...lot,
          seq: lotIdx + 1,
          usage: input.usage,
          date: lot.date ?? moment(lot.end).format("YYYY-MM-DD"),
          warehousing: lot.warehousing ?? lot.good_quantity,
          amount: lotAmount,
          originalAmount: originalAmount,
          originalCurrent: Number(lot.current),
          current: isModify ? new Big(Number(lot.current)).plus(originalTotalUsage).minus(totalUsage).toNumber() : new Big(Number(lot.current)).minus(totalUsage).toNumber(),
          isComplete: lot.is_complete ? '사용완료' : '-'
        }
    })
  }

  const getHeaderItemValue = (headerItem) => {
    return headerItemsValue[headerItem.key] ?? '-'
  }

  const ModalContents = () => (
        <UploadButton onClick={() => {
          setIsOpen(true)
        }} hoverColor={POINT_COLOR} haveId status={column.modalType ? "modal" : "table"}>
          <p>자재 보기</p>
        </UploadButton>
    )

  const ModalButtons = () => {
    return <div style={{ height: 56, display: 'flex', alignItems: 'flex-end'}}>
      {
        column.type !== 'readonly' && <div
              onClick={onCancelEvent}
              style={{width: '50%', height: 40, backgroundColor: '#E7E9EB', display: 'flex', justifyContent: 'center', alignItems: 'center'}}
          >
            <p>취소</p>
          </div>
      }
      <div
        onClick={() =>{
          if(column.type === 'readonly'){
            setIsOpen(false)
          }else{
            let bomToSave = []
            let disturbance = 0
            let quantity = 0
            const inputBomIdMap = new Map()
            const originalBom = row.originalBom ?? inputMaterialList.map((v) => {
              return v.bom_info
            })
            row.input_bom?.map((bom) => {
              let bomObject = getBomObject(bom.bom)
              inputBomIdMap.set(bomObject.bomKey, bom)
            })
            inputMaterialList.map((bom, index) => {
              let totalAmount = 0
              if(bom.lots !== undefined) {
                bom.lots?.map(lot => {
                  if (Number(lot.amount)) {
                    totalAmount += Number(lot.amount)
                    bomToSave.push({
                      ...inputBomIdMap.get(bom.bomKey),
                      record_id: undefined,
                      lot: {
                        elapsed: lot.elapsed,
                        type: bom.tab,
                        child_lot_rm: bom.tab === 0 ? {...lot} : null,
                        child_lot_sm: bom.tab === 1 ? {...lot} : null,
                        child_lot_record: bom.tab === 2 ? {...lot} : null,
                        warehousing: lot.warehousing,
                        date: lot.date,
                        current: lot.originalCurrent,
                        amount: new Big(lot.amount).times(bom.usage).toNumber() > lot.originalCurrent ? 0 : lot.amount,
                        version: lot?.version ?? undefined
                      }
                    })
                  }
                })
              }
              else {
                bom.bom_info?.map(lot => {
                  if (Number(lot.amount)) {
                    totalAmount += Number(lot.amount)

                    bomToSave.push({
                      ...inputBomIdMap.get(bom.bomKey),
                      record_id: undefined,
                      lot: {
                        elapsed: lot.elapsed,
                        type: bom.tab,
                        child_lot_rm: bom.tab === 0 ? {...lot} : null,
                        child_lot_sm: bom.tab === 1 ? {...lot} : null,
                        child_lot_record: bom.tab === 2 ? {...lot} : null,
                        warehousing: lot.warehousing,
                        date: lot.date,
                        current: lot.originalCurrent,
                        amount: lot.amount,
                        version: lot?.version ?? undefined
                      }
                    })
                  }
                })
              }
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
                if(inputMaterialList.map((v)=> {return v.lots}).filter(v=>v).length === 0){
                  bomLotInfo = inputMaterialList.map((v) => {
                    return v.bom_info
                  })
                }else {
                  bomLotInfo = inputMaterialList.map((v) => {
                    return v.lots
                  })
                }
                onRowChange({
                  ...row,
                  bom: bomToSave,
                  bom_info: bomLotInfo,
                  quantity: quantity,
                  good_quantity: quantity,
                  originalQty : row.originalQty ?? row.sum,
                  originalBom: originalBom,
                })
                setIsOpen(false)
                setLotList([])
              }else {
                Notiflix.Report.warning(`각 BOM의 생산량을 일치시켜 주세요.`, '', '확인')
              }
            }else{
              Notiflix.Report.warning(`소요량과 생산량 합계를 일치시켜 주세요`, '', '확인')
            }

          }
        }}
        style={{width: column.type !== 'readonly' ? "50%" : '100%', height: 40, backgroundColor: POINT_COLOR, display: 'flex', justifyContent: 'center', alignItems: 'center'}}
      >
        <p>{column.type !== 'readonly' ? '선택 완료' : '확인'}</p>
      </div>
    </div>
  }

  const onCancelEvent = () => {
    setLotList([])
    setSelected({
      index: null,
      product: '',
      type: ''
    })
    setInputMaterialList([])
    setIsOpen(false)
  }

  const isProduct = selected.type === '반제품' || selected.type === '재공품' || selected.type === '완제품'

  const LotListColumns = () => {
    const defaultColumns = isProduct ? searchModalList.ProductLotReadonlyInfo : searchModalList.InputLotReadonlyInfo
    return column.type === 'readonly' ? defaultColumns
        : isModify? defaultColumns?.map(column =>
            column.key === 'amount'?
            {...column, editor: TextEditor, textType: 'Modal', placeholder: '생산량 입력', type:'number', disabledCase: [{key:'is_complete', value: true}]}
            : column).concat({key: 'isComplete', name: '사용완료 상태', formatter: LineBorderContainer, textAlign: 'center'},)
        : defaultColumns?.map(column =>
            column.key === 'amount'?
          {...column, editor: TextEditor, textType: 'Modal', placeholder: '생산량 입력', type:'number'}
          : column)
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
              }}>투입 자재 정보 (해당 제품을 만드는데 사용할 자재는 아래와 같습니다)</p>
              <div style={{display: 'flex'}}>

                <div style={{cursor: 'pointer', marginLeft: 20}} onClick={onCancelEvent}>
                  <img style={{width: 20, height: 20}} src={IcX}/>
                </div>
              </div>
            </div>
            {
              headerItems && headerItems.map((infos, index) => {
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
                                  <HeaderTableText>
                                    {getHeaderItemValue(info)}
                                  </HeaderTableText>
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
                  headerList={column.type === 'readonly' ? searchModalList.InputListReadonly : searchModalList.InputList}
                  row={inputMaterialList ?? [{}]}
                  setRow={(inputMaterials) => {
                    let tmp = inputMaterials.map((input, inputIdx) => {
                      if(input.lotList && selected.index === inputIdx ){
                        setSelected({...selected, type: input.type_name, product: input.code})
                        setLotList(toLotList(input))
                      }
                      delete input.lotList
                      return input
                    })
                    setInputMaterialList([...tmp])
                  }}
                  width={1746}
                  rowHeight={32}
                  height={288}
                  setSelectRow={(e) => {
                    const tmpInputMaterialList = inputMaterialList
                    tmpInputMaterialList[selected.index] = {
                      ...tmpInputMaterialList[selected.index],
                      page: 1,
                      total: 1
                    }
                    setInputMaterialList(tmpInputMaterialList)
                    setSelected({
                      ...selected,
                      index: e
                    })
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
                    const isUsageOverStock = lots.some(lot => {
                      if(!!lot.amount && new Big(lot.originalCurrent).plus(new Big(lot.originalAmount).times(lot.usage)).toNumber() < new Big(lot.amount).times(lot.usage).toNumber()) {
                        Notiflix.Report.warning("경고", "LOT 재고량 보다 소요량이 많습니다.", "확인")
                        return true
                      }
                      return false
                    })
                    if(!isUsageOverStock) {
                      const newLotList = lots.map((lot) => {
                        return {
                          ...lot,
                          current: !!lot.amount ? isModify ? new Big(lot.originalCurrent).plus(new Big(Number(lot.originalAmount)).times(lot.usage)).minus(new Big(Number(lot.amount)).times(lot.usage)).toNumber()
                            : new Big(lot.originalCurrent).minus(new Big(Number(lot.amount)).times(lot.usage)).toNumber() : lot.originalCurrent,
                        }
                      })
                      const allAmount = lodash.sum(lots.map(lot => Number(lot.amount)).filter(lotAmount => lotAmount))
                      const originalAllAmount = isModify ? lodash.sum(inputMaterialList[selected.index]?.originalBom?.map(lot => Number(lot.amount))) : null
                      const originalTotalUsage = isModify ? new Big(originalAllAmount).times(inputMaterialList[selected.index].usage) : null
                      const totalUsage = new Big(allAmount).times(inputMaterialList[selected.index].usage)
                      let newInputMaterialList = inputMaterialList.slice()
                      newInputMaterialList[selected.index] = {
                        ...newInputMaterialList[selected.index],
                        disturbance: allAmount,
                        real_disturbance: totalUsage.toNumber(),
                        stock: isModify ? new Big(newInputMaterialList[selected.index].originalStock).plus(originalTotalUsage).minus(totalUsage).toNumber() : new Big(newInputMaterialList[selected.index].originalStock).minus(totalUsage).toNumber(),
                        lots: newLotList,
                      }
                      setInputMaterialList(newInputMaterialList)
                      setLotList(newLotList)
                    }}}
                  width={1746}
                  rowHeight={32}
                  height={192}
                  type={'searchModal'}
                  headerAlign={'center'}
                  scrollEnd={(value) => {
                    if(value){
                      if(inputMaterialList[selected.index].total > inputMaterialList[selected.index].page){
                        if(selected.index >= 0) {
                          const tmpInputMaterialList = inputMaterialList
                          let selectedMaterial = tmpInputMaterialList[selected.index]
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
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

const HeaderTableTitle = styled.div`
  width: 99px;
  padding: 0 8px;
  display: flex;
  align-items: center;
`

export {InputMaterialListModal}
