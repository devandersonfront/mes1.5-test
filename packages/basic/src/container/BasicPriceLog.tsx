import React, { useEffect, useState } from "react";
import {
    columnlist,
    excelDownload,
    ExcelDownloadModal,
    ExcelTable,
    Header as PageHeader,
    IExcelHeaderType,
    MAX_VALUE,
    PaginationComponent,
    RequestMethod,
    TextEditor, UnitContainer,
} from "shared";
// @ts-ignore
import { SelectColumn } from "react-data-grid";
import Notiflix from "notiflix";
import { useRouter } from "next/router";
import { NextPageContext } from "next";
import { useDispatch } from "react-redux";
import {
    deleteMenuSelectState,
    setMenuSelectState,
} from "shared/src/reducer/menuSelectState";
import {getTableSortingOptions, loadAllSelectItems, setExcelTableHeight} from "shared/src/common/Util";
import {TableSortingOptionType} from "shared/src/@types/type";
import addColumnClass from '../../../main/common/unprintableKey'
import {SearchModalTest} from "shared/src/components/Modal/SearchModalTest";

export interface IProps {
    children?: any;
    page?: number;
    keyword?: string;
    option?: number;
}

const BasicPriceLog = ({}: IProps) => {
    const router = useRouter()
    const [basicRow, setBasicRow] = useState<Array<any>>([]);
    const [column, setColumn] = useState<Array<IExcelHeaderType>>(columnlist["priceLog"]);
    const [pageInfo, setPageInfo] = useState<{ page: number; total: number }>({
        page: 1,
        total: 1,
    });

    const [sortingOptions, setSortingOptions] = useState<TableSortingOptionType>({orders:[], sorts:[]})

    useEffect(() => {
        getData()
    }, [pageInfo.page]);

    const getRequestParams = (_sortingOptions?: TableSortingOptionType) => {
        let params = {}
        //이 부분 해제하면됨
        if(sortingOptions.orders.length > 0){
            params['orders'] = _sortingOptions ? _sortingOptions.orders : sortingOptions.orders
            params['sorts'] = _sortingOptions ? _sortingOptions.sorts : sortingOptions.sorts
        }
        // params['safety_status'] = !!safety_status
        return params
    }

    const getData = async () => {
        Notiflix.Loading.circle();
        const res = await RequestMethod("get", 'serialPrice', {
            path: {
                page: 1,
                renderItem: 18,
            },
            params: {
                rmId:router.query?.rmId,
                orders:sortingOptions.orders,
                sorts:sortingOptions.sorts,
            }
        });

        if(res){
            cleanUpData(res)
        }
        Notiflix.Loading.remove()
    };


    const cleanUpData = (res: any) => {
        let tmpColumn = columnlist["priceLog"];
        let tmpRow = [];

        loadAllSelectItems({column, sortingOptions, setSortingOptions,  setColumn});
        tmpRow = res.info_list;

        let selectKey = "";
        tmpColumn.map((v: any) => {
            if (v.selectList) {
                selectKey = v.key;
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
                    [v.mi_id]: v.value,
                };
            });

            let random_id = Math.random() * 1000;
            return {
                ...row.rawMaterial,
                // ...appendAdditional,
                id: `mold_${random_id}`,
                readonly:true,
                price:row.price,
                log:row.date,

            };
        });
        setPageInfo({page:res.page, total:res.totalPages})
        setBasicRow([...tmpBasicRow]);
    };

    // const loadAllSelectItems = async (column: IExcelHeaderType[]) => {
    //     const changeOrder = (sort:string, order:string) => {
    //         const _sortingOptions = getTableSortingOptions(sort, order, sortingOptions)
    //         setSortingOptions(_sortingOptions)
    //         getData()
    //     }
    //     let tmpColumn = column.map((v: any) => {
    //         const sortIndex = sortingOptions.sorts.findIndex(value => value === v.key)
    //         return {
    //             ...v,
    //             pk: v.unit_id,
    //             sortOption: sortIndex !== -1 ? sortingOptions.orders[sortIndex] : v.sortOption ?? null,
    //             sorts: v.sorts ? sortingOptions : null,
    //             result: v.sortOption ? changeOrder : null,
    //         }
    //     });
    //     Promise.all(tmpColumn).then((res) => {
    //         setColumn([
    //             ...res.map((v,index) => {
    //                 return {
    //                     ...v,
    //                     name: v.moddable ? v.name + "(필수)" : v.name,
    //                     // readonly:readonly ?? false,
    //                     formatter: v.formatter === SearchModalTest ? undefined : v.formatter,
    //                     // fixed: readonly ?? false
    //                 };
    //             }),
    //         ]);
    //     });
    // };

    return (
        <div className={'excelPageContainer'}>
            <PageHeader
                title={"원자재 단가 변경 이력 조회"}
            />
            <ExcelTable
                resizable
                headerList={column}
                row={basicRow}
                width={1576}
                height={setExcelTableHeight(basicRow.length)}
            />
            <PaginationComponent
                currentPage={pageInfo.page}
                totalPage={pageInfo.total}
                setPage={(page) => {
                    setPageInfo({...pageInfo,page:page})
                }}
            />
            {/*<ExcelDownloadModal*/}
            {/*    isOpen={excelOpen}*/}
            {/*    resetFunction={() => reload()}*/}
            {/*    category={"mold"}*/}
            {/*    title={"금형 기준정보"}*/}
            {/*    setIsOpen={setExcelOpen}*/}
            {/*/>*/}
        </div>
    );
};


export { BasicPriceLog };
