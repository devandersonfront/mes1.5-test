import React from 'react'
import styled from "styled-components";
import {IExcelHeaderType} from "../../@types/type";

interface IProps {
  row: any
  column: IExcelHeaderType
  setRow: (row: any) => void
  onChangeOption:any
}

const HeaderFilter = ({row, column, setRow, onChangeOption}: IProps) => {
  const getDefaultValue = column.options[0].name

  return (
    <Select
        defaultValue={getDefaultValue} onChange={(e)=>{
      if(Number(e.target.value) === -1){
        column.result("0,1,2,3,4/");
      }else if(e.target.value === getDefaultValue){
        column.result(null, column.key);
      }else{
        column.result(e.target.value, column.key, e.target.selectedIndex);
      }
    }}>
      {column.options.map((v,i)=>{
        return (
          <Option key={i.toString()} value={v.status}>
            {v.name}
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
