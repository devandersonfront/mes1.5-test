import { IExcelHeaderType } from '../../@types/type'
import styled from 'styled-components'
//@ts-ignore
import DROPDOWN_IMG from '../../../../mes/public/images/ic_monitoring_open.png'
import React, { useRef } from 'react'


type ExcelType = {
    column: IExcelHeaderType
    row: any
    onRowChange: (e: any) => void
}

type SelectListType = {
    pk : string,
    name : string
}


// period_unit : 0(day) , 1(week) , 2(month)
const InputWithDropDown = ({row, column, onRowChange} : ExcelType) => {

    const typeOfUnit = (unit : '일' | '주' | '월') : 0 | 1 | 2 | undefined  => {
        return  unit === '일'
                ? 0
                : unit === '주'
                ? 1
                : unit ==='월'
                ? 2
                : undefined
    }

    const unitOfType = (type : 0 | 1 | 2) : '일' | '주' | '월' => {
        return  type === 0
        ? '일'
        : type === 1
        ? '주'
        : type === 2
        ? '월'
        : undefined
    }

    const handleChange = (e) => {
        onRowChange({...row , [column.key] : Number(e.target.value) , isChange: true})
    }

    const handleDayChange = (e) => {
        onRowChange({...row, period_unit : typeOfUnit(e.target.value) , isChange: true})
    }

    return (
        <InputWithDropDownContainer>
            <InputContainer>
                <InputValue maxLength={5} value={row.period} onChange={handleChange}></InputValue>
            </InputContainer>
            <DropDownContainer>
                    <select
                        style={{background : 'inherit' , border : 'none' , marginRight : 5, color : '#fff'}}
                        onChange={handleDayChange}
                        defaultValue={unitOfType(row.period_unit)}
                    >
                        {
                            column.selectList?.map((list : SelectListType)=>(
                                <option key={list.pk} value={list.name} style={{color : '#000'}}>
                                    {list.name}
                                </option>
                            ))
                        }
                    </select>

            </DropDownContainer>
        </InputWithDropDownContainer>
    )

}


export {InputWithDropDown}


const InputWithDropDownContainer = styled.div`
    width : 100%;
    display : flex;
    justify-content : space-between;
    align-items : center;
    height : 100%;
`

const InputContainer = styled.div`
    width : 100%;
    height : 100%;
`

const InputValue = styled.input`
    width: 100%;
    background : inherit;
    border :none;
    color : #fff;
    margin-left : 10px;
    &:focus {
        outline : none
    }
`

const DropDownContainer = styled.div`
    display : flex;
    align-items : center;
    `
