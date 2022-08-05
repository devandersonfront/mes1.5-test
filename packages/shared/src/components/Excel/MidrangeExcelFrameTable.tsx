import React, {ChangeEvent} from 'react';
import styled from "styled-components";
import {MidrangeExcelDropdown} from "../Dropdown/MidrangeExcelDropdown";
import moment from "moment";
import {
    InspectionFinalDataResult,
    InspectionInfo,
    MidrangeRecordRegister,
    MidrangeRecordType
} from '../../@types/type'
import {MidrangeDatetimePickerBox} from "../CalendarBox/MidrangeDatetimePickerBox";
import {MidrangeMemberSearchModal} from "../Modal/MidrangeMemberSearchModal";
import cookie from "react-cookies";
import { SelectChangeEvent } from '@mui/material'

type inspectionType = 'beginning' | 'middle' | 'end'
interface IProps {
    modalData: any
    setModalData: (e) => void
    readOnly: boolean
    hasResult: boolean
}

const MidrangeExcelFrameTable =  ({ modalData, setModalData, readOnly, hasResult }: IProps)  => {

    const inspectionPhases : {key:inspectionType, value:string}[] = [{key:'beginning', value:'초품'}, {key:'middle', value:'중품'}, {key:'end', value:'종품'}]
    React.useEffect(()=>{
        const legendary_list = modalData.legendary?.map((legend) => {
            return legend ?? ''
        })

        const newData = {
            legendary_list,
            version: modalData.version,
            sic_id: modalData.sic_id,
            writer: hasResult ? modalData.writer : cookie.load('userInfo'),
            record_id: modalData.record_id,
            inspection_info: hasResult ? modalData.inspection_info : initializeInspectionInfo(modalData.inspection_info),
            inspection_result: hasResult ? modalData.inspection_result : initializeInspectionResult(modalData.samples),
            inspection_time: modalData.inspection_time,
            samples: modalData.samples
        }
        setModalData(newData)
    },[])


    const initializeInspectionInfo = (inspectionInfo: MidrangeRecordType['inspection_info']) => {
        const addDataResult = (count: number) => {
            return Array.from({length: count}, (_, i) => ({sequence: i+1, pass: true, value: ''}))
        }
        inspectionPhases.forEach(phase =>
            inspectionInfo[phase.key] = inspectionInfo[phase.key].map(info => ({...info, data_result: addDataResult(info.samples)}))
        )
        return inspectionInfo
    }

    const initializeInspectionResult = (sampleCount: number) => {
        const dataResults = Array.from({length: sampleCount}, (_, i) => ({sequence: i+1, pass: true}))
        let res = {}
        inspectionPhases.map(phase => res[phase.key] = dataResults)
        return res
    }

    const recordChange = (inspection_type: inspectionType, e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>, itemIndex, dataResultIndex) => {
        const temp = {...modalData}
        if (temp.inspection_info?.[inspection_type]?.[itemIndex]?.data_result?.[dataResultIndex] !== undefined) {
            temp.inspection_info[inspection_type][itemIndex].data_result[dataResultIndex].value = e.target.value
        } else {
            temp.inspection_info[inspection_type][itemIndex].data_result[dataResultIndex] = {
                sequence: dataResultIndex,
                value: e.target.value,
                pass: true
            }
        }
        setModalData(temp)
    }


    const resultChange = (inspection_type: inspectionType, e: ChangeEvent<HTMLSelectElement>, resultIndex) => {
        const temp = {...modalData, inspection_result: {
                beginning: modalData.inspection_result['beginning'].map(v => ({...v})),
                middle: modalData.inspection_result['middle'].map(v => ({...v})),
                end: modalData.inspection_result['end'].map(v => ({...v})),
            }}
        if (temp.inspection_result[inspection_type]?.[resultIndex] !== undefined) {
            temp.inspection_result[inspection_type][resultIndex].pass = e.target.value === '합격'
        } else {
            temp.inspection_result[inspection_type][resultIndex] = {
                sequence: resultIndex + 1,
                pass: e.target.value === '합격'
            }
        }
        setModalData(temp)
    }


    const getCriteria = (type: inspectionType) => {
        return (
          <div style={{display:'flex'}}>
              <div style={{flex: 1.5}}>
                  <BottomLeftBorder style={{backgroundColor: 'white', height: '100%'}}>
                      <MidrangeDatetimePickerBox readOnly={readOnly} value={modalData.inspection_time[type]} onDateChange={(date)=>
                      {
                          const newData = {...modalData}
                          newData.inspection_time[type] = date.format("YYYY-MM-DD[T]HH:mm:ss")
                          setModalData(newData)
                      }}/>
                  </BottomLeftBorder>
              </div>
                <div style={{flex: 1.3, flexDirection:'column'}}>
                    {modalData.inspection_info?.[type].map((v,i) => (
                      <>
                      <BottomLeftBorder key={'item' + i} style={{textAlign: "center", height:'40px' }}>
                          {(v.name !== undefined ? v.name : '')+`(${v.unit})`}
                      </BottomLeftBorder>
                      </>))
                    }
                </div>
                <div style={{flex: 1, flexDirection:'column'}}>
                    {modalData.inspection_info?.[type]?.map((v,i) => (
                      <>
                          <BottomLeftBorder key={'range' + i} style={{height:'40px'}}>
                              <div>
                                  {v.standard}
                              </div>
                              <div style={{fontSize: '11px'}}>
                                  ({v.error_minimum}~{v.error_maximum})
                              </div>
                          </BottomLeftBorder>
                      </>))
                    }
                </div>
          </div>)
    }
    let arr = Array.from({length: 10}, (_, i) => '-')
    const getRecords = (type: inspectionType) => {
        return modalData.inspection_info[type]?.map((info,infoIdx)=>
              {
                  return (
                      <div style={{display:'flex'}}>
                          {arr.map((defaultValue,arrIdx)=> (
                                arrIdx > 8 ?
                                  <NoTopBorder style={{ flex: 1, height:'40px'}}>
                                      {info.type === 0
                                        ? <input style={{ width: '100%', height: '100%', border: "none", zIndex: 10, display: "flex", alignItems: "center", textAlign: "center"}} type={"number"}
                                                 value={modalData.samples > arrIdx ? info.data_result?.[arrIdx]?.value ?? '' : defaultValue }
                                                 key={type+'input'+infoIdx+'static'+arrIdx}
                                                 readOnly={readOnly}
                                                 placeholder={modalData.samples > arrIdx ? info.data_result?.[arrIdx]?.value ?? '0' : defaultValue}
                                                 onKeyDown={ (evt) => evt.key === 'e' && evt.preventDefault() } onChange={(e)=>recordChange(type,e,infoIdx,arrIdx)}/>
                                        : info.data_result?.[arrIdx] && modalData.samples > arrIdx
                                          ? <MidrangeExcelDropdown contents={modalData.legendary_list} value={info.data_result[arrIdx].value} onChange={(e)=>recordChange(type,e,infoIdx,arrIdx)} readOnly={readOnly}/>
                                          : defaultValue
                                      }
                                  </NoTopBorder>
                                  :<BottomLeftBorder style={{ flex: 1, height:'40px'}}>
                                    {info.type === 0
                                      ? <input style={{ width: '100%', height: '100%', border: "none", zIndex: 10, display: "flex", alignItems: "center", textAlign: "center"}} type={"number"}
                                               value={modalData.samples > arrIdx ? info.data_result?.[arrIdx]?.value ?? '' : defaultValue }
                                               key={type+'input'+infoIdx+'static'+arrIdx}
                                               readOnly={readOnly}
                                               placeholder={modalData.samples > arrIdx ? info.data_result?.[arrIdx]?.value ?? '0' : defaultValue}
                                               onKeyDown={ (evt) => evt.key === 'e' && evt.preventDefault() } onChange={(e)=>recordChange(type,e,infoIdx,arrIdx)}/>
                                      : info.data_result?.[arrIdx] && modalData.samples > arrIdx
                                        ? <MidrangeExcelDropdown contents={modalData.legendary_list} value={info.data_result[arrIdx].value} onChange={(e)=>recordChange(type,e,infoIdx,arrIdx)} readOnly={readOnly}/>
                                        : defaultValue
                                    }
                                </BottomLeftBorder>
                          ))}
                      </div>)
              }
            ).flatMap(result => result)
    }

    const getResults = (type: inspectionType) => {
        return(
          <div style={{display:'flex'}}>
              {arr.map((defaultValue,arrIdx)=>
                ( arrIdx > 8 ?
                    <NoTopBorder style={{flex:1, height:'40px'}}>
                        {modalData.samples > arrIdx ?
                          modalData.inspection_result[type]?.length > arrIdx && (modalData.inspection_result[type][arrIdx] !== undefined) ?
                            <MidrangeExcelDropdown contents={[ '합격', '불합격' ]}
                                                   onChange={(e) => resultChange(type, e, arrIdx)}
                                                   value={modalData.inspection_result[type][arrIdx].pass ? '불합격' : '합격'}
                                                   readOnly={readOnly}/>
                            :
                            <MidrangeExcelDropdown contents={[ '합격', '불합격' ]}
                                                   onChange={(e) => resultChange(type, e, arrIdx)} value={''}
                                                   readOnly={readOnly}/>
                          : defaultValue}
                    </NoTopBorder>
                    :
                    <BottomLeftBorder style={{flex:1, height:'40px'}}>
                            {modalData.samples > arrIdx ?
                                modalData.inspection_result[type]?.length > arrIdx && (modalData.inspection_result[type][arrIdx] !== undefined) ?
                                  <MidrangeExcelDropdown contents={[ '합격', '불합격' ]}
                                                         onChange={(e) => resultChange(type, e, arrIdx)}
                                                         value={modalData.inspection_result[type][arrIdx].pass ? '합격' : '불합격'}
                                                         readOnly={readOnly}/>
                                  :
                                  <MidrangeExcelDropdown contents={[ '합격', '불합격' ]}
                                                         onChange={(e) => resultChange(type, e, arrIdx)} value={''}
                                                         readOnly={readOnly}/>
                            : defaultValue}
                    </BottomLeftBorder>
                ))}
          </div>
        )
    }

    const sampleHeader = (sampleCount: number) => {
        let arr = Array.from({length: 10}, (_, i) => '-')
        return (
          arr.map((defaultValue, i) => (
              i > 8 ?
                <NoTopBorder style={{ height: '40px', flex: 1 }}>
                    {sampleCount > i ? i > 8 ? '10' : '0' + (i + 1) : defaultValue}
                </NoTopBorder>
                :
                <BottomLeftBorder style={{ height: '40px', flex: 1 }}>
                    {sampleCount > i ? i > 8 ? '10' : '0' + (i + 1) : defaultValue}
                </BottomLeftBorder>
          )))
    }


        return (
        <div>
            <MidrangeTitle>초ㆍ중ㆍ종 검사 결과</MidrangeTitle>
            <div style={{display:'flex', width: '100%', height: '80px'}}>
                <div style={{backgroundColor: "#F4F6FA",flex: 1}}>
                    <BottomLeftBorder style={{height: '40px'}}>작성자</BottomLeftBorder>
                    <BottomLeftBorder style={{height: '40px'}}>
                        <MidrangeMemberSearchModal readOnly={readOnly} value={modalData.writer?.name ?? '-'} onChangeManger={(writer)=> setModalData({...modalData, writer: writer})}/>
                    </BottomLeftBorder>
                </div>
                <div style={{display:'flex', flex: 3.5}}>
                    <BottomLeftBorder style={{flex:1.5}}>
                        점검시간
                    </BottomLeftBorder>
                    <BottomLeftBorder style={{flex:1.3}}>
                        검사 항목(단위)
                    </BottomLeftBorder>
                    <BottomLeftBorder style={{flex:1}}>
                        점검 기준
                    </BottomLeftBorder>
                </div>
                <div style={{backgroundColor: "#F4F6FA", flex:10}}>
                    <NoTopBorder style={{height: "40px"}}>
                        시료
                    </NoTopBorder>
                    <div style={{display:'flex'}}>
                        {sampleHeader(modalData.samples)}
                    </div>
                </div>
            </div>
            {
                inspectionPhases.map(phase => (
                  <div style={{ display: 'flex', width: '100%', minHeight: '80px' }}>
                      <div style={{flex: 1}}>
                        <BottomLeftBorder style={{ fontWeight: 'bold', height:'100%'}}> {phase.value} </BottomLeftBorder>
                      </div>
                      <div style={{ display: 'flex', flex: 3.5 }}>
                          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                              {getCriteria(phase.key)}
                              <BottomLeftBorder style={{ height: '40px' }}>결과</BottomLeftBorder>
                          </div>
                      </div>
                      <div style={{ flex: 10 }}>
                          {getRecords(phase.key)}
                          {getResults(phase.key)}
                      </div>
                  </div>
                ))
            }
        </div>
    );
};

const MidrangeTitle = styled.div`
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #F4F6FA;
    font-weight: bold;
    border: 0.5px solid #B3B3B3;
`

const Header = styled.div`
    background-color: #F4F6FA;
    display: flex;
    justify-content: center;
    align-items: center;
`
const BottomLeftBorder = styled(Header)`
    border-left: 0.5px solid #B3B3B3;
    border-bottom: 0.5px solid #B3B3B3;
`

const NoTopBorder = styled(Header)`
    border-left: 0.5px solid #B3B3B3;
    border-bottom: 0.5px solid #B3B3B3;
    border-right: 0.5px solid #B3B3B3;
`

const Worker = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
`

const ExampleNumber = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    border: 0.5px solid #B3B3B3;
    border-left: 0;
    width: 120px;
`

const CellDefault = styled.div`
    background-color: #F4F6FA;
    display: flex;
    justify-content: center;
    align-items: center;
    white-space: pre-line;
`

export {MidrangeExcelFrameTable};
