import React, {useState} from 'react';
import {columnlist, ExcelTable, Header as PageHeader, IExcelHeaderType} from "shared";
// @ts-ignore
import {SelectColumn} from "react-data-grid";
import moment from "moment";



export interface IProps {
    children?: any
    page?: number
    keyword?: string
    option?: number
}


const BasicMidrange = ({page,keyword,option}:IProps) => {

    const [basicRow, setBasicRow] = useState<Array<any>>([{
        amount: ''
    }])
    const [column, setColumn] = useState<Array<IExcelHeaderType>>( columnlist["midrangeExam"])
    const [selectList, setSelectList] = useState<Set<number>>(new Set())


    return (
        <div>
            <PageHeader title={"초ㆍ중ㆍ종 검사항목 ()"} buttons={['검사 양식 검토', '저장하기']} />
            <ExcelTable
                editable
                resizable
                headerList={[
                    ...column
                ]}
                row={basicRow}
                setRow={(e) => {
                    let tmp: Set<any> = selectList
                    e.map(v => {
                        if(v.isChange) tmp.add(v.id)
                    })
                    setSelectList(tmp)
                    setBasicRow(e)
                }}
                selectList={selectList}
                //@ts-ignore
                setSelectList={setSelectList}
                height={basicRow.length * 40 >= 40*18+56 ? 40*19 : basicRow.length * 40 + 56}
            />
        </div>
    );
};

export {BasicMidrange}
