import React, {useEffect} from 'react'
import styled from "styled-components";
import {IExcelHeaderType} from "../../common/@types/type";

interface IProps {
  row: any
  column: IExcelHeaderType
  setRow: (row: any) => void
}

const TimeFormatter = ({row, column, setRow}: IProps) => {
  const [time, setTime] = React.useState<string | undefined>()

  useEffect(() => {
    if(row[column.key]){
      let sec = Number(row[column.key])
      let hour = Math.floor(sec/3600)
      sec = sec%3600
      let min = Math.floor(sec/60)
      sec = sec%60

      console.log(`${hour}:${min}:${sec}`)

      setTime(`${hour >= 10 ? hour : '0'+hour}:${min >= 10 ? min : '0'+min}:${sec >= 10 ? sec : '0'+sec}`)
    }
  }, [row])

  return(
    <Background style={{background: "white"}} onClick={()=>{
    }} >
      <p style={{padding: 0, color: row[column.key] ? '#0D0D0D' : '#0D0D0D66', width: '100%', textAlign: column.textAlign ?? 'left' }}>
        {time ?? "00:00:00"}
      </p>
    </Background>
  )
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

export {TimeFormatter};
