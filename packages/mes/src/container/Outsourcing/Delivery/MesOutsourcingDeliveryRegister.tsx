import React, { useEffect, useState } from 'react'
import { columnlist, ExcelTable, Header as PageHeader, IExcelHeaderType, RequestMethod, } from 'shared'
// @ts-ignore
import { SelectColumn } from 'react-data-grid'
import Notiflix from "notiflix";
import { deleteMenuSelectState, setMenuSelectState } from "shared/src/reducer/menuSelectState";
import { useDispatch,  } from "react-redux";
import {useRouter} from "next/router";
import moment from "moment";



const MesOutsourcingDeliveryRegister = () => {
    const dispatch = useDispatch()
    const router = useRouter()
    const [selectList, setSelectList] = useState<Set<number>>(new Set());
    const [basicRow, setBasicRow] = useState<any[]>([{}])

    const buttonEvent = (buttonIndex:number) => {
        switch (buttonIndex) {
            case 0:
                shipmentSave()
                break
            default:
                break
        }
    }

    const shipmentSave = async() => {
        const result = basicRow.map(row => {
            if(selectList.has(row.id)){
                const obj:any = {}
                obj.identification = row.identification
                obj.product = row.product
                obj.date = row.date ?? moment().format("YYYY_MM_DD")
                obj.lots = row.lots
                obj.version = row.version
                return obj
            }
        }).filter(v => v)

        await RequestMethod("post", "outsourcingShipmentSave", result)
            .then(() => {
                Notiflix.Report.success("메세지","저장되었습니다.","확인", () => router.push("/mes/outsourcing/delivery/list"))
            })
            .catch(err => {
                console.log(err)
            })
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
                title={"외주 납품"}
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
                    ...columnlist.outsourcingDelivery
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

export { MesOutsourcingDeliveryRegister };
