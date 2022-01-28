import React, {useEffect, useState} from "react";
import {columnlist, ExcelTable, Header as PageHeader, RequestMethod} from "shared";
//@ts-ignore
import {SelectColumn} from "react-data-grid";
import DocumentControlModal from "../../../shared/src/components/Modal/DocumentControlModal";
//@ts-ignore
import Notiflix from "notiflix";
import moment from "moment";
import {useRouter} from "next/router";

interface IProps {
    children?: any
    page?: number
    keyword?: string
    option?: number
    doc_id?: number
}

const BasicDocument = ({page, keyword, option, doc_id}: IProps) => {
    const router = useRouter();

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [modalType, setModalType] = useState<"folderAdd" | "documentUpload" | "fileMove" | null>(null);
    const [basicRow, setBasicRow] = useState<any[]>([]);
    //현재 위치의 폴더 Info
    const [parentData, setParentData] = useState<any>();

    //파일 이동 시 옵션 리스트
    const [folderList, setFolderList] = useState<any[]>();

    //폴더 이동 시 사용하는 state
    const [moveFile, setMoveFile] = useState<number>();
    const [selectList, setSelectList] = useState<Set<number>>(new Set());

    const LoadBasic = async() => {
        const res = await RequestMethod("get", "documentList",
            {
                path:{
                    docId:doc_id ?? null
                }
            })

        if(res){
            cleanUpData(res)
            setSelectList(new Set());
        }
    }

    const LoadDocumentState = async() => {
        if(doc_id){
            const res = await RequestMethod("get", "documentLoad", {
                path:{doc_id : doc_id}
            })
            if(res){
                setParentData({...res})
            }

        }

    }

    const DeleteBasic = async() => {
        const res = await RequestMethod("delete", "documentDelete", selectFile())
        if(res){
            LoadBasic();
        }
    }

    const DocumentDownLoad = async() => {

        const downloadDatas = []
        basicRow.map((row)=>{
            if(selectList.has(row.id)){
                downloadDatas.push(row);
            }
        })

        await RequestMethod("post", "documentDownLoad", downloadDatas)
            .then((res) => {
                if(res){
                    downloadDatas.map((file) => {
                        RequestMethod("get", "anonymousLoad", {
                            path:{
                                uuid:file.file_uuid
                            }
                        })
                            .then((response) => {
                                window.open(response.url)
                            })
                    })
                }

            })
    }

    const cleanUpData = (datas:any[]) => {
        let resultDatas = [];
        let folderList = [];
        datas.map((data) => {
            const randomId = Math.random()*1000;
            let result:any = {...data, id:"document_"+randomId};
            result.type = data.type === "dir" ? "폴더" : data.type;
            // result.date = data.created;
            result.date = moment().format("YYYY-MM-DD");

            if(data.type === "dir"){
                folderList.push(data)
                // folderList.push("fileParent")
            }

            resultDatas.push(result);
        })

        setBasicRow(resultDatas)
        setFolderList(folderList);
        settingFolderList();
    }

    const settingFolderList = async() => {
        await RequestMethod("get", "documentAll",{
            params:{
                type:"dir"
            }
        })
            .then((res) => {
                setFolderList(res)
            })
    }

    const selectFile = () => {
        const data = basicRow.filter((row) => {
            Object.keys(row).map((key) => {
                if(row[key] === null){
                    row[key] = undefined
                }
            })
            return selectList.has(row.id);
        })
        return [...data]
    }

    const buttonEvents = (index:number) => {
        switch (index){
            case 0:
                setIsOpen(true);
                setModalType("folderAdd");
                return

            case 1:
                setIsOpen(true);
                setModalType("documentUpload");
                return

            case 2:
                if(selectList.size <= 0) {
                    Notiflix.Report.warning("경고", "데이터를 선택해주시기 바랍니다.", "확인",)
                    return
                }else{
                    selectFile().map((value,index) =>{
                        if(value.type === "폴더"){
                            Notiflix.Report.warning("경고", "파일을 선택해주시기 바랍니다.", "확인");
                            return
                        }
                    })
                }
                DocumentDownLoad();
                return

            case 3:
                router.push("/mes/basic/document/logs")
                return

            case 4:
                if(selectList.size <= 0) {
                    Notiflix.Report.warning("경고", "데이터를 선택해주시기 바랍니다.", "확인",)
                    return
                }else{
                    if(selectFile()[0].type === "폴더") {
                        Notiflix.Report.warning("경고", "파일을 선택해주시기 바랍니다.", "확인");
                        return
                    }
                }
                setIsOpen(true);
                setModalType("fileMove");
                return

            case 5:
                if(selectList.size <= 0) {
                    Notiflix.Report.warning("경고", "데이터를 선택해주시기 바랍니다.", "확인",)
                    return
                }
                Notiflix.Confirm.show("경고","문서를 삭제하시겠습니까?","확인","취소",() =>{
                    DeleteBasic()

                }, () => {

                })
                return
            default:
                return
        }
    }

    useEffect(()=>{
        LoadBasic();
        LoadDocumentState();
        setSelectList(new Set());
        setParentData("")
    },[doc_id])

    return (
        <div>
            <PageHeader
                title={parentData?.name ?? "표준 문서 관리"}
                buttons={selectList.size >= 2 ? ["", "", "문서 다운로드","", "", "삭제"] : ["문서 폴더 추가", "문서 업로드", "문서 다운로드", "문서 로그", "파일 이동", "삭제"]}
                buttonsOnclick={buttonEvents}
            />
            <ExcelTable
                headerList={[SelectColumn,...columnlist.documentManage]}
                row={basicRow}
                setRow={(e) => {
                    setBasicRow(e)
                }}
                selectList={selectList}
                setSelectList={(e) => {
                    //@ts-ignore
                    setSelectList(e)
                }}
                setSelectRow={(e) => {
                    setMoveFile(e)
                    if(basicRow[e].type === "폴더" || basicRow[e].type === "dir"){
                        // setFolderId(basicRow[e]?.doc_id)
                        if(moveFile === e){
                            router.push("/mes/basic/document?doc_id="+basicRow[e].doc_id)
                        }
                    }
                }}
            />
            <DocumentControlModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                type={modalType}
                reload={LoadBasic}
                folderList={folderList}
                selectFile={basicRow.filter((row) => selectList.has(row.id))[0]}
                parentData={parentData}
            />
        </div>
    )
}

export {BasicDocument}
