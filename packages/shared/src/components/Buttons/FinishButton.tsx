import React, {useEffect, useState} from 'react'
import {IExcelHeaderType} from '../../common/@types/type'
import {CellButton} from '../../styles/styledComponents'
import {useRouter} from 'next/router'
import Notiflix from 'notiflix'

interface IProps {
  row: any
  column: IExcelHeaderType
  setRow: (row: any) => void
}

const FinishButton = ({ row, column, setRow}: IProps) => {
  const [title, setTitle] = useState<string>("작업 종료")

  const router = useRouter()

  return (
    <CellButton onClick={() => {
    }}>
      {title}
    </CellButton>
  );
}

export {FinishButton};
