import React, { useEffect, useState } from 'react'
import { IExcelHeaderType } from '../../@types/type'
import { UnitBox, UnitValue, UnitWrapper } from '../../styles/styledComponents'
import Big from 'big.js'
import { isInteger } from 'lodash'



interface IProps {
  row: any
  column: IExcelHeaderType
  setRow: (row: any) => void
}

const UnitContainer = ({ row, column, setRow }: IProps) => {
  const [title, setTitle] = useState<string>("")

  useEffect(() => {
    let fixNumber: any = Number(row[column.key]);

    if (!isNaN(Number(fixNumber))) {
      fixNumber = fixNumber.toLocaleString(undefined, {minimumFractionDigits: column.toFix ?? undefined,  maximumFractionDigits: column.toFix ?? undefined})
    } else {
      fixNumber = undefined
    }
    // }
    setTitle(fixNumber !== undefined ? fixNumber : "")
  }, [row[column.key]])

  return (
    <UnitWrapper>
      <UnitValue>
        {
          !title && column.placeholder
            ? <p style={{ color: column.textType === 'Modal' ? '#0000004d' : '#ffffff4d' }}>
              {column.placeholder}
            </p>
            : <p style={{ color: column.textType === 'Modal' ? 'black' : 'white', textAlign: column.textAlign ?? null }}>{title}</p>
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

export { UnitContainer };
