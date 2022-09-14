import React, {useEffect, useState} from 'react'
import {
    columnlist,
    ExcelTable,
    Header as PageHeader,
    IExcelHeaderType,
    PaginationComponent,
    RequestMethod,
    TextEditor
} from 'shared'
// @ts-ignore
import {SelectColumn} from 'react-data-grid'
import Notiflix from "notiflix";
import {useRouter} from 'next/router'
import {NextPageContext} from 'next'
import moment from 'moment'
import {TransferCodeToValue, TransferValueToCode} from 'shared/src/common/TransferFunction'
import {useDispatch} from 'react-redux'
import {deleteMenuSelectState, setMenuSelectState} from "shared/src/reducer/menuSelectState";
import { getTableSortingOptions, setExcelTableHeight } from 'shared/src/common/Util'
import { TableSortingOptionType } from 'shared/src/@types/type'
import addColumnClass from '../../../../../main/common/unprintableKey'

interface IProps {
    children?: any
    page?: number
    search?: string
    option?: number
}


const optionList = ['원자재 CODE', '원자재 품명', '재질', '원자재 LOT 번호', '거래처']

const MesRawMaterialExportList = ({page, search, option}: IProps) => {
    const router = useRouter()
    const dispatch = useDispatch()
    const [basicRow, setBasicRow] = useState<Array<any>>([])
    const [column, setColumn] = useState<Array<IExcelHeaderType>>( columnlist["rawstockExport"])
    const [selectList, setSelectList] = useState<Set<number>>(new Set())
    const [optionIndex, setOptionIndex] = useState<number>(0)
    const [keyword, setKeyword] = useState<string>();
    const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
        page: 1,
        total: 1
    })

    const [selectDate, setSelectDate] = useState<{from:string, to:string}>({
        from: moment().subtract(1,'month').format('YYYY-MM-DD'),
        to: moment().format('YYYY-MM-DD')
    });
    const [sortingOptions, setSortingOptions] = useState<{orders:string[], sorts:string[]}>({orders:[], sorts:[]})

    const onSelectDate = (date: {from:string, to:string}) => {
        setSelectDate(date)
        reload(undefined, date)
    }

    const reload = (keyword?:string, date?:{from:string, to:string}, sortingOptions?: TableSortingOptionType, _nzState?: boolean, _expState?: boolean) => {
        setKeyword(keyword)
        if(pageInfo.page > 1) {
            setPageInfo({...pageInfo, page: 1})
        } else {
            getData(undefined, keyword, date, sortingOptions)
        }
    }

    useEffect(() => {
        getData(pageInfo.page, keyword)
    }, [pageInfo.page]);

    useEffect(() => {
        dispatch(setMenuSelectState({main:"원자재 관리",sub:router.pathname}))
        return(() => {
            dispatch(deleteMenuSelectState())
        })
    },[])

    const loadAllSelectItems = (column: IExcelHeaderType[], date?: {from:string, to:string}, _nzState?:boolean, _expState?:boolean ) => {
        const changeOrder = (sort:string, order:string) => {
            const _sortingOptions = getTableSortingOptions(sort, order, sortingOptions)
            setSortingOptions(_sortingOptions)
            reload(undefined, date, _sortingOptions, _nzState, _expState)
        }
        let tmpColumn = column.map((v: any) => {
            const sortIndex = sortingOptions.sorts.findIndex(value => value === v.key)
            return {
                ...v,
                pk: v.unit_id,
                sortOption: sortIndex !== -1 ? sortingOptions.orders[sortIndex] : v.sortOption ?? null,
                sorts: v.sorts ? sortingOptions : null,
                result: v.sortOption ? changeOrder : null,
            }
        });

        setColumn(tmpColumn);
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
        params['material_type'] = 0
        return params
    }

    const getData = async (page: number = 1, keyword?: string, date?: {from:string, to:string}, _sortingOptions?: TableSortingOptionType) => {
        Notiflix.Loading.circle();
        const res = await RequestMethod("get", keyword ? 'exportSearch' : 'exportList', {
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
                cleanUpData(res, date);
            }
        }
        Notiflix.Loading.remove()
    };

    const cleanUpData = (res: any, date?: {from:string, to:string}, _nzState?:boolean, _expState?:boolean) => {
        let tmpColumn = columnlist["rawstockExport"];
        tmpColumn = tmpColumn.map((column: any) => {
            let menuData: object | undefined;
            res.menus && res.menus.map((menu: any) => {
                if(menu.colName === column.key){
                    menuData = {
                        id: menu.id,
                        name: menu.title,
                        width: menu.width,
                        tab:menu.tab,
                        unit:menu.unit
                    }
                } else if(menu.colName === 'id' && column.key === 'tmpId'){
                    menuData = {
                        id: menu.id,
                        name: menu.title,
                        width: menu.width,
                        tab:menu.tab,
                        unit:menu.unit
                    }
                }
            })
            if(column.key === "export") menuData = {
                id: column.id,
                name: "수정",
                width: column.width,
                tab:column.tab,
                unit:column.unit
            }
            if(menuData){
                return {
                    ...column,
                    ...menuData
                }
            }
        }).filter((v:any) => v)

        let additionalMenus = res.menus ? res.menus.map((menu:any) => {
            if(menu.colName === null){
                return {
                    id: menu.id,
                    name: menu.title,
                    width: menu.width,
                    key: menu.title,
                    editor: TextEditor,
                    type: 'additional',
                    unit: menu.unit
                }
            }
        }).filter((v: any) => v) : []


        loadAllSelectItems( [
            ...tmpColumn,
            ...additionalMenus
        ], date, _nzState, _expState )


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

        let pk = "";
        Object.keys(res.info_list).map((v) => {
            if(v.indexOf('_id') !== -1){
                pk = v
            }
        })

        let tmpBasicRow = res.info_list.map((row: any, index: number) => {

            let appendAdditional: any = {}

            row.additional && row.additional.map((v: any) => {
                appendAdditional = {
                    ...appendAdditional,
                    [v.title]: v.value
                }
            })
            return {
                ...row,
                id: row.lme_id,
                rm_id:row.lot_raw_material.raw_material.code,
                name:row.lot_raw_material.raw_material.name,
                texture:row.lot_raw_material.raw_material.texture,
                depth:row.lot_raw_material.raw_material.depth,
                width:row.lot_raw_material.raw_material.width,
                height:row.lot_raw_material.raw_material.height,
                type:TransferCodeToValue(row.lot_raw_material.raw_material.type, 'rawMaterialType'),
                export_count:row.count,
                lot_number:row.lot_raw_material.lot_number,
                date:moment(row.date).format("YYYY-MM-DD"),
                export_type:TransferCodeToValue(row.export_type, 'export'),
                current:row.lot_raw_material.current,
                customer_id:row.lot_raw_material.raw_material.customer?.name,
                readonly: row.export_type === 0,
                onClickEvent: row.export_type === 0 ? () => Notiflix.Report.warning('경고', '생산 출고 취소는 작업 일보 삭제를 통해서만 가능합니다.', '확인') : (row) =>
                    Notiflix.Confirm.show(`경고`, '출고 취소 하시겠습니까?', '예','아니오', () => DeleteBasic(row), ()=>{},
                        {width: '400px'}),
                onClickReturnEvent: row.export_type === 0 ? () => Notiflix.Report.warning('경고', '생산 출고 수정은 작업 일보 수정을 통해서만 가능합니다.', '확인') : (row, setIsOpen) =>
                    Notiflix.Confirm.show(`경고`, '수정하시겠습니까?', '예','아니오', () => {
                            setIsOpen(false)
                            SaveBasic(row)
                        }, ()=>{},
                        {width: '400px'}),
            }
        })
        setSelectList(new Set)
        setBasicRow([...tmpBasicRow])
    }

    async function SaveBasic(row: any) {
        let res: any
        res = await RequestMethod('post', `shipmentExportSave`,
            [row])
            .catch((error) => {
                if(error.status === 409){
                    Notiflix.Report.warning("경고", error.data.message, "확인",)
                    return true
                }
                return false
            })

        if(res){

            Notiflix.Report.success('저장되었습니다.','','확인', () => reload())
        }
    }

    const DeleteBasic = async (row?) => {
        let selectedData;
        try {
            if (row) {
                selectedData = [ row ]
                selectedData[0].export_type = TransferValueToCode(row.export_type, "export")
            } else {
                selectedData = basicRow.map((row) => {
                    if (selectList.has(row.id)) {
                        const export_type = TransferValueToCode(row.export_type, "export")
                        if (export_type === 0) throw('생산 출고 취소는 작업 일보 삭제를 통해서만 가능합니다.')
                        return { ...row, export_type }
                    }
                }).filter(v => v)
            }
            const res = await RequestMethod('delete', `exportDelete`,selectedData)

            if(res) {
                Notiflix.Report.success('삭제되었습니다.','','확인', () => reload());
            }
        } catch(errMsg) {
            Notiflix.Report.warning('경고', errMsg, '확인')
        }

    }


    const onClickHeaderButton = (index: number) => {
        const noneSelected = selectList.size <= 0
        if(noneSelected){
            return Notiflix.Report.warning("데이터를 선택해주세요.","","확인")
        }
        switch(index){
            case 0:
                Notiflix.Confirm.show("경고","데이터를 삭제하시겠습니까?", "확인", "취소", () => DeleteBasic())
                return;
        }
    }


    return (
        <div className={'excelPageContainer'}>
            <PageHeader
                isSearch
                searchKeyword={keyword}
                onSearch={reload}
                searchOptionList={optionList}
                onChangeSearchOption={(option) => {
                    setOptionIndex(option)
                }}
                optionIndex={optionIndex}
                isCalendar
                calendarType={'period'}
                selectDate={selectDate}
                //@ts-ignore
                setSelectDate={onSelectDate}
                buttons={["삭제"]}
                buttonsOnclick={onClickHeaderButton}
                title={"원자재 출고 현황"}
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
                setRow={(e) => {
                    let tmp: Set<any> = selectList
                    e.map(v => {
                        if(v.isChange) {
                            tmp.add(v.id)
                            v.isChange = false
                        }
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
                    setPageInfo({...pageInfo, page:page})
                }}
            />
        </div>
    );
}


export {MesRawMaterialExportList};
