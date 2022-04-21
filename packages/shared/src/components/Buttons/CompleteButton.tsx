import React, {useState} from 'react'
import {IExcelHeaderType} from '../../common/@types/type'
import {CellButton} from '../../styles/styledComponents'
import Notiflix from 'notiflix'
import {RequestMethod} from '../../common/RequestFunctions'

interface IProps {
  row: any
  column: IExcelHeaderType
  onRowChange: (row: any) => void
}

const CompleteButton = ({ row, column, onRowChange}: IProps) => {
  const [title, setTitle] = useState<string>("")

  const afterCompleteUi = () => {
    return <CellButton
      onClick={() => {
        column.onClickEvent(row)
      }
      }>{column.afterEventTitle}</CellButton>
  }

  const beforeCompleteUi = () => {
    return <CellButton
      onClick={() => {
      column.onClickEvent(row)
    }
    }>{column.beforeEventTitle}</CellButton>
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
