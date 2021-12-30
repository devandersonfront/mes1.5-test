import React from 'react';
import {SelectButton, TitleBox} from "../../styles/styledComponents";
import styled from "styled-components";

interface IProps {
    title: string
    value: string
    placeholder: string
    fileOnClick: ()=> void
    deleteOnClick: ()=> void
}

const TitleFileUpload = ({title,value,placeholder,fileOnClick,deleteOnClick}: IProps) => {
    return (
        <div style={{display: "flex", marginBottom: '8px', alignItems: "center"}}>
            <TitleBox>{title}</TitleBox>
            <ValueBox style={{color: value === '' ? 'rgba(255,255,255,0.3)' : 'white'}}>
                {value === '' ? placeholder : value}
            </ValueBox>
            <SelectButton>
                파일선택
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



export {TitleFileUpload}
