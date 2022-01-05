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

const dummyList = {
        info_list: [
            {
                tool_id: 1,
                code: "공구 code",
                name: "공구명",
                customer: {
                    customer_id: 1,
                    name: "고객사명",
                    rep: "대표자명",
                    manager: "담당자명",
                    telephone: "전화번호",
                        cellphone: "휴대폰",
                        fax: "팩스",
                        address: "주소",
                        crn: "사업자 번호",
                        photo: "사업자 등록증",
                        additional: [ ],
                },
                additional: [],
                version: 1,
            },
        ],
        menus: [
            {
                id: 1 ,
                title: "공구 CODE",
                colName:"code"
            },
            {
                id: 2 ,
                title: "공구 품명",
                colName:"name"
            },
            {
                id: 3 ,
                title: "단위",
                unit: "EA",
                colName:"unit"
            },
            {
                id: 4 ,
                title: "거래처",
                colName:"customer"
            },
            {
                id: 5 ,
                title: "공구 재고량",
                unit: "EA",
                colName:"product"
            },
            {
                id: 6 ,
                title: "생산 품목",
                colName:""
            },
        ],
            page: 1,
            renderItem: 22,
            totalPages: 1
}

const dummySearch = {
    info_list: [
        {
            tool_id: 1,
            code: "공구 code Search",
            name: "공구명 Search",
            customer: {
                customer_id: 1,
                name: "고객사명 Search",
                rep: "대표자명 Search",
                manager: "담당자명 Search",
                telephone: "전화번호 Search",
                cellphone: "휴대폰 Search",
                fax: "팩스 Search",
                address: "주소 Search",
                crn: "사업자 번호 Search",
                photo: "사업자 등록증 Search",
                additional: [],
            },
            additional: [],
            version: 1,
        },
    ],
    menus: [
        {
            id: 1 ,
            title: "공구 CODE",
            colName:"code"
        },
        {
            id: 2 ,
            title: "공구 품명",
            colName:"name"
        },
        {
            id: 3 ,
            title: "단위",
            unit: "EA",
            colName:"unit"
        },
        {
            id: 4 ,
            title: "거래처",
            colName:"customer"
        },
        {
            id: 5 ,
            title: "공구 재고량",
            unit: "EA",
            colName:"product"
        },
        {
            id: 6 ,
            title: "생산 품목",
            colName:""
        },
    ],
    page: 1,
    renderItem: 22,
    totalPages: 10
}


const BasicTool = ({page, keyword, option}: IProps) => {
    console.log(page, keyword, option)
    const router = useRouter();
    const [column, setColumn] = useState<any>(columnlist.toolRegister)
    const [basicRow, setBasicRow] = useState<Array<any>>([]);

    const [pageInfo, setPageInfo] = useState<{page:number, total:number}>({page:0, total:0});
    // const [keyword, setKeyword] = useState<string>("");
    const [optionIndex, setOptionIndex] = useState<number>(0);
    const [selectList, setSelectList] = useState<Set<number>>(new Set())




    const cleanUpData = (info_list:any) => {
        let tmpColumn = columnlist["toolRegister"];
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

        // let pk = "";
        // Object.keys(tmpRow).map((v) => {
        //     if(v.indexOf('_id') !== -1){
        //         pk = v
        //     }
        // })
        console.log("tmpRow : ", tmpRow)
        let tmpBasicRow = tmpRow.map((row: any, index: number) => {

            let appendAdditional: any = {}

            row.additional && row.additional.map((v: any) => {
                appendAdditional = {
                    ...appendAdditional,
                    [v.mi_id]: v.value
                }
            })

            let random_id = Math.random()*1000;
            console.log(row,  appendAdditional)
            return {
                ...row,
                ...appendAdditional,
                id: `tool_${random_id}`,
            }
        })
        console.log("tmpBasicRow : ", tmpBasicRow);
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
        // const res = await RequestMethod("get", "toolList", {
        //     path:{
        //         page:page,
        //         renderItem:18
        //     },
        //     params:{
        //
        //     }
        // })

        // if(res){
        console.log(dummyList)
            setPageInfo({...pageInfo, total:dummyList.totalPages});
            cleanUpData(dummyList);
            // console.log(resultData);
        if(dummyList){
            // setBasicRow(resultData);
        }
    }

    const SearchBasic = async() => {
        // const res = await RequestMethod("get", "toolSearch",{
        //     path:{
        //         page:page,
        //         renderItem:18
        //     },
        //     params:{
        //         opt:optionIndex,
        //         keyword:keyword,
        //
        //     }
        // })

            setPageInfo({...pageInfo, total:dummySearch.totalPages});
             cleanUpData(dummySearch);
        // if(res){
        //
        //     // setBasicRow(resultData);
        // }
    }

    const buttonsEvent = (index:number) => {
        switch (index){
            case 0:
                router.push(`/mes/item/manage/tool`)
                return
            case 1:
                const randomId = Math.random()*1000;
                setBasicRow([...basicRow, {id:`tool_${randomId}`}])
                return
            case 2:
                alert("저장하기")
                console.log("basicRow : ", basicRow)
                return
            case 3:
                alert("삭제")

                return
            default:
                break;
        }
    }

    useEffect(() => {
        // setOptionIndex(option)
        console.log(keyword)
        if(keyword){
            SearchBasic();
        }else{
            LoadBasic();
        }
    }, [keyword])

    return (
        <div>
            <PageHeader
                title={"공구 기본정보"}
                isSearch
                searchKeyword={keyword}
                onChangeSearchKeyword={(keyword) => {
                    if(keyword){
                        router.push(`/mes/basic/tool?page=1&keyword=${keyword}&opt=${optionIndex}`);
                    }else{
                        router.push(`/mes/basic/tool?page=1&keyword=`);
                    }
                }}
                searchOptionList={["공구 CODE", "공구 품명", "거래처"]}
                onChangeSearchOption={(option) => {
                    setOptionIndex(option);
                }}
                optionIndex={optionIndex}
                buttons={["항목관리","행 추가","저장하기","삭제"]}
                buttonsOnclick={buttonsEvent}
            />
            <ExcelTable
                resizable
                headerList={[SelectColumn, ...column]}
                row={basicRow}
                setRow={(e) => {
                    let tmp: Set<any> = selectList
                    e.map(v => {
                        if(v.isChange) tmp.add(v.id)
                    })
                    setSelectList(tmp)
                    setBasicRow(e)
                }}
                selectList={selectList}
                //@ts-ignore
                setSelectList={setSelectList}
            />
            {/*<PaginationComponent totalPage={pageInfo.total} currentPage={pageInfo.page} setPage={(page) => setPageInfo({...pageInfo, page:page})} />*/}
            <PaginationComponent totalPage={pageInfo.total} currentPage={pageInfo.page} setPage={(page) => setPageInfo({...pageInfo, page:page})} />
        </div>
    )
}

export {BasicTool}

