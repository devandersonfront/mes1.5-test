import React, {useState} from 'react'
import {IExcelHeaderType} from '../../common/@types/type'
import {CellButton} from '../../styles/styledComponents'
import Notiflix from 'notiflix'
import {RequestMethod} from '../../common/RequestFunctions'

interface IProps {
  row: any
  column: IExcelHeaderType
  onRowChange: (row: any) => void
}

const FinishButton = ({ row, column, onRowChange}: IProps) => {
  const [title, setTitle] = useState<string>("작업 종료")

  const SaveBasic = async () => {
    let res: any
    res = await RequestMethod('post', `sheetFinish`,
      {
        ...row,
        status: 2
      }).catch((err) => {
        Notiflix.Report.failure("에러",err.data.message,"확인")
    })


    if(res){
      Notiflix.Report.success('저장되었습니다.','','확인', ()=>  onRowChange({
        ...row,
        finish: true
      }));
    }
  }

  return (
      <div style={{width:"100%", height:"100%", display:"flex", justifyContent:"center", alignItems:"center"}}>
        <CellButton onClick={() => {
          Notiflix.Confirm.show(`작업지시서가 완료 처리됩니다. 진행 하시겠습니까?`, '*작업완료 처리된 지시서는 작업일보 등록이 불가해집니다.', '예','아니오', () =>  SaveBasic(), ()=>{},
            {width: '400px'})
        }}>
          {title}
        </CellButton>
      </div>
  );
}

export {FinishButton};
