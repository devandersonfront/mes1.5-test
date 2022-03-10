import React from "react"
import styled from "styled-components"

interface ImageProfile {
    title?:string
    image?:string
    direction?:"top" | "bottom" | "left" | "right"
    edit?:boolean
    onChangeFunction?:() => void
    style?:object
}

const DefaultImageProfile = ({title, image, direction, style, edit, onChangeFunction}:ImageProfile) => {
    return (
        <Frame>
            {(direction === undefined || direction === "left")  && <div className={"title left"}>{title}</div>}
            {direction === "top" && <div className={"title top"}>{title}</div>}
            {direction === "right" && <div className={"title right"}>{title}</div>}
            {direction === "bottom" && <div className={"title bottom"}>{title}</div>}
            <ImgBox className={"image"} style={style}>
                {image ?
                    <img  style={{width:"100%", }} src={image} />
                    :
                    <div >사진 없음</div>
                }
            </ImgBox>
        </Frame>
    )
}

const Frame = styled.div`
    display:grid;
    grid-template-columns: auto 1fr auto;
    grid-template-rows:auto 1fr auto;
    grid-gap: 1px ; 
    border:1px solid #B3B3B3;
    .image{
        color:rgba(0,0,0,0.5);
        grid-row: 2/2;
        grid-column:2/2;
        border-left:1px solid #B3B3B3;
    }
    .title{
        margin-left:5px;
        min-width:59px;
        font-size:14px;
        font-weight:bold;
    }
    .top{
        grid-row: 1/1;
        grid-column:2/2;
    }
    .left{
        grid-row: 2/2;
        grid-column:1/1;
    }
    .right{
        grid-row: 2/2;
        grid-column:3/3;
    }
    .bottom{
        grid-row: 3/3;
        grid-column:2/2;
    }
`
const ImgBox = styled.div`
    width:100%;
    overflow:hidden;
`

export default DefaultImageProfile
