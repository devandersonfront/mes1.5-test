import { log } from "console";
import React, { useEffect, useState } from "react";
import Modal from 'react-modal'
import styled from 'styled-components'


interface IProps {
    url: string
    open: boolean
    changeSetOnImage: (value: boolean) => void
}

interface ImgProps {
    src?: string,
    style?: object,
    objectFit?: string
}

const Img = styled.img`
    object-fit: ${(props: ImgProps) => props.objectFit ? props.objectFit : "none"}
`;


const ImageOpenModal = ({ url, open, changeSetOnImage }: IProps) => {
    const [imagePercent, setImagePercent] = useState(100);
    const [objectFit, setObjectFit] = useState("none");
    

    const imageButtonClickHandler = (e) => {
        e.preventDefault();

        if (e.target.name == "original") {
            setObjectFit("none")
        }
        if (e.target.name == "custom") {
            setObjectFit("cover")
        }
        if (e.target.name == "enlargement") {
            console.log("enlargement");
            if (imagePercent < 500) {
                setImagePercent((prev) => prev + 10)
            } else {
                alert("500이상은 증가할수 없습니다.");
            }
        }
        if (e.target.name == "reduction") {
            console.log("reduction");

            if (imagePercent > 25) {
                setImagePercent((prev) => prev - 10)
            } else {
                alert("25% 이하는 감소할수 없습니다.");
            }

        }
        if (e.target.name == "rotation") {
            console.log("rotation");
        }


    }

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

    return (
        <div>
            <Modal isOpen={open}
                style={{
                    content: {
                        display: "flex",
                        height: "100%",
                        justifyContent: "center",
                        marginTop: '400px',
                        left: '50%',
                        right: 'auto',
                        transform: 'translate(-50%, -50%)',
                        border: "2px solid blue"
                    },
                    overlay: {
                        background: 'rgba(0,0,0,.6)',
                        zIndex: 5
                    }
                }}>
                <div style={{ textAlign: "center" }}>
                    <div style={{ marginBottom: "10px" }}>
                        <button onClick={imageButtonClickHandler} name="original">원본</button>
                        <button onClick={imageButtonClickHandler} name="custom">맞춤</button>
                        <button onClick={imageButtonClickHandler} name="enlargement">확대</button>
                        <button onClick={imageButtonClickHandler} name="reduction">축소</button>
                        <button onClick={imageButtonClickHandler} name="rotation">90도회전</button>
                        <button>저장</button>
                        &nbsp;&nbsp;
                        {imagePercent &&
                            <span>
                                모드:
                                <span>{mode(objectFit)}</span> &nbsp;&nbsp;
                                크기:
                                <span>{imagePercent} %</span>
                            </span>
                        }
                        <button style={{ float: "right", height: "50px" }} onClick={() => changeSetOnImage(false)}>닫기</button>
                    </div>
                    <div style={{ height: "100%", width: "100%" }}>
                        <Img src={url} alt={"이미지 없음"} objectFit={objectFit} style={{ width: imagePercent + "%", height: imagePercent + "%" }} />
                    </div>

                </div>
            </Modal>
        </div>

    )

}

export default ImageOpenModal;