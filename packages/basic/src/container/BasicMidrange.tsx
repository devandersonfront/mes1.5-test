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


const deviceList = [
    {pk: 0, name: "선택없음"},
    {pk: 1, name: "미스피드 검출장치"},
    {pk: 2, name: "하사점 검출장치"},
    {pk: 3, name: "로드모니터"},
    {pk: 4, name: "앵글시퀀서"},
    {pk: 5, name: "엔코더"},
    {pk: 6, name: "통관센서"},
    {pk: 7, name: "유틸리티 센서"},
]

const BasicMidrange = ({page,keyword,option}:IProps) => {

    const [basicRow, setBasicRow] = useState<Array<any>>([{
        amount: deviceList[7].name
    }])
    const [column, setColumn] = useState<Array<IExcelHeaderType>>( columnlist["midrange"])
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
