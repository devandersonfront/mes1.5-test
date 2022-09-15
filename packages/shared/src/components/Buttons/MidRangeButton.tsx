import React from 'react';
import {useRouter} from "next/router";
import {CellButton, UploadButton} from "../../styles/styledComponents";
import {IExcelHeaderType} from "../../@types/type";
import Notiflix from 'notiflix';


interface IProps {
    row: any
    column: IExcelHeaderType
}

const MidRangeButton = ({row, column }: IProps) => {
    const router = useRouter()
    const itemRegistered = row.inspection_category !== null && row.inspection_category !== undefined
    const buttonStyle = itemRegistered ? {width: '100%', backgroundColor: '#ffffff00'} : null
    const titleStyle = itemRegistered ? {color: 'white', textDecoration: 'underline'} : null
    const title = itemRegistered ? '검사항목 보기' : '검사항목 등록'
    const routeParam = {
        pathname : `/mes/basic/productV1u/midrange/form/${itemRegistered ? 'detail' : 'register'}`,
        query : { customer_id: row.customer_id, cm_id: row.cm_id, code: row.code, name: row.name, product_id: row.product_id, type: row.type, process_id:row.process?.name}
    }
    const onClickEvent = () => {
        row.product_id ? router.push(routeParam)
            : Notiflix.Report.warning(
              '경고',
              '제품을 먼저 등록해 주시기 바랍니다.',
              '확인',
            );
    }
    return (
      <>
        <div style={{
            padding: '3.5px 0px 0px 3.5px',
            width: '100%',
            opacity : row.readonly ? .3 : row.product_id   ? 1 : .3
        }}>
            <UploadButton style={buttonStyle}  onClick={() => row.readonly ? undefined : onClickEvent()}>
                <p style={titleStyle}>{title}</p>
            </UploadButton>
        </div>
      </>)
}

export {MidRangeButton};
