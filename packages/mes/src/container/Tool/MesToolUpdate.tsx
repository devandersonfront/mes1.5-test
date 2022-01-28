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
import {useSelector} from "react-redux";

const MesToolUpdate = () => {
    const router = useRouter();
    const toolStore = useSelector((router:RootState) => router.toolInfo);
    const [basicRow, setBasicRow] = useState<Array<any>>([]);
    const [column, setColumn] = useState<any>(columnlist.toolWarehousingUpdate);
    const [selectList, setSelectList] = useState<Set<number>>(new Set())

    const cleanUpData = () => {
        let cleanData = [...toolStore];

        cleanData.map((value) => {
            value.code = value.tool_id;
            // rowData.name = value.name;
            // rowData.unit = value.unit;
            value.customer = value.customer_id;

            return value
        })
        setBasicRow([...cleanData]);
    }

    const SaveCleanUpData = (data:any[]) => {
        let resultData = [];
        data.map((rowData, index) => {
            let tmpRow:any = {};
            let toolObject:any = {};
            toolObject.tool_id = rowData?.tool.tool_id;
            toolObject.code = rowData.code;
            toolObject.name = rowData.name;
            toolObject.unit = rowData.unitPK;
            toolObject.stock = rowData?.stock;
            toolObject.customer = rowData.customerData;
            toolObject.additional = rowData?.additional ?? [];
            toolObject.version = rowData?.version ?? undefined;

            tmpRow.tool = toolObject;
            tmpRow.date = rowData.date;
            tmpRow.warehousing = rowData.warehousing;
            tmpRow.lot_tool_id = rowData.lot_tool_id;

            resultData.push(tmpRow);
        })
        return resultData;
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
                const result = basicRow.filter((row) => {
                    if (selectList.has(row.id)) return row
                })
                //result 값 가지고 save
                SaveCleanUpData(result)
                SaveBasic(SaveCleanUpData(result));
                router.push("/mes/tool/list");

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
        if(toolStore?.data === ''){
            // Notiflix.Report.warning("수정할 데이터가 없습니다.","","확인",() =>
                router.back()
            // )
        }
        cleanUpData();
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
                headerList={[
                    SelectColumn,
                    ...column
                ]}
                row={basicRow}
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
            />
            {/*<PaginationComponent currentPage={} setPage={} totalPage={}  />*/}
        </div>
    )
}

export {MesToolUpdate};
