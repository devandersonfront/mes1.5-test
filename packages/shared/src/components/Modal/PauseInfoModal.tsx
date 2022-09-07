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
import {UploadButton} from "../../styles/styledComponents";
import { sum } from 'lodash'

interface IProps {
  column: IExcelHeaderType
  row: any
  onRowChange: (e: any) => void
  modify?: boolean
}

const PauseInfoModal = ({column, row, onRowChange, modify}: IProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [totalSec, setTotalSec] = useState<number>(0)
  const [selectRow, setSelectRow] = useState<number>()
  const [searchList, setSearchList] = useState<any[]>([])
  const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
    page: 1,
    total: 1
  })
  const hasData = row['pause_reasons'] && row['pause_reasons'].length > 0
  const secondsToHMS = (seconds:number) => {
    return {
      seconds,
      hour:Math.floor(seconds / 3600),
      minute:Math.floor(seconds % 3600 / 60),
      second:Math.floor(seconds % 3600 % 60),
    }
  }

  useEffect(() => {
      if(column.type !== 'readonly') {
        if(isOpen && (row.processId || row.product.processId)){
          loadPauseList()
        } else if(column.type === 'modify' && hasData){
          setTotalSec(sum(row.pause_reasons.map(reason => reason.amount)))
        }
      } else {
        if(hasData) {
          let total = 0
          setSearchList([ ...row.pause_reasons.map(v => {
            const times = secondsToHMS(v.amount)
            total += v.amount
            return {
              ...v,
              ...v.pause_reason,
              ...times
            }
          }) ])
          setTotalSec(total)
        }
      }
    }, [isOpen, pageInfo.page])

  const toHHMMSS = (seconds: number) => {
    const times = secondsToHMS(seconds)
    return `${times.hour.toString().padStart(2,'0')}:${times.minute.toString().padStart(2,'0')}:${times.second.toString().padStart(2,'0')}`
  }

  const changeRow = (rows: any) => {
    let reasonMap
    if(hasData) {
      reasonMap = row.pause_reasons.reduce((map, obj) => {
        map.set(obj.pause_reason.ppr_id, obj.amount);
        return map;
      }, new Map);
    }
    return rows.map(row => {
      const times = secondsToHMS(hasData ? reasonMap.get(row.ppr_id) ?? 0 : 0)
      return {
        ...row,
        ...times
      }
    })
  }

  const loadPauseList = async () => {
    Notiflix.Loading.circle()
    const res = await RequestMethod('get', `pauseReasonSearch`,{
      path: {
        page: pageInfo.page,
        renderItem: 22,
        process_id: row.processId ?? row.product.processId,
      }
    })

    if(res){
      const resSearchList = changeRow(res.info_list)
      setPageInfo({page: res.page, total:res.totalPages})
      setSearchList(prev => res.page > 1? [... prev, ...resSearchList] : [...resSearchList])
    }
    Notiflix.Loading.remove()
  }

  const getWorkTime = () => {
    return (moment(row.end).toDate().getTime() - moment(row.start).toDate().getTime()) / 1000
  }



  const ModalContents = () => (
        <UploadButton onClick={() => {
          setIsOpen(true)
        }} hoverColor={POINT_COLOR} haveId status={column.modalType ? "modal" : "table"}>
          <p>{toHHMMSS(totalSec)}</p>
        </UploadButton>
      )

  const ModalButtons = () => {
    return <div style={{ height: 40, display: 'flex', alignItems: 'flex-end'}}>
      {
        column.type !== 'readonly' && <div
              onClick={onCancelEvent}
              style={{width: "50%", height: 40, backgroundColor: '#E7E9EB', display: 'flex', justifyContent: 'center', alignItems: 'center'}}
          >
            <p style={{color: '#717C90'}}>취소</p>
          </div>
      }
      <div
        onClick={() => {
          try{
            if(column.type !== 'readonly'){
              if(selectRow !== undefined && selectRow !== null){
                if(getWorkTime() < totalSec) throw("작업 시간보다 일시 정지 시간이 더 클 수 없습니다.")
                  onRowChange({
                    ...row,
                    pause_reasons: [
                      ...searchList.map(v => {
                        return ({
                          amount: v.seconds,
                          pause_reason: v
                        })
                      })
                    ],
                    isChange: true
                  })

                }
              }
            onCloseModalEvent()
          } catch(errMsg){
            Notiflix.Report.warning('경고', errMsg, '확인')
          }
        }}
        style={{width: column.type !== 'readonly' ? "50%" : "100%", height: 40, backgroundColor: POINT_COLOR, display: 'flex', justifyContent: 'center', alignItems: 'center'}}
      >
        <p>{column.type !== 'readonly' ? "등록하기" : "확인"}</p>
      </div>
    </div>
  }

  const onCloseModalEvent = () => {
    setIsOpen(false)
    setPageInfo({page:1, total:1})
    setSearchList([])
  }

  const onCancelEvent = () => {
    onCloseModalEvent()
    if(hasData){
      setTotalSec(sum(row.pause_reasons.map(reason => reason.amount)))
    } else {
      setTotalSec(0)
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
          height: 803
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
            }}>일시 정지 시간 ({row.identification})</p>
            <div style={{display: 'flex', alignItems: 'center', justifyContent:'center', height: 28}}>
              <div style={{display: 'flex'}}>
                <p style={{margin: 0, padding: 0, fontSize: 22, fontWeight: 'bold'}}>총 시간</p>
                <div style={{
                  backgroundColor: 'white', width: 144, height: 28, border: '1px solid #B3B3B3', marginLeft: 16, marginRight: 32,
                  display: 'flex', alignItems: 'center', paddingTop:3
                }}>
                  <p style={{margin:0, padding: '0 0 0 8px'}}>{toHHMMSS(totalSec)}</p>
                </div>
              </div>
              {/*<Button>*/}
              {/*  <p>엑셀로 받기</p>*/}
              {/*</Button>*/}
              <div style={{cursor: 'pointer', marginLeft: 20}} onClick={onCancelEvent}>
                <img style={{width: 20, height: 20}} src={IcX}/>
              </div>
            </div>
          </div>
          <div style={{padding: '0 16px', width: 1776}}>
            <ExcelTable
              headerList={ column.type === 'readonly' ? searchModalList.pauseTimeReadOnly : searchModalList.pauseTime }
              row={searchList ?? []}
              setRow={(e) => {
                const newReasons = e.map(reason => {
                  const seconds = reason.isChange ? Number(reason.hour) * 3600 + Number(reason.minute) * 60 + Number(reason.second) : reason.seconds
                  if(reason.isChange){
                    setTotalSec(totalSec - reason.seconds + seconds)
                  }
                  return {
                    ...reason,
                    seconds,
                    isChange: undefined
                  }
                })
                setSearchList(newReasons)
              }}
              width={1746}
              rowHeight={32}
              height={718}
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

export {PauseInfoModal}
