import React, {useState} from 'react';
import {
    columnlist,
    ExcelTable,
    Header as PageHeader,
    MidrangeFormReviewModal,
    RequestMethod
} from "shared";
import {IExcelHeaderType} from 'shared/src/@types/type'
import {useRouter} from "next/router";
import Notiflix from "notiflix";
import { setExcelTableHeight } from 'shared/src/common/Util'
import { sum } from 'lodash'

const BasicMidrangeDetail = () => {
    const [basicRow, setBasicRow] = useState<Array<any>>([{
    }])
    const [sampleBasicRow, setSampleBasicRow] = useState<Array<any>>([{

    }])
    const [legendaryBasicRow, setLegendaryBasicRow] = useState<Array<any>>([{

    }])
    const [itemBasicRow, setItemBasicRow] = useState<Array<any>>([{

    }])
    const [productId, setProductId] = useState<number>()
    const [ isOpen, setIsOpen ] = useState<boolean>(false)
    const [column, setColumn] = useState<Array<IExcelHeaderType>>( columnlist["midrangeExamDetail"])
    const [sampleColumn, setSampleColumn] = useState<Array<IExcelHeaderType>>(columnlist['midrangeDetail'])
    const [legendaryColumn, setLegendaryColumn] = useState<Array<IExcelHeaderType>>(columnlist['midrangeLegendaryDetail'])
    const [ItemColumn, setItemColumn] = useState<Array<IExcelHeaderType>>(columnlist['midrangeInspectionItemDetail'])
    const [selectList, setSelectList] = useState<Set<number>>(new Set())
    const [sampleSelectList, setSampleSelectList] = useState<Set<number>>(new Set())
    const [legendarySelectList, setLegendarySelectList] = useState<Set<number>>(new Set())
    const [ItemSelectList, setItemSelectList] = useState<Set<number>>(new Set())
    const router = useRouter()

    const LoadMidrange = async (product_id: number) => {
        Notiflix.Loading.circle()
        const res = await RequestMethod('get', `inspectCategoryLoad`,{
            path: {
                product_id: product_id
            }
        })

        if(res){
            const legendaryKey = Object.keys(res.legendary_list)
            const legendaryValue = Object.values(res.legendary_list)

            const legendaryArray = legendaryKey.map((v,i)=>{
                return {legendary: v, LegendaryExplain: legendaryValue[i]}
            })

            const itemBasic = res.category_info.map((v)=>{
                return {...v, type: v.type === 1 ? '범례 적용' : "수치 입력"}
            })

            setSampleBasicRow([{samples: res.samples}])
            setLegendaryBasicRow(legendaryArray)
            setItemBasicRow(itemBasic)
        }
    }

    const buttonEvents = async(index:number) => {
        switch (index) {
            case 0 :
                router.push('/mes/basic/productV1u')
                return
            case 1 :
                setIsOpen(!isOpen)
                return
            case 2 :
                router.push(({pathname: '/mes/basic/productV1u/midrange/form/modify',
                    query: { customer_id: router.query.customer_id, cm_id: router.query.cm_id, code: router.query.code, name: router.query.name, product_id: router.query.product_id, type: router.query.type} }))
                return
        }
    }
    React.useEffect(()=>{
        const data = {
            osd_id:router.query.osd_id ?? "-",
            lot_number:router.query.lot_number ?? "-",
            code: router.query.code ?? "-",
            material_name: router.query.name ??  "-",
            type: router.query.type ?? "-",
            process_id: router.query.process_id ?? "-",
            worker_name: router.query.worker_name ?? "-",
            name: router.query.machine_name ?? "-",
            customer: router.query.customer_id ?? "-",
            model: router.query.cm_id ?? "-",
        }
        setBasicRow([data])
        if(router.query.product_id){
            LoadMidrange(Number(router.query.product_id))
        }
    },[router.query])


    return (
        <div>
            <PageHeader title={"초ㆍ중ㆍ종 검사항목 정보"} buttons={[ '목록 보기', '검사 양식 검토', '수정하기']} buttonsOnclick={buttonEvents} />
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
                height={setExcelTableHeight(legendaryBasicRow.length)+10}
                width={sum(legendaryColumn.map(col => col.width))}
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
                height={setExcelTableHeight(itemBasicRow.length)}
            />
            {
                isOpen && <MidrangeFormReviewModal data={{basic: basicRow, samples: sampleBasicRow, legendary: legendaryBasicRow, item: itemBasicRow}} isOpen={isOpen} setIsOpen={setIsOpen}/>
            }
        </div>
    );
};

export {BasicMidrangeDetail};
