import React from 'react'
import Modal from 'react-modal'
import Styled from 'styled-components'
//@ts-ignore
import IcX from '../../../public/images/ic_x.png'


interface Props {
  backgroundColor ?: 'WHITE' | 'DARKBLUE'
  isOpen: boolean,
  onClose?: () => void
  onClickEvent?: () => void
}

const BasicModal: React.FunctionComponent<Props> = ({
                                                      backgroundColor,
                                                      children,
                                                      isOpen,
                                                      onClose,
                                                    }) => {
  return <Modal
      isOpen={isOpen}
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          width: 1776,
          padding: 0,
          overflow: 'hidden',
          minHeight: 816,
          height : 816,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background : backgroundColor === 'WHITE' ? '#FFFFFF' : 'linear-gradient(90deg, #202E4A, #0F1722)'
        },
        overlay: {
          background: 'rgba(0,0,0,.6)',
        },
      }}
    >
    <div style={{ padding: 16 , height : '100%',display: 'flex',flexDirection: 'column'}}>
      <div>
        <div style={{ textAlign: 'right' }}>
          <img src={IcX} style={{ width: 32, height: 32, cursor: 'pointer' }}
              onClick={() => onClose && onClose()}/>
        </div>
      </div>
      {children}
    </div>
  </Modal>

}


BasicModal.defaultProps = {
    backgroundColor : "WHITE"
}


export default BasicModal
