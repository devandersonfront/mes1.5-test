import React, { useEffect, useState } from 'react'
import { columnlist, ExcelTable, Header as PageHeader, IExcelHeaderType, RequestMethod, } from 'shared'
// @ts-ignore
import { SelectColumn } from 'react-data-grid'
import Notiflix from "notiflix";
import { deleteMenuSelectState, setMenuSelectState } from "shared/src/reducer/menuSelectState";
import { useDispatch,  } from "react-redux";
import {useRouter} from "next/router";
import moment from "moment";
import { alertMsg } from 'shared/src/common/AlertMsg'



const MesOutsourcingDeliveryRegister = () => {
    const dispatch = useDispatch()
    const router = useRouter()
    const [selectList, setSelectList] = useState<Set<number>>(new Set());
    const [basicRow, setBasicRow] = useState<any[]>([{}])

    useEffect(() => {
        dispatch(
          setMenuSelectState({ main: "외주 관리", sub: router.pathname })
        )
        return () => {
            dispatch(deleteMenuSelectState())
        }
    }, [])

    const buttonEvent = (buttonIndex:number) => {
        switch (buttonIndex) {
            case 0:
                saveRows()
                break
            default:
                break
        }
    }

    const save = async (postBody: any) => {
        const result = await RequestMethod("post", "outsourcingShipmentSave",postBody)
        if(result){
            Notiflix.Report.success(
              '성공',
              '저장되었습니다.',
              '확인',
              () => router.push('/mes/outsourcing/delivery/list')
            )
        }
        setSelectList(new Set())
    }

    const validate = (row:any) => {
        if(!!!row.product_id) throw(alertMsg.noProduct)
        if(!!!row.lots) throw(alertMsg.needsBom)
    }

    const saveRows = async () => {
        try {
            if(selectList.size === 0 ) throw(alertMsg.noSelectedData)
            const postBody = basicRow.filter(row => selectList.has(row.id)).map(row => {
                validate(row)
                return { ...row,
                    // identification: row.identification,
                    product: {
                        ...row.product,
                        customer : row?.customerArray?.customer_id ? row.customerArray : null,
                        model : row?.modelArray?.cm_id ? row.modelArray : null,
                    },
                    date: row.date ?? moment().format("YYYY_MM_DD"),
                    lots: row.lots,
                    version: row.version,
                }
            })
            save(postBody)
        } catch (errMsg){
            Notiflix.Report.warning('경고',errMsg,'확인')
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

    return (
        <div>
            <PageHeader
                title={"외주 출고"}
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
