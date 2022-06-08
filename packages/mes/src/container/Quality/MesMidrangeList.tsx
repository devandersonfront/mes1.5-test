import React, { useEffect, useState } from 'react';
import { columnlist, ExcelTable, Header as PageHeader, IExcelHeaderType, RequestMethod } from "shared";
import moment from "moment";
// @ts-ignore
import { SelectColumn } from "react-data-grid";
import Notiflix from "notiflix";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { deleteSelectMenuState, setSelectMenuStateChange } from "shared/src/reducer/menuSelectState";

interface IProps {
    children?: any
    page?: number
    keyword?: string
    option?: number
}

const MesMidrangeList = ({ option }: IProps) => {
    const router = useRouter()
    const dispatch = useDispatch()
    const [basicRow, setBasicRow] = useState<Array<any>>([])
    const [column, setColumn] = useState<Array<IExcelHeaderType>>(columnlist["midrangeList"])
    const [selectList, setSelectList] = useState<Set<number>>(new Set())
    const [optionList, setOptionList] = useState<string[]>(['수주 번호', '지시 고유 번호', 'CODE', '품명', 'LOT 번호', '작업자'])
    const [optionIndex, setOptionIndex] = useState<number>(0)
    const [selectDate, setSelectDate] = useState<{ from: string, to: string }>({
        from: moment().subtract(1, "months").format("YYYY-MM-DD"),
        to: moment().format('YYYY-MM-DD')
    });

    const [keyword, setKeyword] = useState<string>("");
    const [pageInfo, setPageInfo] = useState<{ page: number, total: number }>({
        page: 1,
        total: 1
    })

    const loadPage = (page: number) => {
        if (keyword) {
            searchQualityRecordInspect(keyword, optionIndex, page).then(() => {
                Notiflix.Loading.remove()
            })
        } else {
            qualityRecordInspectList(page).then(() => {
                Notiflix.Loading.remove()
            })
        }
    }

    useEffect(() => {
        loadPage(pageInfo.page)
    }, [pageInfo.page, selectDate])

    useEffect(() => {
        dispatch(setSelectMenuStateChange({ main: "품질 관리", sub: router.pathname }))
        return (() => {
            dispatch(deleteSelectMenuState())
        })
    }, [])

    const searchQualityRecordInspect = async (keyword, opt, page?: number) => {
        Notiflix.Loading.circle()
        const res = await RequestMethod('get', `qualityRecordInspectSearch`, {
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

        if (res) {
            setPageInfo({
                ...pageInfo,
                page: res.page,
                total: res.totalPages
            })

            const data = res.info_list.map((v) => {
                const randomId = Math.random() * 1000;
                return {
                    id: "midrange_" + randomId,
                    record_id: v.record_id,
                    identification: v.operation_sheet.identification ? v.operation_sheet.identification : '-',
                    contract_id: v.operation_sheet.contract ? v.operation_sheet.contract.identification : '-',
                    osId: v.operation_sheet.identification ?? '-',
                    lot_number: v.lot_number ?? '-',
                    code: v.operation_sheet.product.code ?? '-',
                    product: v.operation_sheet.product,
                    machines: v.machines,
                    user: v.worker,
                    name: v.operation_sheet.product.name ?? '-',
                    type: column[4].selectList[v.operation_sheet.product.type].name,
                    unit: v.operation_sheet.product.unit ?? '-',
                    process_id: v.operation_sheet.product.process === null ? '-' : v.operation_sheet.product.process.name,
                    ln_id: v.lot_number ?? '-',
                    worker: v.worker.name,
                    start: v.start,
                    end: v.end,
                    inspection_category: v.inspection_category,
                    loadPage
                }
            })

            if (pageInfo.page > 1) {
                const basicAddResponseData = basicRow.concat(data)
                setBasicRow([...basicAddResponseData])
            } else {
                setBasicRow([...data])
            }
        }

    }

    const qualityRecordInspectList = async (page?: number) => {
        Notiflix.Loading.circle()
        const res = await RequestMethod('get', `qualityRecordInspectList`, {
            path: {
                page: (page || page !== 0) ? page : 1,
                renderItem: 22,
            },
            params: {
                from: selectDate.from,
                to: selectDate.to,
            }
        })

        if (res) {
            setPageInfo({
                ...pageInfo,
                page: res.page,
                total: res.totalPages
            })

            const data = res.info_list.map((v) => {
                const randomId = Math.random() * 1000;
                // if(v.machines) {
                return {
                    id: "midrange_" + randomId,
                    record_id: v.record_id,
                    identification: v.operation_sheet.identification ? v.operation_sheet.identification : '-',
                    contract_id: v.operation_sheet.contract ? v.operation_sheet.contract.identification : '-',
                    osId: v.operation_sheet.identification ?? '-',
                    lot_number: v.lot_number ?? '-',
                    code: v.operation_sheet.product.code ?? '-',
                    name: v.operation_sheet.product.name ?? '-',
                    product: v.operation_sheet.product,
                    machines: v.machines,
                    user: v.worker,
                    type: column[4].selectList[v.operation_sheet.product.type].name,
                    unit: v.operation_sheet.product.unit ?? '-',
                    process_id: v.operation_sheet.product.process === null ? '-' : v.operation_sheet.product.process.name,
                    ln_id: v.lot_number ?? '-',
                    worker: v.worker.name,
                    start: v.start,
                    end: v.end,
                    inspection_category: v.inspection_category,
                    loadPage
                }
                // }
            })
            if (pageInfo.page > 1) {
                const basicAddResponseData = basicRow.concat(data)
                setBasicRow([...basicAddResponseData])
            } else {
                setBasicRow([...data])
            }
        }

    }

    const settingHeight = (length:number) => {
        switch (length){
            case 0:
                return 80
            default :
                return basicRow.length * 40 + 56
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
                    // setKeyword(keyword);
                    searchQualityRecordInspect(keyword, optionIndex, pageInfo.page).then(() => {
                        Notiflix.Loading.remove()
                    })
                    // setPageInfo({page:1, total:1})
                    setKeyword(keyword);
                    setPageInfo({page:1, total:pageInfo.total})
                }}
                onChangeSearchOption={(option) => {
                    setOptionIndex(option)
                }}
                calendarTitle={'등록 날짜'}
                calendarType={'period'}
                selectDate={selectDate}
                //@ts-ignore
                setSelectDate={(date) => {
                    setSelectDate(date as {from:string, to:string})
                    setPageInfo({page:1, total:pageInfo.total})
                }}
                title={"초ㆍ중ㆍ종 검사 리스트"}
            />
            <ExcelTable
                editable
                resizable
                headerList={column}
                row={basicRow}
                setRow={(e) => {
                    let tmp: Set<any> = selectList
                    e.map(v => {
                        if (v.isChange) {
                            tmp.add(v.id)
                            v.isChange = false
                        }
                    })
                    setSelectList(tmp)
                    setBasicRow(e)
                }}
                selectList={selectList}
                //@ts-ignore
                setSelectList={setSelectList}
                width={1576}
                height={settingHeight(basicRow.length)}
                scrollEnd={(value) => {
                    if (value) {
                        if (pageInfo.total > pageInfo.page) {
                            setSelectList(new Set)
                            setPageInfo({ ...pageInfo, page: pageInfo.page + 1 })
                        }
                    }
                }}
            />
        </div>
    );
};

export { MesMidrangeList }
