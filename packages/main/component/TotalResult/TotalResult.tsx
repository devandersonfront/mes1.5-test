import React, {useState} from "react";
import styled from "styled-components";
//@ts-ignore
import Notiflix from "notiflix";

interface Props {
    rowData:any[]
    selectList:ReadonlySet<number>
}

const TotalResult = ({rowData, selectList}:Props) => {

    const [result, setResult] = useState(0);

    const action = () => {
        let tmp_result = 0;
        if(selectList.size > 0){
            rowData.map((value)=>{
                if(selectList.has(value.id)){
                    tmp_result += Number(value.amount);
                }
            })

            setResult(tmp_result)
        }else{
            // Notiflix.Report.warning("선택한 항목이 없습니다!", "", "확인")
            setResult(0)
        }
    }

    const AddComma = (number:number) => {
        let regexp = /\B(?=(\d{3})+(?!\d))/g;
        return number.toString().replace(regexp, ",");
    }
    return(
        <div style={{color:"white", marginBottom:"30px"}}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", margin:"16px 0"}}>
                <p style={{fontSize:22, fontWeight:600}}>선택항목 납품 개수 합계</p>
                <Button onClick={()=>{
                    action();
                }}>합계 계산</Button>
            </div>
            <div>
                <TableTitle>선택항목 납품 개수 합계(EA)</TableTitle>
                <TableContent>{result === 0 ? "-" : AddComma(result)} EA</TableContent>
            </div>
        </div>
    );
}

const Button = styled.button`
    width:100px;
    height:40px;
    color:white;
    font-size:16px;
    font-weight:600;
    border:none;
    border-radius:6px;
    background:#717C90;
    display:flex;
    justify-content:center;
    align-items:center;
    cursor:pointer;
    
`;

const TableTitle = styled.div`
    background:black;
    width:100%;
    height:40px;
    display:flex;
    justify-content:center;
    align-items:center;
`;

const TableContent = styled.div`
    width:100%;
    height:40px;
    display:flex;
    justify-content:center;
    align-items:center;
    background:#353B48;
`;

export default TotalResult;
