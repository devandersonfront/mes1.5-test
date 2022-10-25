import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {ExcelTable, Header as PageHeader, PaginationComponent, RequestMethod} from "shared";
import {columnlist} from "shared";
//@ts-ignore
import {SelectColumn} from "react-data-grid";
import moment from "moment";
//@ts-ignore
import Notiflix from "notiflix";
import {useRouter} from "next/router";
import {useDispatch} from "react-redux";
import {deleteMenuSelectState, setMenuSelectState} from "shared/src/reducer/menuSelectState";
import { alertMsg } from 'shared/src/common/AlertMsg'

const MesToolRegister = () => {
    const router = useRouter();
    const dispatch = useDispatch()
    const [basicRow, setBasicRow] = useState<Array<any>>([{
        id:`toolWarehousingRegister_${Math.random()*1000}`,
        warehousing:"0",
        date:moment().format("YYYY.MM.DD"),
    }]);
    const [column, setColumn] = useState<any>(columnlist.toolWarehousingRegister);
    const [selectList, setSelectList] = useState<Set<number>>(new Set())

    useEffect(() => {
        getMenus()
        dispatch(setMenuSelectState({main:"공구 관리",sub:router.pathname}))
        return(() => {
            dispatch(deleteMenuSelectState())
        })
    },[])


    const getMenus = async () => {
        let res = await RequestMethod('get', `loadMenu`, {
            path: {
                tab: 'ROLE_TOOL_01'
            }
        })

        if(res){
            let tmpColumn = columnlist["toolWarehousingRegister"]

            tmpColumn = tmpColumn.map((column: any) => {
                let menuData: object | undefined;
                res.bases && res.bases.map((menu: any) => {
                    if(menu.colName === column.key){
                        menuData = {
                            id: menu.id,
                            name: menu.title,
                            width: menu.width,
                            tab:menu.tab,
                            unit:menu.unit,
                            moddable: menu.moddable,
                        }
                    } else if(menu.colName === 'id' && column.key === 'tmpId'){
                        menuData = {
                            id: menu.id,
                            name: menu.title,
                            width: menu.width,
                            tab:menu.tab,
                            unit:menu.unit,
                            moddable: menu.moddable,
                        }
                    }
                })

                if(menuData){
                    return {
                        ...column,
                        ...menuData,
                    }
                }
            }).filter((v:any) => v)

            // setColumn([...tmpColumn])
            setColumn([...tmpColumn.map(v=> {
                return {
                    ...v,
                    name: !v.moddable ? v.name+'(필수)' : v.name
                }
            })])
        }
    }

    const toToolObject = (data:any) => {
        return {
            tool: {
                tool_id: data.code,
                code: data?.tool_id,
                name: data.name,
                unit: data.unitPK ?? data.unit,
                // customer: data.customerArray ?? data.customer,
                customer : data?.customerArray?.customer_id ? data.customerArray : null,
                sync: data.sync,
                version: data.version ?? undefined,
                additional: data.additional,
                products: data.products,
                stock: data?.warehousing,
            },
            date: moment(data.date).format('YYYY-MM-DD'),
            warehousing: data.amount
        }
    }

    const validate = (row) => {
        if(!!!row.tool_id) throw(alertMsg.noTool)
        if(!!!row.amount) throw(alertMsg.noImportAmount)
    }

    const SaveBasic = async () => {
        try {
            if(selectList.size === 0) throw(alertMsg.noSelectedData)
            const selected = basicRow.filter(row => selectList.has(row.id))
            const postBody = selected.map((row, i) => {
                validate(row)
                return toToolObject(row)
            })
            const res = await RequestMethod('post', `lotToolSave`, postBody)

            if(res){
                Notiflix.Report.success('저장되었습니다.','','확인', () => {
                    setTimeout(() => {
                        router.push("/mes/tool/warehousinglist")
                    }, 300)
                });
            }
        } catch(errMsg){
            Notiflix.Report.warning("경고", errMsg, "확인",)
        }
    }

    const buttonEvents = (number:number) => {
        switch(number) {
            case 0:
                const randomId = Math.random()*1000;
                setBasicRow([...basicRow, {
                    id:`toolWarehousingRegister_${randomId}`,
                    warehousing:"0",
                    date:moment().format("YYYY.MM.DD")
                }])
                return
            case 1:
                SaveBasic();
                return
            case 2:
                if(selectList.size === 0) {
                    return  Notiflix.Report.warning("경고",alertMsg.noSelectedData,"확인" )
                }
                Notiflix.Confirm.show("경고","삭제하시겠습니까?","확인", "취소", () => {
                    const tmpRow = basicRow.filter(({id}, index) => !selectList.has(id))
                    setBasicRow(tmpRow);
                })
                return
            default :
                return
        }
    }

    return (
        <div>
            <PageHeader
                title={"공구 입고 등록"}
                buttons={
                    ['행추가', '저장하기', '삭제']
                }
                buttonsOnclick={buttonEvents}

            />

            <ExcelTable
                resizable
                selectable
                headerList={[
                    SelectColumn,
                    ...column
                ]}
                row={basicRow}
                setRow={(e) => {
                    let tmp: Set<any> = selectList
                    let tmpBasicRow = [...e]

                    e.map((v, index) => {
                        if(v.isChange) {
                            tmp.add(v.id)
                            v.isChange = false
                        }
                        // if(basicRow[index].amount == v.amount) {
                            if (v.code) {
                                tmpBasicRow[index].tool_id_save = v.tool_id
                                tmpBasicRow[index].code_save = v.code
                            }
                        // }
                        if(v.customer) {
                            tmpBasicRow[index].customer_id = v.customer
                        }
                    })
                    setSelectList(tmp)
                    setBasicRow(tmpBasicRow)
                }}
                selectList={selectList}
                //@ts-ignore
                setSelectList={setSelectList}
                width={1576}
            />
            {/*<PaginationComponent currentPage={} setPage={} totalPage={}  />*/}
        </div>
    )
}

export {MesToolRegister};
