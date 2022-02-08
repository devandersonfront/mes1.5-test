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

const MesToolRegister = () => {
    const router = useRouter();
    const [basicRow, setBasicRow] = useState<Array<any>>([{
        id:`toolWarehousingRegister_${Math.random()*1000}`,
        warehousing:"0",
        date:moment().format("YYYY.MM.DD"),
    }]);
    const [column, setColumn] = useState<any>(columnlist.toolWarehousingRegister);
    const [selectList, setSelectList] = useState<Set<number>>(new Set())

    const CheckAuthorize = async() => {
        await RequestMethod("get", "loadMenu", {
            path:{
                tab:"ROLE_TOOL_01"
            }
        }).then((res) =>{
            console.log(res)
        })
            .catch((err) => {
                console.log(err)
            })
    }

    const SaveCleanUpData = (data:any[]) => {
        let resultData = [];
        data.map((rowData, index) => {
            let tmpRow:any = {};
            let toolObject:any = {};
            toolObject.tool_id = rowData?.tool_id;
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
                //result 값 가지고 save
                SaveCleanUpData(result)
                SaveBasic(SaveCleanUpData(result));

                return
            case 2:
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
        CheckAuthorize()
    },[])

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

export {MesToolRegister};
