import React, {useRef} from 'react';
import {SelectButton, TitleBox} from "../../styles/styledComponents";
import styled from "styled-components";
import {uploadTempFile} from "../../common/fileFuctuons";

interface IProps {
    title: string
    value: string
    index: number
    placeholder: string
    fileOnClick: (fileObject: object)=> void
    deleteOnClick: ()=> void
}

const TitleFileUpload = ({title,index,value,placeholder,fileOnClick,deleteOnClick}: IProps) => {
    const fileRef = useRef(null)

    const onClickImageUpload = (index: string) => {// input[type='file']
        // @ts-ignore
        fileRef.current.click();
    }


    return (
        <div style={{display: "flex", marginBottom: '8px', alignItems: "center"}}>
            <TitleBox>{title}</TitleBox>
            <ValueBox style={{color: value === '' ? 'rgba(255,255,255,0.3)' : 'white'}}>
                {value === '' ? placeholder : value}
            </ValueBox>
            <SelectButton onClick={()=>onClickImageUpload('1')}>
                파일선택
            </SelectButton>
            <input ref={fileRef} type={"file"} hidden key={`${title}+${index}`}
                   onChange={async (e) => {
                       if(e.target.files && e.target.files.length !== 0) {
                           // Buffer.from(e.target.files[0]);
                           const uploadImg = await uploadTempFile(e.target.files[0] , e.target.files[0].size, true, "application/json");

                           if(uploadImg !== undefined){
                               const fileInfo = {
                                   name: e.target.files[0].name,
                                   uuid: uploadImg.UUID,
                                   sequence: index+1
                               }
                               fileOnClick(fileInfo)
                           }
                       }

                   }}
                   id={`${title}+${index}`}
                   accept={"image/png, image/jpeg, image/jpg, .xlsx, .pdf, .hwp, .doc, .docx" }/>
        </div>
    );
};


const ValueBox = styled.div`
    padding-left: 16px;
    color: white;
    font-size: 16px;
    background-color: #353B48;
    width: 93%;
    height: 40px;
    display: flex;
    align-items: center;
`



export {TitleFileUpload}
