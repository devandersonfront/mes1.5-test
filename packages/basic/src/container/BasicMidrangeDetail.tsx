import React, {useState} from 'react';
import {columnlist, ExcelTable, Header as PageHeader, IExcelHeaderType, RequestMethod} from "shared";
import {MidrangeButton} from "shared/src/styles/styledComponents";
import {useRouter} from "next/router";
import Notiflix from "notiflix";

const BasicMidrangeDetail = () => {
    const [basicRow, setBasicRow] = useState<Array<any>>([{
    }])
    const [sampleBasicRow, setSampleBasicRow] = useState<Array<any>>([{

    }])
    const [legendaryBasicRow, setLegendaryBasicRow] = useState<Array<any>>([{

    }])
    const [itemBasicRow, setItemBasicRow] = useState<Array<any>>([{

    }])
    const [column, setColumn] = useState<Array<IExcelHeaderType>>( columnlist["midrangeExamDetail"])
    const [sampleColumn, setSampleColumn] = useState<Array<IExcelHeaderType>>(columnlist['midrangeDetail'])
    const [legendaryColumn, setLegendaryColumn] = useState<Array<IExcelHeaderType>>(columnlist['midrangeLegendaryDetail'])
    const [ItemColumn, setItemColumn] = useState<Array<IExcelHeaderType>>(columnlist['midrangeInspectionItemDetail'])
    const [selectList, setSelectList] = useState<Set<number>>(new Set())
    const [sampleSelectList, setSampleSelectList] = useState<Set<number>>(new Set())
    const [legendarySelectList, setLegendarySelectList] = useState<Set<number>>(new Set())
    const [ItemSelectList, setItemSelectList] = useState<Set<number>>(new Set())
    const router = useRouter()

    const LoadMidrange = async () => {
        Notiflix.Loading.circle()
        const res = await RequestMethod('get', `inspectCategoryLoad`,{
            path: {
                product_id: 28
            }
        })

        if(res){
            const legendaryKey = Object.keys(res.legendary_list)
            const legendaryValue = Object.values(res.legendary_list)

            const legendaryArray = legendaryKey.map((v,i)=>{
                return {legendary: v, LegendaryExplain: legendaryValue[i]}
            })

            setSampleBasicRow([{samples: res.samples}])
            setLegendaryBasicRow(legendaryArray)
            setItemBasicRow(res.category_info)
        }
    }

    //product_id
    // console.log(28)
    React.useEffect(()=>{
        console.log(router)
        LoadMidrange()
    },[])

    return (
        <div>
            <PageHeader title={"초ㆍ중ㆍ종 검사항목 정보"} buttons={[ '목록 보기', '검사 양식 검토', '수정하기']} buttonsOnclick={()=>{}} />
            <ExcelTable
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
                height={legendaryBasicRow.length * 40 >= 40*18+56 ? 40*19 : legendaryBasicRow.length * 40 + 56}
            />
            <ExcelTable
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
                height={itemBasicRow.length * 40 >= 40*18+56 ? 40*19 : itemBasicRow.length * 40 + 56}
            />
        </div>
    );
};

export {BasicMidrangeDetail};
