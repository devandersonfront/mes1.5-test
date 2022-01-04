import React, {useEffect, useState} from "react";
import {
    ExcelTable,
    Header as PageHeader,
    IExcelHeaderType, MAX_VALUE,
    PaginationComponent,
    RequestMethod,
    TextEditor
} from "shared";
//@ts-ignore
import {SelectColumn} from "react-data-grid";
import {columnlist} from "shared";
import {NextPageContext} from "next";
import {useRouter} from "next/router";

export interface IProps {
    children?: any
    page?: number
    keyword?: string
    option?: number
}


const BasicTool = ({page, keyword, option}: IProps) => {
    const router = useRouter();
    const [column, setColumn] = useState<any>(columnlist.toolRegister)
    const [basicRow, setBasicRow] = useState<Array<any>>([
        {
         code:"CODE",
         com:0
        }]);

    const [pageInfo, setPageInfo] = useState<{page:number, total:number}>({page:0, total:0});
    // const [keyword, setKeyword] = useState<string>("");
    const [optionIndex, setOptionIndex] = useState<number>(0);

    const cleanUpData = (info_list:any) => {
        let tmpColumn = columnlist["toolRegister"];
        let tmpRow = []
        tmpColumn = tmpColumn.map((column: any) => {
            let menuData: object | undefined;
            info_list.menus && info_list.menus.map((menu: any) => {
                if(!menu.hide){
                    if(menu.colName === column.key){
                        menuData = {
                            id: menu.mi_id,
                            name: menu.title,
                            width: menu.width,
                            tab:menu.tab,
                            unit:menu.unit,
                            moddable: !menu.moddable,
                            version: menu.version,
                            sequence: menu.sequence,
                            hide: menu.hide
                        }
                    } else if(menu.colName === 'id' && column.key === 'tmpId'){
                        menuData = {
                            id: menu.mi_id,
                            name: menu.title,
                            width: menu.width,
                            tab:menu.tab,
                            unit:menu.unit,
                            moddable: !menu.moddable,
                            version: menu.version,
                            sequence: menu.sequence,
                            hide: menu.hide
                        }
                    }
                }
            })

            if(menuData){
                return {
                    ...column,
                    ...menuData
                }
            }
        }).filter((v:any) => v)

        let additionalMenus = info_list.menus ? info_list.menus.map((menu:any) => {
            if(menu.colName === null && !menu.hide){
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


        loadAllSelectItems([
            ...tmpColumn,
            ...additionalMenus
        ])


        let selectKey = ""
        let additionalData: any[] = []
        tmpColumn.map((v: any) => {
            if(v.selectList){
                selectKey = v.key
            }
        })

        additionalMenus.map((v: any) => {
            if(v.type === 'additional'){
                additionalData.push(v.key)
            }
        })

        let pk = "";
        Object.keys(tmpRow).map((v) => {
            if(v.indexOf('_id') !== -1){
                pk = v
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

            let random_id = Math.random()*1000;
            return {
                ...row,
                ...appendAdditional,
                user: row.manager ?? undefined,
                managerPk: row.manager ? row.manager.user_id : '',
                manager: row.manager ? row.manager.name : '',
                appointment: row.manager ? row.manager.appointment : '',
                telephone: row.manager ? row.manager.telephone : '',
                id: `factory_${random_id}`,
            }
        })
        setBasicRow([...tmpBasicRow])
    }

    const loadAllSelectItems = async (column: IExcelHeaderType[]) => {
        let tmpColumn = column.map(async (v: any) => {
            if(v.selectList && v.selectList.length === 0){
                let tmpKey = v.key

                let res: any
                res = await RequestMethod('get', `${tmpKey}List`,{
                    path: {
                        page: 1,
                        renderItem: MAX_VALUE,
                    }
                })


                let pk = "";

                res.results.info_list && res.results.info_list.length && Object.keys(res.results.info_list[0]).map((v) => {
                    if(v.indexOf('_id') !== -1){
                        pk = v
                    }
                })
                return {
                    ...v,
                    selectList: [...res.results.info_list.map((value: any) => {
                        return {
                            ...value,
                            name: tmpKey === 'model' ? value.model : value.name,
                            pk: value[pk]
                        }
                    })]
                }

            }else{
                if(v.selectList){
                    return {
                        ...v,
                        pk: v.unit_id
                    }
                }else{
                    return v
                }
            }
        })

        // if(type !== 'productprocess'){
        Promise.all(tmpColumn).then(res => {
            setColumn([...res])
        })
        // }
    }

    const LoadBasic = async() => {
        const res = await RequestMethod("get", "toolList", {
            path:{
                page:page,
                renderItem:18
            },
            params:{

            }
        })

        if(res){
            setPageInfo({...pageInfo, total:res.totalPages});
            const resultData = cleanUpData(res.info_list);

            // setBasicRow(resultData);
        }
    }

    const SearchBasic = async() => {
        const res = await RequestMethod("get", "toolSearch",{
            path:{
                page:page,
                renderItem:18
            },
            params:{
                opt:optionIndex,
                keyword:keyword,

            }
        })

        if(res){
            setPageInfo({...pageInfo, total:res.totalPages});
            const resultData = cleanUpData(res.info_list);

            // setBasicRow(resultData);
        }
    }

    const buttonsEvent = (index:number) => {
        switch (index){
            case 0:
                alert("항목관리")
                return
            case 1:
                setBasicRow([...basicRow, {}])
                return
            case 2:
                alert("저장하기")

                return
            case 3:
                alert("삭제")

                return
            default:
                break;
        }
    }

    useEffect(() => {
        if(keyword){
            // LoadBasic();
        }else{
            // SearchBasic();
        }
    }, [])

    return (
        <div>
            <PageHeader
                title={"공구 기본정보"}
                isSearch
                onChangeSearchKeyword={(keyword) => {
                    router.push(`/mes/basic/tool?page=1&keyword=${keyword}&opt=${optionIndex}`);
                }}
                searchOptionList={["공구 CODE", "공구 품명", "거래처"]}
                onChangeSearchOption={(option) => {
                    setOptionIndex(option);
                }}
                optionIndex={0}
                buttons={["항목관리","행 추가","저장하기","삭제"]}
                buttonsOnclick={buttonsEvent}
            />
            <ExcelTable
                resizable
                headerList={[SelectColumn, ...column]}
                row={basicRow}
                setRow={(e) => {
                    console.log(e)
                    setBasicRow(e)
                }}
            />
            {/*<PaginationComponent totalPage={pageInfo.total} currentPage={pageInfo.page} setPage={(page) => setPageInfo({...pageInfo, page:page})} />*/}
            <PaginationComponent totalPage={pageInfo.total} currentPage={pageInfo.page} setPage={(page) => setPageInfo({...pageInfo, page:page})} />
        </div>
    )
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

export {BasicTool}

