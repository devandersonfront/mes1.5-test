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
import {setToolDataAdd} from "shared/src/reducer/toolInfo";
import {deleteMenuSelectState, setMenuSelectState} from "shared/src/reducer/menuSelectState";
import { setExcelTableHeight } from 'shared/src/common/Util'
import { TableSortingOptionType } from 'shared/src/@types/type'
import { alertMsg } from 'shared/src/common/AlertMsg'
import { setModifyInitData } from 'shared/src/reducer/modifyInfo'

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

const MesToolWarehousingList = ({page, search, option}: IProps) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [basicRow, setBasicRow] = useState<Array<any>>([]);
    const [column, setColumn] = useState<any>(columnlist.toolList)
    const [selectList, setSelectList] = useState<Set<number>>(new Set())
    const [selectDate, setSelectDate] = useState<SelectParameter>({from:moment().subtract(1, "month").format("YYYY-MM-DD"), to:moment().format("YYYY-MM-DD")})
    const [optionIndex, setOptionIndex] = useState<number>(0);
    const [pageInfo, setPageInfo] = useState<{page:number, total:number}>({page:1, total:1});
    const [keyword, setKeyword] = useState<string>()

    const onSelectDate = (date: {from:string, to:string}) => {
        setSelectDate(date)
        reload(null, date)
    }

    const reload = (keyword?:string, date?:{from:string, to:string}) => {
        setKeyword(keyword)
        if(pageInfo.page > 1) {
            setPageInfo({...pageInfo, page: 1})
        } else {
            getData(undefined, keyword, date)
        }
    }

    useEffect(() => {
        getData(pageInfo.page, keyword)
    }, [pageInfo.page]);

    useEffect(() => {
        dispatch(setMenuSelectState({main:"공구 관리",sub:router.pathname}))
        return (() => {
            dispatch(deleteMenuSelectState())
        })
    },[])

    const getRequestParams = (keyword?: string, date?: {from:string, to:string}) => {
        let params = {}
        if(keyword) {
            params['keyword'] = keyword
            params['opt'] = optionIndex
        }
        params['from'] = date ? date.from: selectDate.from
        params['to'] = date ? date.to : selectDate.to
        return params
    }

    const getData = async (page: number = 1, keyword?: string, date?: {from:string, to:string}) => {
        Notiflix.Loading.circle();
        const res = await RequestMethod("get", keyword ? 'lotToolSearch' : 'lotToolList', {
            path: {
                page: page,
                renderItem: 18,
            },
            params: getRequestParams(keyword, date)
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

    const cleanUpData = (info_list:any) => {
        let tmpColumn = columnlist["toolWarehousingList"];
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
        setColumn([
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
                tool_id:row?.tool?.code,
                elapsed: row?.elapsed  === 0 ? "0" : row?.elapsed,
                name: row?.tool?.name,
                unit:row?.tool?.unit,
                customer_id:row?.tool?.customer?.name,
            }
        })
        setSelectList(new Set)
        setBasicRow(tmpBasicRow)
    }

    const DeleteBasic = async() => {
        const res = await RequestMethod("delete", "lotToolDelete", basicRow.filter((row)=>selectList.has(row.id)))
        if(res){
            Notiflix.Report.success("삭제되었습니다.","","확인",() => reload())
        }
    }

    const ButtonEvents = (index:number) => {
        const noneSelected = selectList.size === 0
        if(noneSelected){
            return Notiflix.Report.warning('경고', alertMsg.noSelectedData,"확인")
        }
        switch(index) {
            case 0:
                const selectedRows = basicRow.filter(v => selectList.has(v.id))
                    dispatch(setModifyInitData({
                        modifyInfo: selectedRows,
                        type: "toolin"
                    }))
                    router.push('/mes/tool/update')
                return
            case 1:
                if(selectList.size > 1) {
                    return  Notiflix.Report.warning("경고",alertMsg.onlyOne,"확인" )
                }
                Notiflix.Confirm.show("경고","삭제하시겠습니까?","확인","취소",()=>DeleteBasic())

                return
            default:
                return
        }
    }

    return (
        <div className={'excelPageContainer'}>

            <PageHeader
                title={"공구 입고 리스트"}
                buttons={
                    ["수정 하기", '삭제']
                }
                buttonsOnclick={ButtonEvents}
                isCalendar
                calendarTitle={"입고일"}
                calendarType={"period"}
                selectDate={selectDate}
                setSelectDate={onSelectDate}
                dataLimit
                isSearch
                searchKeyword={keyword}
                onSearch={reload}
                searchOptionList={["공구 CODE", "공구 품명", "거래처"]}
                onChangeSearchOption={setOptionIndex}
            />
            <ExcelTable
                resizable
                selectable
                headerList={[SelectColumn,...column]}
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
                setSelectList={(selectedRows) => {
                    //@ts-ignore
                    setSelectList(selectedRows)
                }}
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
        </div>
    )
}

export {MesToolWarehousingList};
