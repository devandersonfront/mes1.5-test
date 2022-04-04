import {IMenuType} from '../common/@types/type'

export const initalState = {
    main: "",
    sub: "",
}

export const SET_SELECT_MENU_STATE = 'SET_SELECT_MENU_STATE'
export const DELETE_SELECT_MENU_STATE = 'DELETE_SELECT_MENU_STATE'

interface IMenuStateType {
    main?:string,
    sub?: string
}

export const setSelectMenuStateChange = (menuState: IMenuStateType) => {
    return {
        type: SET_SELECT_MENU_STATE,
        menuState: menuState
    }
}

export const deleteSelectMenuState = () => ({
    type: DELETE_SELECT_MENU_STATE,
    menuState: null
})

type DefaultAction = ReturnType<typeof setSelectMenuStateChange> | ReturnType<typeof deleteSelectMenuState>

const reducer = (state: IMenuStateType=initalState, action:DefaultAction) => {
    switch(action.type){
        case SET_SELECT_MENU_STATE:
            const select_menu = {...state};
            const action_menu = action.menuState
            select_menu.main = action_menu?.main ?? select_menu.main
            select_menu.sub = action_menu?.sub ?? select_menu.sub

            return select_menu
        case DELETE_SELECT_MENU_STATE:

            return {main:"",sub:""}
        default:
            return state
    }
}

export default reducer
