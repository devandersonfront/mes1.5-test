import {IMenuType} from '../common/@types/type'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type MenuState = {
  main: IMenuType[],
  sub: IMenuType[][]
}

const initialState : MenuState = {
  sub: [],
  main: []
}

export const menuSlice = createSlice({
  name: 'menuState',
  initialState,
  reducers: {
    setMenuState(state, action: PayloadAction<MenuState>) {
      state.main = action.payload.main
      state.sub = action.payload.sub
    }
  }
})

export const selectMenuState = (state) => state.menuState
export const { setMenuState } = menuSlice.actions
export default menuSlice.reducer
