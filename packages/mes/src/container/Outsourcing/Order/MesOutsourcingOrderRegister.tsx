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



const MesOutsourcingOrderRegister = () => {
    const dispatch = useDispatch()
    const router = useRouter()

    const [basicRow, setBasicRow] = useState<any[]>([{isFirst:true}])
    const [selectList, setSelectList] = useState<Set<number>>(new Set())

    const buttonEvent = async(buttonIndex:number) => {
        switch (buttonIndex) {
            case 0:
                if(selectList.size > 0){
                    const resultData = basicRow.map((row) => {
                        if(selectList.has(row.id)){
                            const obj:any = {}
                            console.log(row.bom)
                            obj.worker = row.worker
                            obj.product = row.product
                            obj.order_quantity = row.good_quantity
                            obj.current = row.good_quantity
                            obj.order_date = row.order_date ?? moment().format("YYYY-MM-DD")
                            obj.due_date = row.due_date ?? moment().format("YYYY-MM-DD")
                            obj.bom = row.bom.map((bomRow) => {
                                delete bomRow.bom.originalBom
                                delete bomRow.bom.outOriginalBom

                                return bomRow
                            })
                            return obj
                        }
                    }).filter(v => v)
                    await RequestMethod("post", "outsourcingExportSave", [...resultData])
                        .then((res) => {
                            Notiflix.Report.success("메세지","등록되었습니다.","확인", () => router.push("/mes/outsourcing/order/list"))
                        })
                        .catch((err) => {
                            console.log(err)
                        })

                }else{
                    Notiflix.Report.warning("경고","데이터를 선택해주시기 바랍니다.","확인", () =>{})
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

    useEffect(() => {
        dispatch(
            setMenuSelectState({ main: "외주 관리", sub: router.pathname })
        )
        return () => {
            dispatch(deleteMenuSelectState())
        }
    }, [])

    return (
        <div>
            <PageHeader
                title={"외주 발주 등록"}
                buttons={
                    ['저장하기', '삭제']
                }
                buttonsOnclick={buttonEvent}
            />
            <ExcelTable
                editable
                resizable
                headerList={[
                    SelectColumn,
                    ...columnlist.outsourcingOrder().map(col => ({ ...col, basicRow, setBasicRow}))
                ]}
                row={basicRow}
                setRow={(rows) => {

                    console.log(rows)
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
