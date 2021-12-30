import React from 'react';
import {SelectButton, TitleBox} from "../../styles/styledComponents";
import styled from "styled-components";

interface IProps{
    value: string
    onChange: ()=>void
}

const TitleCalendarBox = ({value, onChange}:IProps) => {
    return (
        <div style={{display: "flex", marginBottom: '8px', alignItems: "center"}}>
            <TitleBox>등록 날짜</TitleBox>
            <ValueBox>
                {value}
            </ValueBox>
            <SelectButton>
                날짜선택
            </SelectButton>
        </div>
    );
};


const ValueBox = styled.div`
    padding-left: 16px;
    color: white;
    font-size: 16px;
    background-color: #353B48;
    width: 93%;
    height: 40px;
    display: flex;
    align-items: center;
`

export {TitleCalendarBox}
