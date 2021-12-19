import React, {useEffect} from 'react'
import styled from "styled-components";
import {IExcelHeaderType} from "../../common/@types/type";

interface IProps {
  row: any
  column: IExcelHeaderType
  setRow: (row: any) => void
  onChangeOption:any
}

const HeaderFilter = ({row, column, setRow, onChangeOption}: IProps) => {
  return (
    <Select defaultValue={column.options[0].name} onChange={(e)=>{
      if(Number(e.target.value) === -1){
        column.result("0,1,2,3,4/");
      }else if(e.target.value === column.options[0].name){
        column.result(null);
      }else{
        column.result(e.target.value);
      }
    }}>
      {column.options.map((v)=>{
        return (
          <Option value={v.status} >
            <p style={{margin:0, padding: 0, fontWeight: 'bold'}}>{v.name}</p>
          </Option>
        )
      })}
    </Select>
    // <div onClick={() => {
    //     any.column.result();
    // }}>
    //     헤더
    // </div>
  )
}

const Select = styled.select`
  width:100%;
  height:100%;
  background:none;
  border:none;
  color:white;
  font-size:14px;
  font-weight: bold;
  display:flex;
  justify-content:center;
  align-items:center;
`;

const Option = styled.option`
  background:black;
  color:white;
`;


export {HeaderFilter};
