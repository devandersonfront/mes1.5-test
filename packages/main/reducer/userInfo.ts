export const initalState = {name: '', profile: '' , authority :''}

export const GET_USER_INFO = 'GET_USER_INFO'
export const SET_USER_INFO = 'SET_USER_INFO'

interface userInfoType {
  name: string
  profile: string
  authority : string
}

export const setUserInfoAction = (userInfo: userInfoType) => {
  return {
    type: SET_USER_INFO,
    userInfo: userInfo
  }
}

export const getUserInfoAction = () => {
  return {
    type : GET_USER_INFO
  }
}


const reducer = (state: userInfoType=initalState, action) => {
  switch(action.type){  
    case SET_USER_INFO:
      return action.userInfo
    case GET_USER_INFO:
      return state
    default:
      return state
  }
}

export default reducer
