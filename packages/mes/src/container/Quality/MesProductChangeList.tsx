import React, {useEffect, useState} from 'react';
import {columnlist, ExcelTable, Header as PageHeader, IExcelHeaderType, RequestMethod} from "shared";
// @ts-ignore
import {SelectColumn} from "react-data-grid";
import moment from "moment";
import {useRouter} from "next/router";
import Notiflix from "notiflix";
import {useDispatch} from "react-redux";
import {deleteMenuSelectState, setMenuSelectState} from "shared/src/reducer/menuSelectState";
import { setExcelTableHeight } from 'shared/src/common/Util'
import { setModifyInitData } from 'shared/src/reducer/modifyInfo'

interface IProps {
    children?: any
    page?: number
    keyword?: string
    option?: number
}


const MesProductChangeList = ({page, keyword, option}: IProps) => {
    const router = useRouter()
    const dispatch = useDispatch()
    const [basicRow, setBasicRow] = useState<Array<any>>([])
    const [column, setColumn] = useState<Array<IExcelHeaderType>>( columnlist["productChangeList"])
    const [selectList, setSelectList] = useState<Set<number>>(new Set())
    const [optionList, setOptionList] = useState<string[]>([ '거래처', '모델', 'CODE', '품명', '제목', '작성자'])
    const [optionIndex, setOptionIndex] = useState<number>(0)
    const [selectDate, setSelectDate] = useState<{from:string, to:string}>({
        from: moment(new Date()).subtract(1,'month').format('YYYY-MM-DD'),
        to:  moment(new Date()).format('YYYY-MM-DD')
    });

    const [searchKeyword, setSearchKeyword] = useState<string>("");
    const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
        page: 1,
        total: 1
    })

    useEffect(() => {
        if(searchKeyword){
            SearchBasic(searchKeyword, optionIndex, pageInfo.page).then(() => {
                Notiflix.Loading.remove()
            })
        }else{
            LoadBasic(pageInfo.page).then(() => {
                Notiflix.Loading.remove()
            })
        }
    }, [pageInfo.page, selectDate])

    useEffect(() => {
        dispatch(setMenuSelectState({main:"품질 관리",sub:router.pathname}))
        return (() => {
            dispatch(deleteMenuSelectState())
        })
    },[])

    const LoadBasic = async (page?: number) => {
        Notiflix.Loading.circle()
        const res = await RequestMethod('get', `productChangeList`,{
            path: {
                page: page || page !== 0 ? page : 1,
                renderItem: 22,
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


    const SearchBasic = async (keyword: any, option: number, page?: number) => {
        Notiflix.Loading.circle()
        const res = await RequestMethod('get', `productChangeSearch`,{
            path: {
                page: page || page !== 0 ? page : 1,
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
            let random_id = Math.random()*1000;
            return {
                customer_id: v.product.customer  === null ? '-' :  v.product.customer.name ,
                cm_id: v.product.model === null ? '-' : v.product.model.model,
                code: v.product.code,
                material_name: v.product.name === null ? '-' : v.product.name,
                type: column[4].selectList[v.product.type].name,
                process_id: v.product.process === null ? '-' : v.product.process.name,
                title: v.title,
                register: moment(v.created).format('YYYY.MM.DD'),
                writer: v.writer.name,
                id: `productchange_${random_id}`,
                pcr_id: v.pcr_id
            }
        })
        if(res.page > 1) {
            setSelectList(new Set)
            const basicAddTmpRow = basicRow.concat(tmpRow)
            setBasicRow([...basicAddTmpRow])
        }else {
            setSelectList(new Set)
            setBasicRow([...tmpRow])
        }
    }

    const buttonEvents = (number:number) => {
        switch(number) {
            case 0:

                return
            case 1:
                Notiflix.Loading.circle();
                let check = false;
                let count = 0;
                basicRow.map((v) => {
                    if(selectList.has(v.id)){
                        check = true;
                        count+=1
                    }
                })

                if(check && count === 1) {
                    const selectProduct = basicRow.map(v => {
                        if (selectList.has(v.id)) {
                            return v
                        }
                    }).filter(v => v)
                    Notiflix.Loading.remove(300);
                    router.push({pathname: '/mes/quality/product/change/detail', query: { pcr_id: selectProduct[0].pcr_id }})
                } else if(count > 1){
                    Notiflix.Loading.remove(300);
                    Notiflix.Report.warning("데이터를 한개만 선택해주세요.","","확인")
                } else{
                    Notiflix.Loading.remove(300);
                    Notiflix.Report.warning("데이터를 선택해주세요.","","확인")
                }
                return
            default :
                return
        }
    }

    return (
        <div>
            <PageHeader
                isSearch
                isCalendar
                searchOptionList={optionList}
                onChangeSearchKeyword={setSearchKeyword}
                onSearch={()=> {
                    setSelectList(new Set)
                    setPageInfo({page:1, total:1})
                }}
                onChangeSearchOption={(option) => {
                    setSelectList(new Set)
                    setOptionIndex(option)
                }}
                calendarTitle={'등록 날짜'}
                calendarType={'period'}
                selectDate={selectDate}
                setSelectDate={(date) => {
                //@ts-ignore
                    setSelectDate(date)
                    setPageInfo({page:1, total:1})
                }}
                title={"변경점 정보 리스트"}
                buttons={
                    ['', '자세히 보기']
                }
                buttonsOnclick={buttonEvents}
            />
            <ExcelTable
                editable
                resizable
                selectable
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
                width={1576}
                height={setExcelTableHeight(basicRow.length)}
                scrollEnd={(value) => {
                    if(value){
                        if(pageInfo.total > pageInfo.page){
                            setSelectList(new Set)
                            setPageInfo({...pageInfo, page:pageInfo.page+1})
                        }
                    }
                }}
            />
        </div>
    );
};

export {MesProductChangeList}
