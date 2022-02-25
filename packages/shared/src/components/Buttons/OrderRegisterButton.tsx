import React, {useState} from 'react'
import {IExcelHeaderType} from '../../common/@types/type'
import {CellButton} from '../../styles/styledComponents'
import {useRouter} from 'next/router'
import {useDispatch} from "react-redux";
import {change_delivery_identification} from "../../reducer/deliveryRegisterState";

interface IProps {
  row: any
  column: IExcelHeaderType
}

const OrderRegisterButton = ({row, column}: IProps) => {
  const router = useRouter()
  const dispatch = useDispatch();


  return (
    <CellButton onClick={() => {
      dispatch(change_delivery_identification(row.identification))
      router.push(column.url)
    }}>
      {column.title}
    </CellButton>
  );
}

export {OrderRegisterButton};
