import React, {useState} from 'react';
import {columnlist, ExcelTable, Header as PageHeader, IExcelHeaderType} from "shared";
import {MidrangeButton} from "shared/src/styles/styledComponents";

const BasicMidrangeModify = () => {
    const [basicRow, setBasicRow] = useState<Array<any>>([{
        amount: ''
    }])
    const [sampleBasicRow, setSampleBasicRow] = useState<Array<any>>([{
        amount: ''
    }])
    const [legendaryBasicRow, setLegendaryBasicRow] = useState<Array<any>>([{
        amount: ''
    }])
    const [itemBasicRow, setItemBasicRow] = useState<Array<any>>([{
        amount: ''
    }])
    const [column, setColumn] = useState<Array<IExcelHeaderType>>( columnlist["midrangeExam"])
    const [sampleColumn, setSampleColumn] = useState<Array<IExcelHeaderType>>(columnlist['midrange'])
    const [legendaryColumn, setLegendaryColumn] = useState<Array<IExcelHeaderType>>(columnlist['midrangeLegendary'])
    const [ItemColumn, setItemColumn] = useState<Array<IExcelHeaderType>>(columnlist['midrangeInspectionItem'])
    const [selectList, setSelectList] = useState<Set<number>>(new Set())
    const [sampleSelectList, setSampleSelectList] = useState<Set<number>>(new Set())
    const [legendarySelectList, setLegendarySelectList] = useState<Set<number>>(new Set())
    const [ItemSelectList, setItemSelectList] = useState<Set<number>>(new Set())

    return (
        <div>
            <PageHeader title={"초ㆍ중ㆍ종 검사항목 정보 (수정)"} buttons={['검사 양식 검토', '저장하기']} />
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
            <ExcelTable
                editable
                resizable
                headerList={[
                    ...sampleColumn
                ]}
                row={sampleBasicRow}
                setRow={(e) => {
                    let tmp: Set<any> = sampleSelectList
                    e.map(v => {
                        if(v.isChange) tmp.add(v.id)
                    })
                    setSampleSelectList(tmp)
                    setSampleBasicRow(e)
                }}
                selectList={sampleSelectList}
                //@ts-ignore
                setSelectList={setSampleSelectList}
                height={sampleBasicRow.length * 40 >= 40*18+56 ? 40*19 : sampleBasicRow.length * 40 + 56}
            />
            <ExcelTable
                editable
                resizable
                headerList={[
                    ...legendaryColumn
                ]}
                row={legendaryBasicRow}
                setRow={(e) => {
                    let tmp: Set<any> = legendarySelectList
                    e.map(v => {
                        if(v.isChange) tmp.add(v.id)
                    })
                    setLegendarySelectList(tmp)
                    setLegendaryBasicRow(e)
                }}
                selectList={legendarySelectList}
                //@ts-ignore
                setSelectList={setLegendarySelectList}
                height={legendaryBasicRow.length * 40 >= 40*18+56 ? 40*19 : legendaryBasicRow.length * 40 + 40}
            />
            <MidrangeButton onClick={()=>{let items = {}
                let random_id = Math.random()*1000;
                legendaryColumn.map((value) => {
                    if (value.selectList && value.selectList.length) {
                        items = {
                            ...value.selectList[0],
                            [value.key]: value.selectList[0].name,
                            [value.key + 'PK']: value.selectList[0].pk,//여기 봐야됨!
                            ...items,
                        }
                    }
                })

                setLegendaryBasicRow([
                    {
                        ...items,
                        id: `customer_${random_id}`,
                        name: null,
                        additional: [],
                    },
                    ...legendaryBasicRow
                ])
            }}>
                +범례 추가
            </MidrangeButton>
            <ExcelTable
                editable
                resizable
                headerList={[
                    ...ItemColumn
                ]}
                row={itemBasicRow}
                setRow={(e) => {
                    let tmp: Set<any> = ItemSelectList
                    e.map(v => {
                        if(v.isChange) tmp.add(v.id)
                    })
                    setItemSelectList(tmp)
                    setItemBasicRow(e)
                }}
                selectList={ItemSelectList}
                //@ts-ignore
                setSelectList={setItemSelectList}
                height={itemBasicRow.length * 40 >= 40*18+56 ? 40*19 : itemBasicRow.length * 40 + 40}
            />
            <MidrangeButton>
                +검사 항목 추가
            </MidrangeButton>
        </div>
    );
};

export {BasicMidrangeModify};
