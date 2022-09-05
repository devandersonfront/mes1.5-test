import { log } from "console";
import React, { useEffect, useState, useRef } from "react";
import Modal from 'react-modal'
import styled from 'styled-components'
import AddIcon from '@mui/icons-material/Add';

// @ts-ignore
import Icon_X from '../../../public/images/file_delete_button.png';
// @ts-ignore
import Plus from '../../../public/images/plus-solid.svg';
// @ts-ignore
import Minus from '../../../public/images/minus-solid.svg';
// @ts-ignore
import rotation_right from '../../../public/images/rotate-right-solid.svg';
// @ts-ignore
import rotation_left from '../../../public/images/rotate-left-solid.svg';
// @ts-ignore
import Close from '../../../public/images/xmark-solid.svg';
// @ts-ignore
import floppy_disk from '../../../public/images/floppy-disk-solid.svg';
import { RequestMethod, SF_ENDPOINT } from '../../../../shared';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Notiflix from "notiflix";
import axios from 'axios';



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
    width: ${(props: ImgProps) => props.width} + "px";
    height: ${(props: ImgProps) => props.height} + "px";
    border: "10px solid blue";
    aspect-ratio: "auto " + ${(props: ImgProps) => props.aspectRatio};
    transform: rotate(${(props: ImgProps) => props.imageDegree + "deg"});
`;

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;

    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth();
    let day = today.getDay();

    const option = year + "-" + month + "-" + day;

    const date = new Date(option);
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    // console.log("file name !!!!!!!!!!!!!! : ", result);

    return result;
}

const ImageOpenModal2 = ({ url, open, changeSetOnImage, uuid, photoId }: IProps) => {
    const [imagePercent, setImagePercent] = useState(100);
    const [objectFit, setObjectFit] = useState("cover");
    const [originalWidth, setOriginalWidth] = useState(0);
    const [originalHeight, setOriginalHeight] = useState(0);
    const [imageDegree, setImageDegree] = useState(0);

    const child1 = useRef(null);

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
        // e.preventDefault();

        if (e.target.id == "original") {
            setObjectFit("none")
            setImagePercent(100);
            setImageDegree(0)
            // set_original_width_height();
        }
        if (e.target.id == "custom") {
            setObjectFit("cover")
            setImageDegree(0)
            setImagePercent(100);
        }

        if (e.target.id == "enlargement") {

            if (imagePercent <= 500) {
                // console.log("500 보다 작아 ", imagePercent);

                switch (imagePercent) {

                    case 20:
                        setImagePercent((prev) => prev + 10)
                        break;
                    case 30:
                        setImagePercent((prev) => prev + 10)
                        break;
                    case 40:
                        setImagePercent((prev) => prev + 10)
                        break;
                    case 50:
                        setImagePercent((prev) => prev + 10)
                        break;
                    case 60:
                        setImagePercent((prev) => prev + 10)
                        break;
                    case 70:
                        setImagePercent((prev) => prev + 10)
                        break;
                    case 80:
                        setImagePercent((prev) => prev + 10)
                        break;
                    case 90:
                        setImagePercent((prev) => prev + 10)
                        break;

                    case 100:
                        setImagePercent((prev) => prev + 10)
                        break;
                    case 110:
                        setImagePercent((prev) => prev + 15)
                        break;
                    case 125:
                        setImagePercent((prev) => prev + 25)
                        break;

                    case 150:
                        setImagePercent((prev) => prev + 25)
                        break;

                    case 175:
                        setImagePercent((prev) => prev + 25)
                        break;

                    case 200:
                        setImagePercent((prev) => prev + 50)
                        break;

                    case 250:
                        setImagePercent((prev) => prev + 50)
                        break;

                    case 300:
                        setImagePercent((prev) => prev + 100)
                        break;

                    case 400:
                        setImagePercent((prev) => prev + 100)
                        break;

                }
            } else {
                alert("500이상은 증가할수 없습니다.");
            }
        }
        if (e.target.id == "reduction") {
            console.log("reduction");
            switch (imagePercent) {
                case 500:
                    setImagePercent((prev) => prev - 100)
                    break;

                case 400:
                    setImagePercent((prev) => prev - 100)
                    break;

                case 300:
                    setImagePercent((prev) => prev - 50)
                    break;

                case 250:
                    setImagePercent((prev) => prev - 50)
                    break;

                case 200:
                    setImagePercent((prev) => prev - 25)
                    break;

                case 175:
                    setImagePercent((prev) => prev - 25)
                    break;

                case 150:
                    setImagePercent((prev) => prev - 25)
                    break;

                case 125:
                    setImagePercent((prev) => prev - 15)
                    break;
                case 110:
                    setImagePercent((prev) => prev - 10)
                    break;
                case 100:
                    setImagePercent((prev) => prev - 10)
                    break;
                case 90:
                    setImagePercent((prev) => prev - 10)
                    break;
                case 80:
                    setImagePercent((prev) => prev - 10)
                    break;
                case 70:
                    setImagePercent((prev) => prev - 10)
                    break;
                case 60:
                    setImagePercent((prev) => prev - 10)
                    break;
                case 50:
                    setImagePercent((prev) => prev - 10)
                    break;
                case 40:
                    setImagePercent((prev) => prev - 10)
                    break;
                case 30:
                    setImagePercent((prev) => prev - 10)
                    break;

            }
        }

        if (e.target.id == "rotation+") {

            let img = new Image();
            img.src = url;

            let width = img.width;
            let height = img.height;


            setImageDegree((prev) => {

                switch (prev) {
                    case 270:
                        return 0;
                    default:
                        return prev + 90;
                }
            }
            )
        }

        if (e.target.id == "rotation-") {
            let img = new Image();
            img.src = url;
            let width = img.width;
            let height = img.height;

            setImageDegree((prev) => {
                switch (prev) {
                    case 90:
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
        const ratio = imagePercent / 100;

        if (option === "original_image") {
            return width * ratio;
        } else if (option === "custom_image") {
            return 1400 * ratio
        }
    }

    const calculateHeight = (option: string, imagePercent: number) => {
        let img = new Image();
        img.src = url;
        let height = img.height;
        const ratio = imagePercent / 100;


        if (option === "original_image") {
            return height * ratio;
        } else if (option === "custom_image") {
            return 700 * ratio
        }

    }

    return (
        <div>
            <div>

                <div ref={child1} ></div>

                <Modal isOpen={open}
                    style={{
                        content: {
                            margin: "0 auto",
                            width: "1700px",
                            height: "800px"
                        },
                        overlay: {
                            background: 'rgba(0,0,0,.6)',
                        }
                    }}>


                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", height: "20px", zIndex: 5 }}>

                            <Button size="medium" variant="outlined" onClick={imageButtonClickHandler} id="original">원본</Button>
                            <Button size="medium" variant="outlined" onClick={imageButtonClickHandler} id="custom">맞춤</Button>

                            <img
                                onClick={imageButtonClickHandler}
                                id="enlargement"
                                src={Plus}
                                style={{ borderRadius: "4px", width: "24px", height: "24px", marginRight: "4px", marginLeft: '4px' }}
                            />

                            <img
                                onClick={imageButtonClickHandler}
                                id="reduction"

                                src={Minus}
                                style={{ borderRadius: "4px", width: "24px", height: "24px", marginRight: "4px", marginLeft: '4px' }}
                            />
                            <img
                                onClick={imageButtonClickHandler}
                                id="rotation+"
                                src={rotation_right}
                                style={{ borderRadius: "4px", width: "24px", height: "24px", marginRight: "4px", marginLeft: '4px' }}
                            />
                            <img
                                onClick={imageButtonClickHandler}
                                id="rotation-"
                                src={rotation_left}
                                style={{ borderRadius: "4px", width: "24px", height: "24px", marginRight: "4px", marginLeft: '4px' }}
                            />

                            <a href={`${SF_ENDPOINT}/anonymous/download/${uuid}`}>
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

                        </div>
                        <br />

                        <div style={{ display: "flex", justifyContent: "center", gap: "10px", height: "20px" }}>
                            {/* 모드: {objectFit} &nbsp;&nbsp;
                            폭 : {originalWidth}, 높이: {originalHeight} &nbsp;&nbsp; */}
                            {imagePercent} &nbsp;&nbsp;
                            {/* 각도: {imageDegree} &nbsp;&nbsp;  */}
                        </div>

                        <div style={{ display: "flex", justifyContent: "center", gap: "10px", height: "20px" }}>
                            <Img
                                src={url}
                                alt={"이미지 없음"}
                                objectFit={objectFit}
                                imagePercent={imagePercent}
                                imageDegree={imageDegree}
                                width={objectFit === "none" ? calculateWidth("original_image", imagePercent) : calculateWidth("custom_image", imagePercent)}
                                height={objectFit === "none" ? calculateHeight("original_image", imagePercent) : calculateHeight("custom_image", imagePercent)}
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