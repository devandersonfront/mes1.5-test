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

    // 해당 리스트의 데이터를 받아오는 함수
    const LoadBasic = async() => {

        const res = await RequestMethod("get", "documentList",{ path: { docId : doc_id ?? null}})

        if(res){
            const convertData = res.map((v)=>({...v , id : v.doc_id, type : v.type === "dir" ? "폴더" : v.type , date : moment(v.created).format("YYYY-MM-DD")}))
            const classfyData = res.filter(v => v.type === 'dir')

            setBasicRow(convertData)
            setFolderList(classfyData)
            setSelectList(new Set())
        }
    }

    // 문서관리의 이름만을 위한 함수
    const LoadDocumentState = async() => {
        if(doc_id){
            const res = await RequestMethod("get", "documentLoad", {path:{doc_id : doc_id}})
            if(res){
                return setParentData({...res})
            }
        }

        return setParentData({...parentData , name : '표준 문서 관리'})
    }

    // 삭제
    const DeleteBasic = async() => {
        const res = await RequestMethod("delete", "documentDelete", selectFile())
        if(res){
            LoadBasic();
        }
    }

    // 문서 다운로드
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
                        if(file.file_uuid){
                            RequestMethod("get", "anonymousLoad", {
                                path:{
                                    uuid:file.file_uuid
                                }
                            }).then((response) => {
                                    window.open(response.url)
                            })
                        }
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

                    const files = selectFile()
                    let haveFolder;

                    files.map((value,index) =>{
                        if(value.type === "폴더"){
                            Notiflix.Report.warning("경고", "파일을 선택해주시기 바랍니다.", "확인");
                            haveFolder = true
                        }
                    })

                    if(!haveFolder){
                        DocumentDownLoad();
                    }
                }
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

    const moveFolder = (id: string) => {

        if (id !== undefined) {
            router.push({
                pathname: `/mes/basic/document`,
                query: {doc_id : id}
            });
        }
    };

    useEffect(()=>{
        LoadBasic();
        LoadDocumentState();
    },[doc_id])



    return (
        <div>
            <PageHeader
                title={parentData?.name ?? "표준 문서 관리"}
                buttons={selectList.size >= 2 ? ["", "", "문서 다운로드","", "", "삭제"] : ["문서 폴더 추가", "문서 업로드", "문서 다운로드", "문서 로그", "파일 이동", "삭제"]}
                buttonsOnclick={buttonEvents}
            />
            <ExcelTable
                headerList={[SelectColumn,
                    ...columnlist.documentManage({
                        move: moveFolder
                    })]}
                row={basicRow}
                setRow={(e) => {
                    setBasicRow(e)
                }}
                selectList={selectList}
                setSelectList={(e) => {
                    //@ts-ignore
                    setSelectList(e)
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
