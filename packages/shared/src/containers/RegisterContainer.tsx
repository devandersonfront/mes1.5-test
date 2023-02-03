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
    buttonEvent?: {}
    multiRegister?: boolean
    columnKey: string
    checkDuplicate?: (rows: any[]) => void
    duplicateKey?: string
    radioNum ?: (num : number) => void
}

const defaultInitData = {isFirst:true}

const RegisterContainer = ({radioButtons , useRadio, title, data, setData, validate, setPostBody, apiType, afterSavePath, initData, buttons, buttonEvent, multiRegister, columnKey, checkDuplicate, duplicateKey ,radioNum}:IProps) => {
    const [radioValue, setRadioValue] = useState<number>(0)
    const [selectList, setSelectList] = useState<Set<number>>(new Set())
    const router = useRouter()
    const headerButtons = buttons ?? (multiRegister ? ['저장하기', '삭제'] : ['행 추가','저장하기', '삭제'])

    useEffect(()=>{
        setData(addInitData([]))
        radioNum && radioNum(radioValue)
    },[radioValue])

    const filterSelectedRows = (data) => data.filter((row) => selectList.has(row.id))

    const addInitData = (data: any[]) => {
        data.push({...initData, ...defaultInitData})
        return data
    }

    const save = async (postBody: any) => {
        const result = await RequestMethod("post", apiType, postBody)
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

    const saveRows = async (data) => {
        try {
            const selected = filterSelectedRows(data)
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

    const deleteRow = (data) => {
        let filteredRows = data.filter((row) => !selectList.has(row.id))
        if(filteredRows.length > 0){
            filteredRows[0] = {...filteredRows[0], ...defaultInitData}
        } else {
            filteredRows = addInitData(filteredRows)
        }
        setData(filteredRows)
        setSelectList(new Set())
    }

    const addRow = (data) => {
        const added = addInitData(data)
        setData(added)
    }

    const buttonEventHandler = (buttonIndex:number) => {
        try {
            const button = headerButtons[buttonIndex]
            const buttonKey = getButtonKey(button)
            if(selectList.size === 0 && buttonKey !== 'add') throw(alertMsg.noSelectedData)
            const event = buttonEvent && buttonEvent[buttonKey] !== undefined ? buttonEvent[buttonKey] : defaultButtonEvent[buttonKey]
            event && event(data, selectList)
        }catch(errMsg) {
            Notiflix.Report.warning('경고',errMsg,'확인')
        }
    }

    const getButtonKey = (button: string) => {
        switch(button){
            case '저장하기': return 'save'
            case '삭제': return 'delete'
            case '행 추가': return 'add'
            default: return button
        }
    }

    const defaultButtonEvent = {
        'save' : saveRows,
        'delete': (data) =>  Notiflix.Confirm.show("경고", "삭제하시겠습니까?", "확인", "취소",
          () => deleteRow(data)),
        'add': addRow
    }

    return (
        <div>
            <PageHeader
                title={title}
                buttons={headerButtons}
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
                ].concat(useRadio || multiRegister ? columnlist[columnKey](data, setData, radioValue).filter((data) => data) : columnlist[columnKey])}
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
