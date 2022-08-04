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

interface IProps {
  column: IExcelHeaderType
  row: any
  onRowChange: (e: any) => void
  modify?: boolean
}

const optionList = ['제조번호','제조사명','기계명','','담당자명']



const PauseInfoModal = ({column, row, onRowChange, modify}: IProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [totalTime, setTotalTime] = useState<string>('00:00:00')
  const [totalSec, setTotalSec] = useState<number>(0)
  const [selectRow, setSelectRow] = useState<number>()
  const [searchList, setSearchList] = useState<any[]>([])
  const [searchKeyword, setSearchKeyword] = useState<string>('')
  const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
    page: 1,
    total: 1
  })
  const [initProp, setInitProp]  = useState<{isInit: boolean, initTotal:string}>({isInit: true, initTotal:'00:00:00'})
  const hasData = row['pause_reasons'] && row['pause_reasons'].length > 0
  useEffect(() => {
      if(column.type !== 'readonly') {
        initialize()
        if(isOpen && row.process_id && row.process_id !== '-' && searchList.findIndex((e) => !!e.amount) === -1) {
          loadPauseList()
        }
      } else {
        if(hasData) {
          let total = 0
          setSearchList([ ...row.pause_reasons.map(v => {

            let sec = v.amount
            let hour = Math.floor(sec / 3600)
            sec = sec % 3600
            let min = Math.floor(sec / 60)
            sec = sec % 60

            total += v.amount

            return {
              ...v,
              ...v.pause_reason,
              hour: hour,
              minute: min,
              second: sec,
              amount: `${hour >= 10 ? hour : '0' + hour}:${min >= 10 ? min : '0' + min}:${sec >= 10 ? sec : '0' + sec}`
            }
          }) ])

          sumTotalTime(total)
        }
      }
    }, [isOpen, row['pause_reason'], searchKeyword])

  useEffect(() => {
    if(isOpen && pageInfo.page!=1)
    {
      loadPauseList()
    }
  },[pageInfo.page])

  const initialize = () => {
    if(initProp.isInit){
      let initTotal = 0
      if(hasData){
        row.pause_reasons.map(reason => {
          initTotal += reason.amount
        })
      }
      setInitProp({isInit:false, initTotal: sumTotalTime(initTotal) })
    }
  }

  const changeRow = (eachRow: any, key?: string) => {
    let second, minute, hour = 0
    if(hasData) {
      const reasonMap = new Map<number, any>(row.pause_reasons.map(reason =>
        [reason.pause_reason.ppr_id, reason]
      ))
      second = reasonMap.get(eachRow.ppr_id)?.amount ?? 0
      hour = Math.floor(second / 3600)
      second = second % 3600
      minute = Math.floor(second / 60)
      second = second % 60
    }
    let tmpData = {
      ...eachRow,
      machine_id: eachRow.name,
      machine_idPK: eachRow.machine_id,
      manager: eachRow.manager ? eachRow.manager.name : null,
      second,
      minute,
      hour,
      amount: `${hour >= 10 ? hour : '0' + hour}:${minute >= 10 ? minute : '0' + minute}:${second >= 10 ? second : '0' + second}`
    }

    return tmpData
  }

  const sumTotalTime = (total: number) => {
    let sec = total
    let hour = Math.floor(sec / 3600)
    sec = sec % 3600
    let min = Math.floor(sec / 60)
    sec = sec % 60
    const totalTime = `${hour >= 10 ? hour : '0' + hour}:${min >= 10 ? min : '0' + min}:${sec >= 10 ? Math.floor(sec) : '0' + Math.floor(sec)}`
    setTotalSec(sec)
    setTotalTime(totalTime)
    return totalTime
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
      let resSearchList = res.info_list.map((row: any, index: number) => {
        return changeRow(row)
      })

      setPageInfo({page: res.page, total:res.totalPages})
      setSearchList([...searchList, ...resSearchList])
    }
  }

  const ModalContents = () => (
        <UploadButton onClick={() => {
          setIsOpen(true)
        }} hoverColor={POINT_COLOR} haveId status={column.modalType ? "modal" : "table"}>
          <p>{totalTime}</p>
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
          if(column.type !== 'readonly'){
            if(selectRow !== undefined && selectRow !== null){
              onRowChange({
                ...row,
                pause_reasons: [
                  ...searchList.map(v => {
                    return ({
                      amount: v.time_sec ?? 0,
                      pause_reason: v
                    })
                  })
                ],
                name: row.name,
                isChange: true
              })
            }
          }
          onCloseModalEvent()
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
    setInitProp({...initProp, isInit:true})
  }

  const onCancelEvent = () => {
    onCloseModalEvent()
    setIsOpen(false)
    if(!hasData){
      setTotalTime('00:00:00')
      setTotalSec(0)
    } else {
      setTotalTime(initProp.initTotal)
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
                  <p style={{margin:0, padding: '0 0 0 8px'}}>{totalTime}</p>
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
                let addIndex = 0
                let ppr_id = ''
                let reason = ''
                let total = 0
                let tmpRow = e.map((v, i) => {
                  let time_sec = 0
                  if(v.add) {
                    addIndex = i+1
                    reason = v.reason
                    ppr_id = v.ppr_id
                  }

                  if(v.hour || v.minute || v.second){
                    const numHour = v.hour === undefined ? 0 : Number(v.hour)
                    const numMinute = v.minute === undefined ? 0 : Number(v.minute)
                    const numSecond = v.second === undefined ? 0 : Number(v.second)

                    time_sec = (numHour*3600)+(numMinute*60)+(Math.floor(numSecond))

                    total = total+time_sec
                  }

                  sumTotalTime(total)

                  return {
                    ...v,
                    time_sec,
                    add: false,
                  }
                })
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
