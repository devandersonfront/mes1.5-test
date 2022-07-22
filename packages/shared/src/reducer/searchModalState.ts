import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type SearchModalState = {
    index:number
}
const initialState: SearchModalState = {  index:0 }

export const searchModalSlice = createSlice({
    name: 'searchModalState',
    initialState,
    reducers: {
        changeSearchModalNumber(state, action: PayloadAction<SearchModalState>) {
            return action.payload
        }
    }
})

export const { changeSearchModalNumber } = searchModalSlice.actions
export default searchModalSlice.reducer

