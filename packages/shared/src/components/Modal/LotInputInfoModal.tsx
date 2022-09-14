import React, {useEffect, useRef, useState} from 'react'
import {IExcelHeaderType} from '../../@types/type'
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
import {TransferCodeToValue} from '../../common/TransferFunction'
import Notiflix from "notiflix";
import {UploadButton} from "../../styles/styledComponents";
import { TransferType } from '../../@types/type'
import Big from 'big.js'
import lodash from 'lodash'
import Tooltip from 'rc-tooltip'
import 'rc-tooltip/assets/bootstrap_white.css';
interface IProps {
  column: IExcelHeaderType
  row: any
  onRowChange: (e: any) => void
}

//작업일보 투입 자재 모달
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

const LotInputInfoModal = ({column, row, onRowChange}: IProps) => {

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [summaryData, setSummaryData] = useState<any>({})
  const [selectRow, setSelectRow] = useState<number>()
  const [searchList, setSearchList] = useState<any[]>([])
  const [lotList, setLotList] = useState<any[]>([])
  const [selectProduct, setSelectProduct] = useState<string>('')
  const [selectType, setSelectType] = useState<string>('')
  const cavity = row.molds?.filter(mold => mold.mold.setting === 1)?.[0]?.mold?.mold?.cavity ?? 1

  useEffect(() => {
    if(isOpen) {
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
        worker_name: row.worker.name ?? row.worker ?? '-',
        good_quantity: row.good_quantity ?? 0,
        poor_quantity: row.poor_quantity ?? 0,
      })
      if(row.operation_sheet && row.operation_sheet?.input_bom?.length > 0){
        const filter_input_bom = row.operation_sheet.input_bom.filter((bom) => bom.bom.setting === 1)
        changeRow(filter_input_bom)
      }else if(row.input_bom?.length > 0){
        changeRow(row.input_bom)
      }else{
        Notiflix.Report.warning("경고","투입 자재가 없습니다.","확인", () => setIsOpen(false))
      }
    }
  }, [isOpen])

  const changeRow = (tmpRow: any, key?: string) => {
    const newRows = tmpRow?.map((v, i) => {
      let childData: any = {}
      let childDataType: TransferType = null
      let product = null
      let raw_material = null
      let sub_material = null
      let bomId = null
      switch(v.bom.type){
        case 0:{
          childData = v.bom.child_rm
          childData.unit = v.bom.child_rm.type == "1" ? "kg" : v.bom.child_rm.type == "2" ? "장" : "-";
          childDataType = 'rawMaterial'
          raw_material = childData
          bomId = v.bom.childRmId
          break;
        }
        case 1:{
          childData = v.bom.child_sm
          childDataType = 'subMaterial'
          sub_material = childData
          bomId = v.bom.childSmId
          break;
        }
        case 2:{
          childData = v.bom.child_product
          childDataType = 'product'
          product = childData
          bomId = v.bom.childProductId
          break;
        }
      }
      const bomLots = getBomLots(bomId, childDataType)
      const stock = getTotalStock(bomLots)
      const sumOfUsage = bomLots?.length > 0 ? lodash.sum(bomLots.map(bom => new Big(bom.lot.amount).times(bom.bom.usage).toNumber())) : new Big(row.good_quantity).div(cavity)

      return {
        ...childData,
        seq: i+1,
        code: childData.code,
        type: TransferCodeToValue(childData?.type, childDataType),
        tab: v.bom.type,
        type_name: TransferCodeToValue(childData?.type, childDataType),
        cavity,
        unit: childData.unit,
        parent: v.bom.parent,
        usage: v.bom.usage,
        version: v.bom.version,
        setting: v.bom.setting,
        stock,
        bom_lot_list: tmpRow,
        disturbance: sumOfUsage,
        processArray: childData.process ?? null,
        process: childData.process ? childData.process.name : '-',
        bom: bomLots,
        product,
        raw_material,
        sub_material,
      }
    })

    setSearchList(newRows)
  }

  function getTotalStock(lots){
    return lots.length > 0 ? lodash.sum(lots.map((lot) => new Big(lot.lot.current).minus(new Big(lot.lot.amount).times(lot.bom.usage)).toNumber())) : 0
  }

  function getBomLots(id:number, type: TransferType) {
    switch(type){
      case 'rawMaterial':
        return row.bom?.filter((bom) => bom?.lot?.child_lot_rm?.rmId === id)
      case 'subMaterial':
        return row.bom?.filter((bom) => bom?.lot?.child_lot_sm?.smId === id)
      case 'product':
        return row.bom?.filter((bom) => bom?.lot?.child_lot_record?.operation_sheet?.productId === id)
      default:
        return null
    }
  }

  const getSummaryInfo = (info) => {
    return summaryData[info.key] ?? '-'
  }

  const ModalContents = () => (

        <UploadButton onClick={() => {
          setIsOpen(true)
        }} hoverColor={POINT_COLOR} haveId status={column.modalType ? "modal" : "table"} >
          <p style={{ textDecoration: 'underline', margin: 0, padding: 0}}>자재 보기</p>
        </UploadButton>
    )

  const modalTitle = () => {
    return <div id='modal-title' style={{
      margin: '24px 16px 16px',
      display: 'flex',
      justifyContent: 'space-between',
    }}>
      <p style={{
        color: 'black',
        fontSize: 22,
        fontWeight: 'bold',
        margin: 0
      }}>투입 자재 정보 (해당 제품을 만드는 데 사용한 자재는 아래와 같습니다)</p>
      <div style={{display: 'flex'}}>

        <div style={{cursor: 'pointer', marginLeft: 20}} onClick={() => {
          setIsOpen(false)
        }}>
          <img style={{width: 20, height: 20}} src={IcX}/>
        </div>
      </div>
    </div>
  }

  const modalButtons = () => {
    return <div style={{ height: 56, display: 'flex', alignItems: 'flex-end'}}>
      <div
        onClick={() =>{
            setIsOpen(false)
        }}
        style={{width: '100%', height: 40, backgroundColor: POINT_COLOR, display: 'flex', justifyContent: 'center', alignItems: 'center'}}
      >
        <p>{'확인'}</p>
      </div>
    </div>
  }

  const isProduct = selectType === '반제품' || selectType === '재공품' || selectType === '완제품'

  const LotListColumns = () => {
    return isProduct ? searchModalList.ProductLotReadonlyInfo : searchModalList.InputLotReadonlyInfo
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
            padding: 0,
          },
          overlay: {
            background: 'rgba(0,0,0,.6)',
            zIndex: 5,
          }
        }}>
          <div id='modal-root' style={{
            width: 1776,
            height: 803
          }}>
            {
              modalTitle()
            }
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
                                  <Tooltip placement={'rightTop'}
                                           overlay={
                                             <div style={{fontWeight : 'bold'}}>
                                               {getSummaryInfo(info)}
                                             </div>
                                           } arrowContent={<div className="rc-tooltip-arrow-inner"></div>}>
                                    <HeaderTableText>{getSummaryInfo(info)}</HeaderTableText>
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
            <div id='body-title' style={{display: 'flex', justifyContent: 'space-between', height: 64}}>
              <div style={{height: '100%', display: 'flex', alignItems: 'flex-end', paddingLeft: 16,}}>
                <div style={{ display: 'flex', width: 1200}}>
                  <p style={{fontSize: 22, padding: 0, margin: 0}}>투입 자재 리스트</p>
                </div>
              </div>
              <div style={{display: 'flex', justifyContent: 'flex-end', margin: '24px 48px 8px 0'}}>
              </div>
            </div>
            <div id='body-root' style={{padding: '0 16px', width: 1776}}>
              <ExcelTable
                  headerList={searchModalList.InputListReadonly}
                  row={searchList ?? [{}]}
                  onRowClick={(clicked) => {const e = searchList.indexOf(clicked) 
                    setSelectRow(e)
                  }}
                  setRow={(e) => {
                    let tmp = e.map((v, index) => {
                      if(v.bom){
                        setSelectProduct(v.code)
                        if(v.lotList){
                          const newLots = v.lotList.map(lot => ({
                            ...lot,
                            amount: new Big(lot.amount).times(cavity),
                            unit: v.unit,
                            current: new Big(lot.current).minus(new Big(lot.amount).times(v.usage)).toNumber()
                          }))
                          setSelectType(v.type_name)
                          setLotList(newLots)
                        }
                      }
                      delete v.lotList
                      return {
                        ...v,
                      }
                    })
                    setSearchList([...tmp])
                  }}
                  width={1746}
                  rowHeight={32}
                  height={288}
                  type={'searchModal'}
                  headerAlign={'center'}
              />
            </div>
            <div id='body-2-title' style={{display: 'flex', justifyContent: 'space-between', height: 64}}>
              <div style={{height: '100%', display: 'flex', alignItems: 'flex-end', paddingLeft: 16,}}>
                <div style={{ display: 'flex', width: 1200}}>
                  <p style={{fontSize: 22, padding: 0, margin: 0}}>{selectType} LOT 리스트 ({selectProduct})</p>
                </div>
              </div>
              <div style={{display: 'flex', justifyContent: 'flex-end', margin: '24px 48px 8px 0'}}>
              </div>
            </div>
            <div id='body-2-root' style={{padding: '0 16px', width: 1776}}>
              <ExcelTable
                  headerList={LotListColumns()}
                  row={lotList ?? [{}]}
                  setRow={(e) => {
                    let tmpSearchList = [...searchList]
                    if(selectRow >= 0) {
                      tmpSearchList[selectRow] = {
                        ...tmpSearchList[selectRow],
                        lots: e
                      }
                    }
                    setSearchList([...tmpSearchList])
                    setLotList([...e])
                  }}
                  width={1746}
                  rowHeight={32}
                  height={192}
                  type={'searchModal'}
                  headerAlign={'center'}
              />
            </div>
            {
              modalButtons()
            }
          </div>
        </Modal>
      </SearchModalWrapper>
  )
}

const SearchModalWrapper = styled.div`
  width: 100%;
  height: 100%;
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

export {LotInputInfoModal}
