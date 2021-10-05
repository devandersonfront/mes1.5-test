import React, {useEffect, useState} from 'react'
import {IExcelHeaderType} from '../../common/@types/type'
import {BoxWrap, DropBoxContainer, InnerBoxWrap, UnitBox, UnitValue, UnitWrapper} from '../../styles/styledComponents'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import moment from 'moment'
import useOnclickOutside from 'react-cool-onclickoutside'
import Modal from 'react-modal'
import styled from 'styled-components'
//@ts-ignore
import calendarWhite from '../../../public/images/calendar_icon_white.png'

interface IProps {
  row: any
  column: IExcelHeaderType
  onRowChange: (e: any) => void
}

const RelationWork = ({ row, column, onRowChange }: IProps) => {
  const [title, setTitle] = useState<string>("연관 작업 보기")
  const [bgColor, setBgColor] = useState<string>()


  return (
    <div>
      <UnitWrapper
        style={{cursor: 'pointer'}}
        onClick={() => {
        }}
      >
        <UnitValue
          style={{
            width: '100%',
            padding: 0,
            backgroundColor: bgColor
          }}>
          <p style={{textAlign: 'center', textDecoration: 'underline'}}>{title}</p>
        </UnitValue>
      </UnitWrapper>
    </div>
  );
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

export {RelationWork};
