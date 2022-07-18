import React, {useEffect} from 'react'
import {Profile} from '../../styles/styledComponents'
import {useRouter} from 'next/router'
import cookie from 'react-cookies'
import Notiflix from 'notiflix'
//@ts-ignore
import ic_profile from '../../public/images/ic_profile.png'
import {useDispatch, useSelector} from 'react-redux'
import { selectUserInfo, setUserInfo } from 'shared/src/reducer/userInfo'

//웰컴, 로그인 페이지 네비게이션 컴포넌트
const ProfileHeader = () => {
  const router = useRouter()
  const userInfo = useSelector(selectUserInfo)
  const dispatch = useDispatch()
  useEffect(() => {
    let userInfo = cookie.load('userInfo')
    if(userInfo === undefined){
      router.push("/")
    }
    try {
      dispatch(setUserInfo({
        name: userInfo ? userInfo.name : "",
        profile: userInfo ? userInfo.profile: "",
        authority : userInfo ? userInfo.ca_id.name : ""
      }))
    } catch (e){
      Notiflix.Report.failure("경고","잘못된 접근입니다.","확인", () => {
        cookie.remove("userInfo")
        router.push("/")
      })
    }
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
          cookie.remove("userInfo",{path:"/"})
          // removeLocalstorage(['userToken', 'userInfo'])
          router.push('/').then(() => Notiflix.Loading.remove(500))
        }}>
          Log out
        </a>
      </div>
    </div>
  );
}

export default ProfileHeader;
