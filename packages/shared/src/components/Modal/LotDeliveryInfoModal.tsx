import React, {useEffect, useState} from 'react'
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
import {PaginationComponent}from '../Pagination/PaginationComponent'
import Notiflix from 'notiflix'
import {UploadButton} from '../../styles/styledComponents'
import {TransferCodeToValue} from '../../common/TransferFunction'

interface IProps {
  column: IExcelHeaderType
  row: any
  onRowChange: (e: any) => void
}

const optionList = ['제조번호','제조사명','기계명','','담당자명']

const LotDeliveryInfoModal = ({column, row, onRowChange}: IProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('기계')
  const [optionIndex, setOptionIndex] = useState<number>(0)
  const [keyword, setKeyword] = useState<string>('')
  const [selectRow, setSelectRow] = useState<number>()
  const [searchList, setSearchList] = useState<any[]>([{seq: 1}])
  const [searchKeyword, setSearchKeyword] = useState<string>('')
  const [totalStock, setTotalStock] = useState<number>(0)
  const [totalDelivery, setTotalDelivery] = useState<number>(0)
  const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
    page: 1,
    total: 1
  })

  useEffect(() => {
    if(isOpen) {
      console.log('row', row)
      if (row.lots && row.lots.length) {
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
    let searchList = await SearchBasic().then((results) => {
      return results.map((v, i) => {
        let index = row.lots.findIndex((lot) => lot.group.sum.lot_number === v.group.sum.lot_number)
        console.log(index)
        if (index !== -1) {
          return {
            seq: i + 1,
            lot_number: v.group.sum.lot_number,
            start: v.group.sum.start,
            end: v.group.sum.end,
            worker_name: v.group.sum.worker.name,
            good_quantity: v.group.sum.good_quantity,
            current: v.group.sum.current,
            amount: row.lots[index].amount,
            group: {
              ...v,
            },
            ...v,
          }
        }

        return {
          seq: i + 1,
          lot_number: v.group.sum.lot_number,
          start: v.group.sum.start,
          end: v.group.sum.end,
          worker_name: v.group.sum.worker.name,
          good_quantity: v.group.sum.good_quantity,
          current: v.group.sum.current,
          amount: v.amount,
          group: {
            ...v,
          },
          ...v,
        }
      })

    })

    console.log(searchList)
    setSearchList([...searchList])
  }

  const changeRow = (tmpRow: any) => {
    let tmpData = []
    let row = [];
    if(typeof tmpRow === 'string'){
      let tmpRowArray = tmpRow.split('\n')

      row = tmpRowArray.map(v => {
        if(v !== ""){
          let tmp = JSON.parse(v)
          return tmp
        }
      }).filter(v=>v)
    }else{
      row = [{...tmpRow}]
    }

    console.log(row)
    tmpData = row.map((v, i) => {

      return {
        seq: i+1,
        lot_number: v.sum.lot_number,
        start: v.sum.start,
        end: v.sum.end,
        worker_name: v.sum.worker.name,
        good_quantity: v.sum.good_quantity,
        current: v.sum.current,
        group: {
          ...v,
        }
      }
    })
    return tmpData
  }

  const SearchBasic = async () => {
    Notiflix.Loading.circle()
    const res = await RequestMethod('get', `recordGroupList`,{
      path: {
        product_id: row.product.product_id,
        page: 1,
        renderItem: 18,
      },
    })

    if(res){
      const searchList = changeRow(res)

      setPageInfo({
        ...pageInfo,
        page: res.page,
        total: res.totalPages,
      })

      setSearchList([...searchList])
      return searchList
    }
  }

  const ModalContents = () => {
    return <>
      <div style={{
        width: '100%',
        backgroundColor: column.type === 'base' || column.type === 'baseReadonly' ? '#00000000' : 'white'
      }}>
        <div onClick={() => {
          setIsOpen(true)
        }}>
          <p style={{textDecoration: 'underline', padding: 0, margin: 0, color: column.type === 'base' || column.type === 'baseReadonly' ? 'white' : 'black', textAlign: 'center'}}>LOT 보기</p>
        </div>
      </div>
    </>
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
              <div style={{cursor: 'pointer', marginLeft: 20}} onClick={() => {
                setIsOpen(false)
              }}>
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
              <HeaderTableText>{row.customer ?? '-'}</HeaderTableText>
            </HeaderTableTextInput>
            <HeaderTableTitle>
              <HeaderTableText style={{fontWeight: 'bold'}}>모델</HeaderTableText>
            </HeaderTableTitle>
            <HeaderTableTextInput style={{width: 144}}>
              <HeaderTableText>{row.model ?? '-'}</HeaderTableText>
            </HeaderTableTextInput>
          </HeaderTable>
          <HeaderTable>
            <HeaderTableTitle>
              <HeaderTableText style={{fontWeight: 'bold'}}>CODE</HeaderTableText>
            </HeaderTableTitle>
            <HeaderTableTextInput style={{width: 144}}>
              <HeaderTableText>{row.code ?? '-'}</HeaderTableText>
            </HeaderTableTextInput>
            <HeaderTableTitle>
              <HeaderTableText style={{fontWeight: 'bold'}}>품명</HeaderTableText>
            </HeaderTableTitle>
            <HeaderTableTextInput style={{width: 144}}>
              <HeaderTableText>{row.product_name ?? '-'}</HeaderTableText>
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
              headerList={column.key === 'baseReadonly' ? searchModalList.lotDeliveryInfoReadonly : searchModalList.lotDeliveryInfo}
              row={searchList ?? [{}]}
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
              // setSelectRow={(e) => {
              //   setSelectRow(e)
              // }}
              setSelectRow={(e) => {
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
            : <div style={{height: 45, display: 'flex', alignItems: 'flex-end'}}>
              <div
                onClick={() => {
                  setIsOpen(false)
                }}
                style={{
                  width: 888,
                  height: 40,
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
                    amount: totalDelivery,
                    name: row.name,
                    isChange: true
                  })

                  setIsOpen(false)
                }}
                style={{
                  width: 888,
                  height: 40,
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
