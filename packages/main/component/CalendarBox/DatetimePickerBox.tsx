import React, {useEffect, useState} from 'react'
import {IExcelHeaderType} from '../../common/@types/type'
import 'react-calendar/dist/Calendar.css'
import moment, {Moment} from 'moment'
import {createStyles, Theme} from '@material-ui/core/styles'
import {createMuiTheme, makeStyles} from '@material-ui/core'
import {DateTimePicker, MuiPickersUtilsProvider} from '@material-ui/pickers'
import MomentUtils from "@date-io/moment";
import {ThemeProvider} from 'styled-components'

interface IProps {
  row: any
  column: IExcelHeaderType
  onRowChange: (e: any) => void
  onClose: (state: boolean) => void
}

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#ffffff',
    },
  },
});

const whiteTheme = createMuiTheme({
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
    onRowChange({
      ...row,
      [column.key]: date ? `${date.format("YYYY-MM-DD HH:mm")}:00` : null,
      isChange: true
    })
  };

  return (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
      <ThemeProvider theme={darkTheme}>
      <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
        <DateTimePicker
          clearable
          value={selectedDate ?? null}
          onChange={onDateChange}
          format={'yyyy-MM-DD HH:mm:ss'}
          InputProps={{ className: classes.input, disableUnderline: true}}
        />
      </MuiPickersUtilsProvider>
      </ThemeProvider>
    </div>

  );
}



export default DatetimePickerBox;
