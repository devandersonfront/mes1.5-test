import React, {ChangeEvent} from 'react';
import styled from "styled-components";
import {MidrangeExcelDropdown} from "../Dropdown/MidrangeExcelDropdown";
import moment from "moment";
import {InspectionInfo} from "../../@types/type";

const dump = {
    operation_inspection_id: "61d55d578aa961291d3f40ae",
    work_id: 2,
    worker: {
        user_id: 99,
        company: null,
        name: "eomjihwan",
        appointment: null,
        telephone: null,
        email: null,
        authority: 5,
        ca_id: null,
        id: "",
        password: null,
        profile: null,
        sync: null,
        additional: [],
        token: null,
        version: null,
        serviceAddress: null
    },
    sic_id: "sic-2323",
    inspection_info: {
        middle: [
            {
                title: "차종환 유격대18182838238",
                unit: "mm",
                type: 0,
                error_minimum: 30,
                error_maximum: 150,
                samples: 5,
                data_result: [
                    {
                        sequence: "1",
                        value: '345.7',
                        pass: true
                    },
                    {
                        sequence: "2",
                        value: '2345.7',
                        pass: true
                    },
                    {
                        sequence: "3",
                        value: '3345.7',
                        pass: true
                    }
                ]
            },
            {
                title: "백찬 척후병대장",
                unit: "mm",
                type: 1,
                error_minimum: 30,
                error_maximum: 150,
                samples: 5,
                data_result: [
                    {
                        sequence: "1",
                        value: '345.7',
                        pass: true
                    },
                    {
                        sequence: "2",
                        value: '2345.7',
                        pass: true
                    },
                    {
                        sequence: "3",
                        value: '3345.7',
                        pass: true
                    }
                ]
            }
        ],
        beginning: [
            {
                title: "차종환 유격대38",
                unit: "cm",
                type: 0,
                error_minimum: 50,
                error_maximum: 180,
                samples: 5,
                data_result: [
                    {
                        sequence: "1",
                        value: '345123.7',
                        pass: true
                    },
                    {
                        sequence: "2",
                        value: '2345123.7',
                        pass: true
                    },
                    {
                        sequence: "3",
                        value: '3341235.7',
                        pass: true
                    }
                ]
            },
            {
                title: "백찬 척후병대장123",
                unit: "cm",
                type: 1,
                error_minimum: 50,
                error_maximum: 180,
                samples: 5,
                data_result: [
                    {
                        sequence: "1",
                        value: '3454.7',
                        pass: true
                    },
                    {
                        sequence: "2",
                        value: '234555.7',
                        pass: true
                    },
                    {
                        sequence: "3",
                        value: "334566.7",
                        pass: true
                    }
                ]
            }
        ]
    },
    inspection_time: {
        middle: "2022-01-04T08:03:58.43",
        beginning: "2022-01-04T08:03:58.43",
        end: "2022-01-04T08:03:58.43"
    },
    version: 0
}

const MidrangeExcelTable = () => {

    const [testData, setTestData] = React.useState(dump)
    let arr = new Array(10).fill(undefined).map((val,idx) => idx);

    const itemDataResultTextChange = (inspection_info: 'beginning' | 'middle' | 'end', e: ChangeEvent<HTMLInputElement>, itemIndex, dataResultIndex) => {
        const temp = testData
        if(inspection_info === 'beginning') {
            if (temp.inspection_info.beginning[itemIndex].data_result[dataResultIndex] !== undefined) {
                temp.inspection_info.beginning[itemIndex].data_result[dataResultIndex].value = e.target.value
            } else {
                temp.inspection_info.beginning[itemIndex].data_result[dataResultIndex] = {
                    sequence: String(dataResultIndex),
                    value: e.target.value,
                    pass: true
                }
            }
        }else if(inspection_info === 'middle'){
            if (temp.inspection_info.middle[itemIndex].data_result[dataResultIndex] !== undefined) {
                temp.inspection_info.middle[itemIndex].data_result[dataResultIndex].value = e.target.value
            } else {
                temp.inspection_info.middle[itemIndex].data_result[dataResultIndex] = {
                    sequence: String(dataResultIndex),
                    value: e.target.value,
                    pass: true
                }
            }
        }else {

        }

        // @ts-ignore
        setTestData({...testData, temp})
    }

    const itemDataResultDropdownChange = (inspection_info: 'beginning' | 'middle' | 'end', e: ChangeEvent<HTMLSelectElement>, itemIndex, dataResultIndex) => {

        console.log(inspection_info, e.target.value, itemIndex, dataResultIndex)
        const temp = testData
        if(inspection_info === 'beginning') {
            if (temp.inspection_info.beginning[itemIndex].data_result[dataResultIndex] !== undefined) {
                temp.inspection_info.beginning[itemIndex].data_result[dataResultIndex].value = e.target.value
            } else {
                temp.inspection_info.beginning[itemIndex].data_result[dataResultIndex] = {
                    sequence: String(dataResultIndex),
                    value: e.target.value,
                    pass: true
                }
            }
        }else if(inspection_info === 'middle'){
            if (temp.inspection_info.middle[itemIndex].data_result[dataResultIndex] !== undefined) {
                temp.inspection_info.middle[itemIndex].data_result[dataResultIndex].value = e.target.value
            } else {
                temp.inspection_info.middle[itemIndex].data_result[dataResultIndex] = {
                    sequence: String(dataResultIndex),
                    value: e.target.value,
                    pass: true
                }
            }
        }else {

        }
        console.log(temp)
        // @ts-ignore
        setTestData({...testData, temp})
    }


    const sampleCount = (inspection_info: InspectionInfo[]) => {
        return (
            arr.map((v,i)=>
                <ExampleNumber style={{borderBottom: 0}}>
                    {inspection_info[0].samples > i ?  i+1 > 9 ? 10 : '0'+(i+1) : '-'}
                </ExampleNumber>
            )
        )
    }

    const formItemHeader = (inspection_info: InspectionInfo[]) => {
        return (
            inspection_info && inspection_info.map((v,i)=>
            <div style={{display: "flex"}} key={v.samples+'~'+i}>
                <CellDefault style={{width: '144px', height: '40px', borderBottom: 0, borderRight: 0 }}>
                    {v.title}
                </CellDefault>
                <CellDefault style={{width: '120px', height: '40px', flexDirection: "column", borderBottom: 0  }}>
                    <div>
                        {v.samples}{/*starndard*/}
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
                                       placeholder={inspection_infoType[0].samples > i ? value.data_result[i] !== undefined ? value.data_result[i].value : '0' : '-'}
                                       onKeyDown={ (evt) => evt.key === 'e' && evt.preventDefault() } onChange={(e)=>itemDataResultTextChange(type,e,index,i)}/>
                                :
                                inspection_infoType[0].samples > i ? value.data_result[i] !== undefined ?
                                    //contents 를 legendary 로 변경 해야함
                                    <MidrangeExcelDropdown contents={['12','3454.7','1234']} value={value.data_result[i].value } onChange={(e)=>itemDataResultDropdownChange(type,e,index,i)}/> :
                                    <MidrangeExcelDropdown contents={['12','3454.7','1234']} value={''} onChange={(e)=>itemDataResultDropdownChange(type,e,index,i)}/> : '-'
                            }
                        </ExampleNumber>
                    )}
                </div>
            )
        )
    }

    const resultRow = (inspection_info: InspectionInfo[]) => {
        return(
            ['01','02','01','02','01','02','01','02','01','02',].map((v,i)=>
                <ExampleNumber>
                    {/*{inspection_info[0].samples > i ?*/}
                    {/*    <MidrangeExcelDropdown contents={['합격', '불합격']} onChange={()=>{}}/>*/}
                    {/*    :*/}
                    {/*    '-'*/}
                    {/*}*/}
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
                            {moment(testData.inspection_time.beginning).format("YYYY.MM.DD HH:mm")}
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
                        {resultRow(testData.inspection_info.beginning)}
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
                            {moment(testData.inspection_time.middle).format("YYYY.MM.DD HH:mm")}
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
                        {resultRow(testData.inspection_info.middle)}
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
                            {moment(testData.inspection_time.end).format("YYYY.MM.DD HH:mm")}
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
                    {formItemResult(testData.inspection_info.beginning, 'end')}
                    <div style={{display: "flex"}}>
                        {resultRow(testData.inspection_info.beginning)}
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

export {MidrangeExcelTable};
