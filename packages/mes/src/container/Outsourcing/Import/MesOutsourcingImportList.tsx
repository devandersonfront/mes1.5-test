import React, { useEffect, useState } from 'react'
import {
    columnlist,
    ExcelDownloadModal,
    ExcelTable,
    Header as PageHeader,
    IExcelHeaderType, LotInputInfoModal,
    PaginationComponent,
    RequestMethod,
} from 'shared'
// @ts-ignore
import { SelectColumn } from 'react-data-grid'
import Notiflix from "notiflix";
import { NextPageContext } from 'next'
import { deleteMenuSelectState, setMenuSelectState } from "shared/src/reducer/menuSelectState";
import { useDispatch,  } from "react-redux";
import { setExcelTableHeight } from 'shared/src/common/Util'
import {useRouter} from "next/router";
import {PlaceholderBox} from "shared/src/components/Formatter/PlaceholderBox";
import {CalendarBox} from "shared/src/components/CalendarBox/CalendarBox";
import {TableSortingOptionType} from "shared/src/@types/type";
import {setModifyInitData} from "shared/src/reducer/modifyInfo";



// {key: 'product_name', name: '품명', formatter:PlaceholderBox, type: 'product', placeholder: '-'},
// {key: 'code', name: 'CODE', formatter:PlaceholderBox, placeholder: '-'},
// {key: 'number', name: '발주번호', formatter:PlaceholderBox, type: 'user', placeholder: '-'},
// {key: 'customer', name: '거래처', formatter:PlaceholderBox, placeholder: '-'},
// {key: 'order_date', name: '발주 날짜', formatter:CalendarBox, readonly:true, placeholder: '-'},
// {key: 'input_date', name: '입고 날짜', formatter:CalendarBox, readonly:true, placeholder: '-'},
// {key: 'total_quantity', name: '총 입고량', formatter:PlaceholderBox, placeholder: '-'},
// {key: 'present_quantity', name: '현재까지 입고량', formatter:PlaceholderBox, placeholder: '-'},
// {key: 'good_quantity', name: '입고량', formatter:PlaceholderBox, placeholder: '-'},
// {key: 'lot_number', name: 'Lot번호', formatter:PlaceholderBox, placeholder: '-'},
// {key: 'input', name: '투입 자재', formatter: LotInputInfoModal, width: 118, type: 'readonly'},

// current
// import_date
// lot_number
// oseId
// osi_id
// outsourcing_export
// product
// version
// warehousing
// worker



const MesOutsourcingImportList = () => {

    const dispatch = useDispatch()
    const router = useRouter()
    const [basicRow, setBasicRow] = useState<any[]>([{}])
    const [pageInfo, setPageInfo] = useState<{page:number, total:number}>({page:1, total:4})
    const [selectList, setSelectList] = useState<Set<any>>(new Set());
    const [column, setColumn] = useState<Array<IExcelHeaderType>>(columnlist["outsourcingImportList"]);
    const [keyword , setKeyword] = useState<string>('')
    const [optionIndex, setOptionIndex] = useState<number>(0);

    const convertData = (list) => {
        return list.map((data)=>{
            return {
                ...data,
                id : data.osi_id,
                name : data.product.name,
                product_id : data.product?.code,
                contract_id : data?.outsourcing_export?.identification,
                customer_id : data.product?.customer?.name,
                import_date : data.import_date,
                warehousing : data.warehousing,
                current : data.current,
                lot_number : data.lot_number,
            }
        })
    }


    const convertColumn = (menus) => {
        const colNames = menus.map(menu => menu.colName)
        return column.filter((data)=> colNames.includes(data.key))
    }

    const reload = (keyword?:string ) => {
        setKeyword(keyword)
        if(pageInfo.page > 1) {
            setPageInfo({...pageInfo, page: 1})
        } else {
            getData(undefined, keyword)
        }
    }

    const filterSelectedRows = () => {
       return basicRow.filter((row) => selectList.has(row.id))
    };

    const getRequestParams = (keyword?: string, date?: {from:string, to:string}) => {
        let params = {}
        if(keyword) {
            params['keyword'] = keyword
            params['opt'] = optionIndex
        }
        return params
    }

    // 외주 입고 리스트
    const getData = async (page: number = 1, keyword?: string, _sortingOptions?: TableSortingOptionType) => {
        Notiflix.Loading.circle();
        const res = await RequestMethod("get", keyword? 'outsourcingImportSearch':'outsourcingImportList', {
            path: { page: page ?? 1, renderItem: 18},
            params: getRequestParams(keyword)
        });

        if(res){
            if (res.totalPages > 0 && res.totalPages < res.page) {
                reload();
            } else {
                setBasicRow(convertData(res.info_list));
                setColumn(convertColumn(res.menus))
                setPageInfo({page: res.page, total: res.totalPages})
            }
        }
        Notiflix.Loading.remove()
    };

    // 외주 입고 삭제
    const deleteApi = async () => {
        const selectedRows = filterSelectedRows()
        const result = await RequestMethod('delete', 'outsourcingImportDelete', selectedRows)
        if(result){
            Notiflix.Report.success(
                '성공',
                '삭제가 되었습니다.',
                '확인',
                () => getData())
        }
        setSelectList(new Set())
    }

    const moveModifyPage = () => {
        Notiflix.Loading.circle();
        dispatch(setModifyInitData({modifyInfo: filterSelectedRows(), type: "import"}));
        Notiflix.Loading.remove(300);
        router.push("/mes/outsourcing/import/modify");

    }

    const buttonEvent = (buttonIndex:number) => {
        switch (buttonIndex) {
            case 0:
                selectList?.size > 0 ?
                    selectList?.size > 1 ? Notiflix.Report.warning("데이터를 한개만 선택해주세요.","","확인")
                    : moveModifyPage()
                    : Notiflix.Report.warning('선택 경고','선택된 정보가 없습니다.','확인')
                break
            case 1:
                selectList?.size > 0 ? deleteApi() : Notiflix.Report.warning('선택 경고','선택된 정보가 없습니다.','확인')
                break
            default:
                console.log("good : ", )
                break
        }
    }

    useEffect(() => {
        dispatch(
            setMenuSelectState({ main: "외주 관리", sub: router.pathname })
        )
        return () => {
            dispatch(deleteMenuSelectState())
        }
    }, [])

    useEffect(() => {
        getData(pageInfo.page, keyword)
    }, [pageInfo.page]);

    return (
        <div>
            <PageHeader
                title={"외주 입고 리스트"}
                isSearch
                searchKeyword={keyword}
                onSearch={reload}
                optionIndex={0}
                searchOptionList={["Lot번호", "CODE","품명"]}
                onChangeSearchOption={(option) => {
                    setOptionIndex(option)
                }}
                buttons={
                    ['수정하기', '삭제']
                }
                buttonsOnclick={buttonEvent}
            />
            <ExcelTable
                editable
                resizable
                headerList={[
                    SelectColumn,
                    ...column
                ]}
                row={basicRow}
                //@ts-ignore
                setSelectList={setSelectList}
                selectList={selectList}
                setRow={(row) => {
                    setBasicRow(row)
                }}
                width={1576}
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

export { MesOutsourcingImportList };
