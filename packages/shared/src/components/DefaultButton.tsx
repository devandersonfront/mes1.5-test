import React from 'react'
import { useRouter } from 'next/router'
//@ts-ignore
import styles from '../styles/Home.module.css'
import {PointColorButton} from '../styles/styledComponents'

interface IProps{
  title: string,
  width?: string,
  onClick?: () => void,
}

const DefaultButton = ({title, width, onClick}: IProps) => {

  return (
      <PointColorButton
        style={{
          width,
          cursor: onClick? 'pointer' : 'none'
        }}
        onClick={onClick}
      >{title}</PointColorButton>
  );
}

export default DefaultButton;
