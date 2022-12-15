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

    const [basicRow, setBasicRow] = useState<Array<any>>([]);
    const [column, setColumn] = useState<Array<IExcelHeaderType>>(columnlist["priceLog"]);
    const [selectList, setSelectList] = useState<Set<number>>(new Set());

    useEffect(() => {
        setColumn((col) => col.splice(0, 9))
        getData()
    }, []);

    const getData = async () => {
        Notiflix.Loading.circle();
        const res = await RequestMethod("get", '', {
            path: {
                page: 1,
                // renderItem: 18,
            },
            // params: getRequestParams(keyword, _sortingOptions)
        });

        if(res){
            cleanUpData(res)
        }
        setSelectList(new Set())
        Notiflix.Loading.remove()
    };

    const setAdditionalData = () => {
        const addtional = [];
        basicRow.map((row) => {
            if (selectList.has(row.id)) {
                column.map((v) => {
                    if (v.type === "additional") {
                        addtional.push(v);
                    }
                });
            }
        });

        return addtional;
    };

    const convertDataToMap = () => {
        const map = new Map();
        basicRow.map((v) => map.set(v.id, v));
        return map;
    };

    const filterSelectedRows = () => {
        return basicRow
            .map((row) => selectList.has(row.id) && row)
            .filter((v) => v);
    };

    const classfyNormalAndHave = (selectedRows) => {
        const haveIdRows = [];

        selectedRows.map((row: any) => {
            if (row.mold_id) {
                haveIdRows.push(row);
            }
        });

        return haveIdRows;
    };

    const DeleteBasic = async () => {
        const map = convertDataToMap();
        const selectedRows = filterSelectedRows();
        const haveIdRows = classfyNormalAndHave(selectedRows);
        const additional = setAdditionalData();
        let deletable = true;


        if(haveIdRows.length > 0){

            deletable = await RequestMethod('delete','moldDelete', haveIdRows.map((row) => (
                {...row , additional : [...additional.map(v => {
                        if(row[v.name]) {
                            return {id : v.id, title: v.name, value: row[v.name] , unit: v.unit}
                        }
                    }).filter(v => v)
                    ]}
            )))
            getData()
        }else{
            selectedRows.forEach((row)=>{map.delete(row.id)})
            setBasicRow(Array.from(map.values()))
            setSelectList(new Set())
        }

        if (deletable) {
            Notiflix.Report.success("삭제되었습니다.", "", "확인");
        }
        setSelectList(new Set());
    };

    const cleanUpData = (res: any) => {
        console.log("?????")
        let tmpColumn = columnlist["rawMaterial"];
        let tmpRow = [];
        // tmpColumn = tmpColumn
        //     .map((column: any) => {
        //         let menuData: object | undefined;
        //         res.menus &&
        //         res.menus.map((menu: any) => {
        //             if (!menu.hide) {
        //                 if (menu.colName === column.key) {
        //                     menuData = {
        //                         id: menu.mi_id,
        //                         name: menu.title,
        //                         width: menu.width,
        //                         tab: menu.tab,
        //                         unit: menu.unit,
        //                         moddable: !menu.moddable,
        //                         version: menu.version,
        //                         sequence: menu.sequence,
        //                         hide: menu.hide,
        //                     };
        //                 } else if (menu.colName === "id" && column.key === "tmpId") {
        //                     menuData = {
        //                         id: menu.mi_id,
        //                         name: menu.title,
        //                         width: menu.width,
        //                         tab: menu.tab,
        //                         unit: menu.unit,
        //                         moddable: !menu.moddable,
        //                         version: menu.version,
        //                         sequence: menu.sequence,
        //                         hide: menu.hide,
        //                     };
        //                 }
        //             }
        //         });
        //
        //         if (menuData) {
        //             return {
        //                 ...column,
        //                 ...menuData,
        //             };
        //         }
        //     })
        //     .filter((v: any) => v);

        let additionalMenus = res.menus
            ? res.menus
                .map((menu: any) => {
                    if (menu.colName === null && !menu.hide) {
                        return {
                            id: menu.mi_id,
                            name: menu.title,
                            width: menu.width,
                            // key: menu.title,
                            key: menu.mi_id,
                            editor: TextEditor,
                            type: "additional",
                            unit: menu.unit,
                            tab: menu.tab,
                            version: menu.version,
                            colName: menu.mi_id,
                        };
                    }
                })
                .filter((v: any) => v)
            : [];

        tmpRow = res.info_list;

        setColumn(tmpColumn.filter((col, index) => {
            if(index >= 8) return col
        }))
        // loadAllSelectItems([...tmpColumn, ...additionalMenus]);

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
                    [v.mi_id]: v.value,
                };
            });

            let random_id = Math.random() * 1000;
            return {
                ...row,
                ...appendAdditional,
                id: `mold_${random_id}`,
                readonly:true
            };
        });

        setBasicRow([...tmpBasicRow]);
    };

    const downloadExcel = () => {
        let tmpSelectList: boolean[] = [];
        basicRow.map((row) => {
            tmpSelectList.push(selectList.has(row.id));
        });
        excelDownload(column, basicRow, `mold`, "mold", tmpSelectList);
    };



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
            {/*<PaginationComponent*/}
            {/*    currentPage={pageInfo.page}*/}
            {/*    totalPage={pageInfo.total}*/}
            {/*    setPage={(page) => {*/}
            {/*        setPageInfo({...pageInfo,page:page})*/}
            {/*    }}*/}
            {/*/>*/}
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

export const getServerSideProps = (ctx: NextPageContext) => {
    return {
        props: {
            page: ctx.query.page ?? 1,
            keyword: ctx.query.keyword ?? "",
            option: ctx.query.opt ?? 0,
        },
    };
};

export { BasicPriceLog };
