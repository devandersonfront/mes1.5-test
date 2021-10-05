import React from "react";
import styled from "styled-components";
import {IExcelHeaderType} from "../../common/@types/type";

interface IProps {
    row: any
    column: IExcelHeaderType
    setRow: (row: any) => void
}

const NumberingBox = ({row, column, setRow}: IProps) => {
    //
    // row.machineList.map((v)=>{
    //
    // })
    return(
        <Background style={{background:row.order ? "red" : ""}} >
            {row.order}
        </Background>
    )
}

const Background = styled.div`
    display:flex;
    justify-content:center;
    align-items:center;
    width:100%;
    height:100%;
`;

export default NumberingBox;
