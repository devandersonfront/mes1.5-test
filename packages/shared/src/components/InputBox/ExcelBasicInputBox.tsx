import React, {useEffect} from 'react'
import {IExcelHeaderType} from '../../common/@types/type'
import Notiflix from 'notiflix'
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../reducer";
import {insert_machine_list} from "../../reducer/machineSelect";

interface IProps {
  row: any
  column: IExcelHeaderType
  onRowChange: (e: any) => void
  onClose: (state: boolean) => void
}

const autoFocusAndSelect = (input: HTMLInputElement | null) => {
  input?.focus()
  input?.select()
}

const TextEditor = ({ row, column, onRowChange, onClose }: IProps) => {
  const dispatch = useDispatch();
  const selector = useSelector((state:RootState) => state.MachineSelectReducer);

  useEffect(() => {
  }, [row])

  return (
    <input
      style={{textAlign: 'center', color: column.textType ? 'black' : 'white' }}
      className={'editCell'}
      ref={autoFocusAndSelect}
      value={row[column.key]}
      onFocus={() => {
        if(column.searchType === 'record' && row.osd_id){
          onClose(true)
          Notiflix.Report.warning('수정할 수 없습니다.', '작업지시 고유 번호가 있으면 수정할 수 없습니다.', '확인', )
        }else if(column.key === 'tmpId' && row[column.key]){
          onClose(true)
          Notiflix.Report.warning('수정할 수 없습니다.', '아이디는 수정할 수 없습니다.', '확인', )
        }
      }}
      onChange={(event) => {
        if(column.key === 'mold_name') {
          onRowChange({
            ...row,
            [column.key]: event.target.value,
            wip_name: event.target.value ? event.target.value+'-1' : undefined,
            isChange: true
          })
        }else if(column.key === "goal"){
          onRowChange({ ...row, [column.key]: event.target.value, isChange: true })
          if(selector.selectRow === 1){
            selector.machineList.map((v,i)=>{
              if(i !== 0){
                v.goal = Number(event.target.value)
              }
            })
          }else{
            selector.machineList[selector.selectRow].goal = Number(event.target.value);
          }
          dispatch(insert_machine_list({...selector}))
        }else{
          onRowChange({ ...row, [column.key]: event.target.value, isChange: true })
        }
      }}
      onBlur={() => onClose(true)}
    />
  );
}

export {TextEditor};
