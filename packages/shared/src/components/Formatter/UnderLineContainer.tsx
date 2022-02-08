import React from 'react'
import styled from 'styled-components'
import { IExcelHeaderType } from '../../common/@types/type'

interface IProps {
  row: any
  column: IExcelHeaderType
  setRow: (row: any) => void

}

const UnderLineContainer = ({ row, column, setRow }: IProps) => {

    const onDoubleClick = (e) => {

        if(row.type !== "폴더"){
            return undefined;
        }
        
        e.detail === 2 && column.callback && column.callback(row.doc_id)
    }

    return (
        <Background onClick={onDoubleClick}>
            <UnderLineSpan>{row[column.key]}</UnderLineSpan>
        </Background>
    )
}

const Background = styled.div<any>`
    display:flex;
    justify-content:center;
    align-items:center;
    width:100%;
    height:100%;
    background : ${(props) => props.background};
`

const UnderLineSpan = styled.span` 

    text-decoration: underline;


`

export {UnderLineContainer}
