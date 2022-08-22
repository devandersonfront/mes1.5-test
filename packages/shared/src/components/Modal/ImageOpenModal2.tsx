import { log } from "console";
import React, { useEffect, useState } from "react";
import Modal from 'react-modal'
import styled from 'styled-components'
import AddIcon from '@mui/icons-material/Add';
import Icon_X from '../../../public/images/file_delete_button.png';

import Plus from '../../../public/images/plus-solid.svg';
import Minus from '../../../public/images/minus-solid.svg';

import rotation_right from '../../../public/images/rotate-right-solid.svg';
import rotation_left from '../../../public/images/rotate-left-solid.svg';
import Close from '../../../public/images/xmark-solid.svg';
import floppy_disk from '../../../public/images/floppy-disk-solid.svg';
import { RequestMethod } from '../../../../shared';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';


interface IProps {
    url: string
    open: boolean
    changeSetOnImage: (value: boolean) => void
    uuid?: any
    photoId?: any
}

interface ImgProps {
    src?: string,
    originalWidth?: number,
    originalHeight?: number,
    style?: object,
    objectFit?: string,
    imagePercent?: number,
    imageDegree: number,
    width: number | string,
    height: number | string,
    aspectRatio?: any
}

const Img = styled.img`
    flex:"auto"; // 쓰나 마나 인듯 
    object-fit: ${(props: ImgProps) => props.objectFit === "none" ? "contain" : "contain"};
    width: "auto";
    height: "auto";
    /* max-width: ${(props: ImgProps) => props.width} + "px"; */
    /* max-height: ${(props: ImgProps) => props.height} + "px"; */
    border: "10px solid blue";
    aspect-ratio: "auto " + ${(props: ImgProps) => props.aspectRatio};
    transform: rotate(${(props: ImgProps) => props.imageDegree + "deg"});
`;

/* packages/shared/src/components/Modal/ImageOpenModal.tsx */
const ImageOpenModal2 = ({ url, open, changeSetOnImage, uuid, photoId }: IProps) => {
    const [imagePercent, setImagePercent] = useState(100);
    const [objectFit, setObjectFit] = useState("cover");
    const [originalWidth, setOriginalWidth] = useState(0);
    const [originalHeight, setOriginalHeight] = useState(0);
    const [imageDegree, setImageDegree] = useState(0);


    const mode = (mode: any) => {
        let imgMode;
        if (mode === "cover") {
            imgMode = "맞춤"
        }
        if (mode === "none") {
            imgMode = "원본"
        }

        return (
            <span>
                {imgMode}
            </span>
        )
    }

    useEffect(() => {

        let img = new Image();
        img.src = url;

        let width = img.width;
        let height = img.height;

        setOriginalWidth(width);
        setOriginalHeight(height);

    }, [open, url, changeSetOnImage])

    const set_original_width_height = () => {
        let img = new Image();
        img.src = url;

        let width = img.width;
        let height = img.height;

        setOriginalWidth(width);
        setOriginalHeight(height);

    }

    const imageButtonClickHandler = (e) => {
        e.preventDefault();

        if (e.target.name == "original") {
            console.log("original");
            setObjectFit("none")
            setImagePercent(100);
            setImageDegree(0)
            set_original_width_height();
        }
        if (e.target.name == "custom") {
            console.log("custom");
            setObjectFit("cover")
            setImageDegree(0)
            setImagePercent(100);
        }

        if (e.target.name == "enlargement") {
            console.log("enlargement");
            if (imagePercent < 100) {
                setImagePercent((prev) => prev + 10)
            } else {
                alert("100이상은 증가할수 없습니다.");
            }
        }
        if (e.target.name == "reduction") {
            console.log("reduction");

            if (imagePercent > 10) {
                setImagePercent((prev) => prev - 10)

            } else {
                alert("10% 이하는 감소할수 없습니다.");
            }

        }

        if (e.target.name == "rotation+") {
            console.log("rotation");

            let img = new Image();
            img.src = url;

            let width = img.width;
            let height = img.height;

            console.log("objectFit : ", objectFit);
            console.log("origianlWidth : ", originalWidth);
            console.log("originalHeight : ", originalHeight);

            // if (imageDegree === 0) {
            //     console.log("90니까 높이 넓이 바꿔");
            //     // setOriginalWidth(height);
            //     // setOriginalHeight(width);
            // } else if (imageDegree === 180) {
            //     console.log("180니까 넓이 높이 바꿔");
            //     // setOriginalWidth(height);
            //     // setOriginalHeight(width);
            // } else {
            //     console.log("원래 대로 유지");
            //     // setOriginalWidth(width);
            //     // setOriginalHeight(height);
            // }

            setImageDegree((prev) => {

                switch (prev) {
                    case 360:
                        return 0;
                    default:
                        return prev + 90;
                }
            }
            )
        }

        if (e.target.name == "rotation-") {
            console.log("rotation");
            let img = new Image();
            img.src = url;
            let width = img.width;
            let height = img.height;

            setImageDegree((prev) => {
                switch (prev) {
                    case 360:
                        return 0;
                    default:
                        return prev - 90;
                }
            }
            )
        }

    }

    const close_modal = (option: boolean) => {
        setImageDegree(0);
        setObjectFit("cover");
        setImagePercent(100);
        changeSetOnImage(option)
    }

    const calculateWidth = (option: string, imagePercent: number) => {
        let img = new Image();
        img.src = url;
        let width = img.width;
        console.log("imagePercent : ", imagePercent);
        const ratio = imagePercent / 100;
        console.log("ratio : ", ratio);


        if (option === "original_image") {
            console.log("width : ", width);
            return width * ratio;
        } else if (option === "custom_image") {
            return 700 * ratio
        }
        console.log("hi");
    }

    const calculateHeight = (option: string, imagePercent: number) => {
        let img = new Image();
        img.src = url;
        let height = img.height;
        const ratio = imagePercent / 100;

        console.log("imagePercent : ", imagePercent);
        console.log("height : ", height);

        if (option === "original_image") {
            return height;
        } else if (option === "custom_image") {
            return 700 * ratio
        }

    }

    const forceDownload = (url: string, fileName: string) => {
        const downloadDatas = []
        const uuid_object = { doc_id: photoId }
        downloadDatas.push(uuid_object);
        console.log("downloadDatas for download request : ", downloadDatas);

        const result = RequestMethod("post", "documentDownLoad", downloadDatas)
            .then((res) => {
                if (res) {
                    downloadDatas.map((file) => {
                        if (file.file_uuid) {
                            RequestMethod("get", "anonymousLoad", {
                                path: {
                                    uuid: file.file_uuid
                                }
                            }).then((response) => {
                                window.open(response.url)
                            })
                        }
                    })
                }
            })

        // const file = RequestMethod("get", "anonymousLoad", {
        //     path: {
        //         uuid: uuid
        //     }
        // }).then((response) => {
        //     window.open(response.url)
        // })

        console.log("hi 11 ", result);

        // var xhr = new XMLHttpRequest();
        // xhr.open("GET", url, true);
        // xhr.responseType = "blob";
        // xhr.onload = function () {
        //     var urlCreator = window.URL || window.webkitURL;
        //     var imageUrl = urlCreator.createObjectURL(this.response);
        //     var tag = document.createElement('a');
        //     tag.href = imageUrl;
        //     tag.download = fileName;
        //     document.body.appendChild(tag);
        //     tag.click();
        //     document.body.removeChild(tag);
        // }
        // xhr.send();
    }


    return (
        <div>
            <div>
                <Modal isOpen={open}
                    style={{
                        content: {
                            width: "1800px",
                            height: "800px"
                        },
                        overlay: {
                            background: 'rgba(0,0,0,.6)',
                        }
                    }}>


                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <div style={{ display: "flex", justifyContent: "center", alignItems:"center", gap: "10px", height: "20px", zIndex: 5 }}>

                            <Button size="medium" variant="outlined" onClick={imageButtonClickHandler} name="original">원본</Button>
                            <Button size="medium" variant="outlined" onClick={imageButtonClickHandler} name="custom">맞춤</Button>


                            <img
                                onClick={imageButtonClickHandler}
                                name="enlargement"
                                src={Plus}
                                style={{ borderRadius: "4px", width: "24px", height: "24px", marginRight: "4px", marginLeft: '4px' }}
                            />

                            <img
                                onClick={imageButtonClickHandler}
                                name="reduction"
                                src={Minus}
                                style={{ borderRadius: "4px", width: "24px", height: "24px", marginRight: "4px", marginLeft: '4px' }}
                            />
                            <img
                                onClick={imageButtonClickHandler}
                                name="rotation+"
                                src={rotation_right}
                                style={{ borderRadius: "4px", width: "24px", height: "24px", marginRight: "4px", marginLeft: '4px' }}
                            />
                            <img
                                onClick={imageButtonClickHandler}
                                name="rotation-"
                                src={rotation_left}
                                style={{ borderRadius: "4px", width: "24px", height: "24px", marginRight: "4px", marginLeft: '4px' }}
                            />

                            <a href={url} download>
                                <img
                                    src={floppy_disk}
                                    style={{ borderRadius: "4px", width: "24px", height: "24px", marginRight: "4px", marginLeft: '4px' }}
                                />
                            </a>


                            <img
                                onClick={() => close_modal(false)}
                                src={Close}
                                style={{ borderRadius: "4px", width: "24px", height: "24px", marginRight: "4px", marginLeft: '4px' }}
                            />

                            {/* <a className="download-icon" onClick={() => forceDownload(url, 'images.jpg')}> Download</a> */}


                        </div>
                        <br />

                        <div style={{ display: "flex", justifyContent: "center", gap: "10px", height: "20px" }}>
                            모드: {mode(objectFit)} &nbsp;&nbsp;
                            폭 : {originalWidth}, 높이: {originalHeight} &nbsp;&nbsp;
                            비율: {imagePercent} &nbsp;&nbsp;
                            각도: {imageDegree} &nbsp;&nbsp;
                        </div>

                        <div style={{ display: "flex", justifyContent: "center", gap: "10px", height: "20px" }}>
                            <Img
                                src={url}
                                alt={"이미지 없음"}
                                objectFit={objectFit}
                                imagePercent={imagePercent}
                                imageDegree={imageDegree}
                                width={objectFit === "none" ? calculateWidth("original_image", imagePercent) : calculateWidth("custom_image", imagePercent)}
                                height={objectFit === "none" ? calculateHeight("original_image", imageDegree) : calculateHeight("custom_image", imagePercent)}
                                aspectRatio={originalWidth / originalHeight}
                            />
                        </div>

                    </div>
                </Modal>
            </div >
        </div >

    )

}


export default ImageOpenModal2;