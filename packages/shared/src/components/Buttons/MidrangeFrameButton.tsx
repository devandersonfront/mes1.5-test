import React from 'react';
import {useRouter} from "next/router";
import {CellButton, UploadButton} from "../../styles/styledComponents";
import {IExcelHeaderType} from "../../common/@types/type";
import {MidrangeFormReviewModal} from "../Modal/MidrangeFormReviewModal";


interface IProps {
    row: any
    column: IExcelHeaderType
}

const MidrangeFrameButton = ({row, column }: IProps) => {


    const contentCheck = () => {
        console.log(row)
        if(row.inspection_category !== null){
            return (<>
                <div style={{
                    padding: '3.5px 0px 0px 3.5px',
                    width: '100%'
                }}>
                    <UploadButton style={{width: '100%', backgroundColor: '#ffffff00'}}  onClick={() => {}}>
                        <p style={{color: 'white', textDecoration: 'underline'}}>결과 보기</p>
                    </UploadButton>
                </div>
            </>)
        }else{
            return (<>
                <div style={{
                    padding: '3.5px 0px 0px 3.5px',
                    width: '100%'
                }}>
                    <UploadButton  onClick={() =>{}}>
                        <p>검사 등록</p>
                    </UploadButton>
                </div>
            </>)
        }
    }

    return (
        <>
            <MidrangeFormReviewModal isOpen={false} formReviewData={{basic: ''}}/>
            {contentCheck()}
        </>
    );
}

export {MidrangeFrameButton};
