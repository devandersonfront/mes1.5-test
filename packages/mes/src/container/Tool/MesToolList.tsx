import React, {useEffect, useState} from "react";
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
import {SelectColumn} from "react-data-grid";
import moment from "moment";
import {useRouter} from "next/router";
//@ts-ignore
import Notiflix from "notiflix"
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "shared";
import {setToolDataAdd, ToolUploadInterface} from "shared/src/reducer/toolInfo";
import {deleteSelectMenuState, setSelectMenuStateChange} from "shared/src/reducer/menuSelectState";

interface IProps {
    children?: any
    page?: number
    search?: string
    option?: number
}

interface SelectParameter {
    from:string
    to:string
}

const MesToolList = ({page, search, option}: IProps) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [basicRow, setBasicRow] = useState<Array<any>>([]);
    const [column, setColumn] = useState<any>(columnlist.toolList)
    const [selectList, setSelectList] = useState<Set<number>>(new Set())
    const [selectDate, setSelectDate] = useState<SelectParameter>({from:moment().subtract(1, "month").format("YYYY-MM-DD"), to:moment().format("YYYY-MM-DD")})
    const [optionIndex, setOptionIndex] = useState<number>(0);
    const [pageInfo, setPageInfo] = useState<{page:number, total:number}>({page:1, total:1});
    const [keyword, setKeyword] = useState<string>();
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
                        pk: v.unit_id,
                        // result: changeNzState
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

    const cleanUpData = (info_list:any) => {
        let tmpColumn = columnlist["toolList"];
        let tmpRow:Array<any> = []
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

        if(pageInfo.page > 1){
            tmpRow = [...basicRow,...info_list.info_list]
          }else{
            tmpRow = info_list.info_list
          }


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

        // let pk = "";
        // Object.keys(tmpRow).map((v) => {
        //     if(v.indexOf('_id') !== -1){
        //         pk = v
        //     }
        // })
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
                id: `tool_${random_id}`,
                tool_id: row?.tool_id,
                elapsed: row?.elapsed  === 0 ? "0" : row?.elapsed,
                name: row?.name,
                unit:row?.unit,
                customer_id:row?.customer?.name,
            }
        })
        setBasicRow([...tmpBasicRow])

    }

    const LoadBasic = async() => {
        const res = await RequestMethod("get", "toolList",{
            path:{
                page:pageInfo.page,
                renderItem:20
            },
            // params:{
            //     from: selectDate.from,
            //     to: selectDate.to
            // }
        })

        if(res){
            setPageInfo({...pageInfo, total: res.totalPages })
            cleanUpData(res);
        }
    }

    const SearchBasic = async(keyword : string) => {
        const res = await RequestMethod("get", "toolSearch", {
            path:{
                page:pageInfo.page,
                renderItem:20
            },
            params:{
                // from:selectDate.from,
                // to: selectDate.to,
                keyword:keyword,
                opt:optionIndex
            }
        })
        if(res){
            setPageInfo({...pageInfo, total: res.totalPages })
            cleanUpData(res);
        }
    }

    const DeleteBasic = async() => {
        const res = await RequestMethod("delete", "lotToolDelete", basicRow.filter((row)=>selectList.has(row.id)))

        if(res){
            Notiflix.Report.success("삭제되었습니다.","","확인",() => {
                LoadBasic()
            });
        }
    }

    const ButtonEvents = (index:number) => {
        switch(index) {
            case 0:
                if(selectList && selectList.size > 0){
                    // @ts-ignore
                    dispatch(setToolDataAdd(basicRow.filter((row)=>selectList.has(row.id))));
                    router.push("/mes/tool/update")
                }else{
                    Notiflix.Report.warning("데이터를 선택해주시기 바랍니다.","","확인")
                }
                return
            case 1:
                DeleteBasic()

                return
            default:
                return
        }
    }

    useEffect(()=>{
        if(keyword){
            SearchBasic(keyword)
        }else{
            LoadBasic()
        }

    },[pageInfo.page])

    useEffect(() => {
        dispatch(setSelectMenuStateChange({main:"공구 관리",sub:router.pathname}))
        return(() => {
            dispatch(deleteSelectMenuState())
        })
    },[])

    return (
        <div>
            <PageHeader
                title={"공구 재고 현황"}
                dataLimit
                isSearch
                searchKeyword={keyword}
                onChangeSearchKeyword={(keyword) => {
                    setKeyword(keyword)
                    SearchBasic(keyword).then(() => {
                        Notiflix.Loading.remove();
                      });
                    // setPageInfo({page:1, total:1})
                }}
                searchOptionList={["공구 CODE", "공구 품명", "거래처"]}
                onChangeSearchOption={(option) => {
                    setOptionIndex(option);
                }}
                optionIndex={optionIndex}
            />
            <ExcelTable
                resizable
                headerList={column}
                row={basicRow}
                setRow={(e) => {
                    let tmp: Set<any> = selectList
                    e.map(v => {
                        if(v.isChange) {
                            tmp.add(v.id)
                            v.isChange = false
                        }
                    })
                    setSelectList(tmp)
                    setBasicRow(e);
                }}
                height={basicRow.length * 40 >= 40*18+56 ? 40*19 : basicRow.length * 40 + 56}
                width={1576}
                scrollEnd={(value) => {
                    if(value){
                        if(pageInfo.total > pageInfo.page){
                        setSelectList(new Set)
                        setPageInfo({...pageInfo, page:pageInfo.page+1})
                        }
                    }
                }}
                //@ts-ignore
                setSelectList={setSelectList}

            />
        </div>
    )
}

export {MesToolList};
