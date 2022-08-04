import React, {useEffect, useState} from 'react'
import {IExcelHeaderType} from '../../@types/type'
import {UnitBox, UnitValue, UnitWrapper} from '../../styles/styledComponents'

interface IProps {
  row: any
  column: IExcelHeaderType
  setRow: (row: any) => void
}

const UnitContainer = ({ row, column, setRow}: IProps) => {
  const [title, setTitle] = useState<string>("")
    const AddComma = (number:number) => {
        //후방탐색 부정형은 TV, 아이폰에서 현재 지원을 안함
        // let regexp = /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g
        return number.toLocaleString()
    }

    useEffect(() => {
        let fixNumber:any = Number(row[column.key]);
        // if(Number.isInteger(fixNumber))
        // {
        //     fixNumber = AddComma(fixNumber);
        // }else if(fixNumber !== undefined){
            //반올림이 문제가 발생할 수 있음 (toFixed)
            if(!isNaN(Number(fixNumber))){
              if(column.toFix){
                fixNumber = Number(fixNumber).toFixed(column.toFix)
              }
              fixNumber = AddComma(fixNumber)
            }else{
              fixNumber = undefined
            }
        // }
        setTitle(fixNumber !== undefined ? fixNumber : "" )
    }, [row[column.key]])

  return (
    <UnitWrapper>
      <UnitValue>
        {
          !title && column.placeholder
            ? <p style={{ color: column.textType === 'Modal' ? '#0000004d' : '#ffffff4d' }}>
              {column.placeholder}
            </p>
            : <p style={{color: column.textType === 'Modal' ? 'black' : 'white', textAlign: column.textAlign ?? null}}>{title}</p>
        }
      </UnitValue>
      <UnitBox>
        {
          column.searchType === 'rawin'
            ? <span>{row.type ? row.type === 'COIL' ? 'kg' : '장' : ''}</span>
            : column.type === 'selectUnit'
              ? <span>{row.unit}</span>
              : <span >{column.unitData}</span>
        }
      </UnitBox>
    </UnitWrapper>
  );
}

export {UnitContainer};
