import React, {useEffect, useState} from "react";
import styled from "styled-components";
//@ts-ignore
import Calendar_icon from "../../public/images/calendar_icon_black.png";
import Calendar from "react-calendar";
import moment from "moment";
import useOnclickOutside from "react-cool-onclickoutside";
import {POINT_COLOR} from 'shared'

interface Props {
    selectDate:string
    setSelectDate:(value:string) => void
    onChangeSelectDate:(from:string, to:string) => void
    setState:(value:"local" | "select") => void
    dataLimit:boolean
}

const MonthSelectCalendar = ({selectDate, setSelectDate, onChangeSelectDate, setState, dataLimit}:Props) => {

    const [onCalendar, setOnCalendar] = useState<boolean>(false);
    const [select, setSelect] = useState<string>(moment().format('YYYY.MM'))
    const ref = useOnclickOutside(()=>{
        setOnCalendar(false);
    })

    useEffect(() => {
        if(selectDate) {
            setSelect(moment(selectDate).format("YYYY.MM"))
        }else{
            setSelect(moment().format("YYYY.MM"))
        }
    }, [selectDate])

    return (
        <div style={{background:"#B3B3B3", width:205, height:32, display:"flex",  justifyContent:"space-between", alignItems:"center", padding:"0 10px", fontWeight:550, borderRadius:6 }} >
            기간선택
            <p style={{display:"flex", alignItems:"center"}} >
                <SelectDateText onClick={()=>{
                    setOnCalendar(true);
                }}>{selectDate}</SelectDateText>
                <img src={Calendar_icon} style={{width:32,height:32,fill:"black", marginLeft:6}}/>
            </p>
            {
                onCalendar &&
                <div style={{position:"absolute", top:50, zIndex:10}} ref={ref} >
                    <Calendar defaultView={"year"} view={'year'}  value={new Date(new Date(select))} onClickMonth={(e)=>{ //value={new Date(new Date(selectDate).getMonth())}
                        setSelect(moment(e).format('YYYY-MM'))
                    }}
                        maxDate={dataLimit ? new Date() : new Date("2100.01.01")}
                    />
                    <div style={{display: 'flex', width: '100%', }}>
                        <div style={{width: '50%', height: 32, backgroundColor: '#b3b3b3', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <p style={{padding: 0, margin: 0, textAlign: 'center'}}>취소</p>
                        </div>
                        <div style={{width: '50%', height: 32, backgroundColor: POINT_COLOR, display: 'flex', justifyContent: 'center', alignItems: 'center'}} onClick={() => {
                            //value={new Date(new Date(selectDate).getMonth())}
                            setOnCalendar(false);
                            setState && setState("local");
                            setSelectDate(moment(select).format("YYYY.MM"));
                            onChangeSelectDate(moment(select).startOf("month").format('YYYY-MM-DD'), moment(select).endOf("month").format('YYYY-MM-DD'))
                            // onChangeSelectDate(moment(e).format("YYYY.MM"));
                        }}>
                            <p style={{padding: 0, margin: 0, textAlign: 'center'}}>확인</p>
                        </div>
                    </div>
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

export default MonthSelectCalendar;
