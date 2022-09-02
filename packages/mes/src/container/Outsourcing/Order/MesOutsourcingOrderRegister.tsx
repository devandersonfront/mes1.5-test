import React, { useEffect, useState } from 'react'
import { columnlist, ExcelDownloadModal, ExcelTable, Header as PageHeader, IExcelHeaderType, RequestMethod, } from 'shared'
// @ts-ignore
import { SelectColumn } from 'react-data-grid'
import Notiflix from "notiflix";
import { NextPageContext } from 'next'
import { deleteMenuSelectState, setMenuSelectState } from "shared/src/reducer/menuSelectState";
import { useDispatch,  } from "react-redux";
import {useRouter} from "next/router";



const MesOutsourcingOrderRegister = () => {
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
                    ...columnlist.outsourcingOrder
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

export { MesOutsourcingOrderRegister };
