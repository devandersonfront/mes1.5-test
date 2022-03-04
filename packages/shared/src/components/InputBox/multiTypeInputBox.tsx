import React, {useEffect} from 'react'
import {IExcelHeaderType} from '../../common/@types/type'
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

const autoFocusAndSelect = (input: HTMLInputElement | null) => {
    input?.focus()
    input?.select()
}

const MultiTypeInputEditor = ({ row, column, onRowChange, onClose }: IProps) => {
    const dispatch = useDispatch();
    // const selector = useSelector((state:RootState) => state.MachineSelectReducer);
    console.log("MultiTypeInputEditor : ", row)
    useEffect(() => {
    }, [row])

    const typeCheck = () => {
        switch (row.columnType){
            case "text":
                console.log("TEXT!!!!!")
                return <TextEditor row={row} column={column} onRowChange={onRowChange} />
            case "dropdown":
                console.log("DROPDOWN!!!!!")
                return <DropDownEditor column={column} row={row} onRowChange={onRowChange}/>
            default:
                return <TextEditor row={row} column={column} onRowChange={onRowChange} />
        }
    }

    return typeCheck();
}

export {MultiTypeInputEditor};
