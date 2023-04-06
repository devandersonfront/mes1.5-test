import React, { useEffect, useState } from 'react'
import {
    columnlist,
    ExcelTable,
    Header as PageHeader,
    IExcelHeaderType, PaginationComponent,
    RequestMethod,
    TextEditor,
} from 'shared'
// @ts-ignore
import { SelectColumn } from 'react-data-grid'
import Notiflix from "notiflix";
import { deleteMenuSelectState, setMenuSelectState } from "shared/src/reducer/menuSelectState";
import { useDispatch,  } from "react-redux";
import {useRouter} from "next/router";
import {columnsSort, getTableSortingOptions, setExcelTableHeight} from 'shared/src/common/Util'
import {TableSortingOptionType} from "shared/src/@types/type";
import {TransferCodeToValue} from "shared/src/common/TransferFunction";
import moment from "moment";
import {setModifyInitData} from "shared/src/reducer/modifyInfo";
import { alertMsg } from 'shared/src/common/AlertMsg'

const optionList = ["고유 번호", "", "", "CODE", "품명"]

const MesOutsourcingDeliveryList = () => {
    const dispatch = useDispatch()
    const router = useRouter()

    const [basicRow, setBasicRow] = useState<Array<any>>([]);
    const [column, setColumn] = useState<Array<IExcelHeaderType>>(columnlist["outsourcingDeliveryList"]);
    const [selectList, setSelectList] = useState<Set<number>>(new Set());
    const [optionIndex, setOptionIndex] = useState<number>(0);
    const [selectDate, setSelectDate] = useState<{ from: string; to: string }>({
        from: moment(new Date()).subtract(1, "month").format("YYYY-MM-DD"),
        to: moment(new Date()).add(1, "month").format("YYYY-MM-DD"),
    });
    const [sortingOptions, setSortingOptions] = useState<{orders:string[], sorts:string[]}>({orders:[], sorts:[]})
    const [keyword, setKeyword] = useState<string>("");
    const [pageInfo, setPageInfo] = useState<{ page: number; total: number }>({
        page: 1,
        total: 1,
    });

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

    const filterSelectedRows = () => basicRow.filter((row) => selectList.has(row.id))

    const onSelectDate = (date: {from:string, to:string}) => {
        setSelectDate(date)
        reload(null, date)
    }

    const reload = (keyword?:string, date?:{from:string, to:string}, sortingOptions?: TableSortingOptionType) => {
        setKeyword(keyword)
        if(pageInfo.page > 1) {
            setPageInfo({...pageInfo, page: 1})
        } else {
            getData(undefined, keyword, date, sortingOptions)
        }
    }

    const getRequestParams = (keyword?: string, date?: {from:string, to:string},  _sortingOptions?: TableSortingOptionType) => {
        let params = {}
        if(keyword) {
            params['keyword'] = keyword
            params['opt'] = optionIndex
        }
        params['from'] = date ? date.from: selectDate.from
        params['to'] = date ? date.to : selectDate.to
        params['order'] = _sortingOptions ? _sortingOptions.orders : sortingOptions.orders
        params['sorts'] = _sortingOptions ? _sortingOptions.sorts : sortingOptions.sorts
        return params
    }

    const getData = async (page: number = 1, keyword?: string, date?: {from:string, to:string}, _sortingOptions?: TableSortingOptionType) => {
        Notiflix.Loading.circle();
        const res = await RequestMethod("get", keyword ? 'outsourcingShipmentSearch' : 'outsourcingShipmentList', {
            path: {
                page: page,
                renderItem: 18,
            },
            params: getRequestParams(keyword, date, _sortingOptions)
        });
        if(res){
            if (res.totalPages > 0 && res.totalPages < res.page) {
                reload();
            } else {
                setPageInfo({
                    page: res.page,
                    total: res.totalPages
                })
                cleanUpData(res,date)
            }
        }
        Notiflix.Loading.remove()
    };

    const setNewColumn = (menus:any[], date?: { from: string, to: string }) => {
        const changeOrder = (sort: string, order: string) => {
            const _sortingOptions = getTableSortingOptions(sort, order, sortingOptions)
            setSortingOptions(_sortingOptions)
            reload(null, date, _sortingOptions)
        }
        const menuMap = menus?.reduce((map, menu) => {
            if(false === menu.hide){
                if(menu.colName){
                    map.set(menu.colName, menu)
                }
            }
            return map
        }, new Map())
        let newCols =column.filter(col => menuMap.has(col.key)).map(col => {
            const menu = menuMap.get(col.key)
            const sortIndex = sortingOptions.sorts.findIndex(sort => sort ===col.key)
            return {
                ...col,
                id: menu.mi_id,
                mi_id: menu.mi_id,
                name: !menu.moddable ? `${menu.title}(필수)`: menu.title,
                width: menu.width,
                tab:menu.tab,
                unit:menu.unit,
                moddable: !menu.moddable,
                version: menu.version,
                sequence: menu.sequence,
                hide: menu.hide,
                sortOption: sortIndex !== -1 ? sortingOptions.orders[sortIndex] : col.sortOption ?? null,
                sorts: col.sorts ? sortingOptions : null,
                result: col.sortOption ? changeOrder : null,
            }
        })
        setColumn(columnsSort(newCols))
    }

    const cleanUpData = (res: any, date?: { from: string, to: string }) => {
        res.menus?.length && setNewColumn(res.menus, date)
        const newRows = res.info_list.map((row: any) => {
            const amount = row.lots.reduce((previousValue, currentValue) => previousValue + currentValue.amount, 0)
            return {
                ...row,
                code: row.product.code,
                customer_id: row.product.customer?.name,
                cm_id: row.product.model?.model,
                modelArray: row.model,
                process_id: row.product.process?.name,
                product_id: row.product.code,
                product_name: row.product.name,
                amount:amount,
                type: TransferCodeToValue(row.product.type, "product"),
                product_type: TransferCodeToValue(row.product.type, "productType"),
                unit: row.product.unit,
                processArray: row.process,
                shipment_id: row.shipment_amount,
                id: row.outsourcing_shipment_id,
                reload
            };
        });
        setBasicRow(newRows);
    };

    const deleteApi = async (filtered) => {
        const result = await RequestMethod('delete', 'outsourcingShipmentDelete', filtered)
        if(result){
            Notiflix.Report.success(
              '성공',
              '삭제가 되었습니다.',
              '확인',
              () => getData())
        }
        setSelectList(new Set())
    }

    const moveModifyPage = (filtered) => {
        Notiflix.Loading.circle();
        dispatch(setModifyInitData({modifyInfo: filtered, type: "delivery"}));
        router.push("/mes/outsourcing/delivery/modify").then(() => Notiflix.Loading.remove());
    }

    const buttonEvent = (buttonIndex:number) => {
        switch (buttonIndex) {
            case 0:
                router.push(`/mes/item/manage/outsourcingDeliveryList`);
                break
            case 1:
                try {
                    if(selectList?.size === 0) throw(alertMsg.noSelectedData)
                    if(selectList.size > 1) throw(alertMsg.onlyOne)
                    const filtered = filterSelectedRows()
                    moveModifyPage(filtered)
                } catch(errMsg){
                    Notiflix.Report.warning('경고',errMsg,"확인")
                }
                break
            case 2:
                try {
                    if(selectList?.size === 0) throw(alertMsg.noSelectedData)
                    if(selectList.size > 1) throw(alertMsg.onlyOne)
                    const filtered = filterSelectedRows()
                    Notiflix.Confirm.show("경고", "삭제하시겠습니까?", "확인", "취소", () => deleteApi(filtered))
                } catch(errMsg){
                    Notiflix.Report.warning('경고',errMsg,"확인")
                }
                break
            default:
                break
        }
    }

    return (
        <div>
            <PageHeader
                isCalendar
                calendarType={"period"}
                selectDate={selectDate}
                searchKeyword={keyword}
                onSearch={reload}
                onChangeSearchOption={setOptionIndex}
                setSelectDate={onSelectDate}
                title={"외주 출고 현황"}
                isSearch
                optionIndex={optionIndex}
                searchOptionList={optionList}
                buttons={
                    ['항목관리', '수정하기', '삭제']
                }
                buttonsOnclick={buttonEvent}
            />
            <ExcelTable
                editable
                resizable
                resizeSave
                headerList={[
                    SelectColumn,
                    ...column
                ]}
                row={basicRow}
                setRow={(row) => {
                    setBasicRow([...row])
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
}


export { MesOutsourcingDeliveryList };
