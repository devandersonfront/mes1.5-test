import React, { useEffect, useState } from 'react'
import {IExcelHeaderType} from '../../common/@types/type'
import Notiflix from 'notiflix'
import {useDispatch, useSelector} from "react-redux";
import {add_summary_info, change_summary_info_index} from "../../reducer/infoModal";
import {RequestMethod, RootState} from '../../index'
import moment from "moment";
import lodash from 'lodash'
import { ParseResponse } from '../../common/Util'

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

  useEffect(() => {
    row.clicked && row.page !== 1 && loadMaterialLot(row.tab)
  }, [row.page])
  const loadMaterialLot = async (type:number, initPage?: number) => {
    let res
    switch(type){
      case 0:
        res = await RequestMethod('get', `lotRmSearch`, {
          path:{
            page:initPage? initPage: row.page,
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
            page:initPage? initPage: row.page,
            renderItem:15
          },
          params: {
            // from: "2000-01-01",
            // to:moment().format("YYYY-MM-DD"),
            sm_id: row.sm_id,
            // nz: false
          }
        })
        break;
      case 2:
        res = await RequestMethod('get', `cncRecordSearch`, {
          path:{
            page:initPage? initPage: row.page,
            renderItem:15
          },
          params: {
            from: "2000-01-01",
            to:moment().format("YYYY-MM-DD"),
            productIds: row.product.product_id,
            nz: false,
            rangeNeeded:false
          }
        })
        break;
    }
    if(res){
      const parsedRes = ParseResponse(res)
      onRowChange({
        ...row,
        page: res.page,
        total: res.totalPages,
        clicked: true,
        lotList: initPage? [...parsedRes] : [ ...row.rowLotList,...parsedRes],
        rowLotList: initPage? [...parsedRes] : [ ...row.rowLotList,...parsedRes]
      })
      row.setLo
    }
  }

  const lotReadOnlyEvent = () => {
    updateLotList()
  }

  const updateLotList = () => {
    let lots = []
    lots = row.bom?.map((bom) => bom.lot)
    onRowChange({
      ...row,
      lotList: [...lots.map((v, i) => {
        let type, date, warehousing, elapsed, current
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
          current: v.amount,
          seq: i+1,
        }
      })]
    })
  }

  const lotNotReadOnlyEvent = () => {
    if(row.stock === 0){
      return  Notiflix.Report.warning("경고", "재고가 없습니다.", "확인", )
    }
    else if(row.action === 'modifyAndNoStock') {
      updateLotList()
    }
    // if(row.bom_info !== null){
    else {
      loadMaterialLot(row.tab, 1)
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
