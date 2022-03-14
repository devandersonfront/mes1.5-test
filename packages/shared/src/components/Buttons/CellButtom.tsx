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
    switch(column.key){
      case "pp_id":
        if(row[column.key]){
          setTitle('생산 공정 보기')
        } else {
          setTitle('생산 공정 등록')
        }
        break;
      case "form_id" :
          setTitle("양식 등록")
        break;
      default :
        break;
    }
  }, [column.key])

  return (
    <CellButton onClick={() => {
      if(column.type === "inspection"){
        let typeID = "";
        switch (true){
          case row.machine_id !== undefined:
            typeID = row.machine_id
            break
          case row.mold_id !== undefined :
            typeID = row.mold_id
            break
          default :
            Notiflix.Report.warning("기준정보를 등록해주세요.",``,"확인")
            break
        }
        if(typeID !== "") router.push({
          pathname: '/mes/basic/dailyInspection',
          query:
              row.machine_id ?
                  {
                    machine_id: row.machine_id,
                  }
              :
                  {
                    mold_id: row.mold_id,
                  }
        })
      }else if(row.product_id){
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
    }}
      style={row.form_id && {
        background:"none", color:"white", textDecoration:"underline"
      }}
    >
      {row.form_id ? "양식 보기" : title}
    </CellButton>
  );
}

export {CellButtonComponent};
