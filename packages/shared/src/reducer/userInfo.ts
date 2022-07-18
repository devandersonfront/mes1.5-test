import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type UserInfoState = {
  name: string
  profile: string
  authority? : string 
}
const initialState: UserInfoState = {name: '', profile: '' , authority :''}

export const userSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    setUserInfo(state, action: PayloadAction<UserInfoState>) {
      state.name = action.payload.name
      state.profile = action.payload.profile
      state.authority = action.payload.authority
    }
  }
})

export const selectUserInfo = (state) => state.userInfo
export const { setUserInfo } = userSlice.actions
export default userSlice.reducer
