import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
    columnlist,
    ExcelTable,
    Header as PageHeader,
    IExcelHeaderType, MAX_VALUE,
    PaginationComponent,
    RequestMethod,
    TextEditor
} from "shared";
//@ts-ignore
import { SelectColumn } from "react-data-grid";
import moment from "moment";
import { useRouter } from "next/router";
//@ts-ignore
import Notiflix from "notiflix"
import {useDispatch, useSelector} from "react-redux";
import {setToolDataAdd} from "shared/src/reducer/toolInfo";
import {deleteMenuSelectState, setMenuSelectState} from "shared/src/reducer/menuSelectState";
import { setExcelTableHeight } from 'shared/src/common/Util'
import addColumnClass from '../../../../main/common/unprintableKey'
interface IProps {
    children?: any
    page?: number
    search?: string
    option?: number
}

interface SelectParameter {
    from: string
    to: string
}

const MesToolList = ({ page, search, option }: IProps) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [basicRow, setBasicRow] = useState<Array<any>>([]);
    const [column, setColumn] = useState<any>(columnlist.toolList)
    const [selectList, setSelectList] = useState<Set<number>>(new Set())
    const [selectDate, setSelectDate] = useState<SelectParameter>({ from: moment().subtract(1, "month").format("YYYY-MM-DD"), to: moment().format("YYYY-MM-DD") })
    const [optionIndex, setOptionIndex] = useState<number>(0);
    const [pageInfo, setPageInfo] = useState<{ page: number, total: number }>({ page: 1, total: 1 });
    const [keyword, setKeyword] = useState<string>();

    const reload = (keyword?:string, date?:{from:string, to:string}) => {
        setKeyword(keyword)
        if(pageInfo.page > 1) {
            setPageInfo({...pageInfo, page: 1})
        } else {
            getData(undefined, keyword)
        }
    }

    useEffect(() => {
        getData(pageInfo.page, keyword)
    }, [pageInfo.page]);

    useEffect(() => {
        dispatch(setMenuSelectState({ main: "공구 관리", sub: router.pathname }))
        return (() => {
            dispatch(deleteMenuSelectState())
        })
    }, [])

    const getRequestParams = (keyword?: string) => {
        let params = {}
        if(keyword) {
            params['keyword'] = keyword
            params['opt'] = optionIndex
        }
        return params
    }

    const getData = async (page: number = 1, keyword?: string) => {
        Notiflix.Loading.circle();
        const res = await RequestMethod("get", keyword ? 'toolSearch' : 'toolList', {
            path: {
                page: page,
                renderItem: 18,
            },
            params: getRequestParams(keyword)
        });
        if(res){
            if (res.totalPages > 0 && res.totalPages < res.page) {
                reload();
            } else {
                setPageInfo({
                    page: res.page,
                    total: res.totalPages
                })
                cleanUpData(res)
            }
        }
        Notiflix.Loading.remove()
    }

    const cleanUpData = (info_list: any) => {
        let tmpColumn = columnlist["toolList"];
        let tmpRow: Array<any> = []
        tmpColumn = tmpColumn.map((column: any) => {
            let menuData: object | undefined;
            info_list.menus && info_list.menus.map((menu: any) => {
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
                            hide: menu.hide
                        }
                    } else if (menu.colName === 'id' && column.key === 'tmpId') {
                        menuData = {
                            id: menu.mi_id,
                            name: menu.title,
                            width: menu.width,
                            tab: menu.tab,
                            unit: menu.unit,
                            moddable: !menu.moddable,
                            version: menu.version,
                            sequence: menu.sequence,
                            hide: menu.hide
                        }
                    }
                }
            })

            if (menuData) {
                return {
                    ...column,
                    ...menuData
                }
            }
        }).filter((v: any) => v)

        let additionalMenus = info_list.menus ? info_list.menus.map((menu: any) => {
            if (menu.colName === null && !menu.hide) {
                return {
                    id: menu.mi_id,
                    name: menu.title,
                    width: menu.width,
                    // key: menu.title,
                    key: menu.mi_id,
                    editor: TextEditor,
                    type: 'additional',
                    unit: menu.unit,
                    tab: menu.tab,
                    version: menu.version,
                    colName: menu.mi_id,
                }
            }
        }).filter((v: any) => v) : []

        tmpRow = info_list.info_list

        setColumn([
            ...tmpColumn,
            ...additionalMenus
        ])


        let selectKey = ""
        let additionalData: any[] = []
        tmpColumn.map((v: any) => {
            if (v.selectList) {
                selectKey = v.key
            }
        })

        additionalMenus.map((v: any) => {
            if (v.type === 'additional') {
                additionalData.push(v.key)
            }
        })

        let tmpBasicRow = tmpRow.map((row: any, index: number) => {
            let appendAdditional: any = {}
            row.additional && row.additional.map((v: any) => {
                appendAdditional = {
                    ...appendAdditional,
                    [v.mi_id]: v.value
                }
            })

            let random_id = Math.random() * 1000;
            return {
                ...row,
                ...appendAdditional,
                id: `tool_${random_id}`,
                tool_id: row?.tool_id,
                elapsed: row?.elapsed === 0 ? "0" : row?.elapsed,
                name: row?.name,
                unit: row?.unit,
                customer_id: row?.customer?.name,
            }
        })
        setSelectList(new Set)
        setBasicRow(tmpBasicRow)
    }

    const DeleteBasic = async () => {
        const res = await RequestMethod("delete", "lotToolDelete", basicRow.filter((row) => selectList.has(row.id)))

        if (res) {
            Notiflix.Report.success("삭제되었습니다.", "", "확인", () => reload())
        }
    }

    return (
        <div className={'excelPageContainer noCheckBox'}>
            <PageHeader
                title={"공구 재고 현황"}
                dataLimit
                isSearch
                searchKeyword={keyword}
                onSearch={reload}
                searchOptionList={["공구 CODE", "공구 품명", "거래처"]}
                onChangeSearchOption={setOptionIndex}
                optionIndex={optionIndex}
            />
            <ExcelTable
                resizable
                headerList={addColumnClass(column)}
                row={basicRow}
                setRow={(e) => {
                    let tmp: Set<any> = selectList
                    e.map(v => {
                        if (v.isChange) tmp.add(v.id)
                    })
                    setSelectList(tmp)
                    setBasicRow(e);
                }}
                height={setExcelTableHeight(basicRow.length)}
                width={1576}
                    //@ts-ignore
                setSelectList={setSelectList}
            />
            <PaginationComponent
                currentPage={pageInfo.page}
                totalPage={pageInfo.total}
                setPage={(page) => {
                    setPageInfo({...pageInfo, page: page})
                }}
            />
        </div>
    )
}

export { MesToolList };
