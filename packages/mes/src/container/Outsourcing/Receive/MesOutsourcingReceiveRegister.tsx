import React, { useEffect, useState } from 'react'
import { columnlist, ExcelDownloadModal, ExcelTable, Header as PageHeader, IExcelHeaderType, RequestMethod, } from 'shared'
// @ts-ignore
import { SelectColumn } from 'react-data-grid'
import Notiflix from "notiflix";
import { NextPageContext } from 'next'
import { deleteMenuSelectState, setMenuSelectState } from "shared/src/reducer/menuSelectState";
import { useDispatch,  } from "react-redux";
import { setExcelTableHeight } from 'shared/src/common/Util'
import {useRouter} from "next/router";



const MesOutsourcingReceiveRegister = () => {
    const dispatch = useDispatch()
    const router = useRouter()

    const [basicRow, setBasicRow] = useState<any[]>([{isFirst:true}])
    const [column, setColumn] = useState<() => any[]>(columnlist["outsourcingReceive"]())
    const [radioValue, setRadioValue] = useState<number>(0)
    const buttonEvent = (buttonIndex:number) => {
        switch (buttonIndex) {
            case 0:
                console.log("good : ", basicRow)
                break
            case 1:
                console.log("good : ", basicRow)
                break
            default:
                console.log("good : ", )
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

    useEffect(() => {
        console.log("render : ")
    },[radioValue])
    return (
        <div>
            <PageHeader
                title={"외주 입고"}
                buttons={
                    ['저장하기', '삭제']
                }
                buttonsOnclick={buttonEvent}
                isRadio
                radioTexts={["발주 입고", "그냥 입고"]}
                radioValue={radioValue}
                onChangeRadioValues={(index) => {
                    setRadioValue(index)
                }}
            />
            <ExcelTable
                editable
                resizable
                headerList={[
                    SelectColumn,
                    // ...column.map(col => col)
                    ...columnlist["outsourcingReceive"](basicRow, setBasicRow, radioValue)
                    // ...column(basicRow, setBasicRow, Boolean(radioValue))
                    // ...column()
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

export const getServerSideProps = (ctx: NextPageContext) => {
    return {
        props: {
            page: ctx.query.page ?? 1,
            keyword: ctx.query.keyword ?? "",
            option: ctx.query.opt ?? 0,
        }
    }
}

export { MesOutsourcingReceiveRegister };
