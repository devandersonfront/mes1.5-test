import React, {useState} from 'react';
import {
    columnlist,
    ExcelTable,
    Header as PageHeader,
    MidrangeFormReviewModal,
    RequestMethod, TextEditor
} from "shared";
import {IExcelHeaderType} from 'shared/src/common/@types/type'
import {MidrangeButton} from "shared/src/styles/styledComponents";
import Notiflix from "notiflix";
import {useRouter} from "next/router";

const BasicMidrangeRegister = () => {
    const router = useRouter()
    const [basicRow, setBasicRow] = useState<Array<any>>([{

    }])
    const [sampleBasicRow, setSampleBasicRow] = useState<Array<any>>([{samples: 1}])
    const [legendaryBasicRow, setLegendaryBasicRow] = useState<Array<any>>([])
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
    const [productId, setProductId] = useState<number>()

    React.useEffect(()=>{
        const data = {
            customer: !!router.query.customer_id ? router.query.customer_id : "-",
            model: !!router.query.cm_id ? router.query.cm_id : "-",
            code: !!router.query.code ? router.query.code : "-",
            material_name: !!router.query.name ? router.query.name : "-",
            type: !!router.query.type ? router.query.type : "-",
        }
        setBasicRow([data])
        setProductId(Number(router.query.product_id))
    },[router.query])

    const validateCategoryInfo = (categoryInfo: any[]) => {
        if(!categoryInfo.every(info => info.name)) {
            Notiflix.Report.warning('경고', '검사 항목을 입력해주세요.', '확인')
            return true
        }
       if(!categoryInfo.every(info => info.standard)) {
           Notiflix.Report.warning('경고', '점검 기준을 입력해주세요.', '확인')
           return true
       }
       if(!categoryInfo.every(info => info.error_minimum)) {
           Notiflix.Report.warning('경고', '최소값을 입력해주세요.', '확인')
           return true
       }
       if(!categoryInfo.every(info => info.error_maximum)) {
           Notiflix.Report.warning('경고', '최대값을 입력해주세요.', '확인')
           return true
       }
       return false
    }

    const validateLegendsInfo = (legendsInfo: object) => {
        if(Object.keys(legendsInfo).length <= 0 || Object.keys(legendsInfo).includes('') || Object.keys(legendsInfo).includes('undefined')){
            return Notiflix.Report.warning('경고', '범례를 확인해주세요.', '확인')
        }
        if(Object.values(legendsInfo).includes('') || Object.values(legendsInfo).includes('undefined')){
            return Notiflix.Report.warning('경고', '범례 설명을 확인해주세요.', '확인')
        }
    }


    const MidrangeSave = async () => {
        const categoryInfo = itemBasicRow.map((v)=>{
            return {...v, type: v.type === "범례 적용" ? 1 : 0}
        })
        if(validateCategoryInfo(categoryInfo)) return


        console.log('aa',legendaryBasicRow)
        const legendaryKeyValue = {}
        legendaryBasicRow.map((v,i)=>{
            legendaryKeyValue[v.legendary] = v.LegendaryExplain
        })
        console.log('bb',legendaryKeyValue)

        if(categoryInfo.some(info => info.type === 1)) {
            if(Object.keys(legendaryKeyValue).length <= 0 || Object.keys(legendaryKeyValue).includes('') || Object.keys(legendaryKeyValue).includes('undefined')){
                return Notiflix.Report.warning('경고', '범례를 확인해주세요.', '확인')
            }
            if(Object.values(legendaryKeyValue).includes('') || Object.values(legendaryKeyValue).includes('undefined')){
                return Notiflix.Report.warning('경고', '범례 설명을 확인해주세요.', '확인')
            }
        }

        const midrangeData = {
            product_id: productId,
            samples: Number(sampleBasicRow[0].samples),
            legendary_list: legendaryKeyValue,
            category_info: categoryInfo
        }

        if(midrangeData){

        }
        let res: any
        res = await RequestMethod('post', `inspectCategorySave`,[midrangeData])

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

    return (
        <div>
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
            {
              isOpen && <MidrangeFormReviewModal formReviewData={{basic: basicRow, samples: sampleBasicRow, legendary: legendaryBasicRow, item: itemBasicRow}} isOpen={isOpen} setIsOpen={setIsOpen}/>
            }
        </div>
    );
};

export {BasicMidrangeRegister};
