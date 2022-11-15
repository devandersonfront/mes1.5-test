import React, {useRef, useState} from "react";
import styled from "styled-components";
import {uploadTempFile} from "../../common/fileFuctuons";

interface Props {
    type:"input" | "disabled" | "folder"
    accept?:string
    onChange?:(value:any) => void
    value?:string
    multi?:boolean
}

const FileUploader = ({type, accept, onChange, value, multi}:Props) => {

    const [fileName, setFileName] = useState<string[] | string>();

    const ref = useRef(null);

    const typeContent = (type: "input" | "disabled" | "folder" ) => {
        switch(type){
            case "input" :
                return (
                        <form encType="multipart/form-data" style={{display:'flex'}}>
                            <input
                                multiple={multi}
                                type={"file"}
                                onChange={async(e) => {
                                    const fileList = Array.from(e.target.files)
                                    const fileTypes = fileList.map((file)=> file.name.split(".").length -1)
                                    const fileNames = fileList.map((file)=> file.name)
                                    const files = await Promise.all(fileList.map(async (file)=>(
                                        await uploadTempFile(file,file.size,true,file.name,file.type)
                                    )))
                                    const result = files.map((file,index )=>{
                                        return {...file , name : e.target.files[index].name , type : e.target.files[0].name.split(".")[fileTypes[index]]}
                                    })
                                    setFileName(fileNames.join(','))
                                    onChange(result)
                                }}
                                accept={accept}
                                ref={ref}
                                name={"file"} id={"file"}
                                style={{opacity:0, width:0}}
                            />
                            <FileInfo htmlFor={"file"}>
                                {fileName ?? <div style={{color:"rgba(0,0,0,0.5)"}}>파일을 선택해주세요</div>}
                            </FileInfo>
                            <FileButton htmlFor={"file"}>
                                파일선택
                            </FileButton>
                        </form>
                )
            case "disabled" :
                return (
                    <>
                        <FileInfo style={{width:328}}>
                            {value}
                        </FileInfo>
                    </>
                )
            case "folder" :
                return (
                    <div style={{display:"flex", }}>
                        <FileButton>폴더이름</FileButton>
                        <FolderInput
                            placeholder={"폴더 이름을 입력해주세요."}
                            value={fileName}
                            onChange={(e) => {setFileName(e.target.value)}}
                            onBlur={(e) => {
                                onChange(e.target.value)
                            }}
                        />
                    </div>
                )

            default :
                return;

        }
    }

    return (
        <div>
            {typeContent(type)}
        </div>
    )
}

const FileInfo = styled.label`
    background:#F4F6FA;
    border-radius: 6px;
    width: 256px;
    height: 32px;
    padding-left:16px;
    display:block;
    align-items:center;
    text-overflow:ellipsis;
    overflow:hidden;
    white-space:nowrap;
    line-height:200%;
`;

const FileInput = styled.div`
    background:#F4F6FA;
    width:256px;
    height:32px;
    
`;

const FileButton = styled.label`
    border:none;
    color:#111319;
    background:#19B9DF;
    font-size:15px;
    display:flex;
    justify-content:center;
    align-items:center;
    width:72px;
    height:32px;
    border-radius:6px;
`;

const FolderInput = styled.input`
    background:#F4F6FA;
    border-radius: 6px;
    width: 256px;
    height: 32px;
    border:none;
    padding-left:15px;
`;

export default FileUploader
