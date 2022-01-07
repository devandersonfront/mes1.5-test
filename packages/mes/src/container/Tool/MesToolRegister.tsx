import React, {useState} from "react";
import styled from "styled-components";
import {ExcelTable, Header as PageHeader} from "shared";
import {columnlist} from "shared";
//@ts-ignore
import {SelectColumn} from "react-data-grid";
import moment from "moment";
//@ts-ignore
import Notiflix from "notiflix";

const MesToolRegister = () => {
    console.log(moment().format("YYYY.MM.DD"))
    const [basicRow, setBasicRow] = useState<Array<any>>([{
        id:`toolWarehousingRegister_${Math.random()*1000}`,
        warehousing:"0",
        date:moment().format("YYYY.MM.DD"),
    }]);
    const [column, setColumn] = useState<any>(columnlist.toolWarehousingRegister);
    const [selectList, setSelectList] = useState<Set<number>>(new Set())

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
                console.log(basicRow)
                //result 값 가지고 save
                console.log(result)
                return
            case 2:
                Notiflix.Confirm.show("경고","삭제하시겠습니까?","확인", "취소", () => {
                    const tmpRow = [...basicRow].reverse();
                    tmpRow.map(({id}, index) => {
                        if(selectList.has(id)) {
                            console.log(id, index)
                            tmpRow.splice(index, 1)
                        }
                    })
                    console.log(tmpRow.reverse());
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
        </div>
    )
}

export {MesToolRegister};
