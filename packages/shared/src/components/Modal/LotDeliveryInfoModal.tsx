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
import {UploadButton} from "../../styles/styledComponents";
import {NoAmountValidation, OverAmountValidation} from '../../validations/Validation'

interface IProps {
  column: IExcelHeaderType
  row: any
  onRowChange: (e: any) => void
}

const LotDeliveryInfoModal = ({column, row, onRowChange}: IProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [searchList, setSearchList] = useState<any[]>([{seq: 1}])
  const [totalDelivery, setTotalDelivery] = useState<number>(0)
  const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
    page: 1,
    total: 1
  })
  const isModify = row.shipment_id && !column.readonly
  console.log('aa',row)

  useEffect(() => {
    if(isOpen) {
      if(column.readonly){
        initData()
      } else {
        if(row.product?.product_id) {
          SearchBasic()
        } else {
          setIsOpen(false)
          Notiflix.Report.warning('수주 또는 품목을 선택해 주세요.', '', '확인',)
        }
      }
    }
  }, [isOpen])

  const initData = async() => {
    let tmpData = []
    let totalAmount = 0
    if(row?.lots.length > 0){
      tmpData = row?.lots.map((v, i) => {
        let index = row.lots.findIndex((lot) => lot.group.sum.lot_number === v.group.sum.lot_number)
        if (index !== -1) {
          totalAmount += row.lots[index].amount
          return  {
            seq: i + 1,
            lot_number: v.group.sum.lot_number,
            start: v.group.sum.start,
            end: v.group.sum.end,
            worker_name: v.group.sum.worker?.name ?? '-',
            good_quantity: v.group.sum.good_quantity,
            current: v.group.sum.current,
            amount: row.lots[index].amount ?? row.amount,
            group: {
              ...v,
            },
            ...v,
          }
        }

        // totalAmount += row.amount
        return {
          seq: i + 1,
          lot_number: v.group.sum.lot_number,
          start: v.group.sum.start,
          end: v.group.sum.end,
          worker_name: v.group.sum.worker?.name,
          good_quantity: v.group.sum.good_quantity,
          current: v.group.sum.current,
          amount: v.amount ?? row.amount,
          group: {
            ...v,
          },
          ...v,
        }
      })
    }

    setTotalDelivery(totalAmount)
    setSearchList([...tmpData])
  }

  console.log('s',searchList)
  const changeRow = (tmpRow: any) => {
    return tmpRow.map((v, i) => {
      let current = v.sum.current
      const matchedLot = row.lots?.filter(lot => lot.group.sum.lot_number === v.sum.lot_number)?.[0]
      if(isModify){
        const originalLot = row.originalLots?.filter(lot => lot.group.sum.lot_number === v.sum.lot_number)?.[0]
        const originalAmount = originalLot?.amount ?? 0
        const amount = matchedLot?.amount ?? 0
        current = current + originalAmount - Number(amount)
      }
      const amount = matchedLot?.amount ?? undefined
      return {
        seq: i+1,
        lot_number: v.sum.lot_number,
        start: v.sum.start,
        end: v.sum.end,
        worker_name: v.sum.worker?.name ?? '-',
        good_quantity: v.sum.good_quantity,
        current,
        originalCurrent: current,
        amount,
        group: {
          ...v,
        }
      }
    })
  }

  const SearchBasic = async () => {
    Notiflix.Loading.circle()
    const searchType = column.searchType ?? (row.contract?.contract_id ? 'contract' : 'code')
    const res = await RequestMethod('get', searchType === 'contract' ? `recordGroupListByContract` : `recordGroupList` ,{
      path: {
        product_id: row.product.product_id,
        contract_id: searchType === 'contract' ? row.contract?.contract_id : null,
        page: 1,
        renderItem: 18,
      },
    })
    if(res && res.info_list?.length === 0){
      return Notiflix.Report.warning("경고","해당 품목의 재고가 없습니다.","확인", () => setIsOpen(false))
    }else if(res){
      const searchList = changeRow(res.info_list)
      setPageInfo({
        page: res.page,
        total: res.totalPages,
      })

      setSearchList([...searchList])
    }
    Notiflix.Loading.remove()
  }

  const ModalContents = () => (
      <UploadButton onClick={() => {
        setIsOpen(true)
      }} hoverColor={POINT_COLOR} haveId status={column.modalType ? "modal" : "table"}>
        <p>LOT 보기</p>
      </UploadButton>
  )

  const onClickCloseEvent = () => {
    setIsOpen(false)
    setPageInfo({page:1, total:1})
    setSearchList([])
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
          height: 816
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
            }}>LOT별 납품 정보</p>
            <div style={{display: 'flex'}}>
              <div style={{cursor: 'pointer', marginLeft: 20}} onClick={onClickCloseEvent}>
                <img style={{width: 20, height: 20}} src={IcX}/>
              </div>
            </div>
          </div>
          <HeaderTable>
            <HeaderTableTitle>
              <HeaderTableText style={{fontWeight: 'bold'}}>수주번호</HeaderTableText>
            </HeaderTableTitle>
            <HeaderTableTextInput style={{width: 144}}>
              <HeaderTableText>{row.contract?.identification ?? '-'}</HeaderTableText>
            </HeaderTableTextInput>
            <HeaderTableTitle>
              <HeaderTableText style={{fontWeight: 'bold'}}>거래처</HeaderTableText>
            </HeaderTableTitle>
            <HeaderTableTextInput style={{width: 144}}>
              <HeaderTableText>{row.customer_id ?? '-'}</HeaderTableText>
            </HeaderTableTextInput>
            <HeaderTableTitle>
              <HeaderTableText style={{fontWeight: 'bold'}}>모델</HeaderTableText>
            </HeaderTableTitle>
            <HeaderTableTextInput style={{width: 144}}>
              <HeaderTableText>{row.cm_id ?? '-'}</HeaderTableText>
            </HeaderTableTextInput>
          </HeaderTable>
          <HeaderTable>
            <HeaderTableTitle>
              <HeaderTableText style={{fontWeight: 'bold'}}>CODE</HeaderTableText>
            </HeaderTableTitle>
            <HeaderTableTextInput style={{width: 144}}>
              <HeaderTableText>{row.product_id ?? '-'}</HeaderTableText>
            </HeaderTableTextInput>
            <HeaderTableTitle>
              <HeaderTableText style={{fontWeight: 'bold'}}>품명</HeaderTableText>
            </HeaderTableTitle>
            <HeaderTableTextInput style={{width: 144}}>
              <HeaderTableText>{row.name ?? '-'}</HeaderTableText>
            </HeaderTableTextInput>
            <HeaderTableTitle>
              <HeaderTableText style={{fontWeight: 'bold'}}>품목 종류</HeaderTableText>
            </HeaderTableTitle>
            <HeaderTableTextInput style={{width: 144}}>
              <HeaderTableText>{row.type ?? '-'}</HeaderTableText>
            </HeaderTableTextInput>
          </HeaderTable>
          <HeaderTable>
            <HeaderTableTitle>
              <HeaderTableText style={{fontWeight: 'bold'}}>단위</HeaderTableText>
            </HeaderTableTitle>
            <HeaderTableTextInput style={{width: 144}}>
              <HeaderTableText>{row.unit ?? '-'}</HeaderTableText>
            </HeaderTableTextInput>
            {
              !column.readonly &&
              <>
                  <HeaderTableTitle>
                      <HeaderTableText style={{fontWeight: 'bold'}}>총 재고량</HeaderTableText>
                  </HeaderTableTitle>
                  <HeaderTableTextInput style={{width: 144}}>
                      <HeaderTableText>{row.product?.stock ?? 0}</HeaderTableText>
                  </HeaderTableTextInput>
              </>
            }
            <HeaderTableTitle>
              <HeaderTableText style={{fontWeight: 'bold'}}>총 납품 수량</HeaderTableText>
            </HeaderTableTitle>
            <HeaderTableTextInput style={{width: 144}}>
              <HeaderTableText>{totalDelivery}</HeaderTableText>
            </HeaderTableTextInput>
          </HeaderTable>
          <div style={{display: 'flex', justifyContent: 'space-between', height: 64}}>
            <div style={{height: '100%', display: 'flex', alignItems: 'flex-end', paddingLeft: 16,}}>
              <div style={{ display: 'flex', width: 1200}}>
                <p style={{fontSize: 22, padding: 0, marginBottom: 8}}>LOT별 납품 수량</p>
              </div>
            </div>
            <div></div>
          </div>
          <div style={{padding: '0 16px', width: 1776}}>
            <ExcelTable
              headerList={column.readonly ? searchModalList.lotDeliveryInfoReadonly : searchModalList.lotDeliveryInfo}
              row={searchList }
              setRow={(e) => {
                console.log('e',e)

                let total = 0
                const newSearchList = e.map(v => {
                  if(v.amount){
                    total += Number(v.amount)
                  }
                  let current = v.originalCurrent
                  if(isModify){
                    const originalLot = row.originalLots?.filter(lot => lot.group.sum.lot_number === v.group.sum.lot_number)?.[0]
                    const originalAmount = originalLot?.amount ?? 0
                    const amount = v?.amount ?? 0
                    current = current + originalAmount - Number(amount)
                  }
                  return {
                    ...v,
                    current
                  }
                })
                setSearchList(newSearchList)
                setTotalDelivery(total)
              }}
              width={1746}
              rowHeight={32}
              height={568}
              onRowClick={(clicked) => {const e = searchList.indexOf(clicked) 
                if(!searchList[e].border){
                  searchList.map((v,i)=>{
                    v.border = false;
                  })
                  searchList[e].border = true
                  setSearchList([...searchList])
                }
              }}
              type={'searchModal'}
              headerAlign={'center'}
              scrollEnd={(value) => {
                if (value) {
                  if (pageInfo.total > pageInfo.page) {
                    setPageInfo({ ...pageInfo, page: pageInfo.page + 1 })
                  }
                }
              }}
              
            />


            
          </div>
          { column.readonly ?
            <div style={{height: 45, display: 'flex', alignItems: 'flex-end'}}>
              <div
                onClick={() => onClickCloseEvent()}
                style={{
                  width: '100%',
                  height: 40,
                  backgroundColor: POINT_COLOR,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <p>확인</p>
              </div>
            </div>
            : <div style={{height:45 , width: '100%', display: 'flex', flexWrap:'wrap',flexDirection:'row'}}>
              <div
                onClick={onClickCloseEvent}
                style={{
                  flex:1,
                  height: '100%',
                  backgroundColor: '#b3b3b3',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <p>취소</p>
              </div>
              <div
                onClick={() => {
                  if(NoAmountValidation('amount', searchList,)) return
                  else if(OverAmountValidation('current', 'amount', searchList, '재고량 보다 납품 수량이 많습니다.')) return
                  onRowChange({
                    ...row,
                    lots: searchList.filter(row => !!row.amount && Number(row.amount)),
                    amount: totalDelivery,
                    name: row.name,
                    isChange: true
                  })
                  setIsOpen(false)
                }}
                style={{
                  flex:1,
                  height: '100%',
                  backgroundColor: POINT_COLOR,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <p>선택 완료</p>
              </div>
            </div>}
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
  margin-right: 62px;
  display: flex;
  align-items: center;
`

const HeaderTableText = styled.p`
  margin: 0;
  font-size: 15px;
`

const HeaderTableTitle = styled.div`
  width: 99px;
  padding: 0 8px;
  display: flex; 
  align-items: center;
`

export {LotDeliveryInfoModal}
