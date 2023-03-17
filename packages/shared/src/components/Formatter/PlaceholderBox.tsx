import React from "react";
import styled from "styled-components";
import {IExcelHeaderType} from "../../@types/type";
import Tooltip from 'rc-tooltip'
import 'rc-tooltip/assets/bootstrap_white.css';
interface IProps {
  row: any
  column: IExcelHeaderType
  setRow: (row: any) => void
}

const PlaceholderBox = ({row, column, setRow}: IProps) => {
      const overLayNode = () => {
          return (
              <div style={{fontWeight : 'bold'}} placeholder={column.type == "manage" ? row.placeholder : column.placeholder}>
                  {row[column.key].length > 0 ? row[column.key] : row["placeholder"] ?? column.placeholder}
              </div>
          )
      }
      return(
          <Background className={row?.[column.key] ?? 'unprintable'} style={{backgroundColor:row?.warning ? "red" : undefined}}>
              <Tooltip placement={'rightTop'} overlay={overLayNode} trigger={ column.overlay ? "hover" : ""} arrowContent={<div className="rc-tooltip-arrow-inner"></div>}>
                  <p style={{padding: 0, color: '#ffffff', opacity: row?.[column.key] ? 1 : column.type === 'autoInput' ? .5 : .3, textAlign: 'center', width: '100%' }}>
                      {row?.[column?.key]?.length > 0 ? row?.[column.key] : row?.["placeholder"] ?? column.placeholder}
                  </p>
              </Tooltip>
          </Background>
      )
}

const Background = styled.div`
    display:flex;
    justify-content:flex-start;
    align-items:center;
    width:100%;
    height:100%;
    padding: 0 8px;
    margin:0;
`;


export {PlaceholderBox};
