import React, { useEffect, useState } from 'react'
import {
    columnlist,
    ExcelDownloadModal,
    ExcelTable,
    Header as PageHeader,
    IExcelHeaderType,
    PaginationComponent,
    RequestMethod, TextEditor,
} from 'shared'
// @ts-ignore
import { SelectColumn } from 'react-data-grid'
import Notiflix from "notiflix";
import { NextPageContext } from 'next'
import { deleteMenuSelectState, setMenuSelectState } from "shared/src/reducer/menuSelectState";
import { useDispatch,  } from "react-redux";
import {getTableSortingOptions, setExcelTableHeight} from 'shared/src/common/Util'
import {useRouter} from "next/router";
import {TransferCodeToValue} from "shared/src/common/TransferFunction";



const MesOutsourcingOrderList = () => {
    const dispatch = useDispatch()
    const router = useRouter()
    const [basicRow, setBasicRow] = useState<any[]>([{}])
    const [column, setColumn] = useState<Array<IExcelHeaderType>>(columnlist.outsourcingOrderList)
    const [pageInfo, setPageInfo] = useState<{page:number, total:number}>({page:1, total:4})
    const [sortingOptions, setSortingOptions] = useState<{orders:string[], sorts:string[]}>({orders:[], sorts:[]})

    const buttonEvent = (buttonIndex:number) => {
        switch (buttonIndex) {
            case 0:
                console.log("수정! : ", basicRow)
                router.push("/mes/outsourcing/order/modify")
                break
            case 1:
                console.log("good : ", )
                break
            default:
                console.log("good : ", )
                break
        }
    }

    const loadAllSelectItems = (column: IExcelHeaderType[], date?: {from:string, to:string}) => {
        const changeOrder = (sort:string, order:string) => {
            const _sortingOptions = getTableSortingOptions(sort, order, sortingOptions)
            setSortingOptions(_sortingOptions)
            // reload(null, date, _sortingOptions)
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
    };

    const cleanUpData = (res: any,date?: {from:string, to:string}) => {
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

        loadAllSelectItems([...tmpColumn, ...additionalMenus],date);

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
            let random_id = Math.random() * 1000;
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
                type: TransferCodeToValue(row.product.type, "product"),
                unit: row.product.unit,
                processArray: row.process,
                shipment_id: row.shipment_amount,
                id: `order_${random_id}`,
                // reload
            };
        });
        // setSelectList(new Set());
        setBasicRow([...tmpBasicRow]);
    };

    useEffect(() => {
        dispatch(
            setMenuSelectState({ main: "외주 관리", sub: router.pathname })
        )
        return () => {
            dispatch(deleteMenuSelectState())
        }
    }, [])

    useEffect(() => {
        RequestMethod("get", "outsourcingExportList", {
            path: {
                page: 1,
                renderItem: 18,
            },
            // params: getRequestParams(keyword, date, _sortingOptions)
        })
            .then((res) => {
                console.log(res.menus)
                cleanUpData(res, )
            })

    },[pageInfo.page])


    return (
        <div>
            <PageHeader
                title={"외주 발주 리스트"}
                isSearch
                searchKeyword={""}
                onSearch={(searchKeyword) => {
                    console.log(searchKeyword)
                }}
                optionIndex={0}
                searchOptionList={["품명", "CODE"]}
                onChangeSearchOption={(optNumber) => {
                    console.log("optNumber : ", optNumber)
                }}
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
                setRow={(row) => {
                    setBasicRow(row)
                }}
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

export const getServerSideProps = (ctx: NextPageContext) => {
    return {
        props: {
            page: ctx.query.page ?? 1,
            keyword: ctx.query.keyword ?? "",
            option: ctx.query.opt ?? 0,
        }
    }
}

export { MesOutsourcingOrderList };
