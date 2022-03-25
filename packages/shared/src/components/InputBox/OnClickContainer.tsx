import React, {useEffect, useState} from 'react'
import {IExcelHeaderType} from '../../common/@types/type'
import styled from "styled-components"
interface IProps {
  row: any
  column: IExcelHeaderType
  setRow: (row: any) => void
}

const OnClickContainer = ({ row, column }: IProps) => {

    return (
        <ClickContainer clicked={row.onClicked}>
            <p>{row[column.key]}</p>
        </ClickContainer>
    );
}

export {OnClickContainer};

const ClickContainer = styled.div<any>`

    width: 100%;
    height: 100%;
    box-shadow: ${props => props.clicked && 'inset 0 0 0 2px #66afe9'};

    & > p {
        margin : 0px
    }
`
