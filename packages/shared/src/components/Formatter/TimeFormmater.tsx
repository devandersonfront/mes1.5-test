import React from 'react'
import styled from "styled-components";
import {IExcelHeaderType} from "../../@types/type";
import { RemoveFirstZero } from '../../common/Util'

interface IProps {
    row: any
    column: IExcelHeaderType
    setRow: (row: any) => void
    onRowChange: (e: any) => void
}

const TimeFormatter = ({row, column, setRow,onRowChange}: IProps) => {
    const isReadOnly = column.type === 'readonly'?? undefined
    return(
        <Background style={{background: "white"}} onClick={()=>{}} >
            <p style={{padding: 0, color: '#000', width: '100%', textAlign: column.textAlign ?? 'left' }}>
                <input readOnly={isReadOnly} placeholder={'0'} type={'number'} value={row['hour']} style={{width: '30px'}} onChange={(e)=> onRowChange({...row, hour: RemoveFirstZero(e.target.value)})}/>
                :
                <input readOnly={isReadOnly} placeholder={'0'} type={'number'} value={row['minute']} style={{width: '30px'}} onChange={(e)=>{if(Number(e.target.value) < 60){onRowChange({...row, minute: RemoveFirstZero(e.target.value)})}}}/>
                :
                <input readOnly={isReadOnly} placeholder={'0'} type={'number'} value={Math.floor(row['second'])} style={{width: '30px'}} onChange={(e)=>{if(Number(e.target.value) < 60) {onRowChange({...row, second: RemoveFirstZero(e.target.value)})}}}/>
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
