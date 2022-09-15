import axios from "axios";
import cookie from 'react-cookies'

function setToken(userInfo:any,) {
  axios.defaults.headers.Authorization = userInfo.token;

  const expires = new Date()
  expires.setDate(Date.now() + 1000 * 60 * 60 * 24)
  const cookieInfo = {
    ca_id: {
      authorities: userInfo.ca_id.authorities,
      name: userInfo.ca_id.name
    },
    token: userInfo.token,
    company: userInfo.company,
    id: userInfo.id,
    name: userInfo.name,
    user_id: userInfo.user_id,
    profile: userInfo.profile
  }
  cookie.save(
    'userInfo'
    , cookieInfo
    , {
      path: '/'
      , expires
      , httpOnly: false // dev/prod 에 따라 true / false 로 받게 했다.
    }
  )
}

export {setToken}
