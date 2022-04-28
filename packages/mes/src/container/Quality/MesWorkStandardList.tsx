import React, {useEffect, useState} from 'react';
import {
    columnlist,
    ExcelTable,
    Header as PageHeader,
    IExcelHeaderType,
    MAX_VALUE, PaginationComponent,
    RequestMethod,
    TextEditor
} from "shared";
import {useRouter} from "next/router";
// @ts-ignore
import {SelectColumn} from "react-data-grid";
import Notiflix from "notiflix";
import {useDispatch} from "react-redux";
import {deleteSelectMenuState, setSelectMenuStateChange} from "shared/src/reducer/menuSelectState";

interface IProps {
    children?: any
    page?: number
    search?: string
    option?: number
}


const MesWorkStandardList = ({search, option}: IProps)=> {
    const router = useRouter()
    const dispatch = useDispatch()
    const [excelOpen, setExcelOpen] = useState<boolean>(false)
    const [basicRow, setBasicRow] = useState<Array<any>>([])
    const [column, setColumn] = useState<Array<IExcelHeaderType>>( columnlist["workStandardList"])
    const [selectList, setSelectList] = useState<Set<number>>(new Set())
    const [optionList, setOptionList] = useState<string[]>(['거래처', '모델', '코드', '품명'])
    const [optionIndex, setOptionIndex] = useState<number>(0)
    const [keyword, setKeyword] = useState<string>("")
    const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
        page: 1,
        total: 1
    })

    useEffect(() => {
        setOptionIndex(option)
        if(keyword){
            SearchBasic(keyword, option, pageInfo.page).then(() => {
                Notiflix.Loading.remove()
            })
        }else{
            LoadBasic(pageInfo.page).then(() => {
                Notiflix.Loading.remove()
            })
        }
    }, [pageInfo.page, keyword, option])

    useEffect(() => {
        dispatch(setSelectMenuStateChange({main:"품질 관리",sub:router.pathname}))
        return (() => {
            dispatch(deleteSelectMenuState())
        })
    },[])

    const LoadBasic = async (page?: number) => {
        Notiflix.Loading.circle()
        const res = await RequestMethod('get', `productList`,{
            path: {
                page: (page || page !== 0) ? page : 1,
                renderItem: 18,
            }
        })

        if(res){
            setPageInfo({
                ...pageInfo,
                page: res.page,
                total: res.totalPages
            })
            cleanUpData(res)
        }

    }

    const SearchBasic = async (keyword: any, option: number, isPaging?: number) => {
        Notiflix.Loading.circle()
        if(!isPaging){
            setOptionIndex(option)
        }
        const res = await RequestMethod('get', `productSearch`,{
            path: {
                page: isPaging ?? 1,
                renderItem: 18,
            },
            params: {
                keyword: keyword ?? '',
                opt: option ?? 0
            }
        })
        if(res){
            setPageInfo({
                ...pageInfo,
                page: res.page,
                total: res.totalPages
            })
            cleanUpData(res)
        }
    }

    const cleanUpData = (res: any) => {
        let tmpRow = []
        tmpRow = res.info_list.map((v,i)=>{
            return {
                customer: v.customer?.name,
                model: v.model === null ? '-' : v.model.model,
                code: v.code,
                material_name: v.name === null ? '-' : v.name,
                type: column[4].selectList[v.type].name,
                work_standard_image: v.work_standard_image
            }
        })
        setBasicRow([...tmpRow])
    }

    return (
        <div>
            <PageHeader
                isSearch
                searchKeyword={keyword}
                onChangeSearchKeyword={(keyword) => {
                    setPageInfo({page:1,total:1})
                    setKeyword(keyword)
                    // if(keyword){
                    //     router.push(`/mes/quality/work/standardlist?page=1&keyword=${keyword}&opt=${optionIndex}`)
                    // }else{
                    //     router.push(`/mes/quality/work/standardlist?page=1&keyword=`)
                    // }
                }}
                searchOptionList={optionList}
                onChangeSearchOption={(option) => {
                    setOptionIndex(option)
                }}
                title={"작업 표준서 리스트"}
            />
            <ExcelTable
                headerList={column}
                row={basicRow}
                setRow={setBasicRow}
                // setRow={(e) => {
                //     let tmp: Set<any> = selectList
                //     e.map(v => {
                //         if(v.isChange) {
                            tmp.add(v.id)
                            v.isChange = false
                        }
                //     })
                //     setSelectList(tmp)
                //     setBasicRow(e)
                // }}
                // selectList={selectList}
                // //@ts-ignore
                // setSelectList={setSelectList}
                // height={basicRow.length * 40 >= 40*18+56 ? 40*19 : basicRow.length * 40 + 56}
            />
            <PaginationComponent
                currentPage={pageInfo.page}
                totalPage={pageInfo.total}
                setPage={(page) => {
                    setPageInfo({...pageInfo,page:page})
                    // if(keyword){
                    //     router.push(`/mes/quality/work/standardlist?page=${page}&keyword=${keyword}&opt=${option}`)
                    // }else{
                    //     router.push(`/mes/quality/work/standardlist?page=${page}`)
                    // }
                }}
            />
        </div>
    );
};

export {MesWorkStandardList}
