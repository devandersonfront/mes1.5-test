import React, {useRef, useState} from "react";
import styled from "styled-components";
import {RequestMethod} from "../../common/RequestFunctions";
import Notiflix from "notiflix";
import {uploadTempFile} from "../../common/fileFuctuons";

interface Props {
    type:"input" | "disabled" | "folder"
    accept?:string
    onChange?:(value:any) => void
}

const FileUploader = ({type, accept, onChange}:Props) => {

    const [fileName, setFileName] = useState<string>();

    const ref = useRef(null);

    const typeContent = (type: "input" | "disabled" | "folder" ) => {
        switch(type){
            case "input" :
                return (
                    <div style={{display:"flex", }}>
                        <input type={"file"}
                            onChange={async(e) => {
                                console.log("e : ", e.target.files[0])
                                setFileName(e.target.files[0].name)
                                const result = await uploadTempFile(e.target.files[0] , e.target.files[0].size, true, e.target.files[0].type);
                                console.log("result : ", result)

                            }}
                            accept={accept}
                            ref={ref}
                            name={"file"} id={"file"}
                           style={{opacity:0, width:0}}
                        />
                        <FileInfo htmlFor={"file"}>
                            {/*{fileName ? "abc" : "파일을 선택해주세요."}*/}
                            {fileName ?? <div style={{color:"rgba(0,0,0,0.5)"}}>파일을 선택해주세요</div>}
                        </FileInfo>
                        <FileButton htmlFor={"file"}>
                            파일선택
                        </FileButton>
                    </div>
                )
            case "disabled" :
                return (
                    <>
                        <FileInfo>

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
    display:flex;
    align-items:center;
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
