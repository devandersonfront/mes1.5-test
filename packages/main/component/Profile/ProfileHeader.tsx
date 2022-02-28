import React, {useEffect} from 'react'
import {Profile} from '../../styles/styledComponents'
import {removeLocalstorage} from '../../common/localstorageFunc'
import {useRouter} from 'next/router'
import cookie from 'react-cookies'
import Notiflix from 'notiflix'
//@ts-ignore
import ic_profile from '../../public/images/ic_profile.png'
import {useDispatch, useSelector} from 'react-redux'
import {setUserInfoAction} from '../../reducer/userInfo'
import {SF_ENDPOINT_RESOURCE} from '../../common/configset'

//웰컴, 로그인 페이지 네비게이션 컴포넌트

interface IProps {
  user: {
    name: string
  },
}

const ProfileHeader = () => {
  const router = useRouter()
  //@ts-ignore
  const userInfo = useSelector(state => state.userInfo)
  const dispatch = useDispatch()
  useEffect(() => {
    let userInfo = cookie.load('userInfo')
    dispatch(setUserInfoAction({
      name: userInfo ? userInfo.name : "",
      profile: userInfo ? userInfo.profile: "",
      authority : userInfo ? userInfo.ca_id.name : ""
    }))
  }, [])

  return (
    <div style={{width: '100%', height: 50, display: 'flex', justifyContent: 'flex-end', paddingTop: 20}}>
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        {/*<Profile src={userInfo.profile ? SF_ENDPOINT_RESOURCE+'/'+userInfo.profile : ic_profile}/>*/}
        <Profile src={userInfo.profile ? "https://sizl-resource2.s3.ap-northeast-2.amazonaws.com"+'/'+userInfo.profile : ic_profile}/>
        <span className="p-bold" style={{
          fontSize: 18,
          marginRight: 32,
          display: 'inline-block',
          color: 'white',
          fontFamily: 'Noto Sans KR',
          fontWeight: 'bold'
        }}>{userInfo.name}</span>
        <a style={{
          fontSize: 18,
          marginRight: 32,
          display: 'inline-block',
          color: 'white',
          fontFamily: 'Noto Sans KR',
          fontWeight: 'bold',
          cursor: 'pointer',
        }} onClick={() => {
          Notiflix.Loading.dots('MES System 로그아웃...')
          removeLocalstorage(['userToken', 'userInfo'])
          router.push('/').then(() => Notiflix.Loading.remove(500))
        }}>
          Log out
        </a>
      </div>
    </div>
  );
}

export default ProfileHeader;
