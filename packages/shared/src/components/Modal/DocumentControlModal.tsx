import React, {useEffect, useState} from "react";
import Modal from "react-modal";
import styled from "styled-components";
import FileUploader from "../Buttons/FileUploader";
import {RequestMethod} from "../../common/RequestFunctions";
import DropdownModal from "../Dropdown/DropdownModal";
import Notiflix from 'notiflix'

interface Props {
    isOpen:boolean
    setIsOpen: (value:boolean) => void
    type:"folderAdd" | "documentUpload" | "fileMove"
    reload?:() => void
    allFolder?:any[]
    selectFile?:any
    parentData?:any
    rows ?:any
}

const DocumentControlModel = ({isOpen, setIsOpen, type, reload, allFolder, selectFile, parentData,rows}:Props) => {
    const [fileInfo, setFileInfo] = useState<{doc_id?:number, name:string, type:string, parent?:any, file_uuid?:string, version?:string}[]>([])
    const [selectOption, setSelectOption] = useState<any>("");

    const changeSetSelectOption = (value:any) => {
        setSelectOption(value)
    }


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
                        <div style={{display:"flex",}}>
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
                        </div>
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
                        <div style={{display:"flex",}}>
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
                        </div>
                    </ModalBody>
                )
            case "fileMove":
                return (
                    <ModalBody>
                        <ModalHeader>
                            파일 이동
                        </ModalHeader>
                        <FileUploader type={"disabled"} value={selectFile?.name} />
                        <DropdownModal options={allFolder} value={selectOption} onChange={changeSetSelectOption}/>
                        <div style={{display:"flex",}}>
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

    // useEffect(() => {
    //     setFileInfo([])
    // },[isOpen])

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
