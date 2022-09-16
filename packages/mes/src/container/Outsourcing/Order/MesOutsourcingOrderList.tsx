import React, { useEffect, useState } from 'react'
import {
    columnlist,
    ExcelTable,
    Header as PageHeader,
    IExcelHeaderType,
    PaginationComponent,
    RequestMethod, TextEditor,
} from 'shared'
// @ts-ignore
import { SelectColumn } from 'react-data-grid'
import Notiflix from "notiflix";
import { deleteMenuSelectState, setMenuSelectState } from "shared/src/reducer/menuSelectState";
import { useDispatch,  } from "react-redux";
import { getTableSortingOptions, setExcelTableHeight } from 'shared/src/common/Util'
import {useRouter} from "next/router";
import {TransferCodeToValue} from "shared/src/common/TransferFunction";
import {TableSortingOptionType} from "shared/src/@types/type";
import moment from "moment";
import {setModifyInitData} from "shared/src/reducer/modifyInfo";
import { titles } from 'shared/src/common/menuTitles'

const optionList = ["고유번호", "CODE", "품명", "발주자 이름"]

const MesOutsourcingOrderList = () => {
    const dispatch = useDispatch()
    const router = useRouter()
    const [basicRow, setBasicRow] = useState<any[]>([])
    const [pageInfo, setPageInfo] = useState<{ page: number, total: number }>({page: 1, total: 1})
    const [keyword, setKeyword] = useState<string>()
    const [optionIndex, setOptionIndex] = useState<number>(0);
    const [selectList, setSelectList] = useState<Set<number>>(new Set())
    const [column, setColumn] = useState<Array<IExcelHeaderType>>( columnlist["outsourcingOrderList"])
    const [sortingOptions, setSortingOptions] = useState<TableSortingOptionType>({orders: [], sorts: []})
    const [selectDate, setSelectDate] = useState<{ from: string, to: string }>({
        from: moment().subtract(1, 'month').format('YYYY-MM-DD'),
        to: moment().format('YYYY-MM-DD')
    })
    const [modifyModalOpen, setModifyModalOpen] = useState<boolean>(false)

    useEffect(() => {
        dispatch(
          setMenuSelectState({main: "외주 관리", sub: router.pathname})
        )
        return () => {
            dispatch(deleteMenuSelectState())
        }
    }, [])

    useEffect(() => {
        getData(pageInfo.page, keyword)
    }, [pageInfo.page]);

    const buttonEvent = (buttonIndex: number) => {
        switch (buttonIndex) {
            case 0:
                if (selectList.size === 0 || selectList.size > 1) {
                    Notiflix.Report.warning("경고", selectList.size > 1 ? "발주 수정은 한 개씩만 가능합니다." : "데이터를 선택해주세요.", "확인", () => {
                    })
                } else {
                    dispatch(setModifyInitData({
                        modifyInfo: basicRow.map(v => {
                            if (selectList.has(v.id)) {
                                return v
                            }
                        }).filter(v => v),
                        type: 'workModify'
                    }))
                    setModifyModalOpen(true);
                }
                break
            case 1:
                const deleteDatas = basicRow.map((row) =>{
                    if(selectList.has(row.id)){
                        row.worker = row.worker_object
                        return row
                    }
                }).filter(v =>v)
                RequestMethod("delete","outsourcingOrderDelete",deleteDatas)
                    .then((res) => {
                        Notiflix.Report.success( "삭제되었습니다.", "","확인", () => reload())
                    })
                break
            default:
                break
        }
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

    const getData = async (page: number = 1, keyword?: string, date?: { from: string, to: string }, _sortingOptions?: TableSortingOptionType) => {
        Notiflix.Loading.circle();
        const res = await RequestMethod("get", keyword ? 'outsourcingOrderSearch' : 'outsourcingOrderList', {
            path: {
                page: page,
                renderItem: 18,
            },
            params: getRequestParams(keyword, date, _sortingOptions)
        });
        if (res) {
            if (res.totalPages > 0 && res.totalPages < res.page) {
                reload();
            } else {
                setPageInfo({
                    page: res.page,
                    total: res.totalPages
                })
                cleanUpData(res, date)
            }
        }
        Notiflix.Loading.remove()
    };

    const setNewColumn = (menus:any[], date?: { from: string, to: string }) => {
        const changeOrder = (sort: string, order: string) => {
            const _sortingOptions = getTableSortingOptions(sort, order, sortingOptions)
            setSortingOptions(_sortingOptions)
            reload(null, date, _sortingOptions)
        }
        const menuMap = menus?.reduce((map, menu) => {
            if(false === menu.hide){
                if(menu.colName){
                    map.set(menu.colName, menu)
                }
            }
            return map
        }, new Map())
        let newCols =column.filter(col => menuMap.has(col.key)).map(col => {
            const menu = menuMap.get(col.key)
            const sortIndex = sortingOptions.sorts.findIndex(sort => sort ===col.key)
            return {
                ...col,
                id: menu.mi_id,
                name: !menu.moddable ? `${menu.title}(필수)`: menu.title,
                // width: menu.width,
                tab:menu.tab,
                unit:menu.unit,
                moddable: !menu.moddable,
                version: menu.version,
                sequence: menu.sequence,
                hide: menu.hide,
                sortOption: sortIndex !== -1 ? sortingOptions.orders[sortIndex] : col.sortOption ?? null,
                sorts: col.sorts ? sortingOptions : null,
                result: col.sortOption ? changeOrder : null,

            }
        })
        setColumn(newCols)
    }

    const cleanUpData = (res: any, date?: { from: string, to: string }) => {
        res.menus?.length && setNewColumn(res.menus, date)
        const newRows = res.info_list.map((row: any) => {
            return {
                ...row,
                code: row.product.code,
                customer_id: row.product.customer?.name,
                cm_id: row.product.model?.model,
                modelArray: row.model,
                process_id: row.product.process?.name,
                product_id: row.product.code,
                name: row.product.name,
                worker_object: row.worker,
                worker: row.worker.name,
                type: TransferCodeToValue(row.product.type, "product"),
                unit: row.product.unit,
                processArray: row.process,
                shipment_id: row.shipment_amount,
                id: row.ose_id,
                // reload
            };
        });
        setBasicRow(newRows);
    };

    return (
        <div>
            <PageHeader
                isCalendar
                calendarType={'period'}
                selectDate={selectDate}
                searchKeyword={keyword}
                onSearch={reload}
                onChangeSearchOption={setOptionIndex}
                // //@ts-ignore
                setSelectDate={onSelectDate}
                title={titles._outsourcingOrderList}
                isSearch
                searchOptionList={optionList}
                optionIndex={optionIndex}
                buttons={
                    [/*'수정하기'*/, '삭제']
                }
                buttonsOnclick={buttonEvent}
            />
            <ExcelTable
                editable
                resizable
                headerList={[
                    SelectColumn, ...column
                ]}
                row={basicRow}
                setRow={(row) => {
                    setBasicRow(row)
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
}
export { MesOutsourcingOrderList };
