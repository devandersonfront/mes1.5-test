import React from "react";
import styled from "styled-components";
import {IExcelHeaderType} from "../../@types/type";

interface IProps {
  row: any
  column: IExcelHeaderType
  onRowChange: (row: any) => void
}

const LineBorderContainer = ({row, column, onRowChange}: IProps) => {
  return(
    <Background style={{background: row.border ? "#19B9DF80" : row.noneSelected ? '#C3C4C6' : row.color ? row.color :"white"}} onClick={()=>{
    }} onDoubleClick={() => {
      if(row.doubleClick){
        row.doubleClick()
      }
    }} >
      <p style={{padding: 0, color: row[column.key] ? '#0D0D0D' : row.color ? "white" : '#0D0D0D66', width: '100%', textAlign: column.textAlign ?? 'left' }}>
        {row[column.key] === "" || row[column.key] === null ||  row[column.key] === undefined ? column.placeholder : row[column.key]}
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

export {LineBorderContainer};
