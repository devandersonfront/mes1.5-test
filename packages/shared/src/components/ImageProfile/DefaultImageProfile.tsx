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
            {image ?
                <img className={"image"} style={style} src={image} />
                :
                <div className={"image"} style={style}>이미지 없음</div>
            }
        </Frame>
    )
}

const Frame = styled.div`
    display:grid;
    grid-template-columns: auto 1fr auto;
    grid-template-rows:auto 1fr auto;
    grid-gap: 1px; 
    
    .image{
        grid-row: 2/2;
        grid-column:2/2;
    }
    .title{
        width:72px;
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

export default DefaultImageProfile
