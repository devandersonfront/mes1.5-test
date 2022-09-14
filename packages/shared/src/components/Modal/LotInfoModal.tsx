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
import Tooltip from 'rc-tooltip'
import 'rc-tooltip/assets/bootstrap_white.css';
interface IProps {
  column: IExcelHeaderType
  row: any
  onRowChange: (e: any) => void
}

const optionList = ['제조번호','제조사명','기계명','','담당자명']

const LotInfoModal = ({column, row, onRowChange}: IProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [searchList, setSearchList] = useState<any[]>([{seq: 1}])
  const [ pageInfo, setPageInfo ] = useState({ page : 1, total :1})

  useEffect(() => {
    if(isOpen) {
      if(row.productId){
        SearchBasic('', 0, 1)
      }
    }
  }, [isOpen])

  useEffect(() => {
    if(isOpen && pageInfo.page > 1){
      SearchBasic('', 0, pageInfo.page)
    }
  }, [ pageInfo.page ])


  const changeRow = (row: any, i: number) => {

    return {
      seq: i+1,
      lot_number: row.sum?.lot_number,
      start: row.sum?.start,
      end: row.sum?.end,
      worker: `${row.sum?.worker?.name ?? '-'} ${row.elements?.length > 1 ? `외 ${row.elements?.length-1}명`: ''}`,
      amount: row.sum?.current
    }

  }

  const SearchBasic = async (keyword: any, option: number, page: number) => {
    Notiflix.Loading.circle()
    const res = await RequestMethod('get', `recordGroupList`,{
      path: {
        product_id: row.productId,
        page: page,
        renderItem: 18,
      },
      params:{
        keyword:keyword
      }
    })

    if(res){

      let tmp
      if(typeof res === 'string'){
        let tmpRowArray = res.split('\n')

        tmp = tmpRowArray.map(v => {
          if(v !== ""){
            let tmp = JSON.parse(v)
            return tmp
          }
        }).filter(v=>v)
      }else{
        tmp = [...res?.info_list]
      }

      let searchList = tmp.map((row: any, index: number) => {
        return changeRow(row, index)
      })

      setPageInfo({
        page: res.page,
        total: res.totalPages,
      })

      setSearchList([...searchList])
    }
  }

  const ModalContents = () =>
      <UploadButton onClick={() => {
        setIsOpen(true)
      }} hoverColor={POINT_COLOR} haveId >
          <p style={{textDecoration: 'underline', padding: 0, margin: 0}}>LOT 보기</p>
      </UploadButton>

  const headers = [
    [
      {key:'거래처', value: row.customer_id ?? '-'},
      {key:'모델', value:  row.cm_id ?? '-'},
    ],
    [
      {key:'CODE', value: row.code ?? '-'},
      {key:'품명', value: row.name ?? '-'},
      {key:'품목 종류', value: row.type ?? '-'}
    ],
    [
      {key:'단위', value: row.unit ?? '-'},
      {key:'재고량', value: row.stock ?? 0}
    ]
  ]

  const Headers = () => (
    headers.map(header =>
      <HeaderTable>
        {
          header.map(headerItem => {
            if(headerItem){
              return <>
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
            }
          })
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
            }}>LOT별 재고 현황</p>
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
            Headers()
          }
          <div style={{display: 'flex', justifyContent: 'space-between', height: 64}}>
            <div style={{height: '100%', display: 'flex', alignItems: 'flex-end', paddingLeft: 16,}}>
              <div style={{ display: 'flex', width: 1200}}>
                <p style={{fontSize: 22, padding: 0, marginBottom: 8}}>{column.type === 'readonly'? "LOT 별 수량" : "작업이력"}</p>
              </div>
            </div>
          </div>
          <div style={{padding: '0 16px', width: 1776}}>
            <ExcelTable
              headerList={searchModalList.lotStock}
              row={searchList ?? [{}]}
              setRow={(e) => setSearchList([...e])}
              width={1746}
              rowHeight={32}
              height={568}
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
              scrollEnd={(isEnd) => {
                if(isEnd) {
                  if (pageInfo.total > pageInfo.page) {
                    setPageInfo({ ...pageInfo, page: pageInfo.page + 1 })
                  }
                }
              }}
            />
          </div>
            <div style={{height: 45, display: 'flex', alignItems: 'flex-end'}}>
              <div
                onClick={() => {
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
  overflow: hidden;
  text-overflow: ellipsis;
`

const HeaderTableTitle = styled.div`
  width: 99px;
  padding: 0 8px;
  display: flex;
  align-items: center;
`

export {LotInfoModal}
