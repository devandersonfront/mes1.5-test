import React, {useEffect, useState} from 'react';
import {
    columnlist,
    ExcelTable,
    Header as PageHeader,
    IExcelHeaderType,
    PaginationComponent,
    RequestMethod,
} from "shared";
// @ts-ignore
import {SelectColumn} from "react-data-grid";
import moment from "moment";
import {useRouter} from "next/router";
import Notiflix from "notiflix";
import {useDispatch} from "react-redux";
import {deleteMenuSelectState, setMenuSelectState} from "shared/src/reducer/menuSelectState";
import { setExcelTableHeight } from 'shared/src/common/Util'
import addColumnClass from '../../../../main/common/unprintableKey'
interface IProps {
    children?: any
    page?: number
    keyword?: string
    option?: number
}


const MesProductChangeList = ({}: IProps) => {
    const router = useRouter()
    const dispatch = useDispatch()
    const [basicRow, setBasicRow] = useState<Array<any>>([])
    const [column, setColumn] = useState<Array<IExcelHeaderType>>( columnlist["productChangeList"])
    const [selectList, setSelectList] = useState<Set<number>>(new Set())
    const [optionIndex, setOptionIndex] = useState<number>(0)
    const [selectDate, setSelectDate] = useState<{from:string, to:string}>({
        from: moment(new Date()).subtract(1,'month').format('YYYY-MM-DD'),
        to:  moment(new Date()).format('YYYY-MM-DD')
    });
    const [keyword, setKeyword] = useState<string>("");
    const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
        page: 1,
        total: 1
    })

    const reload = (keyword?:string, date?:{from:string, to:string}, ) => {
        date && setSelectDate(date)
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
        dispatch(setMenuSelectState({main:"품질 관리",sub:router.pathname}))
        return (() => {
            dispatch(deleteMenuSelectState())
        })
    },[])

    const onSelectDate = (date: {from:string, to:string}) => {
        reload(null, date)
    }

    const getRequestParams = (keyword?: string, date?: {from:string, to:string}) => {
        let params = {}
        if(keyword) {
            params['keyword'] = keyword
            params['opt'] = optionIndex
        }
        params['from'] = date ? date.from: selectDate.from,
          params['to'] = date ? date.to : selectDate.to
        return params
    }

    const getData = async (page: number = 1, keyword?: string, date?: {from:string, to:string}, ) => {
        Notiflix.Loading.circle()
        const res = await RequestMethod('get', keyword ? 'productChangeSearch' : 'productChangeList',{
            path: {
                page: page,
                renderItem: 18,
            },
            params: getRequestParams(keyword, date)
        })
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

    const cleanUpData = (res: any) => {
        let tmpRow = []
        tmpRow = res.info_list.map((v,i)=>{
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

        setSelectList(new Set)
        setBasicRow([...tmpRow])
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
        <div className={'excelPageContainer'}>
            <PageHeader
                isSearch
                isCalendar
                searchOptionList={[ '거래처', '모델', 'CODE', '품명', '제목', '작성자']}
                searchKeyword={keyword}
                optionIndex={optionIndex}
                onSearch={reload}
                onChangeSearchOption={(option) => {
                    setOptionIndex(option)
                }}
                calendarTitle={'등록 날짜'}
                calendarType={'period'}
                selectDate={selectDate}
                setSelectDate={onSelectDate}
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
                    ...addColumnClass(column)
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
            />
            <PaginationComponent
                currentPage={pageInfo.page}
                totalPage={pageInfo.total}
                setPage={(page) => {
                    setPageInfo({...pageInfo, page: page})
                }}
            />
        </div>
    );
};

export {MesProductChangeList}
