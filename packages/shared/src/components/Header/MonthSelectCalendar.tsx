import React, {useState} from "react";
import styled from "styled-components";
//@ts-ignore
import Calendar_icon from "../../../public/images/calendar_icon_black.png";
import Calendar from "react-calendar";
import moment from "moment";
import useOnclickOutside from "react-cool-onclickoutside";

interface Props {
    selectDate:string
    setSelectDate:(value:string) => void
    onChangeSelectDate:(from:string, to:string) => void
    setState:(value:"local" | "select") => void
    dataLimit:boolean
    calendarTitle?: string
}

const MonthSelectCalendar = ({selectDate, setSelectDate, onChangeSelectDate, setState, dataLimit, calendarTitle}:Props) => {

    const [onCalendar, setOnCalendar] = useState<boolean>(false);
    const ref = useOnclickOutside(()=>{
        setOnCalendar(false);
    })

    return (
        <div style={{background:"#B3B3B3", width:205, height:32, display:"flex",  justifyContent:"space-between", alignItems:"center", padding:"0 10px", fontWeight:550, borderRadius:6 }} >
            {calendarTitle ?? '기간선택'}
            <p style={{display:"flex", alignItems:"center"}} >
                <SelectDateText onClick={()=>{
                    setOnCalendar(true);
                }}>{selectDate}</SelectDateText>
                <img src={Calendar_icon} style={{width:32,height:32,fill:"black", marginLeft:6}}/>
            </p>
            {
                onCalendar &&
                <div style={{position:"absolute", top:50, zIndex:10}} ref={ref} >
                    <Calendar defaultView={"year"}  value={new Date(new Date(selectDate))} onClickMonth={(e)=>{ //value={new Date(new Date(selectDate).getMonth())}
                        setOnCalendar(false);
                        setState && setState("local");
                        setSelectDate(moment(e).format("YYYY.MM"));
                        onChangeSelectDate(moment(e).startOf("month").format('YYYY-MM-DD'), moment(e).endOf("month").format('YYYY-MM-DD'))
                        // onChangeSelectDate(moment(e).format("YYYY.MM"));
                    }}
                        maxDate={dataLimit ? new Date() : new Date("2100.01.01")}
                    />
                </div>
            }
        </div>
    );
}

const SelectDateText = styled.span`
    width:70px;
    height:32px;
    display:flex;
    justify-content:center;
    align-items:center;
    &:hover{
        background:#cdcdcd;
    }
    cursor:pointer;
`;

export {MonthSelectCalendar};
