import React from 'react'
import styled from "styled-components";

export const CurrentDate = () => {


    return (
        <DateWrapper>
            <Title className={'unprintable'}>현재날짜</Title>
            <div>
                {new Date().toISOString().slice(0, 10)}
            </div>
        </DateWrapper>
    )
}


const DateWrapper = styled.div`
    background : #B3B3B3;
    display : flex;
    width : 200px;
    justify-content : space-around;
    align-items : center;
    border-radius:6px;
`

const Title = styled.p`
    margin : 0px;

`