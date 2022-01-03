import React, {useState} from 'react'
import {IExcelHeaderType} from '../../common/@types/type'
import {CellButton} from '../../styles/styledComponents'
import {useRouter} from 'next/router'

interface IProps {
  column: IExcelHeaderType
}

const OrderRegisterButton = ({ column}: IProps) => {
  const router = useRouter()


  return (
    <CellButton onClick={() => {
      router.push(column.url)
    }}>
      {column.title}
    </CellButton>
  );
}

export {OrderRegisterButton};
