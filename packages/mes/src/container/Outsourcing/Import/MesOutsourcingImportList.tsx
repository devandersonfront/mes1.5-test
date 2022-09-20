import React, { useEffect, useState } from 'react'
import {
    columnlist,
    ExcelDownloadModal,
    ExcelTable,
    Header as PageHeader,
    IExcelHeaderType, LotInputInfoModal,
    PaginationComponent,
    RequestMethod,
} from 'shared'
// @ts-ignore
import { SelectColumn } from 'react-data-grid'
import Notiflix from "notiflix";
import { NextPageContext } from 'next'
import { deleteMenuSelectState, setMenuSelectState } from "shared/src/reducer/menuSelectState";
import { useDispatch,  } from "react-redux";
import { setExcelTableHeight } from 'shared/src/common/Util'
import {useRouter} from "next/router";
import {CalendarBox} from "shared/src/components/CalendarBox/CalendarBox";
import {TableSortingOptionType} from "shared/src/@types/type";
import {setModifyInitData} from "shared/src/reducer/modifyInfo";
import moment from 'moment'
import { alertMsg } from 'shared/src/common/AlertMsg'

const MesOutsourcingImportList = () => {

    const dispatch = useDispatch()
    const router = useRouter()
    const [basicRow, setBasicRow] = useState<any[]>([{}])
    const [pageInfo, setPageInfo] = useState<{page:number, total:number}>({page:1, total:4})
    const [keyword , setKeyword] = useState<string>('')
    const [optionIndex, setOptionIndex] = useState<number>(0);
    const [selectList, setSelectList] = useState<Set<any>>(new Set());
    const [column, setColumn] = useState<Array<IExcelHeaderType>>(columnlist["outsourcingImportList"]);
    const [sortingOptions, setSortingOptions] = useState<TableSortingOptionType>({orders: [], sorts: []})
    const [selectDate, setSelectDate] = useState<{ from: string, to: string }>({
        from: moment().subtract(1, 'month').format('YYYY-MM-DD'),
        to: moment().format('YYYY-MM-DD')
    })
    useEffect(() => {
        dispatch(
          setMenuSelectState({ main: "외주 관리", sub: router.pathname })
        )
        return () => {
            dispatch(deleteMenuSelectState())
        }
    }, [])

    useEffect(() => {
        getData(pageInfo.page, keyword)
    }, [pageInfo.page]);

    const convertData = (list) => {
        return list.map((data)=>{
            return {
                ...data,
                id : data.osi_id,
                name : data.product.name,
                product_id : data.product?.code,
                contract_id : data?.outsourcing_export?.identification,
                customer_id : data.product?.customer?.name,
                import_date : data.import_date,
                warehousing : data.warehousing,
                current : data.current,
                lot_number : data.lot_number,
            }
        })
    }

    const convertColumn = (menus) => {
        const colNames = menus.map(menu => menu.colName)
        return column.filter((data)=> colNames.includes(data.key))
    }

    const onSelectDate = (date: { from: string, to: string }) => {
        setSelectDate(date)
        reload(null, date)
    }

    const reload = (keyword?: string, date?: { from: string, to: string }, sortingOptions?: TableSortingOptionType) => {
        setKeyword(keyword)
        if (pageInfo.page > 1) {
            setPageInfo({...pageInfo, page: 1})
        } else {
            getData(undefined, keyword, date, sortingOptions)
        }
    }

    const filterSelectedRows = () => {
       return basicRow.filter((row) => selectList.has(row.id))
    };

    const getRequestParams = (keyword?: string, date?: { from: string, to: string }, _sortingOptions?: TableSortingOptionType) => {
        let params = {}
        if (keyword) {
            params['keyword'] = keyword
            params['opt'] = optionIndex
        }
        params['from'] = date ? date.from : selectDate.from
        params['to'] = date ? date.to : selectDate.to
        params['order'] = _sortingOptions ? _sortingOptions.orders : sortingOptions.orders
        params['sorts'] = _sortingOptions ? _sortingOptions.sorts : sortingOptions.sorts
        return params
    }

    // 외주 입고 리스트
    const getData = async (page: number = 1, keyword?: string, date?: { from: string, to: string }, _sortingOptions?: TableSortingOptionType) => {
        Notiflix.Loading.circle();
        const res = await RequestMethod("get", keyword? 'outsourcingImportSearch':'outsourcingImportList', {
            path: { page: page ?? 1, renderItem: 18},
            params: getRequestParams(keyword, date, _sortingOptions)
        });

        if(res){
            if (res.totalPages > 0 && res.totalPages < res.page) {
                reload();
            } else {
                setBasicRow(convertData(res.info_list));
                setColumn(convertColumn(res.menus))
                setPageInfo({page: res.page, total: res.totalPages})
            }
        }
        Notiflix.Loading.remove()
    };

    // 외주 입고 삭제
    const deleteApi = async (filtered) => {
        const result = await RequestMethod('delete', 'outsourcingImportDelete', filtered)
        if(result){
            Notiflix.Report.success(
                '성공',
                '삭제가 되었습니다.',
                '확인',
                () => getData())
        }
        setSelectList(new Set())
    }

    const moveModifyPage = (filtered) => {
        Notiflix.Loading.circle();
        dispatch(setModifyInitData({modifyInfo: filtered, type: "import"}));
        router.push("/mes/outsourcing/import/modify",).then(() => Notiflix.Loading.remove());
    }

    const buttonEvent = (buttonIndex:number) => {
        switch (buttonIndex) {
            case 0:
                try {
                    if(selectList?.size === 0) throw(alertMsg.noSelectedData)
                    if(selectList.size > 1) throw(alertMsg.onlyOne)
                    const filtered = filterSelectedRows()
                    filtered.map(row => {if(row.warehousing !== row.current) throw(alertMsg.exportedNotUpdatable)})
                    moveModifyPage(filtered)
                } catch(errMsg){
                      Notiflix.Report.warning('경고',errMsg,"확인")
                }
                break
            case 1:
                selectList?.size > 0 ?
                    Notiflix.Confirm.show("경고", "삭제하시겠습니까?", "확인", "취소",
                        () => {
                            const filtered = filterSelectedRows()
                            deleteApi(filtered)})
                    : Notiflix.Report.warning('선택 경고','선택된 정보가 없습니다.','확인')
                break
            default:
                break
        }
    }

    return (
        <div>
            <PageHeader
                isCalendar
                calendarType={'period'}
                selectDate={selectDate}
                searchKeyword={keyword}
                onSearch={reload}
                onChangeSearchOption={setOptionIndex}
                setSelectDate={onSelectDate}
                title={"외주 입고 현황"}
                isSearch
                optionIndex={optionIndex}
                searchOptionList={["Lot번호", "CODE","품명"]}
                buttons={
                    ['수정하기', '삭제']
                }
                buttonsOnclick={buttonEvent}
            />
            <ExcelTable
                editable
                resizable
                headerList={[
                    SelectColumn,
                    ...column
                ]}
                row={basicRow}
                //@ts-ignore
                setSelectList={setSelectList}
                selectList={selectList}
                setRow={(row) => {
                    setBasicRow(row)
                }}
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
}

export const getServerSideProps = (ctx: NextPageContext) => {
    return {
        props: {
            page: ctx.query.page ?? 1,
            keyword: ctx.query.keyword ?? "",
            option: ctx.query.opt ?? 0,
        }
    }
}

export { MesOutsourcingImportList };
