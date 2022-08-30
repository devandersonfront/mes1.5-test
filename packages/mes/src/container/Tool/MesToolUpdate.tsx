import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {ExcelTable, Header as PageHeader, PaginationComponent, RequestMethod, RootState} from "shared";
import {columnlist} from "shared";
//@ts-ignore
import {SelectColumn} from "react-data-grid";
import moment from "moment";
//@ts-ignore
import Notiflix from "notiflix";
import {useRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";
import {deleteMenuSelectState, setMenuSelectState} from "shared/src/reducer/menuSelectState";

const MesToolUpdate = () => {
    const router = useRouter();
    const dispatch = useDispatch()
    const toolStore = useSelector((router:RootState) => router.toolInfo);
    const [basicRow, setBasicRow] = useState<Array<any>>([]);
    const [column, setColumn] = useState<any>(columnlist.toolWarehousingUpdate);
    const [selectList, setSelectList] = useState<Set<number>>(new Set())

    const cleanUpData = () => {
        const newData = toolStore.map((value) => (
          {
              ...value,
            code: value.tool_id,
            customer: value.customer_id,
            customerData: value.tool.customer,
        }))
        setBasicRow(newData);
    }

    const SaveCleanUpData = (data:any[]) => {
       return data.map((rowData, index) => ({
            tool: {
                tool_id: rowData?.tool.tool_id,
                code: rowData.code,
                name: rowData.name,
                unit: rowData.unitPK,
                stock: rowData?.stock,
                customer: rowData.customerData,
                additional: rowData?.additional ?? [],
                version: rowData?.version ?? undefined,
            },
            date: rowData.date,
            warehousing: rowData.warehousing,
            lot_tool_id: rowData.lot_tool_id,
            version: rowData.version
        }))
    }

    const SaveBasic = async(data:any) => {
        await RequestMethod("post", "lotToolSave", data)
            .then((res) => {
                Notiflix.Report.success("저장되었습니다.","","확인", () => router.push("/mes/tool/warehousinglist"))
            })
            .catch((err) => {
                Notiflix.Report.failure("에러가 발생했습니다. 관리자에게 문의해주시기 바랍니다.","","확인")
            })
    }
    const buttonEvents = (number:number) => {
        switch(number) {
            case 0:
                const result = basicRow.filter((row) => selectList.has(row.id))
                //result 값 가지고 save
                SaveBasic(SaveCleanUpData(result));

                return
            case 1:
                Notiflix.Confirm.show("경고","삭제하시겠습니까?","확인", "취소", () => {
                    const tmpRow = basicRow.filter(({id}, index) => !selectList.has(id))
                    setBasicRow(tmpRow);
                })
                return
            default :
                return
        }
    }

    useEffect(() => {
        if(toolStore.data === ""){
            router.push("/mes/tool/list")
        }else{
            cleanUpData();
            dispatch(setMenuSelectState({main:"공구 관리",sub:"/mes/tool/warehousinglist"}))
        }
        return(() => {
            dispatch(deleteMenuSelectState())
        })
    },[])

    return (
        <div>
            <PageHeader
                title={"공구 입고 (수정)"}
                buttons={
                    ['저장하기', '삭제']
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
            />
            {/*<PaginationComponent currentPage={} setPage={} totalPage={}  />*/}
        </div>
    )
}

export {MesToolUpdate};
