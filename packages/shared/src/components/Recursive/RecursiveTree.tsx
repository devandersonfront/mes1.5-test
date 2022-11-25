import React, { useState } from "react";
import {IDocWithChild} from "../../@types/type";
import {RequestMethod} from "../../common/RequestFunctions";
import checkIcon from "../../../public/images/ic_check.png";
import styled from "styled-components";
import Notiflix from "notiflix";
import menuClose from "../../../public/images/ic_monitoring_close.png";
import menuOpen from "../../../public/images/ic_monitoring_open.png";

interface Props {
    data : any
    onRadioClick ?: (data :any) => void
}

export const RecursiveTree = ({ data , onRadioClick } : Props) =>{
    const [isVisible, setIsVisible] = useState(false);
    const [child ,setChild] = useState([])

    const onClickDoc = async () => {
        if(!isVisible){
            const result = await RequestMethod("get", "docChild", { path: { docId: data.doc_id ?? null } })
            setChild(result.filter(result => result.type === 'dir'))
        }
        setIsVisible(!isVisible);
    };

    return (
        <div style={{padding : 5}}>
            <div style={{display : 'flex', alignItems : 'center'}}>
                <input type="radio" name="test" onClick={() => onRadioClick(data)} style={{marginRight : 10}}/>
                <div onClick={onClickDoc} style={{display : 'flex' , alignItems:'center'}}>
                    <span style={{color : '#ffffff'}}>{data?.name}</span>
                    <ArrowImageWrapper>
                        <img src={isVisible ? menuClose : menuOpen} alt={'arrow'}/>
                    </ArrowImageWrapper>
                </div>
            </div>
            {isVisible ? (
                child?.map((result) => {
                    return (
                        <div style={{padding: '10px 0 10px 10px'}}>
                            <RecursiveTree data={result} onRadioClick={onRadioClick}/>
                        </div>
                    );
                })
            ) : (
                <></>
            )}

        </div>
    );
}

const ArrowImageWrapper = styled.div`
  height: 20px;
  display: flex;
  margin-left: 16px;
`