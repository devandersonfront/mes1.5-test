import React from 'react'
import IcX from '../../../public/images/ic_x.png'

interface IProps {
  style?: object | null
  onClick: (e: any) => void
  imgStyle?: object | null
}

const CloseButton = ({style, onClick, imgStyle} : IProps) => {

  return (
    <div style={ !!style ? style : {cursor: 'pointer', marginLeft: 20}}  onClick={onClick}>
      <img style={!!imgStyle ? imgStyle : {width: 20, height: 20}} src={IcX}/>
    </div>
  )

}

export default CloseButton