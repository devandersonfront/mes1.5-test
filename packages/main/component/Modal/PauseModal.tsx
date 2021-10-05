import React, {useEffect, useState} from 'react'
import {IExcelHeaderType} from '../../common/@types/type'
import styled from 'styled-components'
import Modal from 'react-modal'
import {MAX_VALUE, POINT_COLOR} from '../../common/configset'
//@ts-ignore
import IcSearchButton from '../../public/images/ic_search.png'
//@ts-ignore
import IcX from '../../public/images/ic_x.png'
import ExcelTable from '../Excel/ExcelTable'
import {searchModalList} from '../../common/modalInit'
//@ts-ignore
import Search_icon from '../../public/images/btn_search.png'
import {RequestMethod} from '../../common/RequestFunctions'
import {UnitBox, UnitValue, UnitWrapper, UploadButton} from '../../styles/styledComponents'
import Notiflix from 'notiflix'
import UnitContainer from '../Unit/UnitContainer'
import moment from 'moment'

interface IProps {
  column: IExcelHeaderType
  row: any
  onRowChange: (e: any) => void
}

const optionList = ['고객사명','모델명','CODE', '품명', '재질']

const PoorQuantityModal = ({column, row, onRowChange}: IProps) => {
  const [isExist, setIsExist] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('불량 수량')
  const [optionIndex, setOptionIndex] = useState<number>(0)
  const [keyword, setKeyword] = useState<string>('')
  const [selectRow, setSelectRow] = useState<number>(-1)
  const [searchList, setSearchList] = useState<any[]>([])
  const [total, setTotal] = useState<string>('')

  useEffect(() => {
    if(row['paused_times'] && row['paused_times'].length){
      setSearchList([...row.paused_times])
    }else{
      if(column.searchType === 'list'|| column.searchType === 'disable'){
        SearchDefect().then(() => {
          // Notiflix.Loading.remove()
        })
      }else{
        SearchBasic(keyword, 0).then(() => {
          // Notiflix.Loading.remove()
        })
      }
    }
  }, [isOpen, row['process_id']])

  useEffect(() => {
    if(selectRow >= 0) {
      if(searchList[selectRow].pp_id){
        ProductProcessSearch(searchList[selectRow].pp_id)
      }
    }
  }, [selectRow])

  const changeRow = (row: any, key?: string) => {
    let tmpData = {
        ...row,
        start: `${moment().format('YYYY-MM-DD HH:mm')}:00`,
        end: null
      }

    return tmpData
  }

  const SearchBasic = async (keyword: any, option: number) => {
    // Notiflix.Loading.circle()
    const res = await RequestMethod('get', `pauseSearch`,{
      path: {
        page: 1,
        renderItem: MAX_VALUE,
        process_id: row.process_idPK,
      },
      params: {
        keyword: keyword ?? '',
        opt: option ?? 0
      }
    })

    if(res && res.status === 200){
      if(res.results.info_list.length > 0){

        let searchList = res.results.info_list.map((row: any, index: number) => {
          return changeRow(row)
        })
        setSearchList([...searchList])

      } else {
        setIsExist(true)
        setSearchList([{
          reason: '일시 정지 시간 전체',
          amount: row.paused_timePK / 60,
          paused_time: row.paused_time
        }])
      }
    }
  }


  const SearchDefect = async () => {
    // Notiflix.Loading.circle()
    const res = await RequestMethod('get', `recordPause`,{
      path: {
        or_id: row.or_id
      },
    })

    if(res && res.status === 200){
      if(res.results.paused_times.length){
        let searchList = res.results.paused_times.map((row: any, index: number) => {
          return {
            orp_id: row.orp_id,
            ppr_id: row.ppr.ppr_id,
            reason: row.ppr.reason,
            start: row.start,
            end: row.end,
            amount: row.amount
          }
        })

        setSearchList([...searchList])
      }else{
        setIsExist(true)
        setSearchList([{
          reason: '일시 정지 시간 전체',
          amount: row.paused_timePK / 60,
          paused_time: row.paused_time
        }])
      }
    }
  }

  const ProductProcessSearch = async (pp_id: number) => {
    const res = await RequestMethod('get', `productprocessList`,{
      path: {
        pp_id
      }
    })

    if(res && res.status === 200) {

    }
  }

  return (
    <>
    {
      !isExist ?
        (row.paused_time || row.paused_time === 0)
        ? <UnitWrapper onClick={() => {
          if(column.searchType === 'list' || column.searchType === 'disable'){
            if(row['or_id']) {
              setIsOpen(true)
            }
          }else{
            if(row['process_id']){
                setIsOpen(true)
            }else{
              Notiflix.Report.failure('실패', '공정을 먼저 선택해주세요', '확인')
            }
          }
        }}>
          <UnitValue>
            <p>{row.paused_time}</p>
          </UnitValue>
        </UnitWrapper>
        : <SearchModalWrapper>
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%'}}>
            <UploadButton onClick={() => {
              if(row['process_id']){
                setIsOpen(true)
              }else{
                Notiflix.Report.failure('실패', '공정을 먼저 선택해주세요', '확인')
              }
            }}>
              <p style={{fontSize: 13}}>일시정지 시간등록</p>
            </UploadButton>
          </div>
        </SearchModalWrapper>
        :
        <div style={{margin: 0, display: 'flex', justifyContent:'center'}} onClick={() => {
          if(column.searchType === 'disable'){
            if(row['or_id']) {
              setIsOpen(true)
            }
          }else{
            if(row['process_id']){
              setIsOpen(true)
            }else{
              Notiflix.Report.failure('실패', '공정을 먼저 선택해주세요', '확인')
            }
          }
        }}>
          <UnitValue>
            <p>{row.paused_time}</p>
          </UnitValue>
        </div>
    }
      <Modal isOpen={isOpen} style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          padding: 0,
          overflow:"hidden"
        },
        overlay: {
          background: 'rgba(0,0,0,.6)',
          zIndex: 5
        }
      }}>
        <div style={{
          width: 1776,
          height: 876
        }}>
          <div style={{
            marginTop: 24,
            marginLeft: 16,
            marginRight: 16,
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <p style={{
              color: 'black',
              fontSize: 22,
              fontWeight: 'bold',
              margin: 0,
            }}>일시 정지 시간</p>
            <div style={{cursor: 'pointer'}} onClick={() => {
              setIsOpen(false)
            }}>
              <img style={{width: 20, height: 20}} src={IcX}/>
            </div>
          </div>
          <div style={{padding: '0 16px 0 16px', width: 1776}}>
            <ExcelTable
              headerList={ column.searchType === 'disable' ? !isExist ? searchModalList.pauseDisable : searchModalList.pauseDisableExist : !isExist ? searchModalList.pause : searchModalList.pauseExist}
              row={searchList ?? []}
              setRow={(e) => {
                let addIndex = 0
                let ppr_id = ''
                let reason = ''
                let tmpRow = e.map((v, i) => {
                  if(v.add) {
                    addIndex = i+1
                    reason = v.reason
                    ppr_id = v.ppr_id
                  }
                  return {
                    ...v,
                    add: false
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
              height={772}
              setSelectRow={(e) => {
                setSelectRow(e)
              }}
              type={'searchModal'}
            />
          </div>
          <div style={{ height: 76, display: 'flex', alignItems: 'flex-end'}}>
            <div
              onClick={() => {
                if(selectRow !== undefined && selectRow !== null) {
                  let tmpTotal = 0
                  let tmpArry = searchList.map(v => {
                    let amount = isExist ? Number(v.amount)*60 : moment.duration(moment(v.end).diff(moment(v.start))).asSeconds()
                    if(isNaN(amount)){
                      amount = 0
                    }
                    tmpTotal+=amount
                    return {
                      ...v,
                      amount
                    }
                  })

                  let stringTime = ''
                  if(tmpTotal >= 0){
                    let seconds = Number(tmpTotal)
                    let hour = Math.floor(seconds/3600) < 10 ? '0'+ Math.floor(seconds/3600) :Math.floor(seconds/3600)
                    let min = Math.floor((seconds%3600)/60) < 10 ? '0'+ Math.floor((seconds%3600)/60) : Math.floor((seconds%3600)/60)
                    let sec = Math.floor(seconds%60) < 10 ? '0'+Math.floor(seconds%60) : Math.floor(seconds%60)

                    stringTime = hour+":"+min+":"+sec
                  }else{
                    stringTime = '00:00:00'
                    tmpTotal: 0
                  }

                  if(isExist){
                    onRowChange({
                      ...row,
                      paused_time: stringTime,
                      paused_timePK: tmpTotal,
                      isChange: true
                    })
                  }else{
                    onRowChange({
                      ...row,
                      paused_time: stringTime,
                      paused_timePK: tmpTotal,
                      paused_times: tmpArry,
                      isChange: true
                    })
                  }
                }
                setIsOpen(false)
              }}
              style={{width: '100%', height: 40, backgroundColor: POINT_COLOR, display: 'flex', justifyContent: 'center', alignItems: 'center'}}
            >
              <p>등록하기</p>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

const SearchModalWrapper = styled.div`
  display: flex;
  width: 100%;
`

export default PoorQuantityModal
