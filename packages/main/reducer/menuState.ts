import {IMenuType} from '../common/@types/type'

export const initalState = {
  sub: [],
  main: [],
  selectState:{
    main:0,
    sub:""
  }
}

export const SET_MENU_STATE = 'SET_MENU_STATE'

interface IMenuStateType {
  main: IMenuType[],
  sub: IMenuType[][],
  selectState?:{
    main:number | null,
    sub:string | null
  }
}

export const setMenuStateChange = (menuState: IMenuStateType) => {
  return {
    type: SET_MENU_STATE,
    menuState: menuState,
  }
}

const reducer = (state: IMenuStateType=initalState, action) => {
  switch(action.type){
    case SET_MENU_STATE:
      return action.menuState
    default:
      return state
  }
}

export default reducer
