import React, {useEffect, useState} from 'react'
import {IExcelHeaderType} from '../../common/@types/type'
import {CellButton} from '../../styles/styledComponents'
import {useRouter} from 'next/router'
import Notiflix from 'notiflix'
import {useDispatch, useSelector} from "react-redux";
import {add_summary_info} from "../../reducer/infoModal";
import {RootState} from "../../reducer";

interface IProps {
  row: any
  column: IExcelHeaderType
  onRowChange: (e: any) => void
}

const AddTabButton = ({ row, column, onRowChange}: IProps) => {
  const tabStore = useSelector((root:RootState) => root.infoModal);
  const dispatch = useDispatch();
  const [title, setTitle] = useState<string>(column.key === 'lot' ? "LOT 보기" : "BOM 보기")
  return (
    <div style={{
    }}>
      <div style={{
        fontSize: '15px',
        margin: 0,
        padding: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#0D0D0D',
        background:row.border ? "#19B9DF80" : "white",
        cursor: 'pointer',
      }} onClick={() => {
        if(row.type === 2){
          // onRowChange({
          //   ...row,
          //   newTab: true
          // })
        }
          if(row.bom_root_id){
            console.log(row.bom_root_id, row);
            dispatch(add_summary_info({code:row.bom_root_id, title:row.code, index:tabStore.index+1}))
          }else{
            Notiflix.Report.warning("경고","등록된 BOM 정보가 없습니다.","확인", () => {})
          }

      }}>
        <p style={{padding: 0, margin: 0, textDecoration: 'underline'}}>{title}</p>
      </div>
    </div>
  );
}

export {AddTabButton};
