import React, {useEffect, useState} from 'react'
import styled from "styled-components";
//@ts-ignore
import Calendar_icon from "../../../public/images/calendar_icon_black.png";
import Calendar from "react-calendar";
import moment from "moment";
import useOnclickOutside from "react-cool-onclickoutside";
import {POINT_COLOR} from '../../common/configset'

interface ValueType {
    from:string
    to:string
}

interface Props {
    selectDate:{from:string, to:string}
    onChangeSelectDate:(ValueType:ValueType) =>void
    dataLimit:boolean
    // startSelectDate:string
    // setStartSelectDate:(value:string) => void
    // endSelectDate:string
    // setEndSelectDate:(value:string) => void
    // setState:(value:"local" | "select") => void
    calendarTitle?: string
}

const PeriodSelectCalendar = ({selectDate, onChangeSelectDate, dataLimit, calendarTitle}:Props) => {

    const [onCalendarStart, setOnCalendarStart] = useState<boolean>(false);
    const [onCalendarEnd, setOnCalendarEnd] = useState<boolean>(false);
    const [selectDates, setSelectDates] = useState<{from: string, to: string}>({
        from: moment().format('YYYY-MM-DD'),
        to: moment().format('YYYY-MM-DD'),
    })

    const ref = useOnclickOutside(()=>{
        setOnCalendarEnd(false);
        setOnCalendarStart(false);
    })

    useEffect(() => {
        setSelectDates({
            from: selectDate.from,
            to: selectDate.to
        })
    }, [onCalendarStart, onCalendarEnd])

    return (
        <div style={{background:"#B3B3B3", width:330, height:32, display:"flex",  justifyContent:"space-between", alignItems:"center", padding:"0 10px", fontWeight:550, borderRadius:6 }}>
            {calendarTitle ?? '기간선택'}
            <p style={{display:"flex", alignItems:"center"}}>
                <SelectDateText onClick={()=>{
                    setOnCalendarStart(!onCalendarStart);
                }}>{selectDate.from}</SelectDateText>
                 ~
                <SelectDateText onClick={()=>{
                    setOnCalendarEnd(!onCalendarEnd)
                }}>{selectDate.to}</SelectDateText>

                <img src={Calendar_icon} style={{width:32,height:32,fill:"black", marginLeft:6}}/>
            </p>

            {
                onCalendarStart &&
                <div style={{position:"absolute", top:50, zIndex:10}} ref={ref}>
                    <Calendar maxDate={new Date(new Date(selectDates.to))} value={new Date(selectDates.from)} onClickDay={(e)=>{ //value={new Date(new Date(selectDate).getMonth())}
                        setSelectDates({...selectDates,from: moment(e).format("YYYY-MM-DD")});
                        // setOnCalendarStart(false);
                    }}
                    />
                    <div style={{width: '100%', height: 32, backgroundColor: 'white', display: 'flex'}}>
                        <div
                          style={{width: '50%', height: '100%', justifyContent: 'center', alignItems: 'center', display: 'flex', cursor: 'pointer'}}
                          onClick={() => {
                              setOnCalendarStart(false);
                          }}
                        >
                            <p style={{padding: 0, margin: 0, textAlign: 'center'}}>
                                취소
                            </p>
                        </div>
                        <div
                          style={{
                              width: '50%', height: '100%',
                              justifyContent: 'center', alignItems: 'center', display: 'flex', backgroundColor: POINT_COLOR,
                              cursor: 'pointer'
                          }}
                          onClick={() => {
                              onChangeSelectDate({...selectDate,from: moment(selectDates.from).format("YYYY-MM-DD")});
                              setOnCalendarStart(false)
                          }
                        }>
                            <p style={{padding: 0, margin: 0, textAlign: 'center'}}>
                                확인
                            </p>
                        </div>
                    </div>
                </div>
            }
            {
                onCalendarEnd &&
                <div style={{position:"absolute", top:50, zIndex:10}} ref={ref}>
                    <Calendar minDate={new Date(new Date(selectDates.from))} value={new Date(new Date(selectDates.to))} onClickDay={(e)=>{ //value={new Date(new Date(selectDate).getMonth())}
                        setSelectDates({...selectDates,to: moment(e).format("YYYY-MM-DD")});
                        // setOnCalendarEnd(false);
                    }}
                        maxDate={dataLimit ? new Date(moment().endOf('isoWeek').format('YYYY-MM-DD')) : new Date("2999-12-31")}
                    />
                    <div style={{width: '100%', height: 32, backgroundColor: 'white', display: 'flex'}}>
                        <div
                          style={{width: '50%', height: '100%', justifyContent: 'center', alignItems: 'center', display: 'flex', cursor: 'pointer'}}
                          onClick={() => {
                              setOnCalendarEnd(false);
                          }}
                        >
                            <p style={{padding: 0, margin: 0, textAlign: 'center'}}>
                                취소
                            </p>
                        </div>
                        <div
                          style={{
                              width: '50%', height: '100%',
                              justifyContent: 'center', alignItems: 'center', display: 'flex', backgroundColor: POINT_COLOR,
                              cursor: 'pointer'
                          }}
                          onClick={() => {
                              onChangeSelectDate({...selectDate,to: moment(selectDates.to).format("YYYY-MM-DD")});
                              setOnCalendarEnd(false);
                          }}>
                            <p style={{padding: 0, margin: 0, textAlign: 'center'}}>
                                확인
                            </p>
                        </div>
                    </div>
                </div>
            }
            {/* 아이콘을 클릭했을때 Calendar가 뙇 하고 나오는거*/}
            {/*<Calendar defaultView={"year"} onClickMonth={(e)=>{*/}
            {/*}} />*/}
        </div>
    );
}

const SelectDateText = styled.span`
    width:95px;
    height:32px;
    display:flex;
    justify-content:center;
    align-items:center;
    &:hover{
        background:#cdcdcd;
    }
    cursor:pointer;
`;


export {PeriodSelectCalendar};
