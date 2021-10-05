import React from 'react'
import {IExcelHeaderType} from '../../@types/type'
import {CellButton} from '../../styles/styledComponents'

interface IProps {
  row: any
  column: IExcelHeaderType
  onRowChange: (row: any) => void
}

const AddlButton = ({ row, column, onRowChange}: IProps) => {
  return (
    <CellButton onClick={() => {
      onRowChange({
        ...row,
        add: true
      })
    }}>
      추가
    </CellButton>
  );
}

export {AddlButton}

