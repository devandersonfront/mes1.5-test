import React from 'react'
import {NextPage} from 'next'
import DefaultButton from '../../component/DefaultButton'
import WelcomeInput from '../../component/InputBox/WelcomeInput'
import WelcomeContainer from '../../component/Welcome/WelcomeContainer'
import {useRouter} from 'next/router'
import {requestApi} from 'shared'
import {setToken} from '../../common/tokenManager'
import Notiflix from 'notiflix'
import {useDispatch} from 'react-redux'
import { setUserInfo } from 'shared/src/reducer/userInfo'

interface IProps {
  children?: any
  data: IReqType
  setData: (data: IReqType) => void
}

interface IReqType {
  id: string,
  password: string
}

const LoginPage: NextPage<IProps> = ({children, data, setData }) => {
  const router = useRouter()
  const dispatch = useDispatch()


  const onClickLogin = async () => {
    if(data.id && data.password){
      Notiflix.Loading.dots('MES System 접속 중...')
      const res = await requestApi('post', '/anonymous/login', data)

      if(res) {
        setToken( res )
        dispatch(setUserInfo({
          name: res.name,
          profile: res.profile,
          authority : res.ca_id.name
        }))
        router.push('/mes/dashboard').then()
      }
    }else{
      Notiflix.Report.warning('에러', '아이디와 비밀번호를 입력해주세요', '확인')
    }
  }

  const onKeyDownEnter = async (key: string) => {
    if (key === 'Enter')
      await onClickLogin().then(() => Notiflix.Loading.remove(500))
  }

  return (
    <WelcomeContainer>
      <div style={{width: 320}}>
        <p style={{fontSize: 36, marginBottom: 26, textAlign: 'left', fontFamily: 'Roboto', fontWeight: 'bold'}}>Log In</p>
        <WelcomeInput type="email" value={data.id} title={'ID (e-mail)'}
                     onChangeEvent={(e: React.ChangeEvent<HTMLInputElement>): void => {
                       setData({...data, id: e.target.value})
                   }} hint={'이메일을 입력해주세요.'}/>
        <WelcomeInput type="password" value={data.password} title={'Password'}
                     onChangeEvent={(e: React.ChangeEvent<HTMLInputElement>): void => {
                         setData({...data, password: e.target.value})
                     }} hint={'비밀번호를 입력해주세요.'} onKeyDown={onKeyDownEnter}/>
        <DefaultButton title={'로그인'} onClick={() => onClickLogin().then(() => Notiflix.Loading.remove(500) ) } />
        {/*<p style={{marginTop:"15px", textDecoration:"underline", cursor: 'pointer'}} onClick={()=>{ router.push("/mes/modify/findpassword")}}>*/}
        {/*  비밀번호 찾기*/}
        {/*</p>*/}
      </div>
    </WelcomeContainer>
  )
}

export default LoginPage
