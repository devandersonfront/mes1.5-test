import React, { useEffect, useState } from 'react'
import {
    columnlist,
    ExcelDownloadModal,
    ExcelTable,
    Header as PageHeader,
    IExcelHeaderType,
    PaginationComponent,
    RequestMethod,
} from 'shared'
// @ts-ignore
import { SelectColumn } from 'react-data-grid'
import Notiflix from "notiflix";
import { NextPageContext } from 'next'
import { deleteMenuSelectState, setMenuSelectState } from "shared/src/reducer/menuSelectState";
import { useDispatch,  } from "react-redux";
import { setExcelTableHeight } from 'shared/src/common/Util'
import {useRouter} from "next/router";



const MesOutsourcingReceiveList = () => {
    const dispatch = useDispatch()
    const router = useRouter()
    const [basicRow, setBasicRow] = useState<any[]>([{}])
    const [pageInfo, setPageInfo] = useState<{page:number, total:number}>({page:1, total:4})

    const buttonEvent = (buttonIndex:number) => {
        switch (buttonIndex) {
            case 0:
                console.log("수정! : ", basicRow)
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

    useEffect(() => {
        console.log("get OutsourcingData[Receive]")
    },[pageInfo.page])

    return (
        <div>
            <PageHeader
                title={"외주 입고 리스트"}
                isSearch
                searchKeyword={""}
                onSearch={(searchKeyword) => {
                    console.log(searchKeyword)
                }}
                optionIndex={0}
                searchOptionList={["품명", "CODE"]}
                onChangeSearchOption={(optNumber) => {
                    console.log("optNumber : ", optNumber)
                }}
                buttons={
                    ['수정하기', '삭제']
                }
                buttonsOnclick={buttonEvent}
            />
            <ExcelTable
                editable
                resizable
                headerList={[
                    SelectColumn,
                    ...columnlist.outsourcingReceiveList
                ]}
                row={basicRow}
                setRow={(row) => {
                    setBasicRow(row)
                }}
                width={1576}
            />
            <PaginationComponent
                currentPage={pageInfo.page}
                totalPage={pageInfo.total}
                setPage={(page) => {
                    setPageInfo({...pageInfo, page: page})
                }}
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

export { MesOutsourcingReceiveList };
