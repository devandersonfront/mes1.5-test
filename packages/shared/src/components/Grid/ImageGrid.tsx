import React, {useEffect, useState} from "react"
import styled from "styled-components"
import ImageOpenModal from "../Modal/ImageOpenModal";
import {RequestMethod} from "../../common/RequestFunctions";
import Notiflix from "notiflix";

interface ImageGridType {
    images?: string[]
    selectItems?:Set<string>
    changeSelectItems?:(value:string) => void
}


const ImageGrid = ({images, selectItems, changeSelectItems}:ImageGridType) => {
    const [open, setOpen] = useState<boolean>(false)
    const changeSetOnImage = () => {
        setOpen(false)
    }
    const [imgDatas, setImgDatas] = useState<{UUID:string, contentType:string, fileId:number, name:string, url:string}[]>(null)
    const [selectImg, setSelectImg] = useState<number>(null)

    useEffect(() => {
        if(images){
            const imageData = images.map(async(uuid) => await RequestMethod("get", "anonymousLoad", {
                    path: {
                        uuid
                    }
                })
            )
            Promise.all([...imageData])
                .then((res) => {
                    setImgDatas(res)
                    setSelectImg(null)
                })
        }
    },[images])

    return (
        <div>
            {selectImg !== null &&
                <ImageOpenModal url={imgDatas[selectImg].url} open={open} changeSetOnImage={changeSetOnImage} uuid={imgDatas[selectImg].UUID} photoId={imgDatas[selectImg].fileId}/>
            }
            <ImgGridBox>
                {(images !== null && imgDatas) &&
                    imgDatas.map((url, index) => {
                        return(
                                <Image src={url.url} alt={"이미지 로딩에 실패했습니다."} className={selectItems.has(url.UUID) ? "border" : ""}
                                     onClick={() => {
                                         setSelectImg(index)
                                         changeSelectItems(url.UUID)
                                     }}
                                     onDoubleClick={() => {
                                         setOpen(true)
                                     }}

                                />
                        )
                    })
                }
            </ImgGridBox>
                {!(images !== null && imgDatas)  &&
                    <div style={{width:"100%", height:"10em", display:"flex", justifyContent:"center", alignItems:"center"}}>
                        등록된 작업 표준서가 없습니다.
                    </div>
                }
        </div>
    )
}

const ImgGridBox = styled.div`
    display:grid;
    grid-template-columns: repeat(4, 1fr);
    justify-items:center;
    width:100%;
    
    .border {
        border:1px solid lightblue;
        box-shadow: 1px 1px 5px 3px lightblue; 
        
    }
`
const Image = styled.img`
    width:100%;
    height:200px;
    object-fit:contain;
    margin:3px;
    border-radius:5px;
    &:hover{
        border: 1px solid lightblue;
    }
`;
export {ImageGrid}
