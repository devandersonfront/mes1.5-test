import React, {useState} from 'react'
import {IExcelHeaderType} from '../../common/@types/type'
import {CellButton} from '../../styles/styledComponents'
import {useRouter} from 'next/router'

interface IProps {
  row: any
  column: IExcelHeaderType
  setRow: (row: any) => void
}

const OrderRegisterButton = ({ row, column, setRow}: IProps) => {
  const [title, setTitle] = useState<string>("납품 등록")

  const router = useRouter()

  return (
    <CellButton onClick={() => {
      router.push('/mes/delivery/register')
    }}>
      {title}
    </CellButton>
  );
}

export {OrderRegisterButton};
