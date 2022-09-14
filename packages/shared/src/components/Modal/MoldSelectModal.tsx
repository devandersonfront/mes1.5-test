import React, {useEffect, useState} from 'react'
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
import {MoldInfoModal} from './MoldInfoModal'
import {TransferCodeToValue} from "../../common/TransferFunction";
import {UploadButton} from "../../styles/styledComponents";
import { getUsageType } from '../../common/Util'
import Tooltip from 'rc-tooltip'
import 'rc-tooltip/assets/bootstrap_white.css';
interface IProps {
  column: IExcelHeaderType
  row: any
  onRowChange: (e: any) => void
}

const optionList = ['제조번호','제조사명','기계명','','담당자명']

const headerItems:{title: string, infoWidth: number, key: string, unit?: string}[][] = [
  [
    {title: '지시 고유 번호', infoWidth: 144, key: 'identification'},
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

const MoldSelectModal = ({column, row, onRowChange}: IProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [selectRow, setSelectRow] = useState<number>()
  const [searchList, setSearchList] = useState<any[]>([])
  const [summaryData, setSummaryData] = useState<any>({})

  useEffect(() => {
    if(isOpen){
      LoadBasic(row.productId)
      setSummaryData({
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
  }, [isOpen])

  const LoadBasic = async (productId) => {
    Notiflix.Loading.circle()
    const res = await RequestMethod('get', `moldPrdMoldLinkLoad`,{
      path: {
        productId: productId
      },
    })
    let selectedMold
    row.molds?.map((mold, index) => {
      if(mold.mold.setting){
        selectedMold = mold.mold.mold.mold_id
      }
    })
    if(res){
      setSearchList([...res].map((v, index) =>{
        return {
          ...v.mold,
          sequence: index+1,
          setting: v.mold.mold_id === selectedMold ? 1 : 0,
          isDefault: getUsageType(v.setting)
        }
      }))
    }
    Notiflix.Loading.remove()
  }

  const ModalUpdate = (e:any) => {
    onRowChange(e)
    setIsOpen(false)
  }

  const ModalContents = () => (
        <UploadButton  onClick={() => {
          setIsOpen(true)
        }} hoverColor={POINT_COLOR} haveId status={column.modalType ? "modal" : "table"}>
          <p>금형 보기</p>
        </UploadButton>
     )

  const getSummaryInfo = (info) => {
    return summaryData[info.key] ?? '-'
  }

  const onClose =() => {
    setIsOpen(false)
  }

  const onConfirm = () => {
    try{
      const moldInUse = searchList.filter(row => row.setting === 1)
      const cavity = moldInUse.length > 0 ? moldInUse[0].cavity : 1
      const update = () => {
        if (selectRow !== undefined && selectRow !== null) {
          onRowChange({
            ...row,
            name: row.name,
            molds: moldInUse.map(v => {
              return {
                mold: {
                  sequence: v.sequence,
                  mold: {
                    ...v
                  },
                  setting: v.setting
                }
              }
            }),
            cavity,
            isChange: true
          })
      }}

      if(moldInUse.length > 1) {
        throw ('금형을 하나만 사용해 주시기 바랍니다.')
      } else {
        Notiflix.Report.info('알림', '캐비티가 바뀌면 자재 사용량이 바뀌어 재고가 부족할 수 있습니다.', '확인', () => {
          update()
          onClose()
        })
      }
    } catch (errMsg) {
        Notiflix.Report.warning('경고', errMsg,'확인')
    }
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
            }}>금형 정보 (해당 제품을 만드는 데 사용한 금형을 선택해주세요.{/* 선택 가능 금형이 없으면 금형 수정 버튼을 눌러 금형 정보를 수정해주세요*/})</p>
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
                <p style={{fontSize: 22, padding: 0, margin: 0}}>선택 가능 금형 리스트 {/*(여러금형을 동시에 선택하여 사용할 수 있습니다)*/}</p>
              </div>
            </div>
            <div style={{display: 'flex', justifyContent: 'flex-end', margin: '24px 48px 8px 0'}}>
              {/*<MoldInfoModal column={column} row={row} onRowChange={ModalUpdate} modify/>*/}
            </div>
          </div>
          <div style={{padding: '0 16px', width: 1776}}>
            <ExcelTable
              headerList={searchModalList.moldUse}
              row={searchList ?? [{}]}
              setRow={(e) => {
                setSearchList([...e])
              }}
              width={1746}
              rowHeight={32}
              height={552}
              onRowClick={clicked => {
                const rowIdx = searchList.indexOf(clicked)
                if(!searchList[rowIdx]?.border){
                  const newSearchList = searchList.map((v,i)=> ({
                    ...v,
                    border : i === rowIdx
                  }))
                  setSearchList(newSearchList)
                  setSelectRow(rowIdx)
                }
              }}
              type={'searchModal'}
              headerAlign={'center'}
            />
          </div>
          <div style={{ height: 45, display: 'flex', alignItems: 'flex-end'}}>
            <div
              onClick={() => {
                onClose()
              }}
              style={{width: 888, height: 40, backgroundColor: '#E7E9EB', display: 'flex', justifyContent: 'center', alignItems: 'center'}}
            >
              <p style={{color: '#717C90'}}>취소</p>
            </div>
            <div
              onClick={() => {
                onConfirm()
              }}
              style={{width: 888, height: 40, backgroundColor: POINT_COLOR, display: 'flex', justifyContent: 'center', alignItems: 'center'}}
            >
              <p>선택 완료</p>
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
  text-overflow: ellipsis;
`

const HeaderTableTitle = styled.div`
  width: 110px;
  padding: 0 8px;
  display: flex;
  align-items: center;
`

export {MoldSelectModal}
