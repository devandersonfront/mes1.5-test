import React, {useState} from "react";
import styled from "styled-components";
import {columnlist, ExcelTable, Header as PageHeader} from "shared";
//@ts-ignore
import {SelectColumn} from "react-data-grid";
import moment from "moment";

const MesToolList = () => {
    console.log(moment().format("YYYY.mm.DD"))
    const [basicRow, setBasicRow] = useState<Array<any>>([
        {
            elapsed:"test!",
            code:"test!",
            name:"test!",
            unit:"test!",
            customer:"test!",
            warehousing:"test!",
            date:moment().format("YYYY.mm.DD"),
        }
    ]);
    const [column, setColumn] = useState<any>(columnlist.toolWarehousingList)
    const [selectList, setSelectList] = useState<Set<number>>(new Set())

    return (
        <div>
            <PageHeader
                title={"공구 재고 현황"}
                buttons={
                    ['행추가', '저장하기', '삭제']
                }
                buttonsOnclick={() => {}
                    // () => {}
                    // onClickHeaderButton
                }
            />
            <ExcelTable
                headerList={[SelectColumn,...column]}
                row={basicRow}
                setRow={(e) => {
                    let tmp: Set<any> = selectList
                    e.map(v => {
                        if(v.isChange) tmp.add(v.id)
                    })
                    setSelectList(tmp)
                    setBasicRow(e);
                }} />

        </div>
    )
}

export {MesToolList};
