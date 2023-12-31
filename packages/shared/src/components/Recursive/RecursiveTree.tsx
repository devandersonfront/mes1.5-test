import React, { useState } from "react";
import {IDocWithChild} from "../../@types/type";
import {RequestMethod} from "../../common/RequestFunctions";
import styled from "styled-components";
import Notiflix from "notiflix";
//@ts-ignore
import menuClose from "../../../public/images/ic_monitoring_close.png";
//@ts-ignore
import menuOpen from "../../../public/images/ic_monitoring_open.png";

interface Props {
    initData : IDocWithChild
    onRadioClick ?: (data :IDocWithChild) => void
}

export const RecursiveTree = ({ initData , onRadioClick } : Props) =>{
    const [isVisible, setIsVisible] = useState(false);
    const [child ,setChild] = useState([])

    const onClickDoc = async () => {
        if(!isVisible){
            const result = await RequestMethod("get", "docChild", { path: { docId: initData.doc_id ?? null } })
            setChild(result.filter(result => result.type === 'dir'))
        }
        setIsVisible(!isVisible);
    };

    return (
        <div>
            <div style={{display : 'flex', alignItems : 'center'}}>
                <input type="radio" name="test" onClick={() => onRadioClick(initData)} style={{marginRight : 10}}/>
                <div onClick={onClickDoc} style={{display : 'flex' , alignItems:'center'}}>
                    <span style={{color : '#ffffff'}}>{initData?.name}</span>
                    <ArrowImageWrapper>
                        <img src={isVisible ? menuClose : menuOpen} alt={'arrow'}/>
                    </ArrowImageWrapper>
                </div>
            </div>
            <div style={{padding: '0px 0px 0px 20px'}}>
            {isVisible ? (
                child?.map((result) => {
                    return (

                            <RecursiveTree initData={result} onRadioClick={onRadioClick}/>

                    );
                })
            ) : (
                <></>
            )}
            </div>
        </div>
    );
}

const ArrowImageWrapper = styled.div`
  height: 20px;
  display: flex;
  margin-left: 16px;
`