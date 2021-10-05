import axios from "axios";
import cookie from 'react-cookies'

function setToken(userInfo:any,) {

  axios.defaults.headers.Authorization = userInfo.token;

  const expires = new Date()
  expires.setDate(Date.now() + 1000 * 60 * 60 * 24)

  cookie.save(
    'userInfo'
    , userInfo
    , {
      path: '/'
      , expires
      , httpOnly: false // dev/prod 에 따라 true / false 로 받게 했다.
    }
  )
}

export {setToken}
