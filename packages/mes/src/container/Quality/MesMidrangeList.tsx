import React, { useEffect, useState } from 'react';
import {
    columnlist,
    ExcelTable,
    Header as PageHeader,
    IExcelHeaderType,
    PaginationComponent,
    RequestMethod
} from "shared";
import moment from "moment";
// @ts-ignore
import { SelectColumn } from "react-data-grid";
import Notiflix from "notiflix";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { deleteMenuSelectState, setMenuSelectState } from "shared/src/reducer/menuSelectState";
import {additionalMenus, loadAllSelectItems, setExcelTableHeight} from 'shared/src/common/Util';
import addColumnClass from '../../../../main/common/unprintableKey'

interface IProps {
    children?: any
    page?: number
    keyword?: string
    option?: number
}

const optionList = ['수주 번호', '지시 고유 번호', 'CODE', '품명', 'LOT 번호', '작업자']

const MesMidrangeList = ({ option }: IProps) => {
    const router = useRouter()
    const dispatch = useDispatch()
    const [basicRow, setBasicRow] = useState<Array<any>>([])
    const [column, setColumn] = useState<Array<IExcelHeaderType>>(columnlist["midrangeList"])
    const [selectList, setSelectList] = useState<Set<number>>(new Set())
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

    const onSelectDate = (date: {from:string, to:string}) => {
        setSelectDate(date)
        reload(null, null, date)
    }

    const reload = (keyword?:string, sortingOptions?: any, date?:{from:string, to:string}, ) => {
        setKeyword(keyword)
        if(pageInfo.page > 1) {
            setPageInfo({...pageInfo, page: 1})
        } else {
            getData(undefined, keyword, date)
        }
    }

    useEffect(() => {
        getData(pageInfo.page, keyword)
    }, [pageInfo.page]);

    useEffect(() => {
        dispatch(setMenuSelectState({ main: "품질 관리", sub: router.pathname }))
        return (() => {
            dispatch(deleteMenuSelectState())
        })
    }, [])

    const convertToRowData = (infoList: any[], date?:{from:string, to:string}) => {
        const _reload = () => {
            reload(null, null, date)
        }
        return infoList.map((info) => {
            const randomId = Math.random() * 1000;
            return {
                id: "midrange_" + randomId,
                record_id: info.record_id,
                contract_id: info.operation_sheet?.contract?.identification ?? '-',
                identification: info.operation_sheet?.identification ?? '-',
                code: info.operation_sheet?.product?.code ?? '-',
                name: info.operation_sheet?.product?.name ?? '-',
                type: column[column.findIndex((col) => col.key == "type")]?.selectList[info.operation_sheet?.product?.type]?.name ?? '-',
                unit: info.operation_sheet?.product?.unit ?? '-',
                process_id: info.operation_sheet?.product?.process?.name ?? '-',
                lot_number: info.lot_number ?? '-',
                worker: info.worker?.name ?? '-',
                start: info.start,
                end: info.end,
                product: info.operation_sheet.product,
                machines: info.machines,
                user: info.worker,
                inspection_category: info.inspection_category,
                reload: _reload
            }
        })
    }

    const getRequestParams = (keyword?: string, date?: {from:string, to:string}) => {
        let params = {}
        if(keyword) {
            params['keyword'] = keyword
            params['opt'] = optionIndex
        }
        params['from'] = date ? date.from: selectDate.from,
        params['to'] = date ? date.to : selectDate.to
        return params
    }

    const getData = async (page: number = 1, keyword?: string, date?: {from:string, to:string}, ) => {
        Notiflix.Loading.circle()
        const res = await RequestMethod('get', keyword ? 'qualityRecordInspectSearch': 'qualityRecordInspectList', {
            path: {
                page: page,
                renderItem: 18,
            },
            params: getRequestParams(keyword, date)
        })

        if(res){
            if (res.totalPages > 0 && res.totalPages < res.page) {
                reload();
            } else {
                setPageInfo({
                    page: res.page,
                    total: res.totalPages
                })
                loadAllSelectItems({column:additionalMenus(columnlist["midrangeList"], res), setColumn, reload})

                setBasicRow(convertToRowData(res.info_list, date))
            }
        }
        Notiflix.Loading.remove()
    }

    return (
        <div className={'excelPageContainer noCheckBox'}>
            <PageHeader
                isSearch
                isCalendar
                searchOptionList={optionList}
                searchKeyword={keyword}
                onSearch={reload}
                onChangeSearchOption={(option) => {
                    setOptionIndex(option)
                }}
                calendarTitle={'등록 날짜'}
                calendarType={'period'}
                selectDate={selectDate}
                //@ts-ignore
                setSelectDate={onSelectDate}
                title={"초ㆍ중ㆍ종 검사 리스트"}
            />
            <ExcelTable
                editable
                resizable
                resizeSave
                headerList={addColumnClass(column)}
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
                height={setExcelTableHeight(basicRow.length)}
            />
            <PaginationComponent
                currentPage={pageInfo.page}
                totalPage={pageInfo.total}
                setPage={(page) => {
                    setPageInfo({...pageInfo, page: page})
                }}
            />

        </div>
    );
};

export { MesMidrangeList }
