import React from 'react'
import Modal from 'react-modal'
import Styled from 'styled-components'
//@ts-ignore
import IcX from '../../../public/images/ic_x.png'


interface Props {
  isOpen: boolean,
  onClose?: () => void
  onClickEvent?: () => void
  // buttonType ?: 'register' | 'confirm' 
}


const ModalContainer = {
  textAlign: 'left',
  fontWeight: 'bold'
}

const ButtonStyles = {
  width: '100%',
  background: '#19B9DF',
  borderRadius: 0
}




const BasicModal: React.FunctionComponent<Props> = ({
                                                      children,
                                                      isOpen,
                                                      onClose,
                                                      onClickEvent,
                                                      
                                                    }) => {

  const onEnrollment = () => {

        onClickEvent()

  }


  // const typeOfButton = (type : 'register' | 'confirm') => {

    
  //   switch(type){
  //       case 'register' :
  //           return (
  //             <ButtonContainer>
  //                 <Button type={'cancel'}>
  //                   {'취소'}
  //                 </Button>
  //                 <Button type>
  //                     {'등록하기'}
  //                 </Button>
  //             </ButtonContainer>  
  //           )
  //       case 'confirm' :
  //           return(
  //               <ButtonContainer>
  //                   <Button type  onClick={onClose()}>
  //                       {'확인'}
  //                   </Button>
  //               </ButtonContainer>
  //           )
  //       default :
  //           return undefined
  //   }
  // } 



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
          justifyContent: 'space-between'
        },
        overlay: {
          background: 'rgba(0,0,0,.6)',
          zIndex: 101
        }
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
      {/* <footer>
          {typeOfButton(buttonType)}
      </footer> */}
    </div>
  </Modal>


}

export default BasicModal


const ButtonContainer = Styled.div`

    width : 100%;
    height : 40px;


`

const Button = Styled.div<any>`

    display : flex;
    align-items: center;
    justify-content : center;
    font-size : 14px;
    color : #0D0D0D;
    background-color : ${props => props.type !=='cancel' ? '#19B9DF' : '#E7E9EB'};
    font: normal normal bold 14px/22px Noto Sans CJK KR;
    height: 100%;
`