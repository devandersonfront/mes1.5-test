import React, { useEffect, useRef } from 'react'
import {IExcelHeaderType} from '../../common/@types/type'
import Notiflix from 'notiflix'
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../reducer";
import {insert_machine_list} from "../../reducer/machineSelect";
import { RemoveFirstZero } from '../../common/Util'

interface IProps {
  row: any
  column: IExcelHeaderType
  onRowChange: (e: any) => void
  onClose?: (state: boolean) => void
}


const TextEditor = ({ row, column, onRowChange, onClose }: IProps) => {
  const dispatch = useDispatch();
  const selector = useSelector((state:RootState) => state.MachineSelectReducer);
  const isNumberInput = column.type === 'number'
  useEffect(() => {
  }, [row])
  const checkIfNegative = (value: string) : boolean => {
    return value.startsWith("-")
  }
  const isDisabled: boolean = column.readonly || (column.disabledCase && column.disabledCase.length > 0 && column.disabledCase.some((dcase) => row[dcase.key] === dcase.value))
  const autoFocus = (input: HTMLInputElement | null) => {
      input?.focus()
  }
  return (
    <input
      style={{textAlign: 'center', color: column.textType ? 'black' : 'white', border:"none" }}
      className={'editCell'}
      ref={autoFocus}
      value={isNumberInput? RemoveFirstZero(row[column.key]) : row[column.key]}
      disabled={isDisabled}
      type={isNumberInput ? "number" : "text"}
      onFocus={() => {
        if(column.searchType === 'record' && row.osd_id){
          onClose(true)
          Notiflix.Report.warning('수정할 수 없습니다.', '작업지시 고유 번호가 있으면 수정할 수 없습니다.', '확인')
        }else if(column.key === 'tmpId' && row[column.key]){
          if(!row.isChange || row.user_id){
            onClose(true)
            return Notiflix.Report.warning('수정할 수 없습니다.', '아이디는 수정할 수 없습니다.', '확인')
          }
        }else if(column.key === 'amount' && row.setting){
          onClose(true)
          Notiflix.Report.warning('수정할 수 없습니다.', '사용여부가 부 입니다.', '확인')
        }else if(column.readonly && row.mold_id){
          onClose(true)
          return Notiflix.Report.warning('수정할 수 없습니다.', '', '확인')
        }
      }}

      onChange={(event) => {
        let eventValue = event.target.value
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
          onRowChange({ ...row, [column.key]: eventValue, isChange: true })
          if(selector.selectRow === 1){
            selector.machineList.map((v,i)=>{
              if(i !== 0){
                v.goal = Number(eventValue)
              }
            })
          }else{
            selector.machineList[selector.selectRow].goal = Number(eventValue);
          }
          dispatch(insert_machine_list({...selector}))
        }else{
          // console.log("check : " , column.key , eventValue);
          
          onRowChange({ ...row, [column.key]: eventValue, isChange: true })
        }
      }}
      onBlur={() => onClose && onClose(true)}
    />
  );
}

export {TextEditor};
