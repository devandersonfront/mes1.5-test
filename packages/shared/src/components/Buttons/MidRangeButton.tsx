import React from 'react';
import {useRouter} from "next/router";
import {CellButton, UploadButton} from "../../styles/styledComponents";
import {IExcelHeaderType} from "../../common/@types/type";


interface IProps {
    row: any
}

const MidRangeButton = ({row }: IProps) => {
    const router = useRouter()

    //변경 관련 로직 필요함
    const contentCheck = () => {
        if(row){
            return (<>
            <div style={{
                padding: '3.5px 0px 0px 3.5px',
                width: '100%'
            }}>
                <UploadButton style={{width: '100%', backgroundColor: '#ffffff00'}}  onClick={() => { router.push('/mes/basic/midrange/detail') }}>
                    <p style={{color: 'white', textDecoration: 'underline'}}>검사항목 보기</p>
                </UploadButton>
            </div>
        </>)
        }else{
            return (<>
                <div style={{
                    padding: '3.5px 0px 0px 3.5px',
                    width: '100%'
                }}>
                    <UploadButton  onClick={() => { router.push('/mes/basic/midrange/register') }}>
                        <p>검사항목 등록</p>
                    </UploadButton>
                </div>
            </>)
        }
    }

    return (
       <>
           {contentCheck()}
       </>
    );
}

export {MidRangeButton};
