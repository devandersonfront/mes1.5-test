import React from 'react'
import styled from "styled-components";
import {IExcelHeaderType} from "../../common/@types/type";

interface IProps {
    row: any
    column: IExcelHeaderType
    setRow: (row: any) => void
    onRowChange: (e: any) => void
}

const TimeFormatter = ({row, column, setRow,onRowChange}: IProps) => {
    return(
        <Background style={{background: "white"}} onClick={()=>{}} >
            <p style={{padding: 0, color: '#000', width: '100%', textAlign: column.textAlign ?? 'left' }}>
                <input value={row['hour']} style={{width: '30px'}} onChange={(e)=>onRowChange({...row, hour: e.target.value})}/>
                :
                <input value={row['minute']} style={{width: '30px'}} onChange={(e)=>{if(Number(e.target.value) < 60){onRowChange({...row, minute: e.target.value})}}}/>
                :
                <input value={row['second']} style={{width: '30px'}} onChange={(e)=>{if(Number(e.target.value) < 60) {onRowChange({...row, second: e.target.value})}}}/>
            </p>
        </Background>
    )
}

const Background = styled.div`
    display:flex;
    justify-content:flex-start;
    align-items:center;
    width:100%;
    height:100%;
    padding: 0 8px;
    margin:0;
`;

export {TimeFormatter};
