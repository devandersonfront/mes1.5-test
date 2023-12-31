import React, {useEffect, useState} from 'react';
import {
    columnlist,
    ExcelTable,
    Header as PageHeader,
    MidrangeFormReviewModal,
    RequestMethod
} from "shared";
import {IExcelHeaderType} from 'shared/src/@types/type'
import {MidrangeButton} from "shared/src/styles/styledComponents";
import {useRouter} from "next/router";
import Notiflix from "notiflix";
import {duplicateCheckWithArray, setExcelTableHeight} from 'shared/src/common/Util'

const BasicMidrangeModify = () => {
    const column:Array<IExcelHeaderType> = columnlist["midrangeExam"]
    const [sampleColumn, setSampleColumn] = useState<Array<IExcelHeaderType>>(columnlist['midrange'])
    const legendaryColumn:Array<IExcelHeaderType> = columnlist['midrangeLegendary']
    const [itemColumn, setItemColumn] = useState<Array<IExcelHeaderType>>(columnlist['midrangeInspectionItem'])
    const router = useRouter()
    const [basicRow, setBasicRow] = useState<Array<any>>([{}])
    const [sampleBasicRow, setSampleBasicRow] = useState<Array<any>>([{}])
    const [legendaryBasicRow, setLegendaryBasicRow] = useState<Array<any>>([])
    const [itemBasicRow, setItemBasicRow] = useState<Array<any>>([{}])
    const [ isOpen, setIsOpen ] = useState<boolean>(false)
    const [selectCheckListIndex, setSelectCheckListIndex] = useState<number>(null)
    const [selectLegendaryIndex, setSelectLegendaryIndex] = useState<number>(null)

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
            product_id: router.query.product_id
        }
        setBasicRow([data])
        LoadMidrange(Number(router.query.product_id))
    },[router.query])


    useEffect(() => {
            const midrange = [...columnlist['midrange']]
            midrange.map((col) => {
                delete col.readonly
                return col
            })
            setSampleColumn([...midrange])

            const midrangeInspectionItem = [...columnlist['midrangeInspectionItem']]
            midrangeInspectionItem.map((col) => {
                if(col.key == "unit" || col.key == "type"){
                    delete col.readonly
                }
                return col
            })
            setItemColumn([...midrangeInspectionItem])

    }, [])

    const validateCategoryInfo = (info) => {
        if(!!!info.name) throw('검사 항목을 입력해주세요')
        if(!!!info.standard) throw('검사 기준을 입력해주세요')
        if(!!!info.error_minimum) throw('최소값을 입력해주세요')
        if(!!!info.error_maximum) throw('최대값을 입력해주세요')
    }

    const validateLegendsInfo = (info) => {
        if(!!!info.legendary) throw('범례를 입력해주세요')
        if(!!!info.LegendaryExplain) throw('범례 설명을 입력해주세요')
    }

    const MidrangeSave = async () => {
        try{
            const categoryInfo = itemBasicRow.map((v, i)=>{
                // validateCategoryInfo(v)
                return {...v, type: v.type !== "수치 입력" ? 1 : 0}
            })

            const legendaryKeyValue = {}
            legendaryBasicRow.map((v,i)=>{
                // validateLegendsInfo(v)
                legendaryKeyValue[v.legendary] = v.LegendaryExplain
            })

            if(categoryInfo.some(info => info.type === 1) && Object.keys(legendaryKeyValue).length < 1) throw('범례를 추가해주세요')

            const midrangeData = {
                product_id: basicRow[0]?.product_id,
                samples: Number(sampleBasicRow[0].samples),
                legendary_list: legendaryKeyValue,
                category_info: categoryInfo
            }
            const res = await RequestMethod('post', `inspectCategorySave`,[midrangeData])

            if(res){
                Notiflix.Report.success('저장되었습니다.','','확인',() =>
                  router.push(({pathname:'/mes/basic/productV1u/midrange/form/detail',
                      query: { customer_id: router.query.customer_id, cm_id: router.query.cm_id, code: router.query.code, name: router.query.name, product_id: router.query.product_id, type: router.query.type, process_id: router.query.process_id} })))
            }
        }catch(e) {
            Notiflix.Report.warning('경고', e, '확인')
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

            const legendaryArray = legendaryKey.map((v,index)=>{
                return {sequence:index+1 ,legendary: v, LegendaryExplain: legendaryValue[index]}
            })

            const itemBasic = res.category_info.map((v, index)=>{
                return {...v, sequence:index+1, type: v.type === 1 ? '범례 적용' : "수치 입력"}
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
                    sequence:legendaryBasicRow.length+1
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
                    sequence:itemBasicRow.length+1
                }
            ])

        }
    }

    const deleteRowButton = (type : 'legendary' | 'item') => {
        if(type === 'legendary' && legendaryBasicRow.length > 0) {
            const tmpRow = [...legendaryBasicRow]
            tmpRow.map((row, index) => {
                if(selectLegendaryIndex < index){
                    row.sequence -= 1
                }
            })
            tmpRow.splice(selectLegendaryIndex,1)
            setLegendaryBasicRow(tmpRow)
            setSelectLegendaryIndex(null)
        }else if(type === 'item' && itemBasicRow.length > 1) {
            const tmpRow = [...itemBasicRow]
            tmpRow.map((row, index) => {
                if(selectCheckListIndex < index){
                    row.sequence -= 1
                }
            })
            tmpRow.splice(selectCheckListIndex,1)
            setItemBasicRow(tmpRow)
            setSelectCheckListIndex(null)
        }
    }

    const buttonEvents = async(index:number) => {
        switch (index) {
            case 0 :
                setIsOpen(!isOpen)
                return
            case 1 :
                const duplication:boolean = duplicateCheckWithArray(legendaryBasicRow, ["legendary"])
                const essential:boolean = duplicateCheckWithArray(itemBasicRow, ["name","standard"], true);

                if(duplication && essential){
                    MidrangeSave()
                }else if(!duplication){
                    Notiflix.Report.warning("경고", "중복된 범례가 있습니다.","확인")
                }else if(!essential){
                    Notiflix.Report.warning("경고", "필수값을 입력해주시기 바랍니다.(검사 항목, 점검 기준)","확인")
                }
                return
        }
    }

    return (
        <div>
            <PageHeader title={"초ㆍ중ㆍ종 검사항목 정보 (수정)"} buttons={['검사 양식 검토', '저장하기']} buttonsOnclick={buttonEvents}/>
            <ExcelTable
                headerList={column}
                row={basicRow}
                height={basicRow.length * 40 >= 40*18+56 ? 40*19 : basicRow.length * 40 + 56}
            />
            <ExcelTable
                editable
                headerList={sampleColumn}
                row={sampleBasicRow}
                setRow={setSampleBasicRow}
                height={sampleBasicRow.length * 40 >= 40*18+56 ? 40*19 : sampleBasicRow.length * 40 + 56}
            />
            <ExcelTable
                editable
                headerList={legendaryColumn}
                row={legendaryBasicRow}
                onRowClick={(row) =>{
                    const index = legendaryBasicRow.indexOf(row)
                    setSelectLegendaryIndex(index)
                    legendaryBasicRow.map((legendary,i) => {
                        if(index == i){
                            legendary.border = true
                        }else{
                            legendary.border = false
                        }
                    })
                }}
                setRow={setLegendaryBasicRow}
                height={setExcelTableHeight(legendaryBasicRow.length) - 8}
                width={1576}
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
                headerList={itemColumn}
                row={itemBasicRow}
                onRowClick={(row) => {
                    const index = itemBasicRow.indexOf(row)
                    setSelectCheckListIndex(index)
                    itemBasicRow.map((item,i) => {
                        if(index == i){
                            item.border = true
                        }else{
                            item.border = false
                        }
                    })
                }}
                setRow={(row) => {
                    try{
                        row.map((value) => {
                            if(value.type_id == "2"){
                                legendaryBasicRow.map((value) => {
                                    if(value.legendary == "확인" || value.legendary == "취소"){
                                        throw("이미 있음")
                                    }
                                })
                                legendaryBasicRow.push({sequence:legendaryBasicRow.length, LegendaryExplain:"1", legendary:"확인"})
                                legendaryBasicRow.push({sequence:legendaryBasicRow.length, LegendaryExplain:"2", legendary:"취소"})
                            }
                        })
                        setItemBasicRow(row)
                    }catch(err){
                        setItemBasicRow(row)
                    }
                }}
                height={setExcelTableHeight(itemBasicRow.length) - 8}
                width={1576}
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
                isOpen && <MidrangeFormReviewModal data={{basic: basicRow, samples: sampleBasicRow, legendary: legendaryBasicRow, item: itemBasicRow}} isOpen={isOpen} setIsOpen={setIsOpen}/>
            }
        </div>
    );
};

export {BasicMidrangeModify};
