import React, {useEffect} from 'react'
import {IExcelHeaderType} from '../../@types/type'
import Notiflix from 'notiflix'
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../reducer";
import {insert_machine_list} from "../../reducer/machineSelect";
import {TextEditor} from "./ExcelBasicInputBox";
import {DropDownEditor} from "../Dropdown/ExcelBasicDropdown";

interface IProps {
    row: any
    column: IExcelHeaderType
    onRowChange: (e: any) => void
    onClose?: (state: boolean) => void
}

const MultiTypeInputEditor = ({ row, column, onRowChange, onClose }: IProps) => {
    const typeCheck = () => {
        switch (row.columnType){
            case "text":
                return <TextEditor row={""} column={column} onRowChange={(e) => {
                    onRowChange(e)
                }} onClose={onClose}/>
            case "dropdown":
                return <DropDownEditor column={column} row={row} onRowChange={onRowChange}/>
                // return <DropDownEditor column={{...column,selectList:Object.keys(row.selectList).map((name, index) => Object({name:name, pk:index})), }} row={row} onRowChange={onRowChange}/>
            default:
                return <TextEditor row={row} column={column} onRowChange={onRowChange} />
        }
    }

    return typeCheck();
}

export {MultiTypeInputEditor};
