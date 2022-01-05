import React, {useState} from "react";
import styled from "styled-components";
import {ExcelTable, Header as PageHeader} from "shared";
import {columnlist} from "shared";
//@ts-ignore
import {SelectColumn} from "react-data-grid";
import moment from "moment";


const MesToolRegister = () => {
    console.log(moment().format("YYYY.MM.DD"))
    const [basicRow, setBasicRow] = useState<Array<any>>([{
        code:"",
        name:"",
        unit:"",
        customer:"",
        warehousing:"0",
        date:moment().format("YYYY.MM.DD"),
    }]);
    const [column, setColumn] = useState<any>(columnlist.toolWarehousingRegister);

    const buttonEvents = (number:number) => {
        switch(number) {
            case 0:
                setBasicRow([...basicRow, {warehousing:"0", date:moment().format("YYYY.MM.DD")}])
                return
            case 1:
                console.log(basicRow)
                return
            case 2:

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
                headerList={[
                    SelectColumn,
                    ...column
                ]}
                row={basicRow}
                setRow={(e) => {
                    console.log(e)
                    setBasicRow(e)
                }}
            />
        </div>
    )
}

export {MesToolRegister};
