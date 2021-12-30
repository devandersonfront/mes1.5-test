import React from 'react';
import styled from 'styled-components'
import {TitleBox} from "../../styles/styledComponents";

interface IProps {
    title: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    placeholder: string
}


const TitleInput = ({title, value, placeholder, onChange}:IProps) => {
    return (
        <div style={{display: "flex",  height: '40px', marginBottom: '8px'}}>
            <TitleBox>{title}</TitleBox>
            <ValueBox>
                <input value={value} placeholder={placeholder} onChange={onChange}/>
            </ValueBox>
        </div>
    );
};



const ValueBox = styled.div`
    background-color: #353B48;
    width: 100%;
    input{
        color: white;
        font-size: 16px;
        border: none;
        background-color: #353B48;
        padding-left: 16px;
        height: 100%;
        width: 100%;
    }
`

export {TitleInput}
