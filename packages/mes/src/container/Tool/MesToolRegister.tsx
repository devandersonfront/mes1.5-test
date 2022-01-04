import React, {useState} from "react";
import styled from "styled-components";
import {ExcelTable, Header as PageHeader} from "shared";
import {columnlist} from "../../../../main/common/columnInit";
//@ts-ignore
import {SelectColumn} from "react-data-grid";
import {useOpenState} from "@material-ui/pickers/_shared/hooks/useOpenState";

const MesToolRegister = () => {

    const [basicRow, setBasicRow] = useState<Array<any>>([{name:"품명", code:"CODE", }]);


    return (
        <div>
            <PageHeader
                title={"공구 입고 등록"}
                buttons={
                    ['행추가', '저장하기', '삭제']
                }
                buttonsOnclick={() => {}}
            />

            <ExcelTable
                headerList={[
                    SelectColumn,
                    ...columnlist.toolRegister
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
