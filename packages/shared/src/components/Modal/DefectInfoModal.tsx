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
import moment from 'moment'
import CloseButton from '../Buttons/CloseButton'
import {UploadButton} from "../../styles/styledComponents";

interface IProps {
  column: IExcelHeaderType
  row: any
  onRowChange: (e: any) => void
  modify?: boolean
}

const DefectInfoModal = ({column, row, onRowChange}: IProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [totalCount, setTotalCount] = useState<number>(0)
  const [initCount, setInitCount] = useState<number>(0)
  const [selectRow, setSelectRow] = useState<number>()
  const [searchList, setSearchList] = useState<any[]>([])
  const [searchKeyword, setSearchKeyword] = useState<string>('')
  const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
    page: 1,
    total: 1
  })
  const hasData = row['defect_reasons'] && row['defect_reasons'].length || row['total_defect_reasons'] && row['total_defect_reasons'].length
  const isFromSheetList = column.load === 'sheet'
  useEffect(() => {
    if(column.type !== 'readonly') {
      if(isOpen && row.process_id && row.process_id !== '-' && searchList.findIndex((e) => !!e.amount) === -1) {
        loadDefectList()
      }else if(row.poor_quantity){
        setTotalCount(row.poor_quantity)
      }
    } else {
      if(hasData) {
        let total = 0
        setSearchList([...row.defect_reasons.map(v => {

          if(v.amount){
            total += Number(v.amount)
          }

          return ({
            ...v,
            ...v.defect_reason,
          })
        })])

        setTotalCount(total)
      } else {
        if(isFromSheetList) setTotalCount(row.total_poor_quantity)
      }
    }
  }, [isOpen, searchKeyword, row['defect_reasons'], row['total_defect_reasons']])

  const changeRow = (eachRow: any, reasonMap: Map<number, any>) => {
    const amount = reasonMap.get(eachRow.pdr_id)?.amount ?? 0
    let tmpData = {
      ...eachRow,
      machine_id: eachRow.name,
      machine_idPK: eachRow.machine_id,
      manager: eachRow.manager ? eachRow.manager.name : null,
      amount
    }

    return tmpData
  }

  const changeRowSheet = (row: any, key?: string) => {
    let tmpData = {
      ...row,
      process_name: row.pdr.process_name,
      reason: row.pdr.reason
    }

    return tmpData
  }


  const loadDefectList = async () => {
    Notiflix.Loading.circle()
    const res = await RequestMethod('get', `defectReasonSearch`,{
      path: {
        page: pageInfo.page,
        renderItem: 22,
      }
    })

    if(res){
      const reasonMap = new Map<number, any>()
      if(hasData) {
        let totalAmount = 0
        row.defect_reasons.map(reason => {
          reasonMap.set(reason.defect_reason.pdr_id, reason)
          totalAmount += Number(reason.amount)
        })
        setInitCount(totalAmount)
        setTotalCount(totalAmount)
      }
      let searchList = res.info_list.map((row: any, index: number) => {
        return changeRow(row, reasonMap)
      })

      setSearchList([...searchList])
    }
  }

  const loadDefectSheet = async () => {
    Notiflix.Loading.circle()
    const res = await RequestMethod('get', `sheetDefectList`,{
      path: {
        os_id: row.os_id
      }
    })

    if(res){
      let searchList = res.map((row: any, index: number) => {
        return changeRowSheet(row)
      })

      setSearchList([...searchList])
    }
  }

  const ModalContents = () => (
        <UploadButton onClick={() => {
          setIsOpen(true)
          if(column.load === 'sheet'){
            loadDefectSheet()
          }
        }} hoverColor={POINT_COLOR} haveId status={column.modalType ? "modal" : "table"}>
          <p style={{ textDecoration: 'underline', margin: 0, padding: 0}}>{totalCount}</p>
        </UploadButton>
    )

  const ModalButtons = () => {
    return <>
    <div style={{ height: 40, marginTop:10, display: 'flex', alignItems: 'space-between'}}>
      {
        column.type !== 'readonly' && <div
              onClick={onCancelEvent}
              style={{width: "50%", height: 40, backgroundColor: '#b3b3b3', display: 'flex', justifyContent: 'center', alignItems: 'center'}}
          >
            <p>취소</p>
          </div>
      }
      <div
        onClick={() => {
          if (column.type !== 'readonly' && row.sum < totalCount) {
            Notiflix.Report.warning("경고", "생산한 수량보다 적게 입력해주세요.", "확인",)
            return
          }
          if(row.sum === undefined || row.sum === 0) {
            if(column.type !== 'readonly' && row.good_quantity < totalCount){
              Notiflix.Report.warning("경고", "생산한 수량보다 적게 입력해주세요.", "확인",)
              return
            }
          }
          if(selectRow !== undefined && selectRow !== null ){
            onRowChange({
              ...row,
              poor_quantity: totalCount,
              defect_reasons: [
                ...searchList.map(v => ({
                  amount: v.amount,
                  defect_reason: v
                }))
              ],
              name: row.name,
              isChange: true,
              total_poor_quantity: isFromSheetList ? totalCount : null
            })
          }
          onCloseModalEvent()
        }}
        style={{width: column.type !== 'readonly' ? "50%" : "100%", height: 40, backgroundColor: POINT_COLOR, display: 'flex', justifyContent: 'center', alignItems: 'center'}}
      >
        <p>{column.type !== 'readonly' ? "등록하기" : "확인"}</p>
      </div>
    </div>
    </>
  }

  const onCloseModalEvent = () => {
    setIsOpen(false)
    setPageInfo({page:1, total:1})
    setSearchList([])
  }

  const onCancelEvent = () => {
    onCloseModalEvent()
    if(!hasData){
      setTotalCount(0)
    } else {
      setTotalCount(initCount)
      setInitCount(0)
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
          height: 800,
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
            }}>불량 유형별 수량 ({row['identification']})</p>
            <div style={{display: 'flex', alignItems: 'center', justifyContent:'center', height: 28}}>
              <div style={{display: 'flex'}}>
                <p style={{margin: 0, padding: 0, fontSize: 22, fontWeight: 'bold'}}>총 불량 개수</p>
                <div style={{
                  backgroundColor: 'white', width: 144, height: 28, border: '1px solid #B3B3B3', marginLeft: 16, marginRight: 32,
                  display: 'flex', alignItems: 'center', paddingTop:3, paddingLeft: 8
                }}>
                  <p style={{margin:0, padding: 0}}>{totalCount}</p>
                </div>
              </div>
              {/*<Button>*/}
              {/*  <p>엑셀로 받기</p>*/}
              {/*</Button>*/}
              <CloseButton onClick={onCancelEvent}/>
          </div>
          </div>
          <div style={{padding: '0 16px', width: 1776}}>
            <ExcelTable
              headerList={ searchModalList.defectCount({
                readonly : column.type
              })}
              row={searchList ?? []}
              setRow={(e) => {
                let addIndex = 0
                let ppr_id = ''
                let reason = ''
                let total = 0
                let tmpRow = e.map((v, i) => {
                  if(v.add) {
                    addIndex = i+1
                    reason = v.reason
                    ppr_id = v.ppr_id
                  }

                  if(v.amount){
                    total += Number(v.amount)
                  }

                  return {
                    ...v,
                    add: false
                  }
                })
                setTotalCount(total)

                if(addIndex){
                  tmpRow.splice(addIndex, 0, {
                    ppr_id,
                    reason,
                    start: `${moment().format('YYYY-MM-DD HH:mm')}:00`,
                    end: null,
                  })
                }


                setSearchList([...tmpRow])
              }}
              width={1746}
              rowHeight={32}
              height={706}
              onRowClick={(clicked) => {const e = searchList.indexOf(clicked)
                setSelectRow(e)
              }}
              type={'searchModal'}
              scrollEnd={(value) => {
                if(value){
                  if(pageInfo.total > pageInfo.page){
                    setPageInfo({...pageInfo, page:pageInfo.page+1})
                  }
                }
              }}
            />
          </div>
          {
            ModalButtons()
          }
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
  width: 99px;
  padding: 0 8px;
  display: flex;
  align-items: center;
`

export {DefectInfoModal}