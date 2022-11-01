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
        <input type={"checkbox"} checked={row[column.key]} onChange={(e) => {
            onRowChange({...row, [column.key]:e.target.checked})
        }} />
    )
}

export default Checkbox
