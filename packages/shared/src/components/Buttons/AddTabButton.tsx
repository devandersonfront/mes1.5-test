import React, {useState} from 'react'
import {IExcelHeaderType} from '../../common/@types/type'
import Notiflix from 'notiflix'
import {useDispatch, useSelector} from "react-redux";
import {add_summary_info} from "../../reducer/infoModal";
import {RequestMethod, RootState} from '../../index'
import moment from "moment";

interface IProps {
  row: any
  column: IExcelHeaderType
  onRowChange: (e: any) => void
}

const AddTabButton = ({ row, column, onRowChange}: IProps) => {
  const tabStore = useSelector((root:RootState) => root.infoModal);
  const dispatch = useDispatch();
  const [title, setTitle] = useState<string>(column.key === 'lot' ? "LOT 보기" : "BOM 보기")
  const selector = useSelector((state:RootState) => state.infoModal)

  const loadMaterialLot = async (type) => {
    let res
    switch(type){
      case 0:
        res = await RequestMethod('get', `lotRmSearch`, {
          path:{
            page:1,
            renderItem:15
          },
          params: {
            from: "2000-01-01",
            to:moment().format("YYYY-MM-DD"),
            option:0,
            keyword:row.code,
            // rm_id: row.rm_id,
            nz: false
          }
        })
        break;
      case 1:
        res = await RequestMethod('get', `lotSmSearch`, {
          path:{
            page:1,
          },
          params: {
            sm_id: row.sm_id,
            // nz: true
          }
        })
        break;
      case 2:
        res = await RequestMethod('get', `recordList`, {
          params: {
            productIds: row.product_id,
            nz: true
          }
        })
        break;
    }

    if(res){
      onRowChange({
        ...row,
        lotList: [...res.info_list]
      })
    }
  }

  return (
    <div>
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
        if(column.key === 'lot'){
          if(column.type === 'readonly'){
            let lot = []

            if(row.bom){
              if(row.bom[row.seq-1].lot && !Array.isArray(row.bom[row.seq-1].lot)){
                lot = [row.bom[row.seq-1].lot]
              }else{
                lot = row.bom[row.seq-1].lot
              }
            }

            onRowChange({
              ...row,
              lotList: [...lot.map(v => {
                let type

                switch(v.type){
                  case 0:
                    type = 'child_lot_rm'
                    break
                  case 1 :
                    type = 'child_lot_sm'
                    break
                  case 2:
                    type = 'child_lot_record'
                    break
                }

                return {
                  ...v,
                  ...v[type]
                }
              })]
            })
          }else{
            loadMaterialLot(row.tab)
          }
        }else {
          if (row.bom_root_id) {
            console.log("row : ", row)
            dispatch(add_summary_info({code: row.bom_root_id, title: row.code, index: tabStore.index + 1, product_id:row.bom_root_id}))
          } else {
            Notiflix.Report.warning("경고", "등록된 BOM 정보가 없습니다.", "확인", () => {
            })
          }
        }
      }}>
        <p style={{padding: 0, margin: 0, textDecoration: 'underline'}}>{title}</p>
      </div>
    </div>
  );
}

export {AddTabButton};
