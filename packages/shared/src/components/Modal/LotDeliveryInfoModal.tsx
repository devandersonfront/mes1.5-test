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

const optionList = ['제조번호','제조사명','기계명','','담당자명']

const LotDeliveryInfoModal = ({column, row, onRowChange}: IProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [selectRow, setSelectRow] = useState<number>()
  const [searchList, setSearchList] = useState<any[]>([{seq: 1}])
  const [searchKeyword, setSearchKeyword] = useState<string>('')
  const [totalDelivery, setTotalDelivery] = useState<number>(0)
  const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
    page: 1,
    total: 1
  })

  useEffect(() => {
    if(isOpen) {
      if (row.lots && row.lots.length && column.key === 'lot_number') {
        initData()
      }else if (row.product?.product_id) {
        SearchBasic()
      } else {
        setIsOpen(false)
        Notiflix.Report.warning('수주 또는 품목을 선택해 주세요.', '', '확인',)
      }
    }
  }, [isOpen, searchKeyword])

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
            worker_name: v.group.sum.worker.name,
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
          worker_name: v.group.sum.worker.name,
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

  const changeRow = (tmpRow: any) => {
    let tmpData = []
    let row = [];
    // if(typeof tmpRow === 'string'){
    //   let tmpRowArray = tmpRow.split('\n')
    //
    //   row = tmpRowArray.map(v => {
    //     if(v !== ""){
    //       let tmp = JSON.parse(v)
    //       return tmp
    //     }
    //   }).filter(v=>v)
    // }else{
      row = [...tmpRow]
    // }

    tmpData = row.map((v, i) => {
      return {
        seq: i+1,
        lot_number: v.sum.lot_number,
        start: v.sum.start,
        end: v.sum.end,
        worker_name: v.sum.worker.name,
        good_quantity: v.sum.good_quantity,
        current: v.sum.current,
        amount: v.sum.lot?.amount,
        group: {
          ...v,
        }
      }
    })
    return tmpData
  }

  const SearchBasic = async () => {
    Notiflix.Loading.circle()
    const res = await RequestMethod('get', row.contract?.contract_id? `recordGroupListByContract` : `recordGroupList` ,{
      path: {
        product_id: row.product.product_id,
        contract_id: row.contract?.contract_id?? null,
        page: 1,
        renderItem: 18,
      },
    })
    if(res && res.info_list.length <= 0){
      Notiflix.Report.warning("경고","해당 품목의 재고가 없습니다.","확인", () => setIsOpen(false))
      return
    }else if(res){
      const searchList = changeRow(res.info_list)
      setPageInfo({
        ...pageInfo,
        page: res.page,
        total: res.totalPages,
      })

      setSearchList([...searchList])
      return searchList
    }
  }

  const ModalContents = () => (
      <UploadButton onClick={() => {
        setIsOpen(true)
      }} hoverColor={POINT_COLOR} haveId status={column.modalType ? "modal" : "table"}>
        <p>
          {column.type === "placeholder" ? totalDelivery : "LOT 보기"}
        </p>
      </UploadButton>
  )

  const onClickCloseEvent = () => {
    setIsOpen(false)
    setPageInfo({page:1, total:1})
    setSearchList([{seq: 1}])
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
              column.type === 'base' &&
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
              headerList={column.type === 'baseReadonly'  || column.type === "placeholder" ? searchModalList.lotDeliveryInfoReadonly : searchModalList.lotDeliveryInfo}
              row={searchList }
              setRow={(e) => {
                  let total = 0
                  setSearchList([...e])
                  e.map(v => {
                    if(v.amount){
                      total += Number(v.amount)
                    }
                  })
                  setTotalDelivery(total)
              }}
              width={1746}
              rowHeight={32}
              height={568}
              // onRowClick={(clicked) => {const e = searchList.indexOf(clicked)
              //   setSelectRow(e)
              // }}
              onRowClick={(clicked) => {const e = searchList.indexOf(clicked) 
                if(!searchList[e].border){
                  searchList.map((v,i)=>{
                    v.border = false;
                  })
                  searchList[e].border = true
                  setSearchList([...searchList])
                }
                setSelectRow(e)
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
          { column.type === "readonly" || column.type === "baseReadonly" ?
            <div style={{height: 45, display: 'flex', alignItems: 'flex-end'}}>
              <div
                onClick={() => {
                  if (selectRow !== undefined && selectRow !== null) {
                    onRowChange({
                      ...row,
                      ...searchList[selectRow],
                      name: row.name,
                      isChange: true
                    })
                  }
                  setIsOpen(false)
                }}
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
                  let lot = searchList.map(v => {
                    return {
                      ...v,
                      amount: v.amount ?? 0
                    }
                  })

                  onRowChange({
                    ...row,
                    [column.key]: [...lot.map(v => {
                      if(Number(v.amount)){
                        return v
                      }
                    }).filter(v=>v)],
                    lots: [...lot.map(v => {
                      if(Number(v.amount)){
                        return v
                      }
                    }).filter(v=>v)],
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
