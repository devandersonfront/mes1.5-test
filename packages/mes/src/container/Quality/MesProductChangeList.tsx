import React, {useEffect, useState} from 'react';
import {columnlist, ExcelTable, Header as PageHeader, IExcelHeaderType, RequestMethod} from "shared";
// @ts-ignore
import {SelectColumn} from "react-data-grid";
import moment from "moment";
import {useRouter} from "next/router";
import Notiflix from "notiflix";

interface IProps {
    children?: any
    page?: number
    keyword?: string
    option?: number
}


const MesProductChangeList = ({page, keyword, option}: IProps) => {
    const router = useRouter()
    const [basicRow, setBasicRow] = useState<Array<any>>([{
        order_num: '-', operation_num: '20210401-013'
    }])
    const [column, setColumn] = useState<Array<IExcelHeaderType>>( columnlist["productChangeList"])
    const [selectList, setSelectList] = useState<Set<number>>(new Set())
    const [optionList, setOptionList] = useState<string[]>([ '거래처', '모델', 'CODE', '품명', '제목', '작성자'])
    const [optionIndex, setOptionIndex] = useState<number>(0)
    const [selectDate, setSelectDate] = useState<{from:string, to:string}>({
        from: moment(new Date()).startOf("month").format('YYYY-MM-DD') ,
        to:  moment(new Date()).endOf("month").format('YYYY-MM-DD')
    });

    const [searchKeyword, setSearchKeyword] = useState<string>("");
    const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
        page: 1,
        total: 1
    })

    useEffect(() => {
        // setOptionIndex(option)
        if(searchKeyword !== ""){
            SearchBasic(searchKeyword, optionIndex, pageInfo.page).then(() => {
                Notiflix.Loading.remove()
            })
        }else{
            LoadBasic(pageInfo.page).then(() => {
                Notiflix.Loading.remove()
            })
        }
    }, [pageInfo.page, searchKeyword, option, selectDate])

    const LoadBasic = async (page?: number) => {
        Notiflix.Loading.circle()
        const res = await RequestMethod('get', `productChangeList`,{
            path: {
                page: pageInfo.page ?? 1,
                renderItem: 18,
            },
            params: {
                from: selectDate.from,
                to: selectDate.to,
            }

        })

        if(res){
            setPageInfo({
                ...pageInfo,
                page: res.page,
                total: res.totalPages
            })
            cleanUpData(res)
        }else if (res === 401) {
            Notiflix.Report.failure('불러올 수 없습니다.', '권한이 없습니다.', '확인', () => {
                router.back()
            })
        }

    }


    const SearchBasic = async (keyword: any, option: number, isPaging?: number) => {
        Notiflix.Loading.circle()
        if(!isPaging){
            setOptionIndex(option)
        }
        const res = await RequestMethod('get', `shipmentSearch`,{
            path: {
                page: isPaging ?? 1,
                renderItem: 22,
            },
            params: {
                keyword: keyword ?? '',
                opt: option ?? 0,
                from: selectDate.from,
                to: selectDate.to,
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
        tmpRow = res.map((v,i)=>{
            return {
                customer_id: v.product.customerId  === null ? '-' : v.product.customerId,
                cm_id: v.product.model === null ? '-' : v.product.model,
                code: v.product.code,
                material_name: v.product.name === null ? '-' : v.product.name,
                type: column[4].selectList[v.product.type].name,
                process_id: v.product.processId === null ? '-' : v.product.processId,
                title: v.title,
                register: moment(v.created).format('YYYY.MM.DD'),
                writer: v.writer.name
            }
        })
        setBasicRow([...tmpRow])
    }


    return (
        <div>
            <PageHeader
                isSearch
                isCalendar
                searchKeyword={""}
                searchOptionList={optionList}
                onChangeSearchKeyword={(keyword) => {
                    if(keyword){
                        router.push(`/mes/quality/product/change/list?page=1&keyword=${keyword}&opt=${optionIndex}`)
                    }else{
                        router.push(`/mes/quality/product/change/list?page=1&keyword=`)
                    }
                }}
                onChangeSearchOption={(option) => {
                    // SearchBasic(keyword, option, 1)
                    setOptionIndex(option)
                }}
                calendarTitle={'등록 날짜'}
                calendarType={'period'}
                selectDate={selectDate}
                //@ts-ignore
                setSelectDate={(date) => setSelectDate(date)}
                title={"변경점 정보 리스트"}
                buttons={
                    ['', '수정하기']
                }
            />
            <ExcelTable
                editable
                // resizable
                headerList={[
                    SelectColumn,
                    ...column
                ]}
                row={basicRow}
                // setRow={setBasicRow}
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
                height={basicRow.length * 40 >= 40*18+56 ? 40*19 : basicRow.length * 40 + 56}
                scrollEnd={(value) => {
                    if(value){
                        if(pageInfo.total > pageInfo.page){
                            setPageInfo({...pageInfo, page:pageInfo.page+1})
                        }
                    }
                }}
            />
        </div>
    );
};

export {MesProductChangeList}
