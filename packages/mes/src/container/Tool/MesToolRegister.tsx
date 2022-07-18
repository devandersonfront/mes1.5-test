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


    const SaveCleanUpData = (data:any[]) => {
        let resultData = [];
        let amountCheck = true
        data.map((rowData, index) => {
            if(rowData.amount <= 0 || rowData.amount === undefined){
                amountCheck = false
            }
            let tmpRow:any = {};
            let toolObject:any = {};
            toolObject.tool_id = rowData.code;
            toolObject.code = rowData?.tool_id;
            toolObject.name = rowData.name;
            toolObject.unit = rowData.unitPK ?? rowData.unit;
            toolObject.stock = rowData?.warehousing;
            toolObject.customer = rowData.customerArray ?? rowData.customer;
            toolObject.additional = rowData?.additional ?? [];
            toolObject.version = rowData?.version ?? undefined;

            tmpRow.tool = toolObject;
            tmpRow.date = rowData.date;
            tmpRow.warehousing = rowData.amount;
            // tmpRow.amount = rowData.amount;
            resultData.push(tmpRow);
        })
        if(amountCheck) return resultData
        else return Notiflix.Report.warning("경고","입고량을 입력해 주시기 바랍니다.","확인")
    }

    const SaveBasic = async(data:any) => {
        const res = await RequestMethod("post", "lotToolSave", data)

        if(res){
            Notiflix.Report.success("저장되었습니다.","","확인", () => router.push("/mes/tool/list"))
        }else{
            Notiflix.Report.failure("에러가 발생했습니다. 관리자에게 문의해주시기 바랍니다.","","확인")
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
                const result = basicRow.filter((row) => {
                    if (selectList.has(row.id)) return row
                })
                if(selectList.size < 0 ) return Notiflix.Report.warning("경고","데이터를 선택해주세요.","확인")
                //result 값 가지고 save
                SaveBasic(SaveCleanUpData(result));

                return
            case 2:
                if(selectList.size < 0 ) return Notiflix.Report.warning("경고","데이터를 선택해주세요.","확인")
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
