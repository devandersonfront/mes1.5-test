import React, {useState} from 'react'
import {IExcelHeaderType} from '../../common/@types/type'
import {CellButton} from '../../styles/styledComponents'

interface IProps {
  row: any
  column: IExcelHeaderType
  onRowChange: (row: any) => void
}

const CellButtonComponent = ({ row, column, onRowChange}: IProps) => {
  const [title, setTitle] = useState<string>("추가")

  return (
    <CellButton onClick={() => {
      onRowChange({
        ...row,
        add: true
      })
    }}>
      {title}
    </CellButton>
  );
}

export default CellButtonComponent;
