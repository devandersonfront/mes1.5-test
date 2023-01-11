import React, {useState} from 'react'
import {IExcelHeaderType} from '../../@types/type'
import {BoxWrap, DropBoxContainer, InnerBoxWrap} from '../../styles/styledComponents'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import moment from 'moment'
import useOnclickOutside from 'react-cool-onclickoutside'
import Modal from 'react-modal'
import styled from 'styled-components'
//@ts-ignore
import calendarWhite from '../../../public/images/calendar_icon_white.png'
//@ts-ignore
import calendarBlack from '../../../public/images/calendar_icon_black.png'
import {POINT_COLOR} from '../../common/configset'

interface IProps {
  row: any
  column: IExcelHeaderType
  onRowChange: (e: any) => void
}

const CalendarBox = ({ row, column, onRowChange }: IProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [select, setSelect] = useState<Date>(moment().toDate())
  const ref = useOnclickOutside(() => setIsOpen(false))

  React.useEffect(() => {
    if(isOpen){
      if(row[column.key]) setSelect(moment(row[column.key]).toDate())
      else setSelect(moment().toDate())
    }
  }, [isOpen])

  const minDate = () => {
    let minDate = moment('1900-01-01').subtract(1, 'days').toDate()
    if(column.type == "Modal" && column.dependency){
        return moment(row.date).toDate()
    }
    switch(column.type)
    {
      case 'deadline': minDate = moment(row.date).toDate()
        break
      case 'delivery':
        if(!!row.contract?.date) {
        minDate = moment(row.contract.date).toDate()
        }
        break
      case 'outsourcingOrder':
      case 'outsourcingImport': minDate = moment(row.order_date).toDate()
        break
      default:
    }
    return minDate
  }

  return (
    <div>
      <Background
          onClick={() => {
          if(!column.readonly) setIsOpen(true)
      }}>
        <p style={{padding: 0, margin: 0, color: column.type === "Modal" ? 'black' : row[column.key] ? '#ffffff' : '#ffffff4d', textAlign: 'center', width: '100%' }}>
          {row[column.key] ? row[column.key] : moment().format("YYYY-MM-DD")}
        </p>
        <img  className={'unprintable'} src={column.type !== "Modal" ? calendarWhite : calendarBlack} style={{width: 24, height: 24}}/>
      </Background>
      <Modal
        isOpen={isOpen}
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            padding: 0
          },
          overlay: {
            background: 'rgba(0,0,0,.6)',
            zIndex: 101
          }
        }}
      >
      <DropBoxContainer ref={ref}>
        <InnerBoxWrap style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'space-between',
          flexDirection: 'column'
        }}>
          <BoxWrap style={{backgroundColor: 'white', flexDirection: 'row', display: 'flex'}}>
            <div  style={{display: 'inline-block', float: 'left', flex: 1, marginRight: 20}}>
              <Calendar
                  maxDate={new Date(8640000000000000)}
                  minDate={minDate()}
                onChange={(date) => {
                  setSelect(date)
                }}
                value={select}
              />
            </div>
          </BoxWrap>
          <div>
            <div style={{ height: 40, display: 'flex', alignItems: 'flex-end'}}>
              <div
                onClick={() => {
                  setIsOpen(false)
                }}
                style={{flex: 1, height: 40, backgroundColor: '#b3b3b3', display: 'flex', justifyContent: 'center', alignItems: 'center'}}
              >
                <p>취소</p>
              </div>
              <div
                onClick={() => {
                    const selected = moment(select).format('YYYY-MM-DD')
                    const newRow = {
                        ...row,
                        [column.key]: selected,
                        isChange: true
                    }
                    if(column.dependency){
                        if(!!!row[column.dependency] || selected > row[column.dependency]) {
                            newRow[column.dependency] = selected
                        }
                    }

                    onRowChange(newRow)
                    setIsOpen(false)
                }}
                style={{flex: 1, height: 40, backgroundColor: POINT_COLOR, display: 'flex', justifyContent: 'center', alignItems: 'center'}}
              >
                <p>확인</p>
              </div>
            </div>
          </div>
        </InnerBoxWrap>
      </DropBoxContainer>
      </Modal>
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

export {CalendarBox};
