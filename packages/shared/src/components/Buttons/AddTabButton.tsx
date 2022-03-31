import React, {useState} from 'react'
import {IExcelHeaderType} from '../../common/@types/type'
import Notiflix from 'notiflix'
import {useDispatch, useSelector} from "react-redux";
import {add_summary_info, change_summary_info_index} from "../../reducer/infoModal";
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
            // keyword:row.code,
            rm_id: row.rm_id,
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
        res = await RequestMethod('get', `cncRecordSearch`, {
          path:{
            page:1,

          },
          params: {
            productIds: row.product.product_id,
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

  const lotReadOnlyEvent = () => {
    let lots = []
    lots = row.bom?.map((bom) => bom.lot)
    onRowChange({
      ...row,
      lotList: [...lots.map((v, i) => {
        let type, date, warehousing, elapsed
        switch(v.type){
          case 0:
            type = 'child_lot_rm'
            date = v.date
            warehousing = v.warehousing
            elapsed = v.elapsed
            break
          case 1 :
            type = 'child_lot_sm'
            date = v.date
            warehousing = v.warehousing
            elapsed = null
            break
          case 2:
            type = 'child_lot_record'
            date = moment(v[type].end).format("YYYY-MM-DD")
            warehousing = v[type].good_quantity
            elapsed = null
            break
        }
        return {
          ...v,
          ...v[type],
          date,
          elapsed,
          warehousing,
          seq: i+1,
        }
      })]
    })
  }

  const lotNotReadOnlyEvent = () => {
    if(row.stock === 0){
      return  Notiflix.Report.warning("경고", "재고가 없습니다.", "확인", )
    }
    if(row.bom_info !== null){
      onRowChange({
        ...row,
        lotList: [...row.bom_info]
      })
    }else {
      loadMaterialLot(row.tab)
    }
  }

  const notLotEvent = () => {
    if (row.bom_root_id) {
      const check = tabStore.datas.findIndex((tab) => tab.code == row.bom_root_id)
      if(check >= 0){
        dispatch(change_summary_info_index(check))
      }else{
        dispatch(add_summary_info({code: row.bom_root_id, title: row.code, index: tabStore.index + 1, product_id:row.bom_root_id}))
      }
    } else {
      Notiflix.Report.warning("경고", "등록된 BOM 정보가 없습니다.", "확인", () => {
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
              lotReadOnlyEvent()
            }else{
              lotNotReadOnlyEvent()
            }
          }else {
            notLotEvent()
          }
        }}>
          <p style={{padding: 0, margin: 0, textDecoration: 'underline'}}>{title}</p>
        </div>
      </div>
  );
}

export {AddTabButton};
