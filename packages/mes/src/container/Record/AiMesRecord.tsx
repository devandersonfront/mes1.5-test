import React, { useEffect, useState } from "react";
import {
    columnlist,
    ExcelTable,
    Header as PageHeader,
    IExcelHeaderType,
    PaginationComponent,
    RequestMethod,
    TextEditor, UnitContainer,
} from "shared";
// @ts-ignore
import { SelectColumn } from "react-data-grid";
import Notiflix from "notiflix";
import { useRouter } from "next/router";
import { NextPageContext } from "next";
import moment from "moment";
import { TransferCodeToValue } from "shared/src/common/TransferFunction";
import {
    deleteMenuSelectState,
    setMenuSelectState,
} from "shared/src/reducer/menuSelectState";
import { useDispatch } from "react-redux";
import {CheckRecordLotNumber, getTableSortingOptions, setExcelTableHeight} from 'shared/src/common/Util'
import { TableSortingOptionType } from 'shared/src/@types/type'
import addColumnClass from '../../../../main/common/unprintableKey'
import {alertMsg} from "shared/src/common/AlertMsg";
import Big from "big.js";

interface IProps {
    children?: any;
    page?: number;
    search?: string;
    option?: number;
}

const AiMesRecord = ({}: IProps) => {
    const router = useRouter()
    const dispatch = useDispatch()
    const [recordState, setRecordState] = useState<number>(0)
    const [basicRow, setBasicRow] = useState<Array<any>>([])
    const [deleteBasic, setDeleteBasic] = useState<any>([])
    const [column, setColumn] = useState<Array<IExcelHeaderType>>( columnlist["aiRecordListV2"])
    const [selectList, setSelectList] = useState<Set<number>>(new Set())
    const [optionIndex, setOptionIndex] = useState<number>(0)
    const [selectDate, setSelectDate] = useState<{from:string, to:string}>({
        from: moment().subtract(1,'month').format('YYYY-MM-DD'),
        to: moment().format('YYYY-MM-DD')
    });
    const [keyword, setKeyword] = useState<string>("");
    const [pageInfo, setPageInfo] = useState<{ page: number; total: number }>({
        page: 1,
        total: 1,
    });
    const [sortingOptions, setSortingOptions] = useState<{orders:string[], sorts:string[]}>({orders:[], sorts:[]})

    const reload = (keyword?:string, date?:{from:string, to:string}, sortingOptions?: TableSortingOptionType, radioIdx?: number) => {
        setKeyword(keyword)
        if(pageInfo.page > 1) {
            setPageInfo({...pageInfo, page: 1})
        } else {
            getData(undefined, keyword, date, sortingOptions, radioIdx)
        }
    }
    useEffect(() => {
        getData(pageInfo.page, keyword)
    }, [pageInfo.page]);

    useEffect(() => {
        dispatch(
            setMenuSelectState({ main: "생산관리 등록", sub: router.pathname })
        );
        return () => {
            dispatch(deleteMenuSelectState());
        };
    }, []);

    const loadAllSelectItems = (column: IExcelHeaderType[], date?: {from:string, to:string}, radioIdx?:number) => {
        const changeOrder = (sort:string, order:string) => {
            const _sortingOptions = getTableSortingOptions(sort, order, sortingOptions)
            setSortingOptions(_sortingOptions)
            // reload(null, date, _sortingOptions, radioIdx)
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

    const getRequestParams = (keyword?: string, date?: {from:string, to:string},  _sortingOptions?: TableSortingOptionType, radioIdx?: number) => {
        let params = {}
        if(keyword) {
            params['keyword'] = keyword
            params['opt'] = optionIndex
        }
        params['from'] = date ? date.from: selectDate.from
        params['to'] = date ? date.to : selectDate.to
        params['status'] = [0]
        // params['status'] = [0,1,2]
        return params
    }

    const getData = async (page: number = 1, keyword?: string, date?: {from:string, to:string}, _sortingOptions?: TableSortingOptionType, radioIdx?:number) => {
        Notiflix.Loading.circle();
        const res = await RequestMethod("get", 'aiRecordList', {
            path: {
                page: page,
                renderItem: 18,
            },
            // params: getRequestParams(keyword, {from:"2022-01-01", to:"2023-12-31"}, _sortingOptions,radioIdx)
            params: getRequestParams(keyword, date, _sortingOptions,radioIdx)
        });
        if(res){
            setDeleteBasic(res.info_list)
            if (res.totalPages > 0 && res.totalPages < res.page) {
                reload();
            } else {
                setPageInfo({
                    page: res.page,
                    total: res.totalPages
                })
                convertColumn(res, date, radioIdx)
                cleanUpData(res, date, _sortingOptions, radioIdx);
            }
        }
        Notiflix.Loading.remove()
    };

    const DeleteBasic = async (save?:boolean) => {
        const result = deleteBasic.map((v) => {
            if (selectList.has(v.id)){
                return {...v, status: save ? 2 : 1}
                // return {...v, status:0}
            }
        }).filter(v=>v)

        let res = await RequestMethod('post', `aiRecordSave`, result);
        if (res && !save) {
            Notiflix.Report.success("삭제 성공!", "", "확인", () => reload(null, null))
        }else if(res){
            router.push("/mes/recordV2/list")
        }else{
            Notiflix.Report.failure("에러가 발생했습니다!", "", "확인", () => reload())
        }
    };


    const convertColumn = (res, date?: {from:string, to:string}, radioIdx?:number) => {
        let tmpColumn = columnlist["aiRecordListV2"];
        const convertColumn = tmpColumn.map((column: any) => {
            let menuData: object | undefined;
            res.menus &&
            res.menus.map((menu: any) => {
                if (menu.colName === column.key) {
                    menuData = {
                        id: menu.id,
                        name: menu.title,
                        width: menu.width,
                        tab: menu.tab,
                        unit: menu.unit,
                    };
                } else if (menu.colName === "id" && column.key === "tmpId") {
                    menuData = {
                        id: menu.id,
                        name: menu.title,
                        width: menu.width,
                        tab: menu.tab,
                        unit: menu.unit,
                    };
                }
            });

            if (menuData) {
                return {
                    ...column,
                    ...menuData,
                };
            }
        })
            .filter((v: any) => v);

        let additionalMenus = res.menus
            ? res.menus
                .map((menu: any) => {
                    if (menu.colName === null) {
                        return {
                            id: menu.id,
                            name: menu.title,
                            width: menu.width,
                            key: menu.title,
                            editor: TextEditor,
                            type: "additional",
                            unit: menu.unit,
                        };
                    }
                })
                .filter((v: any) => v)
            : [];

        convertColumn.push({ key : 'confidence', name : '신뢰도',formatter:UnitContainer, unitData:"%", width: 118})
        loadAllSelectItems([...convertColumn, ...additionalMenus], date, radioIdx);
    }

    const forSaveCleanUpData = (res:any) => {
        return {
            additional:res?.additional ?? null,
            bom:res?.bom ?? null,
            company:res?.company ?? null,
            confidence:res?.confidence ?? null,
            contract_id:res?.contract_id ?? null,
            count:res?.count ?? null,
            date:res?.date ?? null,
            deadline:res?.deadline ?? null,
            end:res?.end ?? null,
            goal:res?.goal ?? null,
            good_quantity:res?.good_quantity ?? null,
            id:res?.id ?? null,
            identification:res?.identification ?? null,
            input_bom:res?.input_bom ?? null,
            lot_number:res?.lot_number ?? null,
            machine:res?.machine ?? null,
            machines:res?.machines ?? null,
            mfr_code:res?.mfr_code ?? null,
            name:res?.name ?? null,
            operationRecord:res?.operationRecord ?? null,
            operation_sheet:res?.operation_sheet ?? null,
            prediction_id:res?.prediction_id ?? null,
            prediction_result:res?.prediction_result ?? null,
            process_id:res?.process_id ?? null,
            product:res?.product ?? null,
            product_id:res?.product_id ?? null,
            start:res?.start ?? null,
            status:res?.status ?? null,
            sum:res?.sum ?? null,
            tools:res?.tools ?? null,
            type:res?.type ?? null,
            unit:res?.unit ?? null,
            uph:res?.uph ?? null,
            worker:res?.worker ?? res.operationRecord.worker,
            pause_reasons:res?.pause_reasons ?? null,
            defect_reasons:res?.defect_reasons ?? null
        }

    }

    const cleanUpData = (res: any, date?: {from:string, to:string}, _sortingOptions?: TableSortingOptionType, radioIdx?:number) => {
        const _reload = () => reload(null, date, _sortingOptions, radioIdx)

        let tmpBasicRow = res.info_list.map((row: any, index: number) => {
            let appendAdditional: any = {};

            row.additional &&
            row.additional.map((v: any) => {
                appendAdditional = {
                    ...appendAdditional,
                    [v.title]: v.value,
                };
            });

            let result = 0
            return {
                ...row,
                ...appendAdditional,
                product: row?.product ?? null,
                goal: row?.goal ?? "-",
                contract_id: row?.contract?.identification ?? "-",
                start: row?.start,
                end: row?.end,
                operation_sheet:row.operationRecord.operation_sheet,
                good_quantity: row?.operationRecord.good_quantity,
                input_bom: row?.input_bom ?? [],
                lot_number: row.operationRecord.lot_number,
                identification: row?.operationRecord?.operation_sheet?.identification ?? "-",
                product_id: row?.product?.code ?? "-",
                name: row?.product?.name ?? "-",
                type:
                    row?.product
                        ? TransferCodeToValue(row.product.type, "product")
                        : "-",
                unit: row?.product?.unit,
                process_id: row?.product?.process?.name ?? "-",
                user: row.worker,
                sic_id: row.inspection_category,
                worker: row.worker?.name ?? row.operationRecord.worker ?? '-',
                worker_object: row.worker_object ?? row.worker,
                // sum:row.bom.map((bom) => bom.lot.amount).filter(v=>v).reduce((prev, current) => prev + current, result),
                sum: row?.operationRecord.good_quantity,
                confidence: row?.confidence ? row.confidence.toFixed(4) * 100 : 0,
                // id: `sheet_${random_id}`,
                reload: _reload,
            }
        })
        setBasicRow([...tmpBasicRow]);
        setSelectList(new Set)
    }
    const SaveBasic = async () => {
        if(selectList.size <= 0) return Notiflix.Report.warning("경고","데이터를 선택해주세요.","확인")
        try{
            const postBody = basicRow.map((v) => {
                const cavity = v.molds?.length > 0 ? v.molds[0].mold?.mold?.cavity : 1
                if (selectList.has(v.id)) {
                    if(CheckRecordLotNumber(v.lot_number)){
                        throw(alertMsg.wrongLotNumber)
                    }else
                    if(!v.lot_number){
                        throw(alertMsg.noLotNumber)
                    }else if(v.worker == "-"){
                        throw(alertMsg.noWorker)
                    }else if(!v.good_quantity) {
                        throw(alertMsg.noProductAmount)
                    }else if(!v.operation_sheet) {
                        throw(alertMsg.noOperation)
                    }else if(v.bom == null){
                        throw(alertMsg.needsBom)
                    }
                    if(v.molds) {
                        v.bom.map(bom => {
                            const finalAmount = new Big(Number(bom.lot?.amount)).div(bom?.bom.cavity)
                            const finalUsage = finalAmount.times(bom.bom?.usage)
                            if(!Number.isInteger(finalAmount.toNumber())) throw(alertMsg.productAmountNotCavityDivisor)
                            if(finalUsage.gt(bom.lot?.current)) throw (alertMsg.overStock)
                            // const currentAmount = lotTotalAmountMap.get(bom.osb_id) ?? 0
                            //   lotTotalAmountMap.set(bom.osb_id, currentAmount + Number(bom.lot.amount))
                        })
                    }
                    return {
                        ...v,
                        additional:[],
                        bom: v.bom.map((bom) => {
                            const outsourcing = bom?.bom?.type === 2 && bom.bom?.child_product?.type > 2
                            const lotKey = outsourcing ? 'child_lot_outsourcing' :'child_lot_record'
                            return {
                                ...bom,
                                bom: {
                                    childOutsourcingId:bom.bom?.childOutsourcingId ?? null,
                                    childProductId:bom.bom?.childProductId ?? null,
                                    childRmId:bom.bom?.childRmId ?? null,
                                    childSmId:bom.bom?.childSmId ?? null,
                                    child_product:bom.bom?.child_product ?? null,
                                    child_rm:bom.bom?.child_rm ?? null,
                                    child_sm:bom.bom?.child_sm ?? null,
                                    key:bom.bom?.key ?? null,
                                    parent:bom.bom?.parent ?? null,
                                    parentId:bom.bom?.parentId ?? null,
                                    seq:bom.bom?.seq ?? null,
                                    setting:bom.bom?.setting ?? null,
                                    type:bom.bom?.type ?? null,
                                    usage:bom.bom?.usage ?? null,
                                    version:bom.bom?.version ?? null,
                                },
                                lot: {
                                    ...bom.lot,
                                    [lotKey]: bom.lot?.[lotKey],
                                    amount: v.molds?.length > 0 ? new Big(Number(bom.lot.amount)).div(bom?.bom?.cavity).toString() : Number(bom.lot.amount)}}
                        }),
                        operation_sheet: v.operation_sheet ?? v.operationRecord.operation_sheet,
                        osId:v.os_id,
                        tools: v?.tools?.map((tool) => {
                            return{
                                ...tool,
                                tool:{
                                    sequence: tool.tool?.sequence,
                                    setting: 1,
                                    used: Number(tool.tool.used),
                                    tool: {
                                        ...tool.tool.tool,
                                        customer: tool.tool.customerArray
                                    }
                                }}
                        }).filter(v=>v.tool.tool.code) ?? [],
                        machines: [],
                        version: undefined,
                        uph:0,
                        // inspection_category:0,
                        date:v.start,
                        deadline:v.end
                    }
                }
                }).filter((v) => v)
            const res = await RequestMethod('post', `recordSave`,postBody.map((finalData) => forSaveCleanUpData(finalData)))
            if (res?.length > 0) {
                Notiflix.Report.success('저장되었습니다.', '', '확인', () => {
                    DeleteBasic(true)
                });
            } else {
                Notiflix.Report.failure('이미 삭제된 작업일보 입니다.', '', '확인', () => {
                    reload()
                });
            }

        } catch (errMsg){
            console.log(errMsg)
            Notiflix.Report.warning('경고', errMsg, '확인')
        }
    }
    return (
        <div className={'excelPageContainer'}>
            <PageHeader
                title={"AI 작업 일보 리스트"}
                buttons={["저장하기", "삭제"]}
                buttonsOnclick={(e) => {
                    switch (e) {
                        case 0: {
                            SaveBasic()
                            break;
                        }
                        case 1: {
                            if (selectList.size === 0) {
                                return Notiflix.Report.warning(
                                    "경고",
                                    "데이터를 선택해 주시기 바랍니다.",
                                    "확인"
                                );
                            }
                            Notiflix.Confirm.show(
                                "경고",
                                "삭제하시겠습니까?",
                                "확인",
                                "취소",
                                () => DeleteBasic()
                            );
                            break;
                        }
                    }
                }}
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
                    const tmp = 0
                    const result = e.map((row, index) => {
                        if(row?.lotList){
                            const total = row?.lotList[0]?.lots?.map((lot) => Number(lot.amount)).reduce((prev, current) => prev + current, tmp)
                            return {...row, current:total}
                        } else {
                            row.processId = row.product.process.process_id
                            row.process_id = row.product.process.name
                            if(!row.bom) row.good_quantity = 0
                            return row
                        }
                    })
                    setBasicRow(result)
                    // const deleteCheck = e.every(prop => prop.finish === false);
                    // if(!deleteCheck) reload()
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
            {/*{excelOpen && (*/}
            {/*    <WorkModifyModal*/}
            {/*        row={*/}
            {/*            {...basicRow.filter(row => selectList.has(row.id)).map(row => ({*/}
            {/*                    ...row,*/}
            {/*                    worker: row.user,*/}
            {/*                    worker_name: row.user.name,*/}
            {/*                    sum: row.poor_quantity + row.good_quantity,*/}
            {/*                    input_bom: row.operation_sheet.input_bom,*/}
            {/*                }))[0]}*/}
            {/*        }*/}
            {/*        isOpen={excelOpen}*/}
            {/*        setIsOpen={setExcelOpen}*/}
            {/*    />*/}
            {/*)}*/}
        </div>
    );
};

export const getServerSideProps = (ctx: NextPageContext) => {
    return {
        props: {
            page: ctx.query.page ?? 1,
            keyword: ctx.query.keyword ?? "",
            option: ctx.query.opt ?? 0,
        },
    };
};

export { AiMesRecord };
