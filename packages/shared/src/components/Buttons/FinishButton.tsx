import React, {useState} from 'react'
import {IExcelHeaderType} from '../../common/@types/type'
import {CellButton} from '../../styles/styledComponents'
import {useRouter} from 'next/router'
import Notiflix from 'notiflix'
import {RequestMethod} from '../../common/RequestFunctions'

interface IProps {
  row: any
  column: IExcelHeaderType
  onRowChange: (row: any) => void
}

const FinishButton = ({ row, column, onRowChange}: IProps) => {
  const [title, setTitle] = useState<string>("작업 종료")

  const router = useRouter()

  const SaveBasic = async () => {
    console.log(row)
    let res: any
    res = await RequestMethod('post', `sheetSave`,
      [{
        ...row,
        status: 2
      }]).catch((err) => {
        Notiflix.Report.failure("에러",err.data.message,"확인")
    })


    if(res){
      Notiflix.Report.success('저장되었습니다.','','확인');
    }
  }

  return (
    <CellButton onClick={() => {
      SaveBasic().then(()=>{
        onRowChange({
          ...row,
          finish: true
        })
      })
    }}>
      {title}
    </CellButton>
  );
}

export {FinishButton};
