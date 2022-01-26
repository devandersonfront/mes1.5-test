import React, {useEffect, useState} from 'react'
import {IExcelHeaderType} from '../../common/@types/type'
import 'react-calendar/dist/Calendar.css'
import moment, {Moment} from 'moment'
import {createStyles, Theme} from '@material-ui/core/styles'
import {createMuiTheme, makeStyles} from '@material-ui/core'
import {DateTimePicker, MuiPickersUtilsProvider} from '@material-ui/pickers'
import MomentUtils from "@date-io/moment";
import {ThemeProvider} from 'styled-components'
// @ts-ignore
import calendarWhite from '../../../public/images/calendar_icon_black.png'

interface IProps {
    onDateChange: (date? : Moment) => void
    value: Moment
}

const darkTheme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: {
            main: '#ffffff',
        },
    },
});


const MidrangeDatetimePickerBox = ({ onDateChange, value }: IProps) => {

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
                color: "black",
            },
            input: {
                marginTop: 1,
                color: "black",
                fontSize: 15,
                padding: "0 5px",
                textAlign: 'center',
                width: 130
            }
        }),
    );

    const classes = useStyles()

    return (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
            <ThemeProvider theme={darkTheme}>
                <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
                    <DateTimePicker
                        clearable
                        value={value ?? moment().format("YYYY.MM.DD HH:mm")}
                        onChange={onDateChange}
                        format={'YYYY.MM.DD HH:mm'}
                        InputProps={{ className: classes.input, disableUnderline: true}}
                    />
                </MuiPickersUtilsProvider>
            </ThemeProvider>
            <img src={calendarWhite} style={{width: 24, height: 24}}/>
        </div>

    );
}

export {MidrangeDatetimePickerBox};
