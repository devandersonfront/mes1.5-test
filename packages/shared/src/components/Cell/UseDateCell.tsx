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

const UseDateCell = ({ row, column, onRowChange }: IProps) => {
  const [title, setTitle] = useState<number>(0)
  const [bgColor, setBgColor] = useState<string>()

  useEffect(() => {
    getUseDate(row.date)
  }, [row])

  const getUseDate = (date?: Date) => {

    const now = moment();
    const useDate = moment(date)

    const elapsedDay = Math.floor(Number(moment.duration(now.diff(useDate)).asDays()))

    if( row.date && elapsedDay >= row.expiration ){
      setBgColor('red')
    }else{
      setBgColor(undefined)
    }

    setTitle(elapsedDay)
  }

  return (
    <div>
      <UnitWrapper>
        <UnitValue
          style={{
            width: '100%',
            padding: 0,
            backgroundColor: bgColor
          }}>
          <p style={{textAlign: 'center',}}>{title}</p>
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

export {UseDateCell};
