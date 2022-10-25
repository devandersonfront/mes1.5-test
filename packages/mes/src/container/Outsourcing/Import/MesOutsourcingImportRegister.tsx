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
import moment from "moment";
import { alertMsg } from 'shared/src/common/AlertMsg'

const MesOutsourcingImportRegister = () => {
    const dispatch = useDispatch()
    const router = useRouter()

    const [basicRow, setBasicRow] = useState<any[]>([{isFirst:true}])
    const [radioValue, setRadioValue] = useState<number>(0)
    const [selectList, setSelectList] = useState<Set<number>>(new Set())

    useEffect(()=>{
        setBasicRow([{isFirst:true}])
    },[radioValue])


    useEffect(() => {
        dispatch(setMenuSelectState({ main: "외주 관리", sub: router.pathname }))
        return () => {dispatch(deleteMenuSelectState())}
    }, [])

    const filterSelectedRows = () => basicRow.filter((row) => selectList.has(row.id))

    const save = async (postBody: any) => {
        const result = await RequestMethod("post", "outsourcingImportSave",postBody)
        if(result){
            Notiflix.Report.success(
                '성공',
                '저장되었습니다.',
                '확인',
                () => router.push('/mes/outsourcing/import/list')
            )
        }
        setSelectList(new Set())
    }

    const validate = (row:any) => {
        if(radioValue){
            if(!!!row.product_id) throw(alertMsg.noProduct)
            if(!!!row.worker) throw(alertMsg.noImporter)
        } else {
            if(!!!row.ose_id) throw(alertMsg.noOutOrder)
        }
        if(!!!Number(row.warehousing)) throw(alertMsg.noImportAmount)
        if(row.warehousing > row.current) throw(alertMsg.overImport)
        if(!!!row.lot_number) throw(alertMsg.noLotNumber)
    }

    const saveRows = async () => {
        try {
            const postBody = filterSelectedRows().map(row => {
                validate(row)
                return { ...row,
                    osi_id : undefined,
                    version: undefined,
                    current : row.warehousing ,
                    outsourcing_export : radioValue ? null : row,
                    import_date : row.import_date ?? moment().format('YYYY-MM-DD')
                }
            })
            save(postBody)
        } catch (errMsg){
            Notiflix.Report.warning('경고',errMsg,'확인')
        }
    }

    const deleteRow = () => {
        let filteredRows = filterSelectedRows()
        if(filteredRows.length > 0){
            filteredRows[0] = {...filteredRows[0], isFirst: true}
        } else {
            filteredRows.push({isFirst:true})
        }
        setBasicRow(filteredRows)
        setSelectList(new Set())
    }

    const buttonEventHandler = (buttonIndex:number) => {
        selectList.size > 0 ? buttonEvent(buttonIndex) : Notiflix.Report.warning('선택 경고','선택된 정보가 없습니다.','확인')
    }

    const buttonEvent = (buttonIndex:number) => {
        switch (buttonIndex) {
            case 0:
                saveRows()
                break
            case 1:
                Notiflix.Confirm.show("경고", "삭제하시겠습니까?", "확인", "취소",
                    () => deleteRow())
                break
            default:
                break
        }
    }

    return (
        <div>
            <PageHeader
                title={"외주 입고 등록"}
                buttons={
                    ['저장하기', '삭제']
                }
                buttonsOnclick={buttonEventHandler}
                isRadio
                radioTexts={["발주 입고", "CODE로 입고"]}
                radioValue={radioValue}
                onChangeRadioValues={(index) => {
                    setRadioValue(index)
                }}
            />
            <ExcelTable
                editable
                resizable
                //@ts-ignore
                setSelectList={setSelectList}
                selectList={selectList}
                headerList={[
                    SelectColumn,
                    ...columnlist["outsourcingImport"](basicRow, setBasicRow, !!radioValue)
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

export { MesOutsourcingImportRegister };
