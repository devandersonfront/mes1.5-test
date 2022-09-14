import React, { useEffect, useState } from 'react'
import { columnlist, ExcelDownloadModal, ExcelTable, Header as PageHeader, IExcelHeaderType, RequestMethod, } from 'shared'
// @ts-ignore
import { SelectColumn } from 'react-data-grid'
import Notiflix from "notiflix";
import { deleteMenuSelectState, setMenuSelectState } from "shared/src/reducer/menuSelectState";
import { useDispatch,  } from "react-redux";
import {useRouter} from "next/router";



const MesOutsourcingOrderRegister = () => {
    const dispatch = useDispatch()
    const router = useRouter()

    const [basicRow, setBasicRow] = useState<any[]>([{isFirst:true}])
    const [selectRows, setSelectRows] = useState<Set<number>>(new Set())

    const buttonEvent = (buttonIndex:number) => {
        switch (buttonIndex) {
            case 0:
                console.log("good : ", basicRow)
                break
            case 1:
                console.log("Delete : ", selectRows)
                const liveData = [...basicRow.filter(row => !selectRows.has(row.id))]
                liveData[0].isFirst = true

                setBasicRow(liveData)
                setSelectRows(new Set())

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
                    ...columnlist.outsourcingOrder().map(col => ({ ...col, basicRow, setBasicRow}))
                ]}
                row={basicRow}
                setRow={(row) => {
                    console.log(row)
                    setBasicRow(row)
                }}
                //@ts-ignore
                setSelectList={setSelectRows}
                selectList={selectRows}
                width={1576}
            />
        </div>
    );
}


export { MesOutsourcingOrderRegister };
