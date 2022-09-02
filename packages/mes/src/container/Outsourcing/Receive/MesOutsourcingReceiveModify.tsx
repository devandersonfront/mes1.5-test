import React, {useEffect, useState} from "react"
import {columnlist, ExcelTable, Header as PageHeader} from "shared";
//@ts-ignore
import {SelectColumn} from "react-data-grid";
import {deleteMenuSelectState, setMenuSelectState} from "shared/src/reducer/menuSelectState";
import {useDispatch} from "react-redux";
import {useRouter} from "next/router";

const MesOutsourcingOrderModify = () => {

    const dispatch = useDispatch()
    const router = useRouter()
    const [basicRow, setBasicRow] = useState<any[]>([{}])

    const buttonEvent = (buttonIndex:number) => {
        switch (buttonIndex) {
            case 0:
                console.log("good : ", basicRow)
                break
            case 1:
                console.log("good : ", )
                break
            default:
                console.log("good : ", )
                break
        }
    }

    useEffect(() => {
        dispatch(
            setMenuSelectState({ main: "외주 관리", sub: '/mes/outsourcing/order/list' })
        )
        return () => {
            dispatch(deleteMenuSelectState())
        }
    }, [])

    return (
        <div>
            <PageHeader
                title={"외주 입고 수정"}
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
                    ...columnlist.outsourcingOrderModify
                ]}
                row={basicRow}
                setRow={(row) => {

                    console.log(row)
                    setBasicRow(row)
                }}
                width={1576}
            />
        </div>
    );
}

export {MesOutsourcingOrderModify}
