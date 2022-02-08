import React from 'react';
import {useRouter} from "next/router";
import {CellButton, UploadButton} from "../../styles/styledComponents";
import {IExcelHeaderType} from "../../common/@types/type";


interface IProps {
    row: any
    column: IExcelHeaderType
}

const MidRangeButton = ({row, column }: IProps) => {
    const router = useRouter()

    const contentCheck = () => {
        if(row.inspection_category !== null && row.inspection_category !== undefined){
            return (<>
            <div style={{
                padding: '3.5px 0px 0px 3.5px',
                width: '100%'
            }}>
                <UploadButton style={{width: '100%', backgroundColor: '#ffffff00'}}  onClick={() => { router.push({pathname: '/mes/basic/productV1u/midrange/form/detail', query: { customer_id: row.customer_id, cm_id: row.cm_id, code: row.code, name: row.name, product_id: row.product_id, type: row.type} }) }}>
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
                    <UploadButton  onClick={() => { router.push({pathname: '/mes/basic/productV1u/midrange/form/register',
                        query: { customer_id: row.customer_id, cm_id: row.cm_id, code: row.code, name: row.name, product_id: row.product_id, type: row.type} }) }}>
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
