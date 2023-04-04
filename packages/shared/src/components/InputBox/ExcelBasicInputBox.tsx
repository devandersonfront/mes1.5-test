import React, { useEffect, useRef, useState } from 'react'
import {IExcelHeaderType} from '../../@types/type'
import Notiflix from 'notiflix'
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../reducer";
import { insert_machine_list, selectMachineList } from '../../reducer/machineSelect'
import { RemoveFirstZero } from '../../common/Util'

interface IProps {
  row: any
  column: IExcelHeaderType
  onRowChange: (e: any) => void
  onClose?: (state: boolean) => void
}


const TextEditor = ({ row, column, onRowChange, onClose }: IProps) => {
  const dispatch = useDispatch();
  const selector = useSelector(selectMachineList);
  const isNumberInput = column.inputType === 'number'
  const [ focus, setFocus ] = useState(false)
  useEffect(() => {
    return () => {
      setFocus(false)
    }
  }, [])
  const checkIfNegative = (value: string) : boolean => {
    return value.startsWith("-")
  }

  const isDisabled: boolean = column.readonly || (column.disabledCase && column.disabledCase.length > 0 && column.disabledCase.some((dcase) => row[dcase.key] === dcase.value))
  const autoFocus = (input: HTMLInputElement | null) => {
    input?.focus()
  }
  const korean = /[ㄱ-ㅎ|ㅏ-ㅣ|\\|<|>*]/;
  const validInput = (input: string) => {
    const escapes = ["\\", "<", ">", "*"]
    if(escapes.includes(input)){
        Notiflix.Report.warning("경고","해당 특수문자는 사용할 수 없습니다.","확인")
        return false
    }
    return true
  }


  return (
    <input
      style={{textAlign: 'center', color: column.textType ? 'black' : 'white', border:"none"}}
      className={'editCell'}
      ref={autoFocus}
      onPaste={() => setFocus(true)}
      value={isNumberInput? RemoveFirstZero(row[column.key]) : row[column.key] ?? ""}
      disabled={isDisabled}
      type={isNumberInput ? "number" : "text"}
      maxLength={column.key == "telephone" && 13}
      onKeyDown={(e) => {
        if(validInput(e.key)){
          setFocus(true)
        } else {
          e.preventDefault()
        }
      }}
      onCompositionStart={() => setFocus(true)}
      onFocus={() => {
        if(column.searchType === 'record' && row.osd_id){
          onClose(true)
          Notiflix.Report.warning('수정할 수 없습니다.', '작업지시 고유 번호가 있으면 수정할 수 없습니다.', '확인')
        }else if(column.key === 'id' && row[column.key]){
          if(!row.isChange && row.user_id){
            onClose(true)
            return Notiflix.Report.warning('수정할 수 없습니다.', '아이디는 수정할 수 없습니다.', '확인')
          }
        }else if(column.key === 'amount' && row.setting){
          onClose(true)
          Notiflix.Report.warning('수정할 수 없습니다.', '사용여부가 부 입니다.', '확인')
        }else if(column.readonly && row.mold_id) {
          onClose(true)
          return Notiflix.Report.warning('수정할 수 없습니다.', '', '확인')
        }else if(column.key === 'order_quantity' && !!row.bom){
          return Notiflix.Report.warning('경고', '발주량을 수정할 수 없습니다.', '확인')
        }if(column.type === "stockAdmin"){
          if(row?.changeRows && !row.changeRows?.includes(column.key)){
            onRowChange({...row, changeRows:[...row.changeRows, column.key]})
          }else if(row?.changeRows){
            //아무것도 return 없음
          }else{
            onRowChange({...row, changeRows:[column.key]})
          }
        }
      }}
      onChange={(event) => {
        let eventValue = column.key === "telephone" ? event.target.value.replace(/[^0-9]/g, '')
            .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, "$1-$2-$3").replace(/(\-{1,2})$/g, "") : event.target.value
        const lastChar = eventValue.slice(-1)
        const deleteEvent = eventValue.length < row[column.key]?.length
        if(!validInput(lastChar) || (!deleteEvent && korean.test(lastChar) && !focus)) return

        if(isNumberInput){
          if(checkIfNegative(event.target.value)){
            Notiflix.Report.warning('경고', '음수일 수 없습니다.', '확인')
            return
          }
          eventValue= RemoveFirstZero(event.target.value)
        }
        if(column.key === 'mold_name') {
          onRowChange({
            ...row,
            [column.key]: eventValue,
            wip_name: eventValue ? eventValue+'-1' : undefined,
            isChange: true
          })
        }else if(column.key === "goal"){
          const newMachineList = {...selector}
          onRowChange({ ...row, [column.key]: eventValue, isChange: true })
          newMachineList[newMachineList.selectRow] = { ...newMachineList[newMachineList.selectRow], goal:Number(eventValue)};
          column?.textMultiInput && column.textMultiInput(row.index,eventValue)
          dispatch(insert_machine_list(newMachineList))
        }else{
          onRowChange({ ...row, [column.key]: eventValue, isChange: true })
        }
      }}
      onBlur={(e) => {
        setFocus(false)
        onClose && onClose(true)}}
    />
  );
}

export {TextEditor};
