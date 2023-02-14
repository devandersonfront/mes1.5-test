import {IMenuType} from '../@types/type'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type MenuState = {
  main: IMenuType[],
  sub: IMenuType[][]
  third : any,
}

const initialState : MenuState = {
  sub: [],
  main: [],
  third : []
}

export const menuSlice = createSlice({
  name: 'menuState',
  initialState,
  reducers: {
    setMenuState(state, action: PayloadAction<MenuState>) {
      state.main = action.payload.main
      state.sub = action.payload.sub
      state.third = action.payload.third
    }
  }
})

export const selectMenuState = (state) => state.menuState
export const { setMenuState } = menuSlice.actions
export default menuSlice.reducer
