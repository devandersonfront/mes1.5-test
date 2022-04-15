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
import { getBomObject, getUsageType, ParseResponse } from '../../common/Util'
import {UploadButton} from "../../styles/styledComponents";

interface IProps {
  column: IExcelHeaderType
  row: any
  onRowChange: (e: any) => void
}

//작업일보 등록 투입 자재 모달
const headerWorkItems: {title: string, infoWidth: number, key: string, unit?: string}[][] = [
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
  const [summaryData, setSummaryData] = useState<any>({})
  const [selectRow, setSelectRow] = useState<number>()
  const [searchList, setSearchList] = useState<any[]>([])
  const [lotList, setLotList] = useState<any[]>([])
  const [selectProduct, setSelectProduct] = useState<string>('')
  const [selectType, setSelectType] = useState<string>('')
  const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
    page: 1,
    total: 1
  })

  const isModify = column.action === 'modify'

  useEffect(() => {
    if(isOpen && row.modify){
      modifyLoadRecordGroup(row.osId, row.bom_root_id)
      setSummaryData({
        // ...res.parent
        identification: row.identification,
        lot_number: row.lot_number ?? '-',
        customer: row.product?.customer?.name,
        model: row.product?.model?.model,
        code: row.product?.code,
        name: row.product?.name,
        process: row.product?.process?.name,
        type: Number(row.product?.type) >= 0 ? TransferCodeToValue(row.product.type, 'productType') : "-",
        unit: row.product?.unit,
        goal: row.goal,
        worker_name: row?.worker?.name ?? row?.worker ?? '-',
        good_quantity: row.good_quantity ?? 0,
        poor_quantity: row.poor_quantity ?? 0,
      })
    }
  },[isOpen])

  const modifyLoadRecordGroup = async (os_id: number | string, key: string) => {
    // Notiflix.Loading.circle()
    const res = await RequestMethod('get', `sheetBomLoad`,{
      path: {
        os_id: os_id,
        bom: 'bom',
        key: key,
      },
    })

    if(res){
      let tmpSearchList = changeRow(res,row)
      setSearchList([...tmpSearchList])
    }
  }

  const getBomLotMap = () => {
    const bomIdMap = new Map<string, any[]>()
    row.bom?.map((bom) => {
      const bomObject = getBomObject(bom.bom)
      let bomLotList = []
      if(bomIdMap.has(bomObject.bomKey)){
        bomIdMap.get(bomObject.bomKey).push(bom.lot)
        bomIdMap.set(bomObject.bomKey, bomIdMap.get(bomObject.bomKey))
      } else {
        bomLotList.push(bom.lot)
        bomIdMap.set(bomObject.bomKey, bomLotList)
      }
    })
    return bomIdMap
  }

  const changeRow = (tmpRow: any, parent?:any) => {
    let tmpData = []
    let totalBom = row.bom_info ?? []
    const sumQuantity = row.sum
    const bomIdAndLotMap = getBomLotMap()
    const bomList = ParseResponse(tmpRow)
    tmpData = bomList.map((v, i) => {
      const bomObject = getBomObject(v)
      switch(bomObject.typeName){
        case 'rawmaterial':{
          isModify && totalBom.push(bomIdAndLotMap.get(`rm${v.childRmId}`)?.map((lots) => ({...lots.child_lot_rm, amount: lots.amount})))
          break;
        }
        case 'submaterial':{
          isModify && totalBom.push(bomIdAndLotMap.get(`sm${v.childSmId}`)?.map((lots) => ({...lots.child_lot_sm, amount: lots.amount})))
          break;
        }
        case 'product':{
          isModify && totalBom.push(bomIdAndLotMap.get(`p${v.childProductId}`)?.map((lots) => ({...lots.child_lot_record, amount: lots.amount})))
          break;
        }
      }

      const modifyAndNoStock = isModify && bomObject.object.stock === 0
      const detailedType = TransferCodeToValue(bomObject.object?.type, bomObject.typeName)
      const totalUsage = new Big(sumQuantity).times(bomObject.usage).toNumber()
      return {
        ...bomObject,
        ...bomObject.object,
        ...pageInfo,
        bom_info: totalBom !== undefined ? totalBom[i] : null,
        seq: i+1,
        tab: bomObject.type,
        type_name: detailedType,
        process: bomObject.object.process ? bomObject.object.process.name : null,
        product: bomObject.typeName === 'product' ?{
          ...bomObject.object,
        }: null,
        setting: getUsageType(v.setting),
        disturbance: sumQuantity ?? 0,
        real_disturbance: isNaN(sumQuantity * v.usage) ? 0 : totalUsage,
        stock : modifyAndNoStock ? totalUsage : isModify ? new Big(bomObject.object.stock).plus(totalUsage).toNumber() : bomObject.object.stock,
        action : modifyAndNoStock ? 'modifyAndNoStock' : column.action,
        bom: modifyAndNoStock ? row.bom : null,
      }
    })
    return tmpData
  }
  //
  // React.useEffect(()=>{
  // },[searchList])
  const getSummaryInfo = (info) => {
    return summaryData[info.key] ?? '-'
  }

  const ModalContents = () => (
        <UploadButton onClick={() => {
          setIsOpen(true)
        }} hoverColor={POINT_COLOR} haveId status={column.modalType ? "modal" : "table"}>
          <p>자재 보기</p>
        </UploadButton>
    )

  const onCancelEvent = () => {
    setLotList([])
    setSelectRow(undefined)
    setSelectProduct(undefined)
    setSelectType(undefined)
    setSearchList([])
    setPageInfo({page:1, total:1})
    setIsOpen(false)
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
              headerWorkItems && headerWorkItems.map((infos, index) => {
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
                                    {getSummaryInfo(info)}
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
                  row={searchList ?? [{}]}
                  setRow={(e) => {
                    let tmp = e.map((input, inputIdx) => {
                      if(input.lotList){
                        const lotAmountChanged : boolean = input.lots
                        const bomSaved: boolean = input.bom_info
                        const lotSavedAndUnChanged: boolean = bomSaved && !lotAmountChanged
                        const lotNumAndLotMap = new Map()
                        if(lotAmountChanged){
                          input.lots.map((lot) => lotNumAndLotMap.set(lot.lot_number, lot))
                        }
                        if(lotSavedAndUnChanged){
                          input.bom_info.map((lot) => lotNumAndLotMap.set(lot.lot_number, lot))
                        }
                        setSelectType(input.type_name)
                        setSelectProduct(input.code)
                        setLotList([...input.lotList.map((lot,lotIdx) => {
                          const lotAmount = lotNumAndLotMap.get(lot.lot_number)?.amount ?? "0"
                          return lotSavedAndUnChanged ? {
                              ...lot,
                              usage: input.usage,
                              date: lot.date ?? moment(lot.end).format("YYYY-MM-DD"),
                              warehousing: lot.warehousing ?? lot.good_quantity,
                              // amount: lot.lot_number === row.bom[i]?.lot?.child_lot_rm?.lot_number ? row.bom[i]?.lot.amount : "0",
                              amount: lotAmount,
                              current: isModify ? new Big(input.usage).times(lotAmount).plus(lot.current).toNumber(): Number(lot.current),
                              seq: lotIdx + 1,
                              isComplete: lot.is_complete ? '사용완료' : '-'
                            }
                            : {
                              ...lot,
                              usage: input.usage,
                              date: lot.date ?? moment(lot.end).format("YYYY-MM-DD"),
                              warehousing: lot.warehousing ?? lot.good_quantity,
                              amount: lotAmount,
                              current: isModify ? new Big(input.usage).times(lotAmount).plus(lot.current).toNumber(): lot.current,
                              // amount: v.lot_number === e[0].lotList[i].lot_number ? e[0][lotList[i]].amount : "0",
                              // amount: v.lot_number === row.bom[i]?.lot?.child_lot_rm?.lot_number ? row.bom[i]?.lot.amount : "0",
                              seq: lotIdx + 1,
                              isComplete: lot.is_complete ? '사용완료' : '-'
                            }
                        })])
                      }
                      return {
                        ...input,
                        lotList: undefined,
                        newTab: false
                      }
                    })
                    setSearchList([...tmp])
                  }}
                  width={1746}
                  rowHeight={32}
                  height={288}
                  // setSelectRow={(e) => {
                  //   setSelectRow(e)
                  // }}
                  setSelectRow={(e) => {
                    setSelectRow(e)
                  }}
                  type={'searchModal'}
                  headerAlign={'center'}
              />
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', height: 64}}>
              <div style={{height: '100%', display: 'flex', alignItems: 'flex-end', paddingLeft: 16,}}>
                <div style={{ display: 'flex', width: 1200}}>
                  <p style={{fontSize: 22, padding: 0, margin: 0}}> LOT 리스트 ({selectProduct}) </p>
                  {
                    isModify && selectType === '원자재' &&
                    <p style={{color: 'red',fontSize: 13, paddingLeft: 20, paddingTop:5, margin:0}}> *사용완료 처리된 원자재는 수정할 수 없습니다. </p>
                  }
                </div>
              </div>
              <div style={{display: 'flex', justifyContent: 'flex-end', margin: '24px 48px 8px 0'}}>

              </div>
            </div>
            <div style={{padding: '0 16px', width: 1776}}>
              <ExcelTable
                  headerList={column.type === 'readonly' ? searchModalList.InputLotReadonlyInfo : isModify? searchModalList.ModifyInputLotInfo: searchModalList.InputLotInfo}
                  row={lotList ?? [{}]}
                  setRow={(e) => {
                    const allAmount = lodash.sum(e.map(v=>Number(v.amount)).filter(v=>v))
                    const isOverStock = e.some(lotRow => {
                      if(!!lotRow.amount && lotRow.current < new Big(lotRow.amount).times(lotRow.usage).toNumber()) {
                        Notiflix.Report.warning("경고", "LOT 재고량 보다 소요량이 많습니다.", "확인")
                        return true
                      }
                      return false
                    })
                    if(isOverStock) return

                    let selectTmp = searchList.map((v)=>{
                      if(v.code === selectProduct){
                        return {...v, disturbance: allAmount, real_disturbance: new Big(allAmount).times(v.usage).toNumber()}
                      }else{
                        return v
                      }
                    })
                    let tmp = e.map((v, index) => {
                      return {
                        ...v,
                        // spare: '여',
                        newTab: false
                      }
                    })
                    let tmpSearchList = [...selectTmp]
                    if(selectRow >= 0) {
                      tmpSearchList[selectRow] = {
                        ...tmpSearchList[selectRow],
                        lots: tmp,
                      }
                    }
                    setSearchList([...tmpSearchList])
                    setLotList([...tmp])
                  }}
                  width={1746}
                  rowHeight={32}
                  height={192}
                  type={'searchModal'}
                  headerAlign={'center'}
                  scrollEnd={(value) => {
                    if(value){
                      if(searchList[selectRow].total > searchList[selectRow].page){
                        if(selectRow >= 0) {
                          let tmpSearchList = searchList
                           tmpSearchList[selectRow] = {
                            ...tmpSearchList[selectRow],
                             page: tmpSearchList[selectRow].page+1,
                          }
                          setSearchList([...tmpSearchList ])
                        }
                      }
                    }
                  }}
              />
            </div>
            <div style={{ height: 56, display: 'flex', alignItems: 'flex-end'}}>
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
                      row.input_bom?.map((bom) => {
                        let bomObject = getBomObject(bom.bom)
                        inputBomIdMap.set(bomObject.bomKey, bom)
                        })
                      searchList.map((bom, index) => {
                        let totalAmount = 0
                        if(bom.lots !== undefined) {
                          bom.lots?.map(lot => {
                            if (Number(lot.amount)) {
                              totalAmount += Number(lot.amount)

                              bomToSave.push({
                                ...inputBomIdMap.get(bom.bomKey),
                                // record_id: lot?.record_id ?? undefined,
                                record_id: undefined,
                                lot: {
                                  elapsed: lot.elapsed,
                                  type: bom.tab,
                                  child_lot_rm: bom.tab === 0 ? {...lot} : null,
                                  child_lot_sm: bom.tab === 1 ? {...lot} : null,
                                  child_lot_record: bom.tab === 2 ? {...lot} : null,
                                  warehousing: lot.warehousing,
                                  date: lot.date,
                                  current: lot.current,
                                  amount: Number(lot.amount) > lot.current ? 0 : lot.amount,
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
                                // record_id: lot?.child_lot_record?.record_id ?? undefined,
                                record_id: undefined,
                                lot: {
                                  elapsed: lot.elapsed,
                                  type: bom.tab,
                                  child_lot_rm: bom.tab === 0 ? {...lot} : null,
                                  child_lot_sm: bom.tab === 1 ? {...lot} : null,
                                  child_lot_record: bom.tab === 2 ? {...lot} : null,
                                  warehousing: lot.warehousing,
                                  date: lot.date,
                                  current: lot.current,
                                  amount: Number(lot.amount) > lot.current ? 0 : lot.amount,
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

                      const disturbanceArray = searchList.map((v)=>v.disturbance)
                      const allEqual = arr => arr.every( v => v === arr[0] )
                      if(disturbance === 0){
                        if(disturbanceArray.every((value) => value === 0)){
                          Notiflix.Report.warning(`BOM의 LOT생산량을 입력해주세요.`, '', '확인')
                        }else if(allEqual(disturbanceArray)){
                          let bomLotInfo
                          if(searchList.map((v)=> {return v.lots}).filter(v=>v).length === 0){
                            bomLotInfo = searchList.map((v) => {
                              return v.bom_info
                            })
                          }else {
                             bomLotInfo = searchList.map((v) => {
                              return v.lots
                            })
                          }
                          onRowChange({
                            ...row,
                            bom: bomToSave,
                            bom_info: bomLotInfo,
                            quantity: quantity,
                            good_quantity: quantity
                          })
                          setIsOpen(false)
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

const Button = styled.button`
    width:112px;
    height:32px;
    color:white;
    font-size:15px;
    border:none;
    border-radius:6px;
    background:#717C90;
    display:flex;
    justify-content:center;
    align-items:center;
    cursor:pointer;

`;

const TabBox = styled.button`
  max-width: 214.5px;
  min-width: 40px;
  height: 32px;
  background-color: #19B9DF;
  opacity: 0.5;
  border: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-right: 4px;
  cursor: pointer;
  flex: 1;
  p {
    font-size: 15px;
    width: 168px;
    text-overflow: ellipsis;
    color: white;
    padding-left: 8px;
    text-align: left;
    overflow: hidden;
    white-space: nowrap;
  }
`;

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
