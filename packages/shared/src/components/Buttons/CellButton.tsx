import React, {useEffect, useState} from 'react'
import styled from "styled-components"
import {IExcelHeaderType} from '../../@types/type'
import {CellButton, UploadButton} from '../../styles/styledComponents'
import {useRouter} from 'next/router'
import Notiflix from 'notiflix'
import {POINT_COLOR} from "../../common/configset";

interface IProps {
  row: any
  column: IExcelHeaderType
  setRow: (row: any) => void
}

const CellButtonComponent = ({ row, column, setRow}: IProps) => {
  const [title, setTitle] = useState<string>("")

  const router = useRouter()

  useEffect(() => {
    switch(column.key){
      case "pp_id":
        if(row[column.key]){
          setTitle('생산 공정 보기')
        } else {
          setTitle('생산 공정 등록')
        }
        break;
      case "form_id" :
          setTitle("양식 등록")
        break;
      default :
        break;
    }
  }, [column.key])
  return (
      <ContentBox>
        <div style={{
          padding: '3.5px 0px 0px 3.5px',
          width: '100%',
          opacity : column.type === 'inspection' && !!!row.machine_id && !!!row.mold_id ? .3 : 1
        }}>
        <UploadButton hoverColor={POINT_COLOR} haveId={row?.form_id} onClick={() =>{
          if(column.type === "inspection"){
            let typeID = "";
            switch (true){
              case row.machine_id !== undefined:
                typeID = row.machine_id
                break
              case row.mold_id !== undefined :
                typeID = row.mold_id
                break
              default :
                Notiflix.Report.warning("기준정보를 등록해주세요.",``,"확인")
                break
            }
            if(typeID !== "") router.push({
              pathname: '/mes/basic/dailyInspection',
              query:
                  row.machine_id ?
                      {
                        machine_id: row.machine_id,
                      }
                      :
                      {
                        mold_id: row.mold_id,
                      }
            })
          }else if(row.product_id){
            router.push({
              pathname: '/mes/basic/product/process',
              query: {
                pp_id: row.pp_id ?? "",
                product_id: row.product_id ?? "",
                product_data: encodeURI(JSON.stringify(row))
              }
            })
          }else{
            Notiflix.Report.failure('접근할 수 없습니다.', '품목을 선택해 주세요', '확인')
          }
        }}>
          <p>{row.form_id ? "양식 보기" : title}</p>
        </UploadButton>
        </div>
      </ContentBox>
  );
}

const ContentBox = styled.div`
  width:100%;
  height:100%;
  display:flex;
  justify-content:center;
  align-items:center;
`;

export {CellButtonComponent};
