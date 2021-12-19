import React, {useEffect, useState} from 'react'
import LoginPage from '../../../container/loginPage'
import { NextPageContext } from 'next'
import { useDispatch, useSelector } from 'react-redux';
import {setUserInfoAction} from '../../../reducer/userInfo'
import styled from 'styled-components'

interface IProps {
  children?: any
  data: IReqType
}

interface IReqType {
  id: string,
  password: string
}


const Home = ({data}: IProps) => {
  const [reqData, setReqData] = useState<IReqType>({
    id: "",
    password: ""
  })

  return (
    <Container>
      <LoginPage data={reqData} setData={setReqData} />
    </Container>
  )
}

Home.getInitialProps = async (ctx: NextPageContext) => {
  return {
    data: {
      id: "",
      password: ""
    }
  }
}

const Container = styled.div`
  .container {
    min-height: 100vh;
    padding: 0 0.5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }

  .welcomebtn {
    padding: 12px;
    border-radius: 5px;
    click-event: none;
    color: black;
    background-color: #19B9DF;
    border: none;
    font-size: 18px;
    font-weight: bold;
    text-align: center;
    cursor: pointer;
  }

  .welcomeInputBox {
    width: 100%;
    margin-top: 6px;
    margin-bottom: 11px;
    font-size: 14px;
    border-radius: 5px;
    outline: none;
    border: 0;
    background-color: #ffffff;
    font-size: 15px;
    padding: 14px;
    width: calc(100% - 30px) !important;
    color: #252525;
  }
`


export default Home
