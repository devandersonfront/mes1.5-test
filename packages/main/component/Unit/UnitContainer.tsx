import React, {useEffect, useState} from 'react'
import {IExcelHeaderType} from '../../common/@types/type'
import {UnitBox, UnitValue, UnitWrapper} from '../../styles/styledComponents'

interface IProps {
  row: any
  column: IExcelHeaderType
  setRow: (row: any) => void
}

const UnitContainer = ({ row, column, setRow}: IProps) => {
  const [title, setTitle] = useState<string>("")
    const AddComma = (number:number) => {
        let regexp = /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g;
        return number.toString().replace(regexp, ",");
    }

  useEffect(() => {

    if (Number.isNaN(Number(row[column.key]))) {
      setTitle(row[column.key])
    } else {
      let fixNumber: any = Number(row[column.key])
      // if(Number.isInteger(fixNumber))
      // {
      //     fixNumber = AddComma(fixNumber);
      // }else if(fixNumber !== undefined){
      //반올림이 문제가 발생할 수 있음 (toFixed)
      if (!isNaN(Number(fixNumber))) {
        if (column.toFix) {
          fixNumber = Number(fixNumber).toFixed(column.toFix)
        }
        fixNumber = AddComma(fixNumber)
      } else {
        fixNumber = undefined
      }
      // }
      setTitle(fixNumber !== undefined ? fixNumber : '')
    }
  }, [row[column.key]])


  return (
    <UnitWrapper>
      <UnitValue>
        <p>{title}</p>
      </UnitValue>
      <UnitBox>
        {
          column.searchType === 'rawin'
            ? <span>{row.type === 'COIL' ? 'kg' : '장'}</span>
            : <span>{column.key === 'carryforward' ? (row[column.key] || row[column.key] === 0) ? column.unitData : '' : column.unitData}</span>
        }
      </UnitBox>
    </UnitWrapper>
  );
}

export default UnitContainer;
