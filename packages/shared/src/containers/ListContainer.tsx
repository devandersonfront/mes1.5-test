import React, { useEffect, useState } from 'react'
// @ts-ignore
import { SelectColumn } from 'react-data-grid'
import Notiflix from "notiflix";
import {useRouter} from "next/router";
import { alertMsg } from '../common/AlertMsg'
import { ExcelTable } from '../components/Excel/ExcelTable'
import { Header as PageHeader } from '../components/Header'
import { columnlist } from '../common/columnInit'
import { RequestMethod } from '../common/RequestFunctions'
import { IExcelHeaderType, TableSortingOptionType } from '../@types/type'
import moment from 'moment'
import { setModifyInitData } from '../reducer/modifyInfo'
import { setExcelTableHeight } from '../common/Util'
import { PaginationComponent } from '../components/Pagination/PaginationComponent'
import { useDispatch } from 'react-redux'

interface IProps {
    buttons?: string[],
    title: string
    deleteValidate?: (row: any) => void
    apiKey: string
    columnKey: string
    convertToList: (row: any) => any
    modifyPath?: string,
    searchOptions?: string[]
    noSearch?: boolean
    noPeriod?: boolean
}

const ListContainer = ({ buttons = ['수정하기', '삭제'], title, deleteValidate, apiKey, columnKey, convertToList, modifyPath='/', searchOptions, noSearch = false, noPeriod = false}:IProps) => {
    const dispatch = useDispatch()
    const router = useRouter()
    const [basicRow, setBasicRow] = useState<any[]>([{}])
    const [pageInfo, setPageInfo] = useState<{page:number, total:number}>({page:1, total:1})
    const [keyword , setKeyword] = useState<string>('')
    const [optionIndex, setOptionIndex] = useState<number>(0);
    const [selectList, setSelectList] = useState<Set<any>>(new Set());
    const [column, setColumn] = useState<Array<IExcelHeaderType>>(columnlist[columnKey]);
    const [sortingOptions, setSortingOptions] = useState<TableSortingOptionType>({orders: [], sorts: []})
    const [selectDate, setSelectDate] = useState<{ from: string, to: string }>({
        from: moment().subtract(1, 'month').format('YYYY-MM-DD'),
        to: moment().format('YYYY-MM-DD')
    })

    useEffect(() => {
        getData(pageInfo.page, keyword)
    }, [pageInfo.page]);

    const convertColumn = (menus) => {
        const colNames = menus.map(menu => menu.colName)
        return column.filter((col)=> colNames.includes(col.key))
    }

    const onSelectDate = (date: { from: string, to: string }) => {
        setSelectDate(date)
        reload(null, date)
    }

    const reload = (keyword?: string, date?: { from: string, to: string }, sortingOptions?: TableSortingOptionType) => {
        setKeyword(keyword)
        if (pageInfo.page > 1) {
            setPageInfo({...pageInfo, page: 1})
        } else {
            getData(undefined, keyword, date, sortingOptions)
        }
    }

    const filterSelectedRows = () => {
        return basicRow.filter((row) => selectList.has(row.id))
    };

    const getRequestParams = (keyword?: string, date?: { from: string, to: string }, _sortingOptions?: TableSortingOptionType) => {
        let params = {}
        if (keyword) {
            params['keyword'] = keyword
            params['opt'] = optionIndex
        }
        if(!noPeriod){
            params['from'] = date ? date.from : selectDate.from
            params['to'] = date ? date.to : selectDate.to
        }
        params['order'] = _sortingOptions ? _sortingOptions.orders : sortingOptions.orders
        params['sorts'] = _sortingOptions ? _sortingOptions.sorts : sortingOptions.sorts
        return params
    }

    // 외주 입고 리스트
    const getData = async (page: number = 1, keyword?: string, date?: { from: string, to: string }, _sortingOptions?: TableSortingOptionType) => {
        Notiflix.Loading.circle();
        const res = await RequestMethod("get", keyword ? `${apiKey}Search` : `${apiKey}List`, {
            path: { page: page ?? 1, renderItem: 18},
            params: getRequestParams(keyword, date, _sortingOptions)
        });

        if(res){
            if (res.totalPages > 0 && res.totalPages < res.page) {
                reload();
            } else {
                setBasicRow(res.info_list.map(info => convertToList(info)));
                setColumn(convertColumn(res.menus))
                setPageInfo({page: res.page, total: res.totalPages})
            }
        }
        Notiflix.Loading.remove()
    };

    const deleteApi = async (filtered) => {
        const result = await RequestMethod('delete', `${apiKey}Delete`, filtered)
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
        dispatch(setModifyInitData({modifyInfo: filtered, type: apiKey}));
        router.push(modifyPath).then(() => Notiflix.Loading.remove());
    }

    const buttonEvent = (buttonIndex:number) => {
        if(selectList?.size === 0) throw(alertMsg.noSelectedData)
        switch (buttonIndex) {
            case 0:
                try {
                    if (selectList.size > 1) throw(alertMsg.onlyOne)
                    const filtered = filterSelectedRows()
                    deleteValidate && filtered.map(row => deleteValidate(row))
                    moveModifyPage(filtered)
                } catch(errMsg){
                    Notiflix.Report.warning('경고',errMsg,"확인")
                }
                break
            case 1:
                  Notiflix.Confirm.show("경고", "삭제하시겠습니까?", "확인", "취소",
                    () => {
                        const filtered = filterSelectedRows()
                        deleteApi(filtered)})
                break
            default:
                break
        }
    }

    return (
      <div>
          <PageHeader
            isCalendar={!noPeriod}
            calendarType={'period'}
            selectDate={selectDate}
            searchKeyword={keyword}
            onSearch={reload}
            onChangeSearchOption={setOptionIndex}
            setSelectDate={onSelectDate}
            title={title}
            isSearch={!noSearch}
            optionIndex={optionIndex}
            searchOptionList={searchOptions}
            buttons={buttons}
            buttonsOnclick={buttonEvent}
          />
          <ExcelTable
            editable
            resizable
            headerList={buttons?.length ? [
                SelectColumn,
                ...column
            ] : column}
            row={basicRow}
            //@ts-ignore
            setSelectList={setSelectList}
            selectList={selectList}
            setRow={(row) => {
                setBasicRow(row)
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
    );
}

export { ListContainer };
