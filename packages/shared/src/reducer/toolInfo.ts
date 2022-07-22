
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type ToolState = {
    data:string
}
const initialState: ToolState = { data: "" }

export const toolSlice = createSlice({
    name: 'toolInfo',
    initialState,
    reducers: {
        setToolDataAdd(state, action: PayloadAction<ToolState>) {
            return action.payload
        }
    }
})

export const { setToolDataAdd } = toolSlice.actions
export default toolSlice.reducer

