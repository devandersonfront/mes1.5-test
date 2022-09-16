import React, { useEffect, useState } from 'react'
import { columnlist, ExcelTable, Header as PageHeader, RequestMethod, } from 'shared'
// @ts-ignore
import { SelectColumn } from 'react-data-grid'
import Notiflix from "notiflix";
import { NextPageContext } from 'next'
import { deleteMenuSelectState, setMenuSelectState } from "shared/src/reducer/menuSelectState";
import { useDispatch,  } from "react-redux";
import {useRouter} from "next/router";
import moment from "moment";
import { alertMsg } from 'shared/src/common/AlertMsg'



const MesOutsourcingOrderRegister = () => {
    const dispatch = useDispatch()
    const router = useRouter()

    const [basicRow, setBasicRow] = useState<any[]>([{}])
    const [selectList, setSelectList] = useState<Set<number>>(new Set())

    useEffect(() => {
      dispatch(
        setMenuSelectState({ main: "외주 관리", sub: router.pathname })
      )
      return () => {
        dispatch(deleteMenuSelectState())
      }
    }, [])


  const buttonEvent = async(buttonIndex:number) => {
        switch (buttonIndex) {
            case 0:
                try{
                    if(selectList.size === 0) throw(alertMsg.noSelectedData)
                    const postBody =basicRow.map((row) => {
                      if(!!!row.product) throw(alertMsg.noProduct)
                      if(!!!row.worker) throw('발주자를 선택해 주세요.')
                      if(!!!row.bom) throw(alertMsg.needsBom)
                      return {
                        worker: row.worker,
                        product: row.product,
                        order_quantity: row.order_quantity,
                        current: row.order_quantity,
                        order_date: row.order_date ?? moment().format("YYYY-MM-DD"),
                        due_date: row.due_date ?? moment().format("YYYY-MM-DD"),
                        bom: row.bom,
                      }
                  })
                  const res = await RequestMethod("post", "outsourcingExportSave", postBody)
                  if(res) Notiflix.Report.success("저장되었습니다.","","확인", () => router.push("/mes/outsourcing/order/list"))
                } catch (errMsg){
                  Notiflix.Report.warning('경고', errMsg,'확인')
                }
                break
            case 1:
                const liveData = [...basicRow.filter(row => !selectList.has(row.id))]
                liveData[0].isFirst = true

                setBasicRow(liveData)
                setSelectList(new Set())
                break
            default:
                break
        }
    }

    return (
        <div>
            <PageHeader
                title={"외주 발주 등록"}
                buttons={
                    ['저장하기', /*'삭제'*/]
                }
                buttonsOnclick={buttonEvent}
            />
            <ExcelTable
                editable
                resizable
                headerList={[
                    SelectColumn,
                    ...columnlist.outsourcingOrder
                ]}
                row={basicRow}
                setRow={(rows) => {

                    console.log('rw',rows)
                    rows.map((row) => {
                        if(row.isChange){
                            setSelectList((select) => select.add(row.id))
                        }
                    })

                    setBasicRow(rows)
                }}
                //@ts-ignore
                setSelectList={setSelectList}
                selectList={selectList}
                width={1576}
            />
        </div>
    );
}

export { MesOutsourcingOrderRegister };
