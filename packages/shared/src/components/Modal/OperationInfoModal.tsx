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
import {UploadButton} from '../../styles/styledComponents'
import {TransferCodeToValue} from '../../common/TransferFunction'
import {useDispatch} from "react-redux";
import {change_operation_searchKey} from "../../reducer/operationRegisterState";
import {useRouter} from "next/router";
import Tooltip from 'rc-tooltip'
import 'rc-tooltip/assets/bootstrap_white.css';
interface IProps {
  column: IExcelHeaderType
  row: any
  onRowChange: (e: any) => void
  modify?: boolean
}

const optionList = ['수주 번호', '거래처명', '모델', 'CODE', '품명', '지시고유번호']

const OperationInfoModal = ({column, row, onRowChange}: IProps) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('기계')
  const [optionIndex, setOptionIndex] = useState<number>(0)
  const [keyword, setKeyword] = useState<string>('')
  const [selectRow, setSelectRow] = useState<number>()
  const [searchList, setSearchList] = useState<any[]>([{seq: 1}])
  const [searchKeyword, setSearchKeyword] = useState<string>('')
  const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
    page: 1,
    total: 1
  })

  useEffect(() => {
    if(isOpen) {
      SearchBasic()
    }
  }, [isOpen, searchKeyword])
  // useEffect(() => {
  //   if(pageInfo.total > 1){
  //     SearchBasic(keyword, optionIndex, pageInfo.page).then(() => {
  //       Notiflix.Loading.remove()
  //     })
  //   }
  // }, [pageInfo.page])

  const changeRow = (row: any, key?: string) => {
    let tmpData = {
      ...row,
      identification: row.identification ?? "-",
      date: row.date ?? "-",
      customer_id: row.product?.customer?.name ?? "-",
      cm_id: row.product?.model?.model ?? "-",
      code: row.product?.code ?? "-",
      name: row.product?.name ?? "-",
      type: (row.product?.type || row.product?.type === 0) ? TransferCodeToValue(Number(row.product?.type), 'product') : '-',
      process_id: row.product.process?.name ?? "-",
    }

    return tmpData
  }

  const SearchBasic = async () => {
    Notiflix.Loading.circle()
    const res = await RequestMethod('get', `sheetList`, {
      params: {
        contractIds: row.contract_id,
        // nz: true
      }
    })

    if(res){
      let searchList = res.info_list.map((row: any, index: number) => {
        return changeRow(row)
      })

      setSearchList([...searchList.map((v, i) => {
        return{
          seq: i+1,
          ...v,
        }
      })])
    }
  }

  const ModalContents = () => (
          <UploadButton onClick={() => {
            if(column?.type !== "register"){
              setIsOpen(true)
            }else{
              if(row?.productId){
                // dispatch(change_operation_searchKey(row?.identification))
                // router.push('/mes/operationV1u/register')

                router.push({
                  pathname: `/mes/operationV1u/register`,
                  query: {key : row?.identification}
                });

              }else{
                Notiflix.Report.warning("수주번호가 없습니다.", "", "확인")
              }
            }
          }} hoverColor={POINT_COLOR} haveId={column?.type !== "register"}>
            <p>{column?.type !== "register" ? "작업 지시 보기" : "작업 지시 등록"}</p>
          </UploadButton>
      )

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
              }}>작업 지시 보기 (해당 수주 번호의 작업 지시를 확인할 수 있습니다)</p>
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
            <div style={{display: 'flex', justifyContent: 'flex-end', margin: '24px 48px 8px 0'}}>
              <Button onClick={() => {
                let tmp = searchList

                setSearchList([
                  ...searchList,
                  {
                    seq: searchList.length+1
                  }
                ])
              }}>
                <p>행 추가</p>
              </Button>
              <Button style={{marginLeft: 16}} onClick={() => {
                if(selectRow === 0){
                  return
                }
                let tmpRow = searchList

                let tmp = tmpRow[selectRow]
                tmpRow[selectRow] = tmpRow[selectRow - 1]
                tmpRow[selectRow - 1] = tmp

                setSearchList([...tmpRow.map((v, i) => {
                  return {
                    ...v,
                    seq: i+1
                  }
                })])
              }}>
                <p>위로</p>
              </Button>
              <Button style={{marginLeft: 16}} onClick={() => {
                if(selectRow === searchList.length-1){
                  return
                }
                let tmpRow = searchList

                let tmp = tmpRow[selectRow]
                tmpRow[selectRow] = tmpRow[selectRow + 1]
                tmpRow[selectRow + 1] = tmp

                setSearchList([...tmpRow.map((v, i) => {
                  return {
                    ...v,
                    seq: i+1
                  }
                })])
              }}>
                <p>아래로</p>
              </Button>
            </div>
            <div style={{padding: '0 16px', width: 1776}}>
              <ExcelTable
                  headerList={searchModalList.operationInfo}
                  row={searchList ?? [{}]}
                  setRow={(e) => setSearchList([...e])}
                  width={1746}
                  rowHeight={32}
                  height={552}
                  // onRowClick={(clicked) => {const e = searchList.indexOf(clicked) 
                  //   setSelectRow(e)
                  // }}
                  onRowClick={(clicked) => {const rowIdx = searchList.indexOf(clicked)
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
  width: 100%;
  height:100%;
  display: flex;
  justify-content:center;
  align-items:center;
`

const Button = styled.div`
    width:112px;
    height:32px;
    color:white;
    font-size:15px;
    border:none;
    border-radius:6px;
    text-decoration: underline;
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
  width: 99px;
  padding: 0 8px;
  display: flex; 
  align-items: center;
`

export {OperationInfoModal}
