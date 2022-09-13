export const SET_MENU_STATE = 'SET_MODIFY_INFO'

interface IModifyInfoType {
  modifyInfo: any
  type: String | undefined
}

export const initalState: IModifyInfoType = {
  modifyInfo: {},
  type: undefined
}

export const setModifyInitData = (state: IModifyInfoType) => {
  return {
    type: SET_MENU_STATE,
    modifyInit: state
  }
}

const reducer = (state: IModifyInfoType=initalState, action) => {
  switch(action.type){
    case SET_MENU_STATE:
      return action.modifyInit
    default:
      return state
  }
}

export default reducer
