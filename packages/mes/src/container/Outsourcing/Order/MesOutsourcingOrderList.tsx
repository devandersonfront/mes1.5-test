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
import {getTableSortingOptions} from 'shared/src/common/Util'
import {useRouter} from "next/router";
import {TransferCodeToValue} from "shared/src/common/TransferFunction";
import {TableSortingOptionType} from "shared/src/@types/type";
import moment from "moment";
import {setModifyInitData} from "shared/src/reducer/modifyInfo";

const optionList = ["고유번호", "CODE", "품명", "발주자 이름"]

const MesOutsourcingOrderList = () => {
    const dispatch = useDispatch()
    const router = useRouter()
    const [basicRow, setBasicRow] = useState<any[]>([{}])
    const [pageInfo, setPageInfo] = useState<{ page: number, total: number }>({page: 1, total: 1})
    const [keyword, setKeyword] = useState<string>()
    const [optionIndex, setOptionIndex] = useState<number>(0);
    const [selectList, setSelectList] = useState<Set<number>>(new Set())
    const [sortingOptions, setSortingOptions] = useState<TableSortingOptionType>({orders: [], sorts: []})
    const [selectDate, setSelectDate] = useState<{ from: string, to: string }>({
        from: moment().subtract(1, 'month').format('YYYY-MM-DD'),
        to: moment().format('YYYY-MM-DD')
    })
    const buttonEvent = async(buttonIndex: number) => {
        switch (buttonIndex) {
            // case 0:
            //     if (selectList.size === 0 || selectList.size > 1) {
            //         Notiflix.Report.warning("경고", selectList.size > 1 ? "발주 수정은 한 개씩만 가능합니다." : "데이터를 선택해주세요.", "확인", () => {
            //         })
            //     } else {
            //         dispatch(setModifyInitData({
            //             modifyInfo: basicRow.map(v => {
            //                 if (selectList.has(v.id)) {
            //                     return v
            //                 }
            //             }).filter(v => v),
            //             type: 'workModify'
            //         }))
            //         setModifyModalOpen(true);
            //     }
            //     break
            case 0:
                const deleteDatas = basicRow.map((row) =>{
                    if(selectList.has(row.id)){
                        row.worker = row.worker_object
                        delete row.worker_object
                        return row
                    }
                }).filter(v =>v)


                await RequestMethod("delete","outsourcingExportDelete", deleteDatas)
                    .then((res) => {
                        Notiflix.Report.success("메세지", "삭제되었습니다.", "확인", () => {console.log("ddodo")})
                    })
                    .catch((err) => {
                        console.log(err)
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
        const res = await RequestMethod("get", keyword ? 'outsourcingExportSearch' : 'outsourcingExportList', {
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


    const loadAllSelectItems = async (column: IExcelHeaderType[], date?: { from: string, to: string }) => {
        const changeOrder = (sort: string, order: string) => {
            const _sortingOptions = getTableSortingOptions(sort, order, sortingOptions)
            setSortingOptions(_sortingOptions)
            reload(null, date, _sortingOptions)
        }
        let tmpColumn = column.map((v: any) => {
            const sortIndex = sortingOptions.sorts.findIndex(value => value === v.key)
            return {
                ...v,
                pk: v.unit_id,
                sortOption: sortIndex !== -1 ? sortingOptions.orders[sortIndex] : v.sortOption ?? null,
                sorts: v.sorts ? sortingOptions : null,
                result: v.sortOption ? changeOrder : null,
            }
        });

        // setColumn(tmpColumn);
    }

    const cleanUpData = (res: any, date?: { from: string, to: string }) => {
        let tmpColumn = columnlist["outsourcingOrderList"];
        let tmpRow = [];
        tmpColumn = tmpColumn
            .map((column: any) => {
                let menuData: object | undefined;
                res.menus &&
                res.menus.map((menu: any) => {
                    if (menu.colName === column.key) {
                        menuData = {
                            id: menu.id,
                            name: menu.title,
                            width: menu.width,
                            tab: menu.tab,
                            unit: menu.unit,
                        };
                    } else if (menu.colName === "id" && column.key === "tmpId") {
                        menuData = {
                            id: menu.id,
                            name: menu.title,
                            width: menu.width,
                            tab: menu.tab,
                            unit: menu.unit,
                        };
                    }
                });

                if (menuData) {
                    return {
                        ...column,
                        ...menuData,
                    };
                }
            })
            .filter((v: any) => v);
        let additionalMenus = res.menus
            ? res.menus
                .map((menu: any) => {
                    if (menu.colName === null) {
                        return {
                            id: menu.id,
                            name: menu.title,
                            width: menu.width,
                            key: menu.title,
                            editor: TextEditor,
                            type: "additional",
                            unit: menu.unit,
                        };
                    }
                })
                .filter((v: any) => v)
            : [];

        tmpRow = res.info_list;

        loadAllSelectItems([...tmpColumn, ...additionalMenus], date);

        let selectKey = "";
        let additionalData: any[] = [];
        tmpColumn.map((v: any) => {
            if (v.selectList) {
                selectKey = v.key;
            }
        });

        additionalMenus.map((v: any) => {
            if (v.type === "additional") {
                additionalData.push(v.key);
            }
        });

        let pk = "";
        Object.keys(tmpRow).map((v) => {
            if (v.indexOf("_id") !== -1) {
                pk = v;
            }
        });

        let tmpBasicRow = tmpRow.map((row: any, index: number) => {
            let appendAdditional: any = {};

            row.additional &&
            row.additional.map((v: any) => {
                appendAdditional = {
                    ...appendAdditional,
                    [v.title]: v.value,
                };
            });
            return {
                ...row,
                ...appendAdditional,
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
        // setSelectList(new Set());
        setBasicRow([...tmpBasicRow]);
    };

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
                title={"외주 발주 리스트"}
                isSearch
                searchOptionList={optionList}
                optionIndex={optionIndex}
                buttons={
                    ['삭제']
                }
                buttonsOnclick={buttonEvent}
            />
            <ExcelTable
                editable
                resizable
                headerList={[
                    SelectColumn,
                    ...columnlist.outsourcingOrderList
                ]}
                row={basicRow}
                setRow={(row) => {
                    setBasicRow(row)
                }}
                selectList={selectList}
                //@ts-ignore
                setSelectList={setSelectList}
                width={1576}
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
