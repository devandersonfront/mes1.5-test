import React, {useEffect, useState} from 'react'
import {IExcelHeaderType} from '../../common/@types/type'
import {CellButton} from '../../styles/styledComponents'
import {useRouter} from 'next/router'
import Notiflix from 'notiflix'

interface IProps {
  row: any
  column: IExcelHeaderType
  setRow: (row: any) => void
}

const CellButtonComponent = ({ row, column, setRow}: IProps) => {
  const [title, setTitle] = useState<string>("")

  const router = useRouter()

  useEffect(() => {
    if(column.key === 'pp_id'){
      if(row[column.key]){
        setTitle('생산 공정 보기')
      } else {
        setTitle('생산 공정 등록')
      }
    }
  }, [column.key])

  return (
    <CellButton onClick={() => {
      if(row.product_id){
        router.push({
          pathname: '/mes/basic/product/process',
          query: {
            pp_id: row.pp_id ?? "",
            product_id: row.product_id ?? "",
            product_data: encodeURI(JSON.stringify(row))
          }
        })
      }else{
        Notiflix.Report.failure('접근할 수 없습니다.', '품목을 선택해 주세요', '확인')
      }
    }}>
      {title}
    </CellButton>
  );
}

export default CellButtonComponent;
