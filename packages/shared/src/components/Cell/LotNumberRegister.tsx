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
import {RequestMethod} from '../../common/RequestFunctions'
import Notiflix from 'notiflix'

interface IProps {
  row: any
  column: IExcelHeaderType
  onRowChange: (e: any) => void
}

const LotNumberRegister = ({ row, column, onRowChange }: IProps) => {
  const CheckDuplication = async () => {
    let res = await RequestMethod('get', `checkLotDuplication`,
      {
        path: {
          lot_number: row[column.key]
        }
      })


    if(res){
      onRowChange({
        ...row,
        update: true
      })
      Notiflix.Report.success('사용 가능한 LOT 번호입니다.','','확인');
    }else {
      // Notiflix.Report.warning('중복된 LOT 번호입니다.','','확인',);
    }
  }

  return (
    <div style={{display: 'flex', justifyContent: 'space-between', height: '100%'}}>
      <div style={{paddingLeft: 8, opacity: row[`${column.key}`] ? 1 : .3}}>{row[column.key] ?? 'LOT번호 입력'}</div>
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <CreateBtn onClick={() => {

        }}>
          생성
        </CreateBtn>
        <div style={{width: 4}}/>
        <CreateBtn onClick={() => {
          CheckDuplication()
        }}>
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
  cursor: pointer;
  p {
    margin: 0;
    padding: 0;
  }
`;

export {LotNumberRegister};
