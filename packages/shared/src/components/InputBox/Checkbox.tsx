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
        <div onDoubleClick={() => {
            onRowChange({...row, [column.key]:!row[column.key], isChange:true})
        }}>
            <input type={"checkbox"} checked={row[column.key]} onChange={(e) => {
                onRowChange({...row, [column.key]:e.target.checked, isChange:true})
            }} />
        </div>
    )
}

export default Checkbox
