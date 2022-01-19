import React, {useEffect, useState} from "react";
import Modal from "react-modal";
import styled from "styled-components";
import FileUploader from "../Buttons/FileUploader";
import {RequestMethod} from "../../common/RequestFunctions";

interface Props {
    isOpen:boolean
    setIsOpen: (value:boolean) => void
    type:"folderAdd" | "documentUpload" | "fileMove"
    onFunction?: (file:any) => void
}

const DocumentControlModel = ({isOpen, setIsOpen, type, onFunction}:Props) => {

    const [fileInfo, setFileInfo] = useState<{doc_id?:number, name:string, type:string, parent?:any, file_uuid?:string, version?:string}[]>([])



    const contentSet = (type:"folderAdd" | "documentUpload" | "fileMove") => {
        switch (type){
            case "folderAdd":
                return (
                    <ModalBody>
                        <ModalHeader>
                            문서 폴더 추가
                        </ModalHeader>
                        <FileUploader type={"folder"} onChange={(value) => {
                            setFileInfo([{name:value, type:"dir" }])
                            console.log("fileInfo : ", fileInfo)
                        }}/>
                        <div style={{display:"flex",}}>
                            <Button onClick={() => {
                                setIsOpen(false)
                            }}>취소</Button>
                            <Button
                                style={{color:"#111319", background:"#19B9DF"}}
                                onClick={async()=>{
                                    // onFunction(fileInfo)
                                    await RequestMethod("post", "documentSave", fileInfo)
                                    console.log("fileInfo => ", fileInfo)
                                }}
                            >확인</Button>
                        </div>
                    </ModalBody>
                )
            case "documentUpload":
                return (
                    <ModalBody>
                        <ModalHeader>
                            문서 업로드
                        </ModalHeader>
                        <FileUploader type={"input"} />
                        <div style={{display:"flex",}}>
                            <Button onClick={() => {
                                setIsOpen(false)
                            }}>취소</Button>
                            <Button
                                style={{color:"#111319", background:"#19B9DF"}}
                                onClick={() => {
                                    // onFunction()
                                }}
                            >확인</Button>
                        </div>
                    </ModalBody>
                )
            case "fileMove":
                return (
                    <ModalBody>
                        <ModalHeader>
                            파일 이동
                        </ModalHeader>
                        <div style={{display:"flex",}}>
                            <Button onClick={() => {
                                setIsOpen(false)
                            }}>취소</Button>
                            <Button style={{color:"#111319", background:"#19B9DF"}}>확인</Button>
                        </div>
                    </ModalBody>
                )
            default :
                return (
                    <div>
                        타입을 선택해주세요.
                    </div>
                )

        }
    }

    useEffect(() => {
        setFileInfo([])
    },[isOpen])

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
                },
                overlay: {
                    background: 'rgba(0,0,0,.6)',
                    zIndex: 5
                }
            }}>
                {contentSet(type)}
                {/*<div style={{display:"flex",}}>*/}
                {/*    <Button onClick={() => {*/}
                {/*        setIsOpen(false)*/}
                {/*    }}>취소</Button>*/}
                {/*    <Button*/}
                {/*        style={{color:"#111319", background:"#19B9DF"}}*/}
                {/*        onClick={() => {*/}
                {/*            onFunction(fileInfo)*/}
                {/*        }}*/}
                {/*    >확인</Button>*/}
                {/*</div>*/}
            </Modal>
        </div>
    )

}

const ModalBody = styled.div`
    border-radius:6px;
    width:360px;
    height:192px;
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

const Button = styled.button`
    width:180px;
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

export default DocumentControlModel
