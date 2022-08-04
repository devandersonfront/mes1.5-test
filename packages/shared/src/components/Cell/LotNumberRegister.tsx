import React from 'react'
import {IExcelHeaderType} from '../../@types/type'
import 'react-calendar/dist/Calendar.css'
import styled from 'styled-components'
//@ts-ignore
import calendarWhite from '../../../public/images/calendar_icon_white.png'
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


    if(!res){
      Notiflix.Report.success('사용 가능한 LOT 번호입니다.','','확인', () => {
        onRowChange({
          ...row,
          update: true
        })
      });
    }else {
      Notiflix.Confirm.show(
        '중복된 LOT 번호입니다.',
        '동일한 Lot번호를 등록하시겠습니까?',
        '예', '아니오',
        () => {
          onRowChange({
            ...row,
            update: true
          })
        },
        () => {
          onRowChange({
            ...row,
            lot_number: '',
            update: true
          })
        }
      );
    }
  }

  return (
    <div style={{display: 'flex', justifyContent: 'space-between', height: '100%'}}>
      <div style={{
        width: 200,
        paddingLeft: 8,
        opacity: row[`${column.key}`] ? 1 : .3,
        textOverflow:'ellipsis',
        wordBreak: 'normal',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
      }}>{row[column.key] ?? 'LOT번호 입력'}</div>
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        {/*<CreateBtn onClick={() => {*/}

        {/*}}>*/}
        {/*  생성*/}
        {/*</CreateBtn>*/}
        {/*<div style={{width: 4}}/>*/}
        <CreateBtn onClick={() => {
          if(row[column.key]){
            CheckDuplication()
          }else{
            Notiflix.Report.warning("Lot번호를 입력해주세요", "", '확인')
          }
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
