import React, {useEffect, useState} from "react";
import styled from "styled-components";
import Modal from "react-modal";
import axios from "axios";
import {SF_ENDPOINT_EXCEL} from "../../common/configset";
import cookie from "react-cookies";
//@ts-ignore
import Notiflix from "notiflix";


interface Props {
    isOpen:boolean
    setIsOpen:(value:boolean) => void
    tab:string
    process_id?:number
    cleanUpBasicData:(value:any) => void
    parent?:number
}

const ExcelUploadModal = ({isOpen, setIsOpen, process_id, tab, cleanUpBasicData, parent}:Props) => {

    // const formData = new FormData()
    // formData.append("file", "");

    const [tokenData, setTokenData] = useState<any>();

    const [fileName, setFileName] = useState<string>("");

    const [tempFile, setTempFile] = useState<File>();



    useEffect(()=>{
        setTokenData(cookie.load('userInfo').token);
    }, [])

    useEffect(()=>{
        if(!isOpen) setTempFile(undefined); setFileName("");
    },[isOpen])

    const excelUpload = async() => {
        try{
            if(tempFile !== undefined){
                const formData = new FormData();
                formData.append('file', tempFile);
                const res = await axios.post(
                    cookie.load("userInfo")?.company == "9UZ50Q" ?
                        `${SF_ENDPOINT_EXCEL}/api/v1/upload/eunhye/welding`
                        :
                        `${SF_ENDPOINT_EXCEL}/api/v1/format/upload/${tab}`,
                    formData,
                    {
                        headers:{
                            "Content-Type": "multipart/form-data",
                            Authorization: tokenData
                        },
                        params:{
                            parent:parent
                        }
                    })
                if(res && res.status === 200 && res.data.status === 200 || res && res.status === 201){
                    cleanUpBasicData(res)
                    setIsOpen(false);
                }else if(res.data.status === 404){
                    Notiflix.Report.warning(res.data.message, "", "확인");
                }else{
                    Notiflix.Report.warning(res.data.message, "server", "확인");
                }
            }else{
                Notiflix.Report.warning("파일을 등록해주세요.","","확인");
            }
        }catch (err){
            Notiflix.Report.warning("잘못된 양식입니다.","","확인");
        }
    }



    return (
        <Modal isOpen={isOpen} style={{
            content: {
                top: '50%',
                left: '50%',
                right: 'auto',
                bottom: 'auto',
                marginRight: '-50%',
                transform: 'translate(-50%, -50%)',
                padding: 0
            },
            overlay: {
                background: 'rgba(0,0,0,.6)',
                zIndex: 5
            }
        }}>
            {/*<Background>*/}
                <ModalContainer>
                    <div style={{width:"100%", }}>
                        <p  style={{fontSize:"26px", fontWeight:"bold", marginLeft:"16px", height:"0", padding:0, marginBottom:0 }}>

                        </p>
                    </div>
                    <div style={{width:"calc(100% - 32px)", margin:"0 16px 0 16px", display:"flex",justifyContent:"space-between", alignItems:"center"}}>
                        <p>등록 파일</p>
                        <div style={{border:"1px solid lightgrey", height:"40px", display:"flex", width:"280px", justifyContent:"space-between", alignItems:"center"}}>
                            <p style={{marginLeft:"6px", width:"175px", textOverflow:"ellipsis", overflow:"hidden", whiteSpace:"nowrap"}}>
                                {fileName === "" ? <span style={{color:"rgba(0,0,0,0.4)"}}>파일을 선택해주세요.</span> : fileName}
                            </p>
                            <div style={{overflow:"hidden", width:"80px", height:"100%",background:"rgb(25,185,223)", display:"flex", justifyContent:"center", alignItems:"center", cursor:"pointer"}}>
                                파일선택
                                <input type={"file"} accept={".xls, .xlsx, .csv, .CSV"} style={{opacity:0, position:"absolute", width:"80px",height:"50px", cursor:"pointer"}} onChange={(e)=>{
                                    setFileName(e.target.files[0].name)
                                    setTempFile(e.target.files[0]);
                                }}/>
                            </div>
                        </div>

                    </div>
                    <ButtonBox>
                        <Button style={{background:"#B3B3B3"}}
                            onClick={()=>{
                                setIsOpen(false);
                            }}
                        >취소</Button>
                        <Button onClick={()=>{
                            excelUpload();
                        }}>확인</Button>
                    </ButtonBox>
                </ModalContainer>
            {/*</Background>*/}

        </Modal>
    );
}

const ModalContainer = styled.div`
    display:flex;
    justify-content:space-between;
    align-items:center;
    background:white;
    width:400px;
    height:230px;
    flex-direction:column;
    
`;

const ButtonBox = styled.div`
    width:100%;
    display:flex;
    justify-content:center;
    align-items:center;
`;

const Button = styled.button`
    width:50%;
    height:40px;
    font-size:16px;
    background:rgb(25, 185, 223);
    border:none;
    cursor:pointer;
    
`;

export {ExcelUploadModal};
