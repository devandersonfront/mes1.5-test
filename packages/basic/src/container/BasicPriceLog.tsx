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
import {getTableSortingOptions, setExcelTableHeight} from "shared/src/common/Util";
import {TableSortingOptionType} from "shared/src/@types/type";
import addColumnClass from '../../../main/common/unprintableKey'

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

    useEffect(() => {
        getData()
    }, [pageInfo.page]);

    const getData = async () => {
        Notiflix.Loading.circle();
        const res = await RequestMethod("get", 'serialPrice', {
            path: {
                page: 1,
                renderItem: 18,
            },
            params: {
                rmId:router.query?.rmId
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
        tmpColumn = tmpColumn
            .map((column: any) => {
                let menuData: object | undefined;
                res.menus &&
                res.menus.map((menu: any) => {
                    if (!menu.hide) {
                        if (menu.colName === column.key) {
                            menuData = {
                                id: menu.mi_id,
                                name: menu.title,
                                width: menu.width,
                                tab: menu.tab,
                                unit: menu.unit,
                                moddable: !menu.moddable,
                                version: menu.version,
                                sequence: menu.sequence,
                                hide: menu.hide,
                            };
                        } else if (menu.colName === "id" && column.key === "tmpId") {
                            menuData = {
                                id: menu.mi_id,
                                name: menu.title,
                                width: menu.width,
                                tab: menu.tab,
                                unit: menu.unit,
                                moddable: !menu.moddable,
                                version: menu.version,
                                sequence: menu.sequence,
                                hide: menu.hide,
                            };
                        }
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

    return (
        <div className={'excelPageContainer'}>
            <PageHeader
                title={"원자재 단가 변경 이력 조회"}
            />
            <ExcelTable
                resizable
                headerList={columnlist["priceLog"]}
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
