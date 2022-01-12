import React from 'react';
import {TitleBox} from "../../styles/styledComponents";
import styled from "styled-components";

interface IProps {
    title: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
    placeholder: string
}


const TitleTextArea = ({title, value, placeholder, onChange}:IProps) => {
    return (
        <div style={{display: "flex", marginBottom: '8px'}}>
            <TitleBox>{title}</TitleBox>
            <ValueBox>
                <textarea value={value} placeholder={placeholder} onChange={onChange} />
            </ValueBox>
        </div>
    );
};



const ValueBox = styled.div`
    background-color: #353B48;
    width: 100%;
    height: 496px;
    textarea{
        resize: none;
        white-space: pre-line;
        color: white;
        font-size: 16px;
        border: none;
        background-color: #353B48;
        padding: 8px 0 0 16px;
        line-height: 17px;
        height: 100%;
        width: 100%;
    }
`
export {TitleTextArea};
