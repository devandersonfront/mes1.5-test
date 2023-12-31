import React, {useEffect, useState} from 'react'
import {IExcelHeaderType} from '../../@types/type'
import 'react-calendar/dist/Calendar.css'
import moment, {Moment} from 'moment'
import {createStyles, Theme} from '@material-ui/core/styles'
import {createTheme, makeStyles} from '@material-ui/core'
import {DateTimePicker, MuiPickersUtilsProvider} from '@material-ui/pickers'
import MomentUtils from "@date-io/moment";
import {ThemeProvider} from 'styled-components'
// @ts-ignore
import calendarWhite from '../../../public/images/calendar_icon_black.png'

interface IProps {
  row: any
  column: IExcelHeaderType
  onRowChange: (e: any) => void
  onClose: (state: boolean) => void
}

const darkTheme = createTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#ffffff',
    },
  },
});

const whiteTheme = createTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#000000',
    },
  },
});

const DatetimePickerBox = ({ row, column, onRowChange, onClose }: IProps) => {
  const [selectedDate, setDate] = useState(row[column.key] ? moment(row[column.key]) : null);

  useEffect(() => {
    setDate(row[column.key] ? moment(row[column.key]) : null)
  }, [row[column.key]])

  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      container: {
        display: 'flex',
        flexWrap: 'wrap',
      },
      textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
        color: column.theme === 'white' ? "black" : "white",
      },
      input: {
        marginTop: 1,
        color: column.theme === 'white' ? "black" : "white",
        fontSize: 14,
        padding: column.theme === 'white' ? 0 : 5,
        textAlign: 'center',
        width: 144
      }
    }),
  );

  const classes = useStyles()

  const onDateChange = (date?: Moment) => {
    setDate(date);
    const newRow = {
      ...row,
      [column.key]: date ? `${date.format("YYYY-MM-DD HH:mm")}:00` : null,
      isChange: true
    }
    if(column.type === 'start'){
      if(newRow.start > newRow.end){
        newRow['end'] = newRow.start
      }
    }else if(column.type === 'end'){
      if(newRow.start > newRow.end){
        newRow['start'] = newRow.end
      }
    }

    onRowChange(newRow)
  };


  return (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>

      <ThemeProvider theme={darkTheme}>
      <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
        <DateTimePicker
          clearable={false}
          value={selectedDate ?? null}
          onChange={onDateChange}
          format={'yyyy-MM-DD HH:mm:ss'}
          InputProps={{ className: classes.input, disableUnderline: true}}
          minDate={column.type === "start" ? row.standardStartDate : row.start}
          minDateMessage={null}
        />
      </MuiPickersUtilsProvider>
      </ThemeProvider>
      <img src={calendarWhite} style={{width: 24, height: 24}}/>
    </div>

  );
}

export {DatetimePickerBox};
