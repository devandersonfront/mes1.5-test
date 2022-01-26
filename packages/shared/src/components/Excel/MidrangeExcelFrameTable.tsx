import React, {ChangeEvent} from 'react';
import styled from "styled-components";
import {MidrangeExcelDropdown} from "../Dropdown/MidrangeExcelDropdown";
import moment from "moment";
import {InspectionFinalDataResult, InspectionInfo} from "../../@types/type";
import {MidrangeDatetimePickerBox} from "../CalendarBox/MidrangeDatetimePickerBox";

interface IProps {
    formReviewData: any
    inspectFrameData: (e) => void
}

const MidrangeExcelFrameTable =  ({ formReviewData, inspectFrameData }: IProps)  => {

    const [testData, setTestData] = React.useState<any>({
        legendary_list: [],
        inspection_info: {beginning: [{samples: 1, data_result: []}], middle: [{samples: 1, data_result: [] }], end: [{samples: 1, data_result: [] }]},
        inspection_result: { beginning: [], middle: [], end: [] },
        inspection_time: {
            beginning: moment().format('YYYY-MM-DD[T]HH:mm:ss'),
            middle: moment().format('YYYY-MM-DD[T]HH:mm:ss'),
            end: moment().format('YYYY-MM-DD[T]HH:mm:ss'),
        },
    })

    React.useEffect(()=>{
        if(formReviewData !== undefined) {

            const legendary_list = formReviewData.legendary.map((v) => {
                return v ?? ''
            })

            if(formReviewData.version !== undefined) {
                const reviewData = {
                    version: formReviewData.version,
                    sic_id: formReviewData.sic_id,
                    record_id: formReviewData.record_id,
                    legendary_list: legendary_list,
                    inspection_info: formReviewData.inspection_info,
                    inspection_result: {
                        middle: [],
                        beginning: [],
                        end: []
                    },
                    inspection_time: {
                        beginning: moment().format('YYYY-MM-DD[T]HH:mm:ss'),
                        middle: moment().format('YYYY-MM-DD[T]HH:mm:ss'),
                        end: moment().format('YYYY-MM-DD[T]HH:mm:ss'),
                    }
                }
                //@ts-ignore
                setTestData(reviewData)
            }else {
                const reviewData = {
                    sic_id: formReviewData.sic_id,
                    record_id: formReviewData.record_id,
                    legendary_list: legendary_list,
                    inspection_info: formReviewData.inspection_info,
                    inspection_result: {
                        middle: [],
                        beginning: [],
                        end: []
                    },
                    inspection_time: {
                        beginning: moment().format('YYYY-MM-DD[T]HH:mm:ss'),
                        middle: moment().format('YYYY-MM-DD[T]HH:mm:ss'),
                        end: moment().format('YYYY-MM-DD[T]HH:mm:ss'),
                    }
                }
                //@ts-ignore
                setTestData(reviewData)
            }

        }
    },[formReviewData])

    let arr = new Array(10).fill(undefined).map((val,idx) => idx);

    const itemDataResultTextChange = (inspection_type: 'beginning' | 'middle' | 'end', e: ChangeEvent<HTMLInputElement>, itemIndex, dataResultIndex) => {
        const temp = testData

        if(inspection_type === 'beginning') {
            if (temp.inspection_info.beginning[itemIndex].data_result[dataResultIndex] !== undefined) {
                temp.inspection_info.beginning[itemIndex].data_result[dataResultIndex].value = e.target.value
            } else {
                temp.inspection_info.beginning[itemIndex].data_result[dataResultIndex] = {
                    sequence: dataResultIndex,
                    value: e.target.value,
                    pass: true
                }
            }

        }else if(inspection_type === 'middle'){
            if (temp.inspection_info.middle[itemIndex].data_result[dataResultIndex] !== undefined) {
                temp.inspection_info.middle[itemIndex].data_result[dataResultIndex].value = e.target.value
            } else {
                temp.inspection_info.middle[itemIndex].data_result[dataResultIndex] = {
                    sequence: dataResultIndex,
                    value: e.target.value,
                    pass: true
                }
            }
        }else {
            if (temp.inspection_info.end[itemIndex].data_result[dataResultIndex] !== undefined) {
                temp.inspection_info.end[itemIndex].data_result[dataResultIndex].value = e.target.value
            } else {
                temp.inspection_info.end[itemIndex].data_result[dataResultIndex] = {
                    sequence: dataResultIndex,
                    value: e.target.value,
                    pass: true
                }
            }
        }

        //@ts-ignore
        setTestData({...testData,temp})
    }

    const itemDataResultDropdownChange = (inspection_type: 'beginning' | 'middle' | 'end', e: ChangeEvent<HTMLSelectElement>, itemIndex, dataResultIndex) => {

        const temp = testData
        if(inspection_type === 'beginning') {
            if (temp.inspection_info.beginning[itemIndex].data_result[dataResultIndex] !== undefined) {
                temp.inspection_info.beginning[itemIndex].data_result[dataResultIndex].value = e.target.value
            } else {
                temp.inspection_info.beginning[itemIndex].data_result[dataResultIndex] = {
                    sequence: dataResultIndex,
                    value: e.target.value,
                    pass: true
                }
            }
        }else if(inspection_type === 'middle'){
            if (temp.inspection_info.middle[itemIndex].data_result[dataResultIndex] !== undefined) {
                temp.inspection_info.middle[itemIndex].data_result[dataResultIndex].value = e.target.value
            } else {
                temp.inspection_info.middle[itemIndex].data_result[dataResultIndex] = {
                    sequence: dataResultIndex,
                    value: e.target.value,
                    pass: true
                }
            }
        }else {
            if (temp.inspection_info.end[itemIndex].data_result[dataResultIndex] !== undefined) {
                temp.inspection_info.end[itemIndex].data_result[dataResultIndex].value = e.target.value
            } else {
                temp.inspection_info.end[itemIndex].data_result[dataResultIndex] = {
                    sequence: dataResultIndex,
                    value: e.target.value,
                    pass: true
                }
            }
        }

        // @ts-ignore
        setTestData({...testData, temp})
    }


    const dataResultDropdownChange = (inspection_type: 'beginning' | 'middle' | 'end', e: ChangeEvent<HTMLSelectElement>, resultIndex) => {

        const temp = testData
        if(inspection_type === 'beginning') {
            if (temp.inspection_result.beginning[resultIndex] !== undefined) {
                temp.inspection_result.beginning[resultIndex].pass = e.target.value === '합격'
            } else {
                temp.inspection_result.beginning[resultIndex] = {
                    sequence: resultIndex+1,
                    pass: e.target.value === '합격'
                }
            }
        }else if(inspection_type === 'middle'){
            if (temp.inspection_result.middle[resultIndex] !== undefined) {
                temp.inspection_result.middle[resultIndex].pass = e.target.value === '합격'
            } else {
                temp.inspection_result.middle[resultIndex] = {
                    sequence: resultIndex+1,
                    pass: e.target.value === '합격'
                }
            }
        }else {
            if (temp.inspection_result.end[resultIndex] !== undefined) {
                temp.inspection_result.end[resultIndex].pass = e.target.value === '합격'
            } else {
                temp.inspection_result.end[resultIndex] = {
                    sequence: resultIndex+1,
                    pass: e.target.value === '합격'
                }
            }
        }

        // @ts-ignore
        setTestData({...testData, temp})
    }

    React.useEffect(()=>{
        inspectFrameData(testData)
    },[testData])

    const sampleCount = (inspection_info: InspectionInfo[]) => {
        return (
            arr.map((v,i)=>
                <ExampleNumber style={{borderBottom: 0}}>
                    {inspection_info[0].samples > i ?  i+1 > 9 ? 10 : '0'+(i+1) : <p>-</p>}
                </ExampleNumber>
            )
        )
    }

    const formItemHeader = (inspection_info: InspectionInfo[]) => {
        return (
            inspection_info && inspection_info.map((v,i)=>
                <div style={{display: "flex"}} key={v.samples+'~'+i}>
                    <CellDefault style={{width: '144px', height: '40px', borderBottom: 0, borderRight: 0, textAlign: "center" }}>
                        {(v.name !== undefined ? v.name : '')+`(${v.unit})`}
                    </CellDefault>
                    <CellDefault style={{width: '120px', height: '40px', flexDirection: "column", borderBottom: 0  }}>
                        <div>
                            {v.standard}
                        </div>
                        <div style={{fontSize: '11px'}}>
                            ({v.error_minimum}~{v.error_maximum})
                        </div>
                    </CellDefault>
                </div>
            ))
    }

    const formItemResult = (inspection_infoType: InspectionInfo[], type: 'beginning' | 'middle' | 'end') => {

        return (
            inspection_infoType.map((value,index)=>
                <div style={{display: "flex"}}>
                    {arr.map((v,i)=>
                        <ExampleNumber style={{borderBottom: 0, }}>
                            {value.type === 0 ?
                                <input style={{ width: '100%', height: '100%', border: "none", zIndex: 10, display: "flex", alignItems: "center", textAlign: "center"}} type={"number"}
                                       value={inspection_infoType[0].samples > i ? value.data_result[i] !== undefined ? value.data_result[i].value : '' : '-'}
                                       key={type+'input'+index+'static'+i}
                                       placeholder={inspection_infoType[0].samples > i ? value.data_result[i] !== undefined ? value.data_result[i].value : '0' : '-'}
                                       onKeyDown={ (evt) => evt.key === 'e' && evt.preventDefault() } onChange={(e)=>itemDataResultTextChange(type,e,index,i)}/>
                                :
                                inspection_infoType[0].samples > i ? value.data_result[i] !== undefined ?
                                    <MidrangeExcelDropdown contents={testData.legendary_list} value={value.data_result[i].value} onChange={(e)=>itemDataResultDropdownChange(type,e,index,i)}/> :
                                    <MidrangeExcelDropdown contents={testData.legendary_list} value={''} onChange={(e)=>itemDataResultDropdownChange(type,e,index,i)}/> : <p>-</p>
                            }
                        </ExampleNumber>
                    )}
                </div>
            )
        )
    }

    const resultRow = (inspection_info: InspectionInfo[], inspection_result: InspectionFinalDataResult[], type: 'beginning' | 'middle' | 'end') => {
        return(
            arr.map((v,i)=>
                <ExampleNumber>
                    {inspection_info[0].samples > i ?
                        inspection_result[i] !== undefined ?
                            <MidrangeExcelDropdown contents={['합격', '불합격']} onChange={(e)=>dataResultDropdownChange(type,e,i)} value={inspection_result[i].pass ? '합격' : '불합격'}/>
                            :
                            <MidrangeExcelDropdown contents={['합격', '불합격']} onChange={(e)=>dataResultDropdownChange(type,e,i)} value={''}/>
                        :
                        '-'
                    }
                </ExampleNumber>
            )
        )
    }

    return (
        <div>
            <MidrangeTitle>초ㆍ중ㆍ종 검사 결과</MidrangeTitle>
            <div style={{display: "flex"}}>
                <div style={{backgroundColor: "#F4F6FA", width: '112px',borderLeft: '0.5px solid #B3B3B3', borderTop: 0, height: '80px'}}>
                    <Worker>작성자</Worker>
                    <Worker style={{borderTop: '0.5px solid #B3B3B3'}}>1132</Worker>
                </div>
                <HeaderTitle style={{width: '168px'}}>
                    점검시간
                </HeaderTitle>
                <HeaderTitle style={{width: '144px'}}>
                    검사 항목(단위)
                </HeaderTitle>
                <HeaderTitle style={{width: '120px', borderRight: '0.5px solid #B3B3B3'}}>
                    점검 기준
                </HeaderTitle>
                <div style={{backgroundColor: "#F4F6FA", width: '1200px',borderTop: 0, height: '80px'}}>
                    <CellDefault style={{border: 'none', height: "40px", borderRight: '0.5px solid #B3B3B3'}}>
                        시료
                    </CellDefault>
                    <div style={{display: "flex"}}>
                        {sampleCount(testData.inspection_info.beginning)}
                    </div>
                </div>
            </div>
            {/*초품 */}
            <div style={{display: "flex"}}>
                <CellDefault style={{width: '112px', minHeight: '80px', fontWeight: 'bold', borderRight: 0}}>
                    초품
                </CellDefault>
                <div style={{width: '432px'}}>
                    <div style={{display: "flex"}}>
                        <CellDefault style={{width: '168px', minHeight: '40px', backgroundColor: 'white', borderRight: 0, borderBottom: 0}}>
                            <MidrangeDatetimePickerBox value={testData.inspection_time.beginning} onDateChange={(date)=>setTestData({...testData, inspection_time: {...testData.inspection_time, beginning: date.format("YYYY.MM.DD[T]HH:mm:ss") }})}/>
                        </CellDefault>
                        <div style={{display: "flex", flexDirection: "column"}}>
                            {formItemHeader(testData.inspection_info.beginning)}
                        </div>
                    </div>
                    <CellDefault style={{width: '432px', height: '40px' }}>
                        결과
                    </CellDefault>
                </div>
                <div>
                    {formItemResult(testData.inspection_info.beginning, 'beginning')}
                    <div style={{display: "flex"}}>
                        {resultRow(testData.inspection_info.beginning, testData.inspection_result.beginning, 'beginning')}
                    </div>
                </div>
            </div>
            {/*중품 */}
            <div style={{display: "flex"}}>
                <CellDefault style={{width: '112px', minHeight: '80px', fontWeight: 'bold', borderRight: 0}}>
                    중품
                </CellDefault>
                <div style={{width: '432px'}}>
                    <div style={{display: "flex"}}>
                        <CellDefault style={{width: '168px', minHeight: '40px', backgroundColor: 'white', borderRight: 0, borderBottom: 0}}>
                            <MidrangeDatetimePickerBox value={testData.inspection_time.middle} onDateChange={(date)=>setTestData({...testData, inspection_time: {...testData.inspection_time, middle: date.format("YYYY.MM.DD[T]HH:mm:ss") }})}/>
                        </CellDefault>
                        <div style={{display: "flex", flexDirection: "column"}}>
                            {formItemHeader(testData.inspection_info.middle)}
                        </div>
                    </div>
                    <CellDefault style={{width: '432px', height: '40px' }}>
                        결과
                    </CellDefault>
                </div>
                <div>
                    {formItemResult(testData.inspection_info.middle, 'middle')}
                    <div style={{display: "flex"}}>
                        {resultRow(testData.inspection_info.middle, testData.inspection_result.middle, 'middle')}
                    </div>
                </div>
            </div>
            {/*종품 */}
            <div style={{display: "flex"}}>
                <CellDefault style={{width: '112px', minHeight: '80px', fontWeight: 'bold', borderRight: 0}}>
                    종품
                </CellDefault>
                <div style={{width: '432px'}}>
                    <div style={{display: "flex"}}>
                        <CellDefault style={{width: '168px', minHeight: '40px', backgroundColor: 'white', borderRight: 0, borderBottom: 0}}>
                            <MidrangeDatetimePickerBox value={testData.inspection_time.end} onDateChange={(date)=>setTestData({...testData, inspection_time: {...testData.inspection_time, end: date.format("YYYY.MM.DD[T]HH:mm:ss") }})}/>
                        </CellDefault>
                        <div style={{display: "flex", flexDirection: "column"}}>
                            {formItemHeader(testData.inspection_info.end)}
                        </div>
                    </div>
                    <CellDefault style={{width: '432px', height: '40px' }}>
                        결과
                    </CellDefault>
                </div>
                <div>
                    {formItemResult(testData.inspection_info.end, 'end')}
                    <div style={{display: "flex"}}>
                        {resultRow(testData.inspection_info.end, testData.inspection_result.end, 'end')}
                    </div>
                </div>
            </div>
        </div>
    );
};

const MidrangeTitle = styled.div`
    width: 1744px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #F4F6FA;
    font-weight: bold;
    border: 0.5px solid #B3B3B3;
`

const HeaderTitle = styled.div`
    background-color: #F4F6FA;
    border-left: 0.5px solid #B3B3B3;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80px;
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
    border: 0.5px solid #B3B3B3;
    display: flex;
    justify-content: center;
    align-items: center;
    white-space: pre-line;
`

export {MidrangeExcelFrameTable};
