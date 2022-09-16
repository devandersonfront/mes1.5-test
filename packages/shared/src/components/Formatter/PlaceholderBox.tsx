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
              <div style={{fontWeight : 'bold'}}>
                  {row[column.key] ? row[column.key] : column.placeholder}
              </div>
          )
      }
      console.log(column.key, row[column.key], column.placeholder)
      return(
          <Background className={row[column.key] ?? 'unprintable'}>
              {
                  column.overlay ?
                  <Tooltip placement={'rightTop'} overlay={overLayNode} arrowContent={<div className="rc-tooltip-arrow-inner"></div>}>
                      <p style={{padding: 0, color: '#ffffff', opacity: row[column.key] ? 1 : column.type === 'autoInput' ? .5 : .3, textAlign: 'center', width: '100%' }}>
                          {row[column.key] ? row[column.key] : column.placeholder}
                      </p>
                  </Tooltip>
                      :
                  <p style={{padding: 0, color: '#ffffff', opacity: row[column.key] ? 1 : column.type === 'autoInput' ? .5 : .3, textAlign: 'center', width: '100%' }}>
                      {row[column.key] ? row[column.key] : column.placeholder}
                  </p>
              }
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
