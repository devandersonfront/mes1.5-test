import React, {useEffect, useRef, useState} from 'react'
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
import moment from "moment";
import Big from 'big.js'

interface IProps {
  row: any
  onRowChange: () => void
  isOpen?: boolean
  setIsOpen?: (isOpen: boolean) => void
}

const headerItems:{title: string, infoWidth: number, key: string, unit?: string}[][] = [
  [
    {title: '수주번호', infoWidth: 144, key: 'contract_id'},
    {title: '지시 고유 번호', infoWidth: 144, key: 'identification'},
    {title: '거래처', infoWidth: 144, key: 'customer_id'},
    {title: '모델', infoWidth: 144, key: 'cm_id'},
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
    {title: '총 카운터', infoWidth: 144, key: 'total_counter'},
    {title: '총 양품 수량', infoWidth: 144, key: 'total_good_quantity'},
    {title: '총 불량 수량', infoWidth: 144, key: 'total_poor_quantity'},
  ],
]



const WorkModifyModal = ({row, onRowChange, isOpen, setIsOpen}: IProps) => {
  const [selectRow, setSelectRow] = useState<number>()
  const [searchList, setSearchList] = useState<any[]>([{sequence: 1}])
  const [summaryData, setSummaryData] = useState<any>({})
  const cavity = row.molds ? row.molds[0]?.mold.mold.cavity : 1

  useEffect(() => {
    if(isOpen) {
      let total_count = 0
      let good_quantity = 0
      let poor_quantity = 0

      row.map(v => {
        total_count += v.good_quantity + v.poor_quantity
        good_quantity += v.good_quantity
        poor_quantity += v.poor_quantity
      })
      setSummaryData({
        contract_id: row[0].operation_sheet?.contract?.identification,
        identification: row[0].operation_sheet?.identification,
        customer_id: row[0].operation_sheet?.product?.customer?.name,
        cm_id: row[0].operation_sheet?.product?.model?.model,
        code: row[0].operation_sheet?.product?.code,
        name: row[0].operation_sheet?.product?.name,
        type: row[0].operation_sheet?.product?.type
        || row[0].operation_sheet?.product?.type === 0
            ? TransferCodeToValue(row[0].operation_sheet?.product?.type, 'productType')
            : null,
        process: row[0].product?.process?.name,
        unit: row[0].operation_sheet?.product?.unit,
        goal: row[0].operation_sheet?.goal,
        total_counter: total_count,
        total_good_quantity: good_quantity,
        total_poor_quantity: poor_quantity,
        // unit: row[0].operation_sheet?.product?.unit,
      })
      const newList = row.map((v)=> {return {...v, bom: divBomLotAmountByCavity(row[0].bom), bom_root_id: row[0].operation_sheet.product.bom_root_id, productId: row[0].product.product_id, modify: true, worker: row[0].worker_object, worker_object: null} })
      setSearchList([...newList])
    }
  }, [isOpen])

  function divBomLotAmountByCavity(bom:any[]) {
    return bom.map(bom => ({...bom, lot: {... bom.lot, amount: new Big(bom.lot.amount).times(cavity).toNumber() }}))
  }

  const SaveBasic = async () => {
    try{
      searchList.map((row) => {
        if(!row.lot_number){
          throw("LOT번호를 입력해주시기 바랍니다.")
        }else if(!row.worker?.user_id){
          throw("작업자를 선택해주시기 바랍니다.")
        }else if(!row.sum) {
          throw("생산 수량을 입력해주시기 바랍니다.")
        }})
      const postBody = searchList.map((v, i) => {
        let selectData: any = {}

        Object.keys(v).map(v => {
          if (v.indexOf('PK') !== -1) {
            selectData = {
              ...selectData,
              [v.split('PK')[0]]: v[v]
            }
          }

          if (v === 'unitWeight') {
            selectData = {
              ...selectData,
              unitWeight: Number(v['unitWeight'])
            }
          }

          if (v === 'tmpId') {
            selectData = {
              ...selectData,
              id: v['tmpId']
            }
          }
        })

        return {
          ...v,
          ...selectData,
          bom: v.molds ? v.bom.map(bom => ({...bom, lot: {...bom.lot, amount: new Big(Number(bom.lot.amount)).div(cavity).toString()}})) : v.bom,
          operation_sheet: {
            ...v.operation_sheet,
            status: row.status_no
          },
          input_bom: [],
          status: 0,
        }
      }).filter((v) => v)

      const res = await RequestMethod('post', `recordSave`,postBody)
      if (res) {
        Notiflix.Report.success('저장되었습니다.', '', '확인', () => {
          onRowChange()
          Notiflix.Loading.circle()
          setIsOpen(false)
        });
      }
    } catch (errMsg){
        console.log(errMsg)
        Notiflix.Report.warning('경고', errMsg, '확인')
    }
  }

  const getSummaryInfo = (info) => {
    return summaryData[info.key] ?? '-'
  }

  return (
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
            }}>작업 일보 수정 (해당 작업지시의 작업 일보를 수정해주세요)</p>
            <div style={{display: 'flex'}}>
              <div style={{cursor: 'pointer', marginLeft: 20}} onClick={() => {
                setIsOpen(false)
              }}>
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
                                  {getSummaryInfo(info)}
                                  {/*-*/}
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
                <p style={{fontSize: 22, padding: 0, margin: 0}}>작업이력</p>
              </div>
            </div>
            <div style={{display: 'flex', justifyContent: 'flex-end', margin: '24px 48px 8px 0'}}>

            </div>
          </div>
          <div style={{padding: '0 16px', width: 1776}}>
            <ExcelTable
                headerList={searchModalList.workModify}
                row={searchList ?? [{}]}
                setRow={(e) => {
                  setSearchList(e.map(v => {
                    const good_quantity = Number(v.quantity ??v.sum ?? 0)-Number(v.poor_quantity ?? 0)
                    return {
                      ...v,
                      border:false,
                      good_quantity,
                      current: good_quantity,
                      sum: Number(v.quantity ?? v.sum ?? 0),

                    }
                  }))
                }}
                width={1746}
                rowHeight={32}
                height={557}
                onRowClick={(clicked) => {const e = searchList.indexOf(clicked) 
                  setSelectRow(e)
                }}
                type={'searchModal'}
                headerAlign={'center'}
            />
          </div>
          <div style={{ height: 40, display: 'flex', alignItems: 'flex-end'}}>
            <div
                onClick={() => {
                  setIsOpen(false)
                }}
                style={{width: 888, height: 40, backgroundColor: '#E7E9EB', display: 'flex', justifyContent: 'center', alignItems: 'center'}}
            >
              <p style={{color: '#717C90'}}>취소</p>
            </div>
            <div
                onClick={SaveBasic}
                style={{width: 888, height: 40, backgroundColor: POINT_COLOR, display: 'flex', justifyContent: 'center', alignItems: 'center'}}
            >
              <p>저장</p>
            </div>
          </div>
        </div>
      </Modal>
  )
}

const SearchModalWrapper = styled.div`
  display: flex;
  width: 100%;
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
  width: 110px;
  padding: 0 8px;
  display: flex;
  align-items: center;
`

export {WorkModifyModal}
