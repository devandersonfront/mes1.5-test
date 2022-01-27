import React, {useEffect, useState} from "react";
import {columnlist, ExcelTable, Header as PageHeader, RequestMethod} from "shared";
//@ts-ignore
import {SelectColumn} from "react-data-grid";
import DocumentControlModal from "../../../shared/src/components/Modal/DocumentControlModal";
//@ts-ignore
import Notiflix from "notiflix";
import moment from "moment";

const BasicDocumentLogs = () => {

    const [basicRow, setBasicRow] = useState<any[]>([]);

    const LoadBasic = async() => {
        const res = await RequestMethod("get", "documentLogs",{
            path:{
                page:1,
                renderItem:15
            }
        })

        if(res){
            console.log(res)
            cleanUpData(res)
        }
    }

    const typeFilter = (type:"CREATE" | "UPLOAD" | "DOWNLOAD" | "MOVE" | "DELETE") => {
        switch(type) {
            case "CREATE" :
                return "생성"

            case "UPLOAD" :
                return "업로드"

            case "DOWNLOAD" :
                return "다운로드"

            case "MOVE" :
                return "이동"

            case "DELETE" :
                return "삭제"

            default :
                return "-"
        }
    }

    const cleanUpData = (datas:any[]) => {
        let resultDatas = [];

        datas.map((data) => {

            const randomId = Math.random()*1000;
            let result:any = {...data, id:randomId};
            result.type = data.document.type === "dir" ? "폴더" : data.document.type;
            result.date = moment(data.created).format("YYYY.MM.DD HH:mm:ss");
            result.content = `${data.member.name}(${data.member.id})님께서 ${data.document.name}(을)를 ${typeFilter(data.type)} 하였습니다.`;
            resultDatas.push(result);
        })

        setBasicRow(resultDatas)
    }



    useEffect(()=>{
        LoadBasic();
    },[])

    return (
        <div>
            <PageHeader
                title={"문서 로그"}
                // buttons={selectList.size >= 2 ? ["", "", "문서 다운로드","", "", "삭제"] : ["문서 폴더 추가", "문서 업로드", "문서 다운로드", "문서 로그", "파일 이동", "삭제"]}
                // buttonsOnclick={buttonEvents}
            />
            <ExcelTable
                headerList={columnlist.documentLog}
                row={basicRow}
                setRow={(e) => {
                    setBasicRow(e)
                }}
            />
        </div>
    )
}

export {BasicDocumentLogs}
