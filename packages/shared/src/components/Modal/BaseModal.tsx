import React, { FC, useRef } from 'react'
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


const BaseModal = (props)  => {
    return(
        <Modal
            isOpen={props.isOpen}
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
                    minHeight: 200,
                    height : 200,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  ...props.style.content
                },
                overlay: {
                    background: 'rgba(0,0,0,.6)',
                    zIndex: 101
                }
            }}
        >
            {
                props.children
            }
        </Modal>
    )
}


export {BaseModal}