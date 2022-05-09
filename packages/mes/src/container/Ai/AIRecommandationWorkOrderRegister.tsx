import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";

import {
    ExcelTable,
    Header as PageHeader,
    columnlist,
    IExcelHeaderType,
    RootState,
    RequestMethod
} from 'shared'

// @ts-ignore
import { SelectColumn } from 'react-data-grid'

import moment from 'moment'
import Notiflix from "notiflix";
import { TransferCodeToValue } from 'shared/src/common/TransferFunction'
import { SearchModalResult, SearchResultSort } from "shared/src/Functions/SearchResultSort";


const rows = [
    { id: 1, title: 'Demo1' },
    { id: 2, title: 'Demo2' },
    { id: 3, title: 'Demo3' },
    { id: 4, title: 'Demo4' },
    { id: 5, title: 'Demo5' },
    { id: 6, title: 'Demo6' },
    { id: 7, title: 'Demo7' },
    { id: 8, title: 'Demo8' },
    { id: 9, title: 'Demo9' },
];


function AIRecommandationWorkOrderRegister() {
    const receiveKey = useSelector((root: RootState) => root.OperationRegisterState);
    const [firstCheck, setFirstCheck] = useState<boolean>(true)
    const [selectList, setSelectList] = useState<Set<number>>(new Set())
    const [codeCheck, setCodeCheck] = useState<boolean>(true)

    const [column, setColumn] = useState<Array<IExcelHeaderType>>(columnlist["operationCodeRegisterV2"])
    const [basicRow, setBasicRow] = useState<Array<any>>([{
        id: `operation_${Math.random() * 1000}`, date: moment().format('YYYY-MM-DD'),
        deadline: moment().format('YYYY-MM-DD'), first: true
    }])
    const loadGraphSheet = async (product_id: string, object?: any) => {
        Notiflix.Loading.circle()
        const res = await RequestMethod('get', `sheetGraphList`, {
            path: { product_id }
        })
        if (res) {
            let tmp: Set<any> = selectList
            setSelectList(new Set())

            return [{
                ...object,
                contract_id: codeCheck ? "-" : object.contract_id,
                goal: codeCheck ? 0 : object.contract.amount,
                cm_id: object.cm_id ?? '-',
                process_id: object.product?.process?.name ?? '-',
                name: object.product_name ?? '-',
                date: object?.date ?? moment().format('YYYY-MM-DD'),
                deadline: object?.deadline ?? moment().format('YYYY-MM-DD'),
                first: true,
            }, ...res.map(v => {
                if (v.type === 2) {
                    let random_id = Math.random() * 1000;
                    tmp.add("operation_" + random_id)

                    return {
                        ...v,
                        contract_id: codeCheck ? "-" : object.contract_id,
                        id: "operation_" + random_id,
                        bom_root_id: v.child_product.bom_root_id,
                        product: v.child_product,
                        date: moment().format('YYYY-MM-DD'),
                        deadline: moment().format('YYYY-MM-DD'),
                        customer_id: v.child_product.customer?.name,
                        cm_id: v.child_product.model?.model,
                        name: v.child_product.name ?? v.product_name,
                        product_id: v.child_product.code,
                        code: v.child_product.code,
                        type: TransferCodeToValue(v.child_product.type, 'product'),
                        unit: v.child_product.unit,
                        goal: codeCheck ? 0 : object.contract.amount,
                        process_id: v.child_product.process?.name ?? '-',
                        readonly: true,
                    }
                }
            }).filter(v => v)

            ]
        }
    }

    // 1
    const getMenus = async () => {
        let res = await RequestMethod('get', `loadMenu`, {
            path: {
                tab: 'ROLE_PROD_01'
            }
        })
    }

    // 1
    useEffect(() => {
        if (receiveKey.searchKey !== "" && firstCheck) {
            setColumn(columnlist["operationIdentificationRegisterV2"])
            RequestMethod("get", "contractSearch", {
                params: {
                    keyword: receiveKey.searchKey,
                    opt: 0
                }
            })
                .then(async (res) => {
                    await loadGraphSheet(res.info_list[0].productId, SearchModalResult(SearchResultSort(res.info_list, "contract")[0], "receiveContract"))
                        .then((res) => {
                            setBasicRow(res)
                            setCodeCheck(false)
                            setFirstCheck(false)
                        })

                })
        } else {
            getMenus()
            setFirstCheck(false)
        }
    }, [codeCheck])
    console.log("SelectColumn ; ", SelectColumn);
    console.log("column ; ", column);

    return (
        <>
            <PageHeader
                title={"Ai 작업지시서 등록"}

            />
            <ExcelTable
                editable
                headerList={[
                    SelectColumn,                  // react-data-grid 에서 제공하는 row 에 대한 select column 설정을 위한 props 
                    ...column                      // 헤더 컬럼, 포매터등의 옵션으로 row 의 기본 형식 지정 옵션도 포함
                ]}
                // 1
                // row={rows}
                row={basicRow}
                maxHeight={360}
                setRow={() => {}}
            />
        </>
    )
}


export { AIRecommandationWorkOrderRegister };