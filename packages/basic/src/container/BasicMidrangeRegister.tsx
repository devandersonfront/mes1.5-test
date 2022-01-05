import React, {useState} from 'react';
import {
    columnlist,
    ExcelTable,
    Header as PageHeader,
    IExcelHeaderType,
    MidrangeFormReviewModal,
    RequestMethod
} from "shared";
import {MidrangeButton} from "shared/src/styles/styledComponents";
import Notiflix from "notiflix";

const BasicMidrangeRegister = () => {

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
    const [itemColumn, setItemColumn] = useState<Array<IExcelHeaderType>>(columnlist['midrangeInspectionItem'])
    const [selectList, setSelectList] = useState<Set<number>>(new Set())
    const [sampleSelectList, setSampleSelectList] = useState<Set<number>>(new Set())
    const [ isOpen, setIsOpen ] = useState<boolean>(false)
    const [legendarySelectList, setLegendarySelectList] = useState<Set<number>>(new Set())
    const [ItemSelectList, setItemSelectList] = useState<Set<number>>(new Set())
    const buttonEvents = async(index:number) => {
        switch (index) {
            case 0 :
                setIsOpen(!isOpen)
                return
            case 1 :

                return
        }
    }

    const addRowButton = (type : 'legendary' | 'item') => {
        if( type === 'legendary' && legendaryBasicRow.length < 11) {
            let items = {}
            let random_id = Math.random() * 1000;
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
                ...legendaryBasicRow,
                {
                    ...items,
                    id: `customer_${random_id}`,
                    name: null,
                    additional: [],
                }
            ])
        }else if(type === 'item' && itemBasicRow.length < 51) {
            let items = {}
            let random_id = Math.random()*1000;
            itemColumn.map((value) => {
                if (value.selectList && value.selectList.length) {
                    items = {
                        ...value.selectList[0],
                        [value.key]: value.selectList[0].name,
                        [value.key + 'PK']: value.selectList[0].pk,//여기 봐야됨!
                        ...items,
                    }
                }
            })

            setItemBasicRow([
                ...itemBasicRow,
                {
                    ...items,
                    id: `customer_${random_id}`,
                    name: null,
                    additional: [],
                }
            ])

        }
    }

    return (
        <div>
            <MidrangeFormReviewModal isOpen={isOpen} setIsOpen={setIsOpen}/>
            <PageHeader title={"초ㆍ중ㆍ종 검사항목"} buttons={['검사 양식 검토', '저장하기']} buttonsOnclick={buttonEvents}/>
            <ExcelTable
                editable
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
            <MidrangeButton onClick={()=>addRowButton('legendary')}>
                +범례 추가
            </MidrangeButton>
            <ExcelTable
                editable
                headerList={[
                    ...itemColumn
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
            <MidrangeButton onClick={()=>addRowButton('item')}>
                +검사 항목 추가
            </MidrangeButton>
        </div>
    );
};

export {BasicMidrangeRegister};
