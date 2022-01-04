import React from 'react';
import styled from "styled-components";

const MidRangeExcelTable = () => {
    const sampleCount = () => {
        return (
            ['01','02','01','02','01','02','01','02','01','02',].map((v,i)=>
                <ExampleNumber style={{borderBottom: 0}}>
                    {i+1 > 9 ? 10 : '0'+(i+1)}
                </ExampleNumber>
            )
        )
    }

    const formItemHeader = () => {
        return (
            ['01','22'].map((v,i)=>
            <div style={{display: "flex"}}>
                <CellDefault style={{width: '144px', height: '40px', borderBottom: 0, borderRight: 0 }}>
                    외경(mm)
                </CellDefault>
                <CellDefault style={{width: '120px', height: '40px', flexDirection: "column", borderBottom: 0  }}>
                    <div>
                        19
                    </div>
                    <div style={{fontSize: '11px'}}>
                        (18.9~19.1)
                    </div>
                </CellDefault>
            </div>
        ))
    }
    const formitemResult = () => {
        return (
            ['01','22'].map((value,index)=>
                <div style={{display: "flex"}}>
                    {['01','02','01','02','01','02','01','02','01','02',].map((v,i)=>
                        <ExampleNumber style={{borderBottom: 0}}>
                            {i+1 > 9 ? 10 : '0'+(i+1)}
                        </ExampleNumber>
                    )}
                </div>
            )
        )
    }

    const resultRow = () => {
        return(
            ['01','02','01','02','01','02','01','02','01','02',].map((v,i)=>
                <ExampleNumber>

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
                        {sampleCount()}
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
                            {'0000.00.00 00:00'}
                        </CellDefault>
                        <div style={{display: "flex", flexDirection: "column"}}>
                            {formItemHeader()}
                        </div>
                    </div>
                    <CellDefault style={{width: '432px', height: '40px' }}>
                        결과
                    </CellDefault>
                </div>
                <div>
                    {formitemResult()}
                    <div style={{display: "flex"}}>
                        {resultRow()}
                    </div>
                </div>
            </div>
            {/*초품 */}
            <div style={{display: "flex"}}>
                <CellDefault style={{width: '112px', minHeight: '80px', fontWeight: 'bold', borderRight: 0}}>
                    중품
                </CellDefault>
                <div style={{width: '432px'}}>
                    <div style={{display: "flex"}}>
                        <CellDefault style={{width: '168px', minHeight: '40px', backgroundColor: 'white', borderRight: 0, borderBottom: 0}}>
                            {'0000.00.00 00:00'}
                        </CellDefault>
                        <div style={{display: "flex", flexDirection: "column"}}>
                            {formItemHeader()}
                        </div>
                    </div>
                    <CellDefault style={{width: '432px', height: '40px' }}>
                        결과
                    </CellDefault>
                </div>
                <div>
                    {formitemResult()}
                    <div style={{display: "flex"}}>
                        {resultRow()}
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
                            {'0000.00.00 00:00'}
                        </CellDefault>
                        <div style={{display: "flex", flexDirection: "column"}}>
                            {formItemHeader()}
                        </div>
                    </div>
                    <CellDefault style={{width: '432px', height: '40px' }}>
                        결과
                    </CellDefault>
                </div>
                <div>
                    {formitemResult()}
                    <div style={{display: "flex"}}>
                        {resultRow()}
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
`

export {MidRangeExcelTable};
