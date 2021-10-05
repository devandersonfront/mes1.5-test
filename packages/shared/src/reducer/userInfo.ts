export const initalState = {name: '', profile: ''}

export const GET_USER_INFO = 'GET_USER_INFO'
export const SET_USER_INFO = 'SET_USER_INFO'

interface userInfoType {
  name: string
  profile: string
}

export const setUserInfoAction = (userInfo: userInfoType) => {
  return {
    type: SET_USER_INFO,
    userInfo: userInfo
  }
}


const reducer = (state: userInfoType=initalState, action) => {
  switch(action.type){
    case SET_USER_INFO:
      return action.userInfo
    default:
      return state
  }
}

export default reducer
