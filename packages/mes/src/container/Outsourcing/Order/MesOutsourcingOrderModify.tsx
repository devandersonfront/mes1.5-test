import React, {useEffect, useState} from "react"
import { columnlist, ExcelTable, Header as PageHeader, IExcelHeaderType, RequestMethod, RootState } from 'shared'
//@ts-ignore
import {SelectColumn} from "react-data-grid";
import {deleteMenuSelectState, setMenuSelectState} from "shared/src/reducer/menuSelectState";
import { useDispatch, useSelector } from 'react-redux'
import {useRouter} from "next/router";
import Notiflix from 'notiflix'
import { alertMsg } from 'shared/src/common/AlertMsg'

const MesOutsourcingOrderModify = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const selector = useSelector((state:RootState) => state.modifyInfo);
  const [selectList, setSelectList] = useState<Set<number>>(new Set());
  const [basicRow, setBasicRow] = useState<any[]>([{}])
  const [column, setColumn] = useState<any[]>(columnlist.outsourcingOrderModify)

  useEffect(() => {
    dispatch(
      setMenuSelectState({ main: "외주 관리", sub: router.pathname })
    )
    return () => {
      dispatch(deleteMenuSelectState())
    }
  }, [])

  useEffect(() => {
    if(selector && selector.type && selector.modifyInfo){
      setBasicRow(selector.modifyInfo.map(info => ({
          ...info,
        bom_root_id: info.product.bom_root_id, //InputMaterialListModal에서 사용
        originalCavity: 1, //InputMaterialListModal에서 사용
        originalSum: info.order_quantity, //InputMaterialListModal에서 사용
        // originalLots: info.lots
        })
      ))
    }else{
      router.push('/mes/outsourcing/order/list')
    }
  }, [selector])

  const buttonEvent = (buttonIndex:number) => {
    switch (buttonIndex) {
      case 0:
        if(selectList.size === 0) return Notiflix.Report.warning('경고', alertMsg.noSelectedData, '확인')
        save()
        break
      default:
        break
    }
  }
  const save = async () => {
    const postBody = basicRow.filter((row) => selectList.has(row.id)).map(row => {
      return {
        ...row,
        product: {...row.product,
          customer : row?.customerArray?.customer_id ? row.customerArray : null,
          model : row?.modelArray?.cm_id ? row.modelArray : null,
        },
        worker: row.worker_object,
        current: row.order_quantity,
      }
    })
    const result = await RequestMethod("post", "outsourcingOrderSave", postBody)
    if(result){
      Notiflix.Report.success(
        '성공',
        '저장 되었습니다.',
        '확인',
        () => router.push('/mes/outsourcing/order/list')
      )
    }
    setSelectList(new Set())
  }


  return (
      <div>
        <PageHeader
          title={"외주 발주(수정)"}
          buttons={
            ['저장하기']
          }
          buttonsOnclick={buttonEvent}
        />
        <ExcelTable
          editable
          resizable
          headerList={[
            SelectColumn,
            ...column
          ]}
          row={basicRow}
          setRow={(row) => {
            row.map((row) => {
              if(row.isChange){
                setSelectList((select) => select.add(row.id))
              }
            })
            setBasicRow(row)
          }}
          selectList={selectList}
          //@ts-ignore
          setSelectList={setSelectList}
          width={1576}
        />
      </div>
    );
}

export {MesOutsourcingOrderModify}
