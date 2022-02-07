import React, {useEffect, useState} from 'react';
import {columnlist, ExcelTable, Header as PageHeader, IExcelHeaderType, RequestMethod} from "shared";
import moment from "moment";
// @ts-ignore
import {SelectColumn} from "react-data-grid";
import Notiflix from "notiflix";

interface IProps {
    children?: any
    page?: number
    keyword?: string
    option?: number
}

const MesMidrangeList = ({option}:IProps) => {

    const [basicRow, setBasicRow] = useState<Array<any>>([])
    const [column, setColumn] = useState<Array<IExcelHeaderType>>( columnlist["midrangeList"])
    const [selectList, setSelectList] = useState<Set<number>>(new Set())
    const [optionList, setOptionList] = useState<string[]>([ '수주 번호', '지시 고유 번호', 'CODE', '품명', 'LOT 번호', '작업자' ])
    const [optionIndex, setOptionIndex] = useState<number>(0)
    const [selectDate, setSelectDate] = useState<{from:string, to:string}>({
        from: moment(new Date()).startOf("month").format('YYYY-MM-DD') ,
        to:  moment(new Date()).endOf("month").format('YYYY-MM-DD')
    });

    const [searchKeyword, setSearchKeyword] = useState<string>("");
    const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
        page: 1,
        total: 1
    })

    useEffect(() => {
        // setOptionIndex(option)
        if(searchKeyword){
            searchQualityRecordInspect(searchKeyword, option, pageInfo.page).then(() => {
                Notiflix.Loading.remove()
            })
        }else{
            qualityRecordInspectList(pageInfo.page).then(() => {
                Notiflix.Loading.remove()
            })
        }
    }, [pageInfo.page, searchKeyword, option, selectDate])

    const searchQualityRecordInspect = async (keyword, opt, page?: number) => {
        Notiflix.Loading.circle()
        const res = await RequestMethod('get', `cncRecordSearch`,{
            path: {
                page: (page || page !== 0) ? page : 1,
                renderItem: 22,
            },
            params: {
                keyword: keyword,
                opt: optionIndex,
                from: selectDate.from,
                to: selectDate.to,
            }
        })

        if(res){
            setPageInfo({
                ...pageInfo,
                page: res.page,
                total: res.totalPages
            })

            const data = res.info_list.map((v)=>{
                return {
                    record_id: v.record_id,
                    identification: v.operation_sheet.contract ? v.operation_sheet.contract.identification  : '-',
                    contract_id: v.operation_sheet.contract ? v.operation_sheet.contract.identification  : '-',
                    osId: v.operation_sheet.identification ?? '-',
                    lot_number:  v.lot_number ?? '-',
                    code: v.operation_sheet.product.code ?? '-',
                    product: v.operation_sheet.product,
                    machines: v.machines,
                    user: v.worker,
                    name: v.operation_sheet.product.name ?? '-',
                    type: column[4].selectList[v.operation_sheet.product.type].name,
                    unit: v.operation_sheet.product.unit ?? '-',
                    process_id: v.operation_sheet.product.process === null ? '-' : v.operation_sheet.product.process.name ,
                    ln_id: v.lot_number ?? '-',
                    worker: v.worker.name,
                    start: v.start,
                    end: v.end,
                    inspection_category: v.inspection_category,
                }
            })

            setBasicRow([...data])
        }

    }

    const qualityRecordInspectList =  async  (page?: number) => {
        Notiflix.Loading.circle()
        const res = await RequestMethod('get', `qualityRecordInspectSearch`,{
            path: {
                page: (page || page !== 0) ? page : 1,
                renderItem: 22,
            },
            params: {
                from: selectDate.from,
                to: selectDate.to,
            }
        })

        if(res){
            setPageInfo({
                ...pageInfo,
                page: res.page,
                total: res.totalPages
            })

            const data = res.info_list.map((v)=>{
                return {
                    record_id: v.record_id,
                    identification: v.operation_sheet.contract ? v.operation_sheet.contract.identification  : '-',
                    contract_id: v.operation_sheet.contract ? v.operation_sheet.contract.identification  : '-',
                    osId: v.operation_sheet.identification ?? '-',
                    lot_number:  v.lot_number ?? '-',
                    code: v.operation_sheet.product.code ?? '-',
                    name: v.operation_sheet.product.name ?? '-',
                    product: v.operation_sheet.product,
                    machines: v.machines,
                    user: v.worker,
                    type: column[4].selectList[v.operation_sheet.product.type].name,
                    unit: v.operation_sheet.product.unit ?? '-',
                    process_id: v.operation_sheet.product.process === null ? '-' : v.operation_sheet.product.process.name ,
                    ln_id: v.lot_number ?? '-',
                    worker: v.worker.name,
                    start: v.start,
                    end: v.end,
                    inspection_category: v.inspection_category,
                }
            })
            if(pageInfo.page > 1) {
                const basicAddResponseData = basicRow.concat(data)
                setBasicRow([...basicAddResponseData])
            }else {
                setBasicRow([...data])
            }
        }

    }


    return (
        <div>
            <PageHeader
                isSearch
                isCalendar
                searchKeyword={""}
                searchOptionList={optionList}
                onChangeSearchKeyword={(keyword) => {
                    setSearchKeyword(keyword);
                    setPageInfo({page:1, total:1})
                }}
                onChangeSearchOption={(option) => {
                    setOptionIndex(option)
                }}
                calendarTitle={'등록 날짜'}
                calendarType={'period'}
                selectDate={selectDate}
                //@ts-ignore
                setSelectDate={(date) => setSelectDate(date)}
                title={"초ㆍ중ㆍ종 검사 리스트"}
            />
            <ExcelTable
                editable
                headerList={[
                    SelectColumn,
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
                scrollEnd={(value) => {
                    if(value){
                        if(pageInfo.total > pageInfo.page){
                            setPageInfo({...pageInfo, page:pageInfo.page+1})
                        }
                    }
                }}
            />
        </div>
    );
};

export {MesMidrangeList}
