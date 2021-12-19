import React from 'react'
import {IExcelHeaderType} from '../../common/@types/type'
import {BoxWrap, DropBoxContainer, InnerBoxWrap} from '../../styles/styledComponents'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import moment from 'moment'
import useOnclickOutside from 'react-cool-onclickoutside'
import Modal from 'react-modal'

interface IProps {
  row: any
  column: IExcelHeaderType
  onRowChange: (e: any) => void
  onClose: (state: boolean) => void
  maxDate:boolean
}

const autoFocusAndSelect = (input: HTMLInputElement | null) => {
  input?.focus()
  input?.select()
}

const CalendarBox = ({ row, column, onRowChange, onClose }: IProps) => {
  const ref = useOnclickOutside(() => onClose(true))
  return (
    <Modal
      isOpen={true}
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
      <InnerBoxWrap>
        <BoxWrap style={{backgroundColor: 'white', flexDirection: 'row', display: 'flex'}}>
          <div  style={{display: 'inline-block', float: 'left', flex: 1, marginRight: 20}}>
            <Calendar
              maxDate={column.maxDate ? new Date() : moment('2999-12-31').subtract(1, 'days').toDate() }
              onChange={(date) => {
                onRowChange({
                  ...row,
                  [column.key]: moment(date).format('YYYY-MM-DD'),
                  isChange: true
                })
              }}
              value={row[column.key] ? moment(row[column.key]).toDate() : moment().toDate()}
            />
          </div>
        </BoxWrap>
      </InnerBoxWrap>
    </DropBoxContainer>
    </Modal>
  );
}



export default CalendarBox;
