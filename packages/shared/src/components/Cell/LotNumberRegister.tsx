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
import {TextEditor} from '../InputBox/ExcelBasicInputBox'
import {POINT_COLOR} from '../../common/configset'

interface IProps {
  row: any
  column: IExcelHeaderType
  onRowChange: (e: any) => void
}

const LotNumberRegister = ({ row, column, onRowChange }: IProps) => {
  const [title, setTitle] = useState<string>("연관 작업 보기")
  const [bgColor, setBgColor] = useState<string>()


  return (
    <div style={{display: 'flex', justifyContent: 'space-between'}}>
      <div style={{paddingLeft: 8}}>20210517-001</div>
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <CreateBtn>
          생성
        </CreateBtn>
        <div style={{width: 4}}/>
        <CreateBtn>
          중복 확인
        </CreateBtn>
      </div>
    </div>
  );
}

const CreateBtn = styled.div`
  padding: 0 19px;
  background-color: ${POINT_COLOR};
  height: 24px;
  justify-content: center;
  align-items: center;
  display: flex;
  p {
    margin: 0;
    padding: 0;
  }
`;

export {LotNumberRegister};
