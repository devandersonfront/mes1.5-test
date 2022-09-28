import React, { useEffect, useState } from 'react'
import { IExcelHeaderType } from '../../@types/type'
import { UnitBox, UnitValue, UnitWrapper } from '../../styles/styledComponents'
import { TransferCodeToValue, TransferValueToCode } from '../../common/TransferFunction'



interface IProps {
  row: any
  column: IExcelHeaderType
  onRowChange: (row: any) => void
}

type SelectListType = {
  pk : string,
  name : string
}

const UnitContainer = ({ row, column, onRowChange }: IProps) => {
  const [title, setTitle] = useState<string>("")

  useEffect(() => {
    let fixNumber: any = Number(row[column.key]);
    if (!isNaN(Number(fixNumber))) {
      fixNumber = fixNumber.toLocaleString(undefined, {minimumFractionDigits: column.toFix ?? undefined,  maximumFractionDigits: column.toFix ?? undefined})
    } else {
      fixNumber = undefined
    }
    setTitle(fixNumber !== undefined ? fixNumber : "")
  }, [row[column.key]])

  return (
    <UnitWrapper style={{ backgroundColor: row.border ? '#19B9DF80': undefined}}>
      <UnitValue>
        {
          !title && column.placeholder
            ? <p style={{ color: column.textType === 'Modal' ? '#0000004d' : '#ffffff4d'}}>
              {column.placeholder}
            </p>
            : <p style={{ color: column.textType === 'Modal' ? 'black' : 'white', textAlign: column.textAlign ?? null }}>{title}</p>
        }
      </UnitValue>
      <UnitBox className={'layoutCenter'}>
        {
          column.searchType === 'rawin'
            ? <span>{TransferCodeToValue(row.unit,'rawMaterialUnit')}</span>
            : column.type === 'selectUnit'
              ? <span>{row.unit}</span>
              : column.selectList ?
                  <select
                    style={{background : 'inherit' , border : 'none' , marginRight : 5, color : '#fff'}}
                    onChange={e => {
                      onRowChange({...row, unit : TransferValueToCode(e.target.value, 'rawMaterialUnit') , isChange: true})
                    }}
                    defaultValue={column.selectList?.filter(select => select.pk === row.unit)?.[0].name}
                  >
                    {
                      column.selectList?.map((list : SelectListType)=>(
                        <option key={list.pk} value={list.name} style={{color : '#000'}}>
                          {list.name}
                        </option>
                      ))
                    }
                  </select>
              :<span >{column.unitData}</span>
        }
      </UnitBox>
    </UnitWrapper>
  );
}

export { UnitContainer };
