import React, {useState} from "react"
import styled from "styled-components"
import {columnlist, ExcelTable, Header as PageHeader} from "shared";
import {PointColorButton} from "../../../../main/styles/styledComponents";

const AiDataSet = () => {

    const [column, setColumn] = useState(columnlist.dataSet)
    const [basicRow, setBasicRow] = useState<any[]>([{
        name:"테스트 제품",
        code:"CODE",
        machine_name:"Machine1",
        start:"2022-01-01",
        end:"2022-12-31",
        valid_data:"500",
        download:"",
    }])

    const downloadButton =  () => {
        return (
            <div style={{backgroundColor:"white", height:"40px",display:"flex",justifyContent:"center",alignItems:"center",}}>
                <PointColorButton onClick={() => {
                    console.log("good")
                }} style={{
                    width:"80%",
                    display:"flex",
                    justifyContent:"center",
                    alignItems:"center",
                    height:35,
                }}>
                    파일 다운로드
                </PointColorButton>
            </div>
        )
    }

    return (
        <div>
            <PageHeader
                title={"AI 데이터셋"}
            />
            <ExcelTable
                editable
                resizable
                headerList={[...column.map((v) => {
                    if(v.key == "download") return {...v, formatter:downloadButton}
                    return v
                })]}
                row={basicRow}
                setRow={(row) => {
                    console.log(row)
                }}
                width={1576}
            />
        </div>
    )
}

export {AiDataSet}
