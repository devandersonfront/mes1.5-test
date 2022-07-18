import React, {useRef} from 'react'
import Styled from 'styled-components'
import BasicModal from "./BasicModal"
//@ts-ignore
import Barcode from 'react-barcode';
import axios from 'axios';
import DomToImage from "dom-to-image";
import Notiflix from "notiflix";
import {BarcodeDataType} from '../../common/barcodeType'
import {RequestMethod} from "../../Functions/RequestFunctions";
import Modal from "react-modal";

const QuantityModal = ({isVisible , onClick , onClose}) => {

    const [ quantity , setQuantity ] = React.useState<number | undefined>()

    const handleInput = (event) => {
        setQuantity(event.target.value.replace(/[^0-9]/g, ""))
    }

    const handleClose = () => {
        setQuantity(undefined)
        onClose()
    }

    const handleClick = () => {
        if(quantity > 0){
            onClick(quantity)
            setQuantity(undefined)
        }else{
            Notiflix.Report.warning('주의','수량을 입력해주세요','확인')
        }

    }


    return(
        <Modal
            isOpen={isVisible}
            style={{
                content: {
                    top: '50%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    marginRight: '-50%',
                    transform: 'translate(-50%, -50%)',
                    width: 500,
                    padding: 0,
                    overflow: 'hidden',
                    minHeight: 200,
                    height : 200,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                },
                overlay: {
                    background: 'rgba(0,0,0,.6)',
                    zIndex: 101
                }
            }}
        >
            <div
                style={{
                    alignItems:'center',
                    justifyContent : 'center',
                    height : '100%',
                    padding : 10
                }}>
                <p style={{fontWeight:'bold' , fontSize : 25 , margin : '10px 0px 10px 0px'}}>수량</p>
                <p style={{marginBottom: 10}}>수량을 입력해 주시기 바랍니다.</p>
                <input
                    type={'text'}
                    placeholder={'최대 6자리까지 입력이 가능합니다.'}
                    style={{width : '100%' , height : 30}}
                    onChange={handleInput}
                    value={quantity}
                    maxLength={6}
                />
                <div style={{display : "flex", justifyContent : 'flex-end' , width : '100%'}}>
                    <ButtonBox>
                        <Button color={'#19B9DF'} onClick={handleClick}>확인</Button>
                        <Button color={'#E2E2E2'} onClick={handleClose}>취소</Button>
                    </ButtonBox>
                </div>
            </div>
        </Modal>
    )
}


export {QuantityModal}


const ButtonBox = Styled.div`
     
    display : flex;
    width : 130px;
    justify-content : space-between;
    margin-top : 10px;
    
`

const Button = Styled.button`
      margin: 0;
      padding: 0.5rem 1rem;
      font-size: 1rem;
      font-weight: 400;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      border: none;
      border-radius: 4px;
      cursor : pointer;
      background : ${(props)=> props.color &&  props.color}
`