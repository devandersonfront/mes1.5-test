import React from 'react'
import {IExcelHeaderType} from '../../@types/type'
import {CellButton} from '../../styles/styledComponents'
import {useRouter} from "next/router";

interface IProps {
  row: any
  column: IExcelHeaderType
  onRowChange: (row: any) => void
}

const AddlButton = ({ row, column, onRowChange}: IProps) => {
  const router = useRouter()
  return (
    <CellButton onClick={() => {
      if(column?.url) {
          router.push(column.url)
      }else{
          onRowChange({
            ...row,
            add: true
          })
      }
    }}>
        {column.key == 'log' ? "조회" : "추가"}
    </CellButton>
  );
}

export {AddlButton}

