import React, {ChangeEvent} from "react"
import {IExcelHeaderType} from "../../@types/type";

interface IProps {
    row: any
    column: IExcelHeaderType
    onRowChange: (e: any) => void
    onClose?: (state: boolean) => void
}

const Checkbox = ({row, column, onRowChange, onClose}: IProps) => {
    return (
        <input type={"checkbox"} value={row[column.key]} onChange={(e) => {
            console.log("row : ", row, e.target.checked)
            onRowChange({...row, ai_check:e.target.checked})
        }} />
    )
}

export default Checkbox
