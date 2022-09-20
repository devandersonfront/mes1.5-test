import React, { useEffect, useState } from 'react'
// @ts-ignore
import { SelectColumn } from 'react-data-grid'
import Notiflix from "notiflix";
import {useRouter} from "next/router";
import { alertMsg } from '../common/AlertMsg'
import { ExcelTable } from '../components/Excel/ExcelTable'
import { Header as PageHeader } from '../components/Header'
import { columnlist } from '../common/columnInit'
import { RequestMethod } from '../common/RequestFunctions'

interface IProps {
    radioButtons?: string[]
    useRadio?: boolean
    title: string
    data: any[],
    setData: (data: any) => void
    validate: (row: any) => void
    setPostBody: (row: any) => any
    apiType: string,
    afterSavePath: string,
    initData?: any,
    buttons?: string[],
    buttonEvent?: (buttonIdx:number) => void
    multiRegister?: boolean
    columnKey: string
    checkDuplicate?: (rows: any[]) => void
    duplicateKey?: string
}

const defaultInitData = {isFirst:true}

const RegisterContainer = ({radioButtons , useRadio, title, data, setData, validate, setPostBody, apiType, afterSavePath, initData, buttons, buttonEvent, multiRegister, columnKey, checkDuplicate, duplicateKey }:IProps) => {
    const [radioValue, setRadioValue] = useState<number>(0)
    const [selectList, setSelectList] = useState<Set<number>>(new Set())
    const router = useRouter()


    useEffect(()=>{
        setData([{...initData, ...defaultInitData}])
    },[radioValue])

    const filterSelectedRows = () => data.filter((row) => selectList.has(row.id))

    const save = async (postBody: any) => {
        const result = await RequestMethod("post", apiType,postBody)
        if(result){
            Notiflix.Report.success(
                '성공',
                '저장되었습니다.',
                '확인',
                () => router.push(afterSavePath)
            )
        }
        setSelectList(new Set())
    }

    const saveRows = async () => {
        try {
            const selected = filterSelectedRows()
            checkDuplicate && checkDuplicate(selected.map(row => row[duplicateKey]))
            const postBody = selected.map(row => {
                validate(row)
                return setPostBody(row)
            })
            save(postBody)
        } catch (errMsg){
            Notiflix.Report.warning('경고',errMsg,'확인')
        }
    }
    const deleteRow = () => {
        let filteredRows = data.filter((row) => !selectList.has(row.id))
        if(filteredRows.length > 0){
            filteredRows[0] = {...filteredRows[0], ...defaultInitData}
        } else {
            filteredRows.push({...initData, ...defaultInitData})
        }
        setData(filteredRows)
        setSelectList(new Set())
    }

    const buttonEventHandler = (buttonIndex:number) => {
        selectList.size > 0 ? buttonEvent ? buttonEvent(buttonIndex) : defaultBuuttonEvent(buttonIndex) : Notiflix.Report.warning('경고',alertMsg.noSelectedData,'확인')
    }

    const defaultBuuttonEvent = (buttonIndex:number) => {
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
                title={title}
                buttons={
                    buttons ?? multiRegister ? ['저장하기', '삭제'] : ['행 추가','저장하기', '삭제']
                }
                buttonsOnclick={buttonEventHandler}
                isRadio={useRadio}
                radioTexts={radioButtons}
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
                ].concat(useRadio || multiRegister ? columnlist[columnKey](data, setData, radioValue) : columnlist[columnKey])}
                row={data}
                setRow={(rows) => {
                    rows.map((row) => {
                        if(row.isChange){
                            setSelectList((select) => select.add(row.id))
                        }
                    })
                    setData(rows)
                }}
                width={1576}
            />
        </div>
    );
}

// export const getServerSideProps = (ctx: NextPageContext) => {
//     return {
//         props: {
//             page: ctx.query.page ?? 1,
//             keyword: ctx.query.keyword ?? "",
//             option: ctx.query.opt ?? 0,
//         }
//     }
// }

export { RegisterContainer };
