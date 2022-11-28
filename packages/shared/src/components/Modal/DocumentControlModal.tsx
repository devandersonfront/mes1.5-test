import React, {useEffect, useState} from "react";
import Modal from "react-modal";
import styled from "styled-components";
import FileUploader from "../Buttons/FileUploader";
import {RequestMethod} from "../../common/RequestFunctions";
import DropdownModal from "../Dropdown/DropdownModal";
import Notiflix from 'notiflix'
import {IDoc, IDocWithChild, IMenu} from "../../@types/type";
import TreeView from "../TreeView/TreeView";
import {RecursiveTree} from "../Recursive/RecursiveTree";

interface Props {
    isOpen:boolean
    setIsOpen: (value:boolean) => void
    type:"folderAdd" | "documentUpload" | "fileMove"
    reload?:() => void
    allFolder?:any[]
    selectFile?:any
    parentData?:any
    rows ?:IDoc[]
}

const DocumentControlModal = ({isOpen, setIsOpen, type, reload, allFolder, selectFile, parentData,rows}:Props) => {
    const [fileInfo, setFileInfo] = useState<{doc_id?:number, name:string, type:string, parent?:any, file_uuid?:string, version?:string}[]>([])
    const [selectOption, setSelectOption] = useState<any>("");
    const [menu, setMenu] = React.useState<IDocWithChild[]>([])

    React.useEffect(() => {
        setMenu([{
            created : undefined,
            date : undefined,
            doc_id : undefined,
            file_uuid : undefined,
            id : undefined,
            member : undefined,
            name : '표준문서 관리',
            parent : undefined,
            parentId : undefined,
            type : 'dir',
            version : undefined,
            child : undefined
        }])
    }, [rows])



    const contentSet = (type:"folderAdd" | "documentUpload" | "fileMove") => {
        switch (type){
            case "folderAdd":
                return (
                    <ModalBody>
                        <ModalHeader>
                            문서 폴더 추가
                        </ModalHeader>
                        <FileUploader type={"folder"} onChange={(value) => {
                            setFileInfo([{name:value, type:"dir"}])
                        }}/>
                        <ButtonWrapper>
                            <Button onClick={() => {
                                setIsOpen(false)
                            }}>취소</Button>
                            <Button
                                style={{color:"#111319", background:"#19B9DF"}}
                                onClick={async()=>{

                                    const folderList = rows.filter((row)=> row.type === '폴더')
                                    const isCheck = folderList.some((folder)=> folder.name === fileInfo[0]?.name)

                                    if(fileInfo.length === 0){
                                        return Notiflix.Report.warning(
                                            '경고',
                                            '폴더명을 입력해주세요.',
                                            'Okay',
                                        );
                                    }

                                    if(isCheck){
                                        return Notiflix.Report.warning(
                                            '경고',
                                            '해당 위치에 중복되는 폴더명이 있습니다.',
                                            'Okay',
                                        );
                                    }

                                    await RequestMethod("post", "documentSave",
                                        [{...fileInfo[0], parent:parentData.name ==="표준 문서 관리" ? undefined : parentData}])
                                        .then((res) => {
                                            setIsOpen(false);
                                            setFileInfo([])
                                            reload()
                                        })
                                }}
                            >확인</Button>
                        </ButtonWrapper>
                    </ModalBody>
                )
            case "documentUpload":
                return (
                    <ModalBody>
                        <ModalHeader>
                            문서 업로드
                        </ModalHeader>
                        <FileUploader
                            multi={true}
                            type={"input"}
                            onChange={(files) => {
                                setFileInfo(files.map((file)=>(
                                    {
                                        file_uuid:file.UUID,
                                        type:file.type,
                                        name:file.name,
                                        parent: parentData.name ==='표준 문서 관리' ? undefined : parentData
                                    }
                                )))
                            }} />
                        <ButtonWrapper>
                            <Button onClick={() => {
                                setIsOpen(false)
                            }}>취소</Button>
                            <Button
                                style={{color:"#111319", background:"#19B9DF"}}
                                onClick={async() => {
                                    if(fileInfo.length === 0){
                                        return Notiflix.Report.warning(
                                            '경고',
                                            '파일을 업로드해주세요.',
                                            'Okay',
                                        );
                                    }
                                    await RequestMethod("post", "documentSave", fileInfo)
                                        .then(() => {
                                            setIsOpen(false);
                                            setFileInfo([])
                                            reload()
                                        })

                                }}
                            >확인</Button>
                        </ButtonWrapper>
                    </ModalBody>
                )
            case "fileMove":
                return (
                    <div>
                        <ModalHeader>
                            파일 이동
                        </ModalHeader>
                        <FileUploader type={"disabled"} value={selectFile?.name} />
                        <div style={{background:'rgb(39 49 73)'}}>
                            {
                                menu.map((data)=>{
                                    return  <RecursiveTree initData={data} onRadioClick={setSelectOption}/>
                                })
                            }
                        </div>
                        <ButtonWrapper>
                            <Button onClick={() => {
                                setIsOpen(false)
                            }}>취소</Button>
                            <Button
                                style={{color:"#111319", background:"#19B9DF"}}
                                onClick={async() => {
                                    await RequestMethod("post", "documentMove",[{...selectFile, parent:selectOption}])
                                        .then((res) => {
                                            setIsOpen(false)
                                            reload()
                                        })
                                }}
                            >확인</Button>
                        </ButtonWrapper>
                    </div>
                )
            default :
                return (
                    <div>
                        타입을 선택해주세요.
                    </div>
                )

        }
    }

    return (
        <div>
            <Modal isOpen={isOpen} style={{
                content: {
                    top: '50%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    marginRight: '-50%',
                    transform: 'translate(-50%, -50%)',
                    padding: 0,
                    overflow:""
                },
                overlay: {
                    background: 'rgba(0,0,0,.6)',
                    zIndex: 5
                }
            }}>
                {contentSet(type)}
            </Modal>
        </div>
    )

}

const ModalBody = styled.div<any>`
    border-radius:6px;
    width:360px;
    height:200px;
    display:flex;
    flex-direction:column;
    justify-content:space-between;
    align-items:center;
`;

const ModalHeader = styled.div`
    width:100%;
    height:48px;
    border-bottom: 1px solid #D5D5D5;
    display:flex;
    justify-content:center;
    align-items:center;
    font-size: 22px;   
`;

const ButtonWrapper = styled.div`
    display: flex;
    width : 100%;
`

const Button = styled.button`
    width:50%;
    height:48px;
    display:flex;
    border:none;
    justify-content:center;
    align-items:center;
    background: #E7E9EB;
    color:#666D79;
    font-size:18px;
    font-weight:bold;
`;

export default DocumentControlModal
