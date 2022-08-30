import React, { useEffect, useState } from "react";
import {
    columnlist,
    ExcelTable, FinishButton,
    Header as PageHeader,
    IExcelHeaderType,
    MAX_VALUE, PaginationComponent,
    RequestMethod,
    TextEditor,
} from "shared";
// @ts-ignore
import { SelectColumn } from "react-data-grid";
import Notiflix from "notiflix";
import { useRouter } from "next/router";
import { NextPageContext } from "next";
import moment from "moment";
import { TransferCodeToValue } from "shared/src/common/TransferFunction";
import { WorkModifyModal } from "../../../../shared/src/components/Modal/WorkModifyModal";
import {
    deleteMenuSelectState,
    setMenuSelectState,
} from "shared/src/reducer/menuSelectState";
import { useDispatch } from "react-redux";
import { getTableSortingOptions, setExcelTableHeight } from 'shared/src/common/Util'
import { TableSortingOptionType } from 'shared/src/@types/type'
import addColumnClass from '../../../../main/common/unprintableKey'

interface IProps {
    children?: any;
    page?: number;
    search?: string;
    option?: number;
}

const MesRecordList = ({}: IProps) => {
    const router = useRouter()
    const dispatch = useDispatch()
    const [excelOpen, setExcelOpen] = useState<boolean>(false)
    const [recordState, setRecordState] = useState<number>(0)
    const [basicRow, setBasicRow] = useState<Array<any>>([])
    const [column, setColumn] = useState<Array<IExcelHeaderType>>( columnlist["cncRecordListV2"])
    const [selectList, setSelectList] = useState<Set<number>>(new Set())
    const [optionList, setOptionList] = useState<string[]>(['수주번호', '지시 고유 번호', 'CODE', '품명', 'LOT 번호', '작업자'])
    const [optionIndex, setOptionIndex] = useState<number>(0)
    const [selectDate, setSelectDate] = useState<{from:string, to:string}>({
        from: moment().subtract(1,'month').format('YYYY-MM-DD'),
        to: moment().format('YYYY-MM-DD')
    });

    const [keyword, setKeyword] = useState<string>("");
    const [pageInfo, setPageInfo] = useState<{ page: number; total: number }>({
        page: 1,
        total: 1,
    });
    const [sortingOptions, setSortingOptions] = useState<{orders:string[], sorts:string[]}>({orders:[], sorts:[]})

    const onSelectDate = (date: {from:string, to:string}) => {
        setSelectDate(date)
        reload(null, date)
    }

    const onRadioChange = (btnIdx:number) => {
        setRecordState(btnIdx)
        reload(null, null, null, btnIdx)
    }

    const reload = (keyword?:string, date?:{from:string, to:string}, sortingOptions?: TableSortingOptionType, radioIdx?: number) => {
        setKeyword(keyword)
        if(pageInfo.page > 1) {
            setPageInfo({...pageInfo, page: 1})
        } else {
            getData(undefined, keyword, date, sortingOptions, radioIdx)
        }
    }

    useEffect(() => {
        getData(pageInfo.page, keyword)
    }, [pageInfo.page]);

    useEffect(() => {
        dispatch(
            setMenuSelectState({ main: "생산관리 등록", sub: router.pathname })
        );
        return () => {
            dispatch(deleteMenuSelectState());
        };
    }, []);

    const loadAllSelectItems = (column: IExcelHeaderType[], date?: {from:string, to:string}, radioIdx?:number) => {
        const changeOrder = (sort:string, order:string) => {
            const _sortingOptions = getTableSortingOptions(sort, order, sortingOptions)
            setSortingOptions(_sortingOptions)
            reload(null, date, _sortingOptions, radioIdx)
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

        setColumn(tmpColumn);
    }

    const getRequestParams = (keyword?: string, date?: {from:string, to:string},  _sortingOptions?: TableSortingOptionType, radioIdx?: number) => {
        let params = {}
        if(keyword) {
            params['keyword'] = keyword
            params['opt'] = optionIndex
        }
        params['from'] = date ? date.from: selectDate.from
        params['to'] = date ? date.to : selectDate.to
        params['order'] = _sortingOptions ? _sortingOptions.orders : sortingOptions.orders
        params['sorts'] = _sortingOptions ? _sortingOptions.sorts : sortingOptions.sorts
        params['fin'] = !isNaN(radioIdx) ? !radioIdx : !recordState
        params['rangeNeeded'] = true
        return params
    }

    const getData = async (page: number = 1, keyword?: string, date?: {from:string, to:string}, _sortingOptions?: TableSortingOptionType, radioIdx?:number) => {
        Notiflix.Loading.circle();
        const res = await RequestMethod("get", keyword ? 'cncRecordSearch' : 'cncRecordList', {
            path: {
                page: page,
                renderItem: 18,
            },
            params: getRequestParams(keyword, date, _sortingOptions,radioIdx)
        });
        if(res){
            if (res.totalPages > 0 && res.totalPages < res.page) {
                reload();
            } else {
                setPageInfo({
                    page: res.page,
                    total: res.totalPages
                })
                convertColumn(res, date, radioIdx)
                cleanUpData(res, date, _sortingOptions, radioIdx);
            }
        }
        Notiflix.Loading.remove()
    };

    const DeleteBasic = async () => {
        let res = await RequestMethod('delete', `cncRecordeDelete`, basicRow.map((row, i) => {
                if(selectList.has(row.id)){
                    let selectKey: string[] = []
                    let additional:any[] = []
                    column.map((v) => {
                        if (v.selectList) {
                            selectKey.push(v.key);
                        }

                        if (v.type === "additional") {
                            additional.push(v);
                        }
                    });

                    let selectData: any = {};

                    Object.keys(row).map((v) => {
                        if (v.indexOf("PK") !== -1) {
                            selectData = {
                                ...selectData,
                                [v.split("PK")[0]]: row[v],
                            };
                        }

                        if (v === "unitWeight") {
                            selectData = {
                                ...selectData,
                                unitWeight: Number(row["unitWeight"]),
                            };
                        }

                        if (v === "tmpId") {
                            selectData = {
                                ...selectData,
                                id: row["tmpId"],
                            };
                        }
                    });
                    return {
                        ...row,
                        ...selectData,
                        worker: row.user,
                        additional: [
                            ...additional
                                .map((v) => {
                                    if (row[v.name]) {
                                        return {
                                            id: v.id,
                                            title: v.name,
                                            value: row[v.name],
                                            unit: v.unit,
                                        };
                                    }
                                })
                                .filter((v) => v),
                        ],
                    };
                }
            })
                .filter((v) => v)
        );

        if (res) {
            Notiflix.Report.success("삭제 성공!", "", "확인", () => reload())
        }
    };


    const convertColumn = (res, date?: {from:string, to:string}, radioIdx?:number) => {
        let tmpColumn = columnlist["cncRecordListV2"];
        const convertColumn = tmpColumn.map((column: any) => {
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


        loadAllSelectItems([...convertColumn, ...additionalMenus], date, radioIdx);
    }

    const cleanUpData = (res: any, date?: {from:string, to:string}, _sortingOptions?: TableSortingOptionType, radioIdx?:number) => {
        const _reload = () => reload(null, date, _sortingOptions, radioIdx)

        let tmpBasicRow = res.info_list.map((row: any, index: number) => {
            let appendAdditional: any = {};

            row.additional &&
            row.additional.map((v: any) => {
                appendAdditional = {
                    ...appendAdditional,
                    [v.title]: v.value,
                };
            });

            let random_id = Math.random() * 1000;

            return {
                ...row,
                ...appendAdditional,
                product: row.operation_sheet?.product ?? null,
                goal: row.operation_sheet?.goal ?? "-",
                contract_id: row.operation_sheet?.contract?.identification ?? "-",
                input_bom: row.operation_sheet?.input_bom ?? [],
                identification: row.operation_sheet?.identification ?? "-",
                product_id: row.operation_sheet?.product?.code ?? "-",
                name: row.operation_sheet?.product?.name ?? "-",
                type:
                    row.operation_sheet?.product?.type !== null
                        ? TransferCodeToValue(row.operation_sheet.product.type, "product")
                        : "-",
                unit: row.operation_sheet?.product?.unit,
                process_id: row.operation_sheet?.product?.process?.name ?? "-",
                user: row.worker,
                sic_id: row.inspection_category,
                worker: row.worker.name,
                worker_object: row.worker_object ?? row.worker,
                id: `sheet_${random_id}`,
                reload: _reload
            }
        })
        setBasicRow([...tmpBasicRow]);
        setSelectList(new Set)
    }
    return (
        <div className={'excelPageContainer'}>
            <PageHeader
                isSearch
                isCalendar
                isRadio
                radioTexts={["종료","미완료"]}
                radioValue={recordState}
                onChangeRadioValues={onRadioChange}
                searchOptionList={optionList}
                onChangeSearchOption={(e) => {
                    setOptionIndex(e);
                }}
                searchKeyword={keyword}
                onSearch={reload}
                calendarTitle={"종료일"}
                calendarType={"period"}
                selectDate={selectDate}
                //@ts-ignore
                setSelectDate={onSelectDate}
                //실제사용
                title={"작업 일보 리스트"}
                buttons={["", "수정하기", "삭제"]}
                buttonsOnclick={(e) => {
                    switch (e) {
                        case 1: {
                            if (selectList.size === 1) {
                                setExcelOpen(true);
                            } else if (selectList.size === 0) {
                                Notiflix.Report.warning(
                                    "경고",
                                    "데이터를 선택해 주시기 바랍니다.",
                                    "확인"
                                );
                            } else {
                                Notiflix.Report.warning(
                                    "경고",
                                    "작업일보는 한 개씩만 수정 가능합니다.",
                                    "확인"
                                );
                            }
                            break;
                        }
                        case 2: {
                            if (selectList.size === 0) {
                                return Notiflix.Report.warning(
                                    "경고",
                                    "데이터를 선택해 주시기 바랍니다.",
                                    "확인"
                                );
                            }
                            Notiflix.Confirm.show(
                                "경고",
                                "삭제하시겠습니까?",
                                "확인",
                                "취소",
                                () => DeleteBasic()
                            );
                            break;
                        }
                    }
                }}
            />
            <ExcelTable
                editable
                resizable
                selectable
                headerList={[
                    SelectColumn,
                ...addColumnClass(column)
                ]}
                row={basicRow}
                // setRow={setBasicRow}
                setRow={(e) => {
                    const deleteCheck = e.every(prop => prop.finish === false);
                    if(!deleteCheck) reload()
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
            {excelOpen && (
                <WorkModifyModal
                    row={[
                        ...basicRow
                            .map((v) => {
                                if (selectList.has(v.id)) {
                                    return {
                                        ...v,
                                        worker: v.user,
                                        worker_name: v.user.name,
                                        sum: v.poor_quantity + v.good_quantity,
                                        input_bom: v.operation_sheet.input_bom,
                                    };
                                }
                            })
                            .filter((v) => v),
                    ]}
                    onRowChange={() => reload()}
                    isOpen={excelOpen}
                    setIsOpen={setExcelOpen}
                />
            )}
        </div>
    );
};

export const getServerSideProps = (ctx: NextPageContext) => {
    return {
        props: {
            page: ctx.query.page ?? 1,
            keyword: ctx.query.keyword ?? "",
            option: ctx.query.opt ?? 0,
        },
    };
};

export { MesRecordList };
