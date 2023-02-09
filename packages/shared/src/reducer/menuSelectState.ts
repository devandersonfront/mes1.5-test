import {IMenuType} from '../@types/type'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type MenuSelectState = {
    main?: string
    sub?: string
}

const initialState : MenuSelectState = {
    sub: 'init',
    main: ''
}

// export const deleteSelectMenuState = () => ({
//     type: DELETE_SELECT_MENU_STATE,
//     menuState: null
// })

// export const setSelectMenuStateChange = (menuState: IMenuStateType) => {
//     return {
//         type: SET_SELECT_MENU_STATE,
//         menuState: menuState
//     }
// }

export const selectedMenuSlice = createSlice({
    name: 'menuSelectState',
    initialState,
    reducers: {
        setMenuSelectState(state, action: PayloadAction<MenuSelectState>) {
            state.main = action.payload.main ? action.payload.main : state.main
            state.sub = action.payload.sub ? action.payload.sub : state.sub
        },
        deleteMenuSelectState(state) {
            state.main = initialState.main
            state.sub = initialState.sub
        }
    }
})

export const selectMenuState = (state) => state.menuState
export const { setMenuSelectState, deleteMenuSelectState } = selectedMenuSlice.actions
export default selectedMenuSlice.reducer


