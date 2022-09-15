import React from 'react'
import {IExcelHeaderType} from '../../@types/type'
import {CellButton} from '../../styles/styledComponents'

interface IProps {
  row: any
  column: IExcelHeaderType
}

const CompleteButton = ({ row, column}: IProps) => {
  const afterCompleteUi = () => {
    return <CellButton style={{opacity: row.readonly ? .3 : 1}} onClick={() => row.onClickEvent && row.onClickEvent(row)}>
      {column.afterEventTitle}
    </CellButton>
  }

  const beforeCompleteUi = () => {
    return <CellButton style={{opacity: row.readonly ? .3 : 1}} onClick={() => row.onClickEvent && row.onClickEvent(row)}>
      {column.beforeEventTitle}
    </CellButton>
  }

  return (

    <div style={{width:"100%", height:"100%", display:"flex", justifyContent:"center", alignItems:"center"}}>
    {
      row.is_complete ? afterCompleteUi() : beforeCompleteUi()
    }
    </div>
  );
}

export {CompleteButton};
