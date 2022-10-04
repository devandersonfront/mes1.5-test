import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type UserInfoState = {
  name: string
  profile: string
  authority? : string
  userId?:string
  companyCode?:string
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
      state.userId = action.payload.userId
      state.companyCode = action.payload.companyCode
    }
  }
})

export const selectUserInfo = (state) => state.userInfo
export const { setUserInfo } = userSlice.actions
export default userSlice.reducer
