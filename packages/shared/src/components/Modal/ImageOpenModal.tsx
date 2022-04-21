import React from "react";
import Modal from 'react-modal'

interface IProps {
    url:string
    open:boolean
    changeSetOnImage:(value:boolean) => void
}

const ImageOpenModal = ({url, open, changeSetOnImage}:IProps) => {

    return (
        <div onClick={() => {
            changeSetOnImage(false);
        }} style={{display:"flex", width:"100%", position:"absolute"}}>
            <Modal isOpen={open} style={{
                content: {
                    top: '50%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    marginRight: '-50%',
                    transform: 'translate(-50%, -50%)',
                    padding: 0
                },
                overlay: {
                    background: 'rgba(0,0,0,.6)',
                    zIndex: 5
                }
            }}>
                <div style={{width:"100%", height:"100%"}}>
                    <img src={url} alt={"이미지 없음"} />
                </div>
            </Modal>
        </div>
    )

}

export default ImageOpenModal;
