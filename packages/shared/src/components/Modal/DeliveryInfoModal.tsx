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
import {TransferCodeToValue} from '../../common/TransferFunction'
import Tooltip from 'rc-tooltip'
import 'rc-tooltip/assets/bootstrap_white.css';

interface IProps {
  column: IExcelHeaderType
  row: any
  onRowChange: (e: any) => void
}

const optionList = ['제조번호','제조사명','기계명','','담당자명']

const DeliveryInfoModal = ({column, row, onRowChange}: IProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [searchList, setSearchList] = useState<any[]>([])
  const [total, setTotal] = useState<number>(0)

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
      customer_id: row.product?.customer?.name,
      cm_id: row.product?.model?.model,
      product_id: row.product?.code,
      name: row.product?.name,
      type: TransferCodeToValue(row.product?.type, 'product'),
      unit: row.product?.unit,
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
        renderItem: 15,
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

  const headers = [
    [
      {key:'수주번호', value: row.identification ?? '-'},
      {key:'수주 날짜', value:  row.date ?? '-'},
      {key:'납품 기한', value: row.deadline ?? '-'},
    ],
    [
      {key:'거래처', value: row.customer_id ?? '-'},
      {key:'모델', value: row.cm_id ?? '-'},
      {key:'CODE', value: row.code ?? '-'},
      {key:'품명', value: row.name ?? '-'},
      {key:'품목 종류', value: row.type ?? '-'}
    ],
    [
      {key:'단위', value: row.unit ?? '-'},
      {key:'수주량', value: row.amount ?? '-'}
    ]
  ]

  const Headers = () => (
    headers.map(header =>
      <HeaderTable>
        {
          header.map(headerItem =>
            <>
              <HeaderTableTitle>
                <HeaderTableText style={{fontWeight: 'bold'}}>{headerItem.key}</HeaderTableText>
              </HeaderTableTitle>
              <HeaderTableTextInput style={{width: 144}}>
                <Tooltip placement={'rightTop'}
                         overlay={
                           <div style={{fontWeight : 'bold'}}>
                             {headerItem.value}
                           </div>
                         } arrowContent={<div className="rc-tooltip-arrow-inner"></div>}>
                  <HeaderTableText>{headerItem.value}</HeaderTableText>
                </Tooltip>
              </HeaderTableTextInput>
            </>
          )
        }
      </HeaderTable>
    )
  )

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
          {
            Headers()
          }
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
              onRowClick={(clicked) => {const rowIdx = searchList.indexOf(clicked)
                if(!searchList[rowIdx]?.border){
                  const newSearchList = searchList.map((v,i)=> ({
                    ...v,
                    border : i === rowIdx
                  }))
                  setSearchList(newSearchList)
                }
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
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

`

const HeaderTableTitle = styled.div`
  width: 99px;
  padding: 0 8px;
  display: flex; 
  align-items: center;
`

export {DeliveryInfoModal}
