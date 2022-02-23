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
import Notiflix from 'notiflix'
import {TransferCodeToValue} from '../../common/TransferFunction'

interface IProps {
  column: IExcelHeaderType
  row: any
  onRowChange: (e: any) => void
}

const optionList = ['제조번호','제조사명','기계명','','담당자명']

const DeliveryInfoModal = ({column, row, onRowChange}: IProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('기계')
  const [optionIndex, setOptionIndex] = useState<number>(0)
  const [keyword, setKeyword] = useState<string>('')
  const [selectRow, setSelectRow] = useState<number>()
  const [searchList, setSearchList] = useState<any[]>([])
  const [searchKeyword, setSearchKeyword] = useState<string>('')
  const [total, setTotal] = useState<number>(0)
  const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
    page: 1,
    total: 1
  })

  useEffect(() => {
    if(isOpen) {
      SearchBasic()
    }
  }, [row, isOpen])
  // useEffect(() => {
  //   if(pageInfo.total > 1){
  //     SearchBasic(keyword, optionIndex, pageInfo.page).then(() => {
  //       Notiflix.Loading.remove()
  //     })
  //   }
  // }, [pageInfo.page])

  const changeRow = (row: any, index: number) => {
    let total = 0
    row.lots.map(v => {
      if(v.amount) total += v.amount
    })

    let tmpData = {
      ...row,
      seq: index+1,
      identification: row.identification,
      date: row.date,
      total
    }
    setTotal(total)

    return tmpData
  }

  const SearchBasic = async () => {
    Notiflix.Loading.circle()
    const res = await RequestMethod('get', `shipmentSearch`,{
      path: {
        page: 1,
        renderItem: 100000,
      },
      params: {
        contract_id: row.contract_id
      }
    })

    if(res){
      let searchList = res.info_list.map((row: any, index: number) => {
        return changeRow(row, index)
      })

      setSearchList([...searchList])
    }
  }

  const ModalContents = () => {
    return <>
      <div style={{
        width: '100%'
      }}>
        <div onClick={() => {
          setIsOpen(true)
        }}>
          <p style={{padding: 0, margin: 0, textDecoration: 'underline'}}>{row.shipment_amount}</p>
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
            }}>수주별 납품 현황 (해당 수주 번호의 납품 현황을 확인할 수 있습니다)</p>
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
              <HeaderTableText>{row.identification ?? '-'}</HeaderTableText>
            </HeaderTableTextInput>
            <HeaderTableTitle>
              <HeaderTableText style={{fontWeight: 'bold'}}>수주 날짜</HeaderTableText>
            </HeaderTableTitle>
            <HeaderTableTextInput style={{width: 144}}>
              <HeaderTableText>{row.date ?? '-'}</HeaderTableText>
            </HeaderTableTextInput>
            <HeaderTableTitle>
              <HeaderTableText style={{fontWeight: 'bold'}}>납품 기한</HeaderTableText>
            </HeaderTableTitle>
            <HeaderTableTextInput style={{width: 144}}>
              <HeaderTableText>{row.deadline ?? '-'}</HeaderTableText>
            </HeaderTableTextInput>
          </HeaderTable>
          <HeaderTable>
            <HeaderTableTitle>
              <HeaderTableText style={{fontWeight: 'bold'}}>거래처</HeaderTableText>
            </HeaderTableTitle>
            <HeaderTableTextInput style={{width: 144}}>
              <HeaderTableText>{row.product?.customer?.name ?? '-'}</HeaderTableText>
            </HeaderTableTextInput>
            <HeaderTableTitle>
              <HeaderTableText style={{fontWeight: 'bold'}}>모델</HeaderTableText>
            </HeaderTableTitle>
            <HeaderTableTextInput style={{width: 144}}>
              <HeaderTableText>{row.product?.model?.model ?? '-'}</HeaderTableText>
            </HeaderTableTextInput>
            <HeaderTableTitle>
              <HeaderTableText style={{fontWeight: 'bold'}}>CODE</HeaderTableText>
            </HeaderTableTitle>
            <HeaderTableTextInput style={{width: 144}}>
              <HeaderTableText>{row.product?.code ?? '-'}</HeaderTableText>
            </HeaderTableTextInput>
            <HeaderTableTitle>
              <HeaderTableText style={{fontWeight: 'bold'}}>품명</HeaderTableText>
            </HeaderTableTitle>
            <HeaderTableTextInput style={{width: 144}}>
              <HeaderTableText>{row.product?.name ?? '-'}</HeaderTableText>
            </HeaderTableTextInput>
            <HeaderTableTitle>
              <HeaderTableText style={{fontWeight: 'bold'}}>품목 종류</HeaderTableText>
            </HeaderTableTitle>
            <HeaderTableTextInput style={{width: 144}}>
              <HeaderTableText>{(row.product?.type || row.product?.type === 0) ? TransferCodeToValue(row.product.type, 'productType') : '-' }</HeaderTableText>
            </HeaderTableTextInput>
          </HeaderTable>
          <HeaderTable>
            <HeaderTableTitle>
              <HeaderTableText style={{fontWeight: 'bold'}}>단위</HeaderTableText>
            </HeaderTableTitle>
            <HeaderTableTextInput style={{width: 144}}>
              <HeaderTableText>{row.product?.unit ?? '-'}</HeaderTableText>
            </HeaderTableTextInput>
            <HeaderTableTitle>
              <HeaderTableText style={{fontWeight: 'bold'}}>수주량</HeaderTableText>
            </HeaderTableTitle>
            <HeaderTableTextInput style={{width: 144}}>
              <HeaderTableText>{row.amount ?? 0}</HeaderTableText>
            </HeaderTableTextInput>
          </HeaderTable>
          <div style={{display: 'flex', justifyContent: 'space-between', height: 64}}>
            <div style={{height: '100%', display: 'flex', alignItems: 'flex-end', paddingLeft: 16,}}>
              <div style={{ display: 'flex', width: 1200}}>
                <p style={{fontSize: 22, padding: 0, marginBottom: 8}}>납품 현황</p>
              </div>
            </div>
            <div></div>
          </div>
          <div style={{padding: '0 16px', width: 1776}}>
            <ExcelTable
              headerList={searchModalList.deliveryInfo}
              row={searchList ?? [{}]}
              setRow={(e) => setSearchList([...e])}
              width={1746}
              rowHeight={32}
              height={560}
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
          <div style={{ height: 52, display: 'flex', alignItems: 'flex-end'}}>
            <div
              onClick={() => {
                setIsOpen(false)
              }}
              style={{width: "100%", height: 40, backgroundColor: POINT_COLOR, display: 'flex', justifyContent: 'center', alignItems: 'center'}}
            >
              <p>확인</p>
            </div>
          </div>
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
  margin-right: 70px;
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

export {DeliveryInfoModal}
