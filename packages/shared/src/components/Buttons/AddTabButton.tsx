import React, {useEffect, useState} from 'react'
import {IExcelHeaderType} from '../../common/@types/type'
import {CellButton} from '../../styles/styledComponents'
import {useRouter} from 'next/router'
import Notiflix from 'notiflix'

interface IProps {
  row: any
  column: IExcelHeaderType
  onRowChange: (e: any) => void
}

const AddTabButton = ({ row, column, onRowChange}: IProps) => {
  const [title, setTitle] = useState<string>("BOM 보기")

  return (
    <div style={{
    }}>
      <div style={{
        fontSize: '15px',
        margin: 0,
        padding: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#0D0D0D',
        background:row.border ? "#19B9DF80" : "white",
        cursor: 'pointer',
      }} onClick={() => {
        onRowChange({
          ...row,
          newTab: true
        })
      }}>
        <p style={{padding: 0, margin: 0, textDecoration: 'underline'}}>{title}</p>
      </div>
    </div>
  );
}

export {AddTabButton};
