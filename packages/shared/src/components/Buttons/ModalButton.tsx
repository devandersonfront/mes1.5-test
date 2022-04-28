import React from 'react'
//@ts-ignore
import IcX from '../../../public/images/ic_x.png'
import { POINT_COLOR } from '../../common/configset'

export type ModalButtonType = 'readOnly' | 'confirm'
interface IProps {
  style?: object | null
  imgStyle?: object | null
  buttonType: ModalButtonType
  onClickCloseButton: (e?: any) => void
  onClickConfirmButton?: (e?: any) => void
  closeButtonTitle: string
  confirmButtonTitle?: string
}


const ModalButton = ({style, onClickCloseButton, onClickConfirmButton, imgStyle, buttonType, closeButtonTitle, confirmButtonTitle} : IProps) => {

  const readOnlyButton = () => {
    return <div style={{height: 84, display: 'flex', alignItems: 'flex-end'}}>
      <div
        onClick={onClickCloseButton}
        style={{
          width: "100%",
          height: 40,
          backgroundColor: POINT_COLOR,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <p>{closeButtonTitle}</p>
      </div>
    </div>
  }

  const confirmButtons = () => {
    return <div style={{height: 84, display: 'flex', alignItems: 'flex-end'}}>
      <div
        onClick={onClickCloseButton}
        style={{
          width: 888,
          height: 40,
          backgroundColor: '#b3b3b3',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <p>{closeButtonTitle}</p>
      </div>
      <div
        onClick={onClickConfirmButton}
        style={{
          width: 888,
          height: 40,
          backgroundColor: POINT_COLOR,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <p>{confirmButtonTitle}</p>
      </div>
    </div>
  }

  const RenderButtons = (buttonType: ModalButtonType) => {
    switch(buttonType)
    {
      case 'readOnly': return readOnlyButton()
      case 'confirm': return confirmButtons()
      default: return
    }
  }

  return (
    <>
      {
        RenderButtons(buttonType)
      }
    </>
  )

}

export default ModalButton
