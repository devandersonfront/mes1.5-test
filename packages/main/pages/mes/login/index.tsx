import React, {useEffect, useState} from 'react'
import styles from '../../../styles/Home.module.css'
import LoginPage from '../../../container/loginPage'
import { NextPageContext } from 'next'
import { useDispatch, useSelector } from 'react-redux';
import {setUserInfoAction} from '../../../reducer/userInfo'

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
    <div className={styles.container}>
      <LoginPage data={reqData} setData={setReqData} />
    </div>
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


export default Home
