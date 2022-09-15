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
import Notiflix from 'notiflix'
import {UploadButton} from '../../styles/styledComponents'
//@ts-ignore
import moment from 'moment'
import {transferStringToCode} from "../../common/codeTransferFunctions";
import Big from 'big.js'
import { alertMsg } from '../../common/AlertMsg'
import { CheckRecordLotNumber } from '../../common/Util'
import Tooltip from 'rc-tooltip'
import 'rc-tooltip/assets/bootstrap_white.css';

interface IProps {
  column: IExcelHeaderType
  row: any
  onRowChange: (e: any) => void
}


const headerItems:{title: string, infoWidth: number, key: string, unit?: string}[][] = [
  [
    {title: '수주번호', infoWidth: 144, key: 'contract_id'},
    {title: '지시 고유 번호', infoWidth: 144, key: 'identification'},
    {title: '거래처', infoWidth: 144, key: 'customer_id'},
    {title: '모델', infoWidth: 144, key: 'cm_id'},
  ],
  [
    {title: 'CODE', infoWidth: 144, key: 'product_id'},
    {title: '품명', infoWidth: 144, key: 'name'},
    {title: '품목 종류', infoWidth: 144, key: 'type'},
    {title: '생산 공정', infoWidth: 144, key: 'process_id'},
  ],
  [
    {title: '단위', infoWidth: 144, key: 'unit'},
    {title: '목표 생산량', infoWidth: 144, key: 'goal'},
    {title: '총 카운터', infoWidth: 144, key: 'total_counter'},
    {title: '총 양품 수량', infoWidth: 144, key: 'total_good_quantity'},
    {title: '총 불량 수량', infoWidth: 144, key: 'total_poor_quantity'},
  ],
]

const WorkRegisterModal = ({column, row, onRowChange}: IProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [searchList, setSearchList] = useState<any[]>([{sequence: 1}])

  useEffect(() => {
    if(isOpen) {
      console.log("row : ", row)
      setSearchList([{
        modify: true,
        osId: row.os_id,
        sequence: 1,
        good_quantity: 0,
        poor_quantity: 0,
        processId: row.product?.process?.process_id,
        input_bom: row.input_bom,
        product: row.product,
        goal: row.goal,
        start: row.date + " 00:00:00",
        end: row.date + " 00:00:00",
        standardStartDate : row.date,
        standardEndDate : moment('2999-12-31').subtract(1, 'days').toDate(),
        ...row,
        sum: 0,
        defect_reasons: [],
      }])
    }
  }, [isOpen])

  const SaveBasic = async () => {
    try{
      const postBody = searchList.map((v) => {
        console.log("v : ", v)
        if(CheckRecordLotNumber(v.lot_number)){
          throw(alertMsg.wrongLotNumber)
        }else if(!v.lot_number){
          throw(alertMsg.noLotNumber)
        }else if(!v.manager){
          throw(alertMsg.noWorker)
        }else if(!v.sum) {
          throw(alertMsg.noProductAmount)
        }
        if(v.molds) {
          v.bom.map(bom => {
            const finalAmount = new Big(bom.lot?.amount).div(v.cavity)
            const finalUsage = finalAmount.times(bom.bom?.usage)
            if(!Number.isInteger(finalAmount.toNumber())) throw(alertMsg.productAmountNotCavityDivisor)
            if(finalUsage.gt(bom.lot?.current)) throw (alertMsg.overStock)
            // const currentAmount = lotTotalAmountMap.get(bom.osb_id) ?? 0
            //   lotTotalAmountMap.set(bom.osb_id, currentAmount + Number(bom.lot.amount))
          })
        }

        return {
          ...v,
          bom: v.molds?.length > 0 ? v.bom.map(bom => ({...bom, lot: {...bom.lot, amount: new Big(Number(bom.lot.amount)).div(v.cavity).toString()}})) : v.bom,
          operation_sheet: {
            ...row,
            status: typeof row.status_no === "string" ? transferStringToCode('workStatus', row.status_no) : row.status_no
          },
          tools: v?.tools?.map((tool) => {
            return{
              ...tool,
              tool:{
                ...tool.tool,
                setting: 0,
                used: Number(tool.tool.tool.used),
                tool: {
                  ...tool.tool.tool,
                  customer: tool.tool.tool.customerArray
                }
              }}
          }).filter(v=>v.tool.tool.code),
          machines: v?.machines ? v?.machines.filter((machine) => machine.machine.setting == 1) : [],
          version: undefined
        }
      }).filter((v) => v)
      let res = await RequestMethod('post', `recordSave`, postBody)
      if(res) Notiflix.Report.success('저장되었습니다.','','확인', () => row.reload());
    } catch (errMsg){
      console.log(errMsg)
      Notiflix.Report.warning('경고', errMsg, '확인')
    }
  }

  const ModalContents = () => {
    return <>
        <UploadButton onClick={() => {
          setIsOpen(true)
        }}>
          <p>작업 일보 등록</p>
        </UploadButton>
    </>
  }

  const getSummaryInfo = (info) => {
    return row[info.key] ?? '-'
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
            }}>작업 일보 등록 (해당 작업지시의 작업 일보를 등록해주세요)</p>
            <div style={{display: 'flex'}}>
              {/*<Button>*/}
              {/*  <p>엑셀로 받기</p>*/}
              {/*</Button>*/}
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
          <div style={{display: 'flex', justifyContent: 'space-between', height: 64}}>
            <div style={{height: '100%', display: 'flex', alignItems: 'flex-end', paddingLeft: 16,}}>
              <div style={{ display: 'flex', width: 1200}}>
                <p style={{fontSize: 22, padding: 0, margin: 0}}>작업이력</p>
              </div>
            </div>
            {/*<div style={{display: 'flex', justifyContent: 'flex-end', margin: '24px 48px 8px 0'}}>*/}
            {/*  <Button onClick={() => {*/}
            {/*    let tmp = searchList*/}

            {/*    setSearchList([*/}
            {/*      ...searchList,*/}
            {/*      {*/}
            {/*        sequence: searchList.length+1,*/}
            {/*        start: moment().format('YYYY-MM-DD'),*/}
            {/*        end: moment().format('YYYY-MM-DD'),*/}
            {/*      }*/}
            {/*    ])*/}
            {/*  }}>*/}
            {/*    <p>행 추가</p>*/}
            {/*  </Button>*/}
            {/*</div>*/}
          </div>
          <div style={{padding: '0 16px', width: 1776}}>
            <ExcelTable
                headerList={searchModalList.workRegister}
                row={searchList ?? [{}]}
                setRow={(e) => {
                  setSearchList(e.map(v => {
                    console.log(v)
                    return {
                      ...v,
                      border:false,
                      good_quantity: Number(v.quantity ?? 0)-Number(v.poor_quantity ?? 0),
                      sum: Number(v.quantity ?? 0)
                    }
                  }))
                }}
                width={1746}
                rowHeight={32}
                height={557}
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
              onClick={() => {
                SaveBasic()
              }}
              style={{width: 888, height: 40, backgroundColor: POINT_COLOR, display: 'flex', justifyContent: 'center', alignItems: 'center'}}
            >
              <p>저장</p>
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
  width: 110px;
  padding: 0 8px;
  display: flex;
  align-items: center;
`

export {WorkRegisterModal}
