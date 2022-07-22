import React, {useState} from "react";
import styled from "styled-components";
import {RequestMethod} from "../../common/RequestFunctions";
//@ts-ignore
import Notiflix from "notiflix"

interface Props {
    title:string
    changeState:(value:boolean) => void
    rowData:any[]
    selectList:ReadonlySet<number>
    selectDate:{from:string, to:string}
    LoadData:() => void
}

const TitleCreateModal = ({title, changeState, rowData, selectList, selectDate, LoadData}:Props) => {

    const [inputTitle, setInputTitle] = useState<string>("");

    const saveData = async(result: any) => {
        const res = await RequestMethod('post', "stockSummarySave", {
                ...result
        });

        if(res && res.status === 200){
            LoadData();
        }
    }

    return (
        <Background>
            <ModalBox>
                <div style={{margin:32}}>
                    <p>{title}</p>
                    <input style={{width:"100%", height:"30px"}} defaultValue={inputTitle} onBlur={(e)=>{
                        setInputTitle(e.target.value);
                    }}
                           placeholder={"입력하지 않으면 자동으로 생성합니다."}
                    />
                </div>

                <div style={{display:"flex",justifyContent:"space-evenly", }}>
                    <Button style={{background:"#B3B3B3"}} onClick={()=>{
                        changeState(false)
                    }}>취소</Button>
                    <Button style={{borderRight:"0.5px solid"}} onClick={()=>{
                        let summaries = [];
                        const summary_id = rowData[0].summary_id ?? undefined;
                        if(selectList.size > 0){
                            rowData.map((data) => {
                                if(selectList.has(data.id)){
                                    summaries.push({
                                                ...data,
                                                cm_id: data.cm_idPK,
                                                customer_id: data.customer_idPK,
                                                product_id: data.product.product_id,
                                        })
                                    }
                                })
                            let result = {
                                    from: selectDate.from,
                                    to: selectDate.to,
                                    name: inputTitle,
                                    summaries:summaries,
                                    summary_id:summary_id
                            };

                            saveData(result);
                            Notiflix.Report.success("저장되었습니다.", "", "확인");
                            changeState(false);
                        }else{
                            Notiflix.Report.warning("선택한 데이터가 없습니다.", "", "확인");
                        }
                    }}>확인</Button>
                </div>
            </ModalBox>
        </Background>
    );
}

const Background = styled.div`
    position:fixed;
    z-index:11;
    display:flex;
    justify-content:center;
    align-items:center;
    width:100vw;
    height:100vh;
    top:0;
    left:0;
    background:rgba(0,0,0,0.3);
`;

const ModalBox = styled.div`
    background:white;
    width:400px;
    height:200px;
    display:flex;
    flex-direction:column;
    justify-content:space-between;
`;

const Button = styled.button`
    width:50%;
    height:30px;
    background:#19B9DF;
    font-size:18px;
    font-weight:bold;
    border:none;
    cursor:pointer;
`;

export default TitleCreateModal
