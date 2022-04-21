import React, {useState} from 'react';
import {
    columnlist,
    ExcelTable,
    Header as PageHeader,
    MidrangeFormReviewModal,
    RequestMethod
} from "shared";
import {IExcelHeaderType} from 'shared/src/common/@types/type'
import {MidrangeButton} from "shared/src/styles/styledComponents";
import {useRouter} from "next/router";
import Notiflix from "notiflix";

const BasicMidrangeModify = () => {
    const router = useRouter()
    const [basicRow, setBasicRow] = useState<Array<any>>([{}])
    const [sampleBasicRow, setSampleBasicRow] = useState<Array<any>>([{}])
    const [legendaryBasicRow, setLegendaryBasicRow] = useState<Array<any>>([])
    const [itemBasicRow, setItemBasicRow] = useState<Array<any>>([{}])
    const [productId, setProductId] = useState<number>()
    const [ isOpen, setIsOpen ] = useState<boolean>(false)
    const [column, setColumn] = useState<Array<IExcelHeaderType>>( columnlist["midrangeExam"])
    const [sampleColumn, setSampleColumn] = useState<Array<IExcelHeaderType>>(columnlist['midrange'])
    const [legendaryColumn, setLegendaryColumn] = useState<Array<IExcelHeaderType>>(columnlist['midrangeLegendary'])
    const [itemColumn, setItemColumn] = useState<Array<IExcelHeaderType>>(columnlist['midrangeInspectionItem'])
    const [selectList, setSelectList] = useState<Set<number>>(new Set())
    const [sampleSelectList, setSampleSelectList] = useState<Set<number>>(new Set())
    const [legendarySelectList, setLegendarySelectList] = useState<Set<number>>(new Set())
    const [ItemSelectList, setItemSelectList] = useState<Set<number>>(new Set())

    const MidrangeSave = async () => {
        const legendaryKeyValue = {}
        legendaryBasicRow.map((v,i)=>{
            legendaryKeyValue[v.legendary] = v.LegendaryExplain
        })

        if(Object.keys(legendaryKeyValue).includes('') || Object.keys(legendaryKeyValue).includes('undefined')){
            return Notiflix.Report.warning('경고', '범례를 확인해주세요.', '확인')
        }else if(Object.values(legendaryKeyValue).includes('') || Object.values(legendaryKeyValue).includes('undefined')){
            return Notiflix.Report.warning('경고', '범례 설명을 확인해주세요.', '확인')
        }

        const categoryInfo = itemBasicRow.map((v)=>{
            return {...v, type: v.type === "범례 적용" ? 1 : 0}
        })

        const midrangeData = {
            product_id: productId,
            samples: Number(sampleBasicRow[0].samples),
            legendary_list: legendaryKeyValue,
            category_info: categoryInfo
        }
        let res: any
        res = await RequestMethod('post', `inspectCategorySave`,[midrangeData])

        if(res){
            Notiflix.Report.success('저장되었습니다.','','확인');
            router.push('/mes/basic/productV1u')
        }
    }

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
                            [value.key]: Number(value.selectList[0].pk),
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

    const deleteRowButton = (type : 'legendary' | 'item') => {

        if(type === 'legendary' && legendaryBasicRow.length > 0) {

            const tmpRow = [...legendaryBasicRow]
            tmpRow.splice(-1,1)
            setLegendaryBasicRow(tmpRow)

        }else if(type === 'item' && itemBasicRow.length > 1) {

            const tmpRow = [...itemBasicRow]
            tmpRow.splice(-1,1)
            setItemBasicRow(tmpRow)

        }

    }

    React.useEffect(()=>{
        const data = {
            customer: router.query.customer_id,
            model: router.query.cm_id,
            code: router.query.code,
            material_name: router.query.name,
            type: router.query.type,
        }
        setBasicRow([data])
        setProductId(Number(router.query.product_id))
        LoadMidrange(Number(router.query.product_id))
    },[router.query])

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

    return (
        <div>
            <PageHeader title={"초ㆍ중ㆍ종 검사항목 정보 (수정)"} buttons={['검사 양식 검토', '저장하기']} buttonsOnclick={buttonEvents}/>
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
            <div style={{display : 'flex'}}>
                <MidrangeButton onClick={()=>deleteRowButton('legendary')} style={{backgroundColor :'#98999B'}}>
                    -범례 삭제
                </MidrangeButton>
                <MidrangeButton onClick={()=>addRowButton('legendary')}>
                    +범례 추가
                </MidrangeButton>
            </div>
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
            <div style={{display : 'flex'}}>
                <MidrangeButton onClick={()=>deleteRowButton('item')} style={{backgroundColor :'#98999B'}}>
                    -검사 항목 삭제
                </MidrangeButton>
                <MidrangeButton onClick={()=>addRowButton('item')}>
                    +검사 항목 추가
                </MidrangeButton>
            </div>
            <MidrangeFormReviewModal formReviewData={{basic: basicRow, samples: sampleBasicRow, legendary: legendaryBasicRow, item: itemBasicRow}} isOpen={isOpen} setIsOpen={setIsOpen}/>
        </div>
    );
};

export {BasicMidrangeModify};
