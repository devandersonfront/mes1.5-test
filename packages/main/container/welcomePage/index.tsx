import React from 'react'
import { NextPage } from 'next'
import styled from 'styled-components'
import DefaultButton from '../../component/DefaultButton'
import {useRouter} from 'next/router'

interface IProps {
  // router: NextRouter
}

const WelcomePage: NextPage<IProps> = () => {

  const router = useRouter()

  return (
    <div style={{
      zIndex: 1,
      backgroundImage: `url(${require('../../public/images/img_welcome_bg.png')})`,
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: "center",
      justifyContent: "center",
    }}>
      <div style={{width: 635, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingBottom: 60}}>
        <p style={{
          fontSize: 60,
          fontFamily: 'Roboto',
          fontWeight: 'bold',
          paddingLeft: 10,
          paddingRight: 10,
          paddingBottom: 27,
          marginBottom: 0,
          borderBottom: '1px solid white',
          color: 'white',
          textAlign: 'center',
          width: '100%',
        }}>Mes System</p>
        <p
          className="p-eng"
          style={{
            fontFamily: 'Roboto',
            fontWeight: 'bold',
            fontSize: 36,
            marginTop: 25,
            marginBottom: 32,
            color: 'white',
            textAlign: 'center'
          }}
        >
          Smart Manufacturing Execution System
        </p>
        <DefaultButton onClick={() => {
          router.push('/mes/login')
        }} width={'320px'} title={'로그인'}/>
      </div>
    </div>
  )
}

export default WelcomePage
