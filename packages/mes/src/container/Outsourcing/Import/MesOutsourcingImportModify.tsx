import React, { useEffect, useState } from 'react'
import {
    columnlist,
    ExcelDownloadModal,
    ExcelTable,
    Header as PageHeader,
    IExcelHeaderType,
    RequestMethod,
    RootState,
} from 'shared'
// @ts-ignore
import { SelectColumn } from 'react-data-grid'
import Notiflix from "notiflix";
import { NextPageContext } from 'next'
import { deleteMenuSelectState, setMenuSelectState } from "shared/src/reducer/menuSelectState";
import {useDispatch, useSelector,} from "react-redux";
import { setExcelTableHeight } from 'shared/src/common/Util'
import {useRouter} from "next/router";
import moment from "moment";
import { alertMsg } from 'shared/src/common/AlertMsg'

const MesOutsourcingImportModify = () => {
    const dispatch = useDispatch()
    const selector = useSelector((state:RootState) => state.modifyInfo)
    const router = useRouter()
    const [basicRow, setBasicRow] = useState<any[]>([{isFirst:true}])
    const [selectList, setSelectList] = useState<Set<number>>(new Set())

    useEffect(() => {
        if(selector && selector.type && selector.modifyInfo){
            setBasicRow(selector.modifyInfo.map(info => ({
                  ...info,
                  identification : info.outsourcing_export?.identification,
                  order_date : info.outsourcing_export?.order_date,
                  order_quantity : info.outsourcing_export?.order_quantity,
                  max_warehousing: (info.outsourcing_export?.current ?? 0) + info.current,
                  current: info.outsourcing_export?.current ? info.outsourcing_export?.current + info.current : '-',
                  bom : info.outsourcing_export?.bom
              })
            ))
        }else{
            router.push('/mes/outsourcing/import/list')
        }
    }, [selector])

    useEffect(() => {
        dispatch(setMenuSelectState({ main: "외주 관리", sub: router.pathname }))
        return () => {dispatch(deleteMenuSelectState())}
    }, [])

    const filterSelectedRows = () => basicRow.filter((row) => selectList.has(row.id))

    const save = async (postBody) => {
        const result = await RequestMethod("post", "outsourcingImportSave", postBody)
        if(result){
            Notiflix.Report.success(
                '성공',
                '저장 되었습니다.',
                '확인',
                () => router.push('/mes/outsourcing/import/list')
            )
        }
        setSelectList(new Set())
    }

    const validate = (row:any) => {
        if(!!!Number(row.warehousing)) throw(alertMsg.noImportAmount)
        if(row.warehousing > row.current) throw(alertMsg.overImport)
        if(!!!row.lot_number) throw(alertMsg.noLotNumber)
    }

    const saveRows = async () => {
        try {
            const postBody = filterSelectedRows().map(row => {
                validate(row)
                return { ...row,
                    current : row.warehousing
                }
            })
            save(postBody)
        } catch (errMsg){
            Notiflix.Report.warning('경고',errMsg,'확인')
        }
    }

    const deleteRow = () => {
        Notiflix.Confirm.show("경고", "삭제하시겠습니까?", "확인", "취소",
            () => {
                let filteredRows = filterSelectedRows()
                setBasicRow(filteredRows.length !== 0 ? filteredRows : [{isFirst:true}])
                setSelectList(new Set())
            },
        )
    }

    const buttonEventHandler = (buttonIndex:number) => {
        selectList.size > 0 ? buttonEvent(buttonIndex) : Notiflix.Report.warning('경고',alertMsg.noSelectedData,'확인')
    }

    const buttonEvent = (buttonIndex:number) => {
        switch (buttonIndex) {
            case 0:
                saveRows()
                break
            case 1:
                deleteRow()
                break
            default:
                break
        }
    }
    return (
        <div>
            <PageHeader
                title={"외주 입고(수정)"}
                buttons={
                    ['저장하기']}
                buttonsOnclick={buttonEventHandler}
            />
            <ExcelTable
                editable
                resizable
                //@ts-ignore
                setSelectList={setSelectList}
                selectList={selectList}
                headerList={[
                    SelectColumn,
                    ...columnlist["outsourcingImportModify"](basicRow, setBasicRow)
                ]}
                row={basicRow}
                setRow={(rows) => {
                    rows.map((row) => {
                        if(row.isChange){
                            setSelectList((select) => select.add(row.id))
                        }
                    })
                    setBasicRow(rows)
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

export { MesOutsourcingImportModify };
