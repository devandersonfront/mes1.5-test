import React, { useEffect, useState } from 'react'
import {columnlist, ExcelTable, Header as PageHeader, IExcelHeaderType, RequestMethod, RootState,} from 'shared'
// @ts-ignore
import { SelectColumn } from 'react-data-grid'
import Notiflix from "notiflix";
import { deleteMenuSelectState, setMenuSelectState } from "shared/src/reducer/menuSelectState";
import {useDispatch, useSelector,} from "react-redux";
import {useRouter} from "next/router";
import moment from "moment";
import {PlaceholderBox} from "shared/src/components/Formatter/PlaceholderBox";



const MesOutsourcingDeliveryModify = () => {
    const dispatch = useDispatch()
    const router = useRouter()
    const selector = useSelector((state:RootState) => state.modifyInfo);
    const [selectList, setSelectList] = useState<Set<number>>(new Set());
    const [basicRow, setBasicRow] = useState<any[]>([{}])
    const [column, setColumn] = useState<any[]>(columnlist.outsourcingDeliveryModify)

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
                obj.outsourcing_shipment_id = row.outsourcing_shipment_id
                obj.contract = row.contract
                obj.identification = row.identification
                obj.product = row.product
                obj.date = row.date
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

    useEffect(() => {
        if(selector && selector.type && selector.modifyInfo){
            setBasicRow(selector.modifyInfo.map(info => ({
                    ...info,
                    // identification : info.outsourcing_export?.identification,
                    // order_date : info.outsourcing_export?.order_date,
                    // order_quantity : info.outsourcing_export?.order_quantity,
                    // bom : info.outsourcing_export?.bom
                })
            ))
        }else{
            router.push('/mes/outsourcing/delivery/list')
        }
    }, [selector])

    return (
        <div>
            <PageHeader
                title={"외주 납품 수정"}
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

export { MesOutsourcingDeliveryModify };
