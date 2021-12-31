import React, {useState} from 'react';
import {columnlist, ExcelTable, Header as PageHeader, IExcelHeaderType} from "shared";
import {useRouter} from "next/router";
// @ts-ignore
import {SelectColumn} from "react-data-grid";

interface IProps {
    children?: any
    page?: number
    keyword?: string
    option?: number
}


const MesWorkStandardList = ({page, keyword, option}: IProps)=> {
    const router = useRouter()

    const [excelOpen, setExcelOpen] = useState<boolean>(false)
    const [basicRow, setBasicRow] = useState<Array<any>>([
        {
            customer: '진주상사', model: '한국차', code: 'SU-20210701-1', material_name: 'SU900', material_id: '완제품',
        },{
            customer: '-', model: '-', code: 'SU-20210701-2', material_name: 'SU900-2', material_id: '반제품',
        },{
            customer: '-', model: '-', code: 'SU-20210701-3', material_name: 'SU900-1', material_id: '반제품',
        },
    ])
    const [column, setColumn] = useState<Array<IExcelHeaderType>>( columnlist["workStandardList"])
    const [selectList, setSelectList] = useState<Set<number>>(new Set())
    const [optionList, setOptionList] = useState<string[]>(['거래처', '모델', 'CODE', '품명', '품목종류'])
    const [optionIndex, setOptionIndex] = useState<number>(0)

    const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
        page: 1,
        total: 1
    })

    return (
        <div>
            <PageHeader
                isSearch
                searchKeyword={keyword}
                onChangeSearchKeyword={(keyword) => {
                    if(keyword){
                        router.push(`/mes/stockV2/list?page=1&keyword=${keyword}&opt=${''}`)
                    }else{
                        router.push(`/mes/stockV2/list?page=1&keyword=`)
                    }
                }}
                searchOptionList={['거래처','모델','코드','품명']}
                onChangeSearchOption={(option) => {
                    // setOptionIndex(option)
                }}
                title={"작업 표준서 리스트"}
                buttons={
                    ['']
                }
                buttonsOnclick={
                    () => {}
                    // onClickHeaderButton
                }
            />
            <ExcelTable
                editable
                resizable
                headerList={[
                    SelectColumn,
                    ...column
                ]}
                row={basicRow}
                setRow={setBasicRow}
                // setRow={(e) => {
                //     let tmp: Set<any> = selectList
                //     e.map(v => {
                //         if(v.isChange) tmp.add(v.id)
                //     })
                //     setSelectList(tmp)
                //     setBasicRow(e)
                // }}
                // selectList={selectList}
                // //@ts-ignore
                // setSelectList={setSelectList}
                // height={basicRow.length * 40 >= 40*18+56 ? 40*19 : basicRow.length * 40 + 56}
            />
        </div>
    );
};

export {MesWorkStandardList}
