import React, {useState} from "react";
import styled from "styled-components";
import Calendar from "react-calendar";
import moment from "moment";
import useOnclickOutside from "react-cool-onclickoutside";
import 'react-calendar/dist/Calendar.css'
import '@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css'
import dynamic from "next/dynamic";

const DateRangePicker = dynamic(() => import("@wojtekmaj/react-daterange-picker/dist/entry.nostyle"), {
    ssr: false,
});
interface ValueType {
    from:string
    to:string
}

interface Props {
    selectDate:{from:string, to:string}
    onChangeSelectDate:(ValueType:ValueType) =>void
    dataLimit:boolean
}

const DateRangeCalendar = ({selectDate, onChangeSelectDate, dataLimit}:Props) => {

    const [onCalendar, setOnCalendar] = useState<boolean>(false);
    const maxDate = new Date(moment().subtract(1,'day').format("YYYY-MM-DD"))

    return (
        <div style={{background:"#B3B3B3", width:300, height:32, display:"flex",  justifyContent:"space-between", alignItems:"center", padding:"0 10px", fontWeight:550, borderRadius:6 }}>
            <p>기간선택</p>
            <div onClick={()=>setOnCalendar(!onCalendar)} style={{position: "absolute", marginLeft: '80px' ,width: '200px', height: '30px', zIndex: 2}}>
            </div>
            <DateRangePicker value={[selectDate.from, selectDate.to]} maxDate={maxDate} onChange={(e)=>{
                onChangeSelectDate({...selectDate,from: moment(e[0]).format("YYYY-MM-DD"),to: moment(e[1]).format("YYYY-MM-DD")})
            }}
                             calendarIcon={null}
                             clearIcon={null}
                             selectRange={true}
                             disabled={true}
                             isOpen={onCalendar}
            />
        </div>
    );
}



export default DateRangeCalendar;
