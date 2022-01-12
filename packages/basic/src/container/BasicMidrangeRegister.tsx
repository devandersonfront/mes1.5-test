import React, {useState} from 'react';
import {
    columnlist,
    ExcelTable,
    Header as PageHeader,
    IExcelHeaderType,
    MidrangeFormReviewModal,
    RequestMethod, TextEditor
} from "shared";
import {MidrangeButton} from "shared/src/styles/styledComponents";
import Notiflix from "notiflix";
import {useRouter} from "next/router";

const BasicMidrangeRegister = () => {
    const router = useRouter()
    const [basicRow, setBasicRow] = useState<Array<any>>([{

    }])
    const [sampleBasicRow, setSampleBasicRow] = useState<Array<any>>([{samples: 1}])
    const [legendaryBasicRow, setLegendaryBasicRow] = useState<Array<any>>([{

    }])
    const [itemBasicRow, setItemBasicRow] = useState<Array<any>>([{unit: 'mm', type: 0}])
    const [column, setColumn] = useState<Array<IExcelHeaderType>>( columnlist["midrangeExam"])
    const [sampleColumn, setSampleColumn] = useState<Array<IExcelHeaderType>>(columnlist['midrange'])
    const [legendaryColumn, setLegendaryColumn] = useState<Array<IExcelHeaderType>>(columnlist['midrangeLegendary'])
    const [itemColumn, setItemColumn] = useState<Array<IExcelHeaderType>>(columnlist['midrangeInspectionItem'])
    const [selectList, setSelectList] = useState<Set<number>>(new Set())
    const [sampleSelectList, setSampleSelectList] = useState<Set<number>>(new Set())
    const [ isOpen, setIsOpen ] = useState<boolean>(false)
    const [legendarySelectList, setLegendarySelectList] = useState<Set<number>>(new Set())
    const [ItemSelectList, setItemSelectList] = useState<Set<number>>(new Set())

    const MidrangeSave = async () => {
        const legendaryKeyValue = {}
        legendaryBasicRow.map((v,i)=>{
            legendaryKeyValue[v.legendary] = v.LegendaryExplain
        })

        const midrangeData = {
            product_id: 28,
            samples: Number(sampleBasicRow[0].samples),
            legendary_list: legendaryKeyValue,
            category_info: itemBasicRow
        }
        let res: any
        res = await RequestMethod('post', `inspecCategorySave`,[midrangeData])

        if(res){
            Notiflix.Report.success('저장되었습니다.','','확인');
            router.push('/mes/basic/productV1u')
        }
    }

    const buttonEvents = async(index:number) => {
        switch (index) {
            case 0 :
                setIsOpen(!isOpen)
                return
            case 1 :
                MidrangeSave()
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
                    id: `legendary_${random_id}`,
                }
            ])
        }else if(type === 'item' && itemBasicRow.length < 51) {
            let items = {}
            let random_id = Math.random()*1000;
            itemColumn.map((value) => {
                if (value.selectList && value.selectList.length) {
                    if(value.key === 'type'){
                        items = {
                            [value.key]: value.selectList[0].pk,
                            [value.key + 'PK']: value.selectList[0].pk,//여기 봐야됨!
                            ...items,
                        }
                    }else {
                        items = {
                            [value.key]: value.selectList[0].name,
                            [value.key + 'PK']: value.selectList[0].pk,//여기 봐야됨!
                            ...items,
                        }
                    }
                }
            })

            setItemBasicRow([
                ...itemBasicRow,
                {
                    ...items,
                    id: `item_${random_id}`,
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
