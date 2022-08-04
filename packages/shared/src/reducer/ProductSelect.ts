import {ProductListType} from "../@types/type";
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState: ProductListType = {
    total_length:0,
    selectRow:null,
    products: [] }

export const productSelectSlice = createSlice({
    name: 'productSelect',
    initialState,
    reducers: {
        insert_productList(state, action: PayloadAction<ProductListType['products']>) {
            state.products = action.payload
            state.total_length = action.payload.length
        },
        insert_select_productList(state, action: PayloadAction<ProductListType['selectRow']>) {
            state.selectRow = action.payload
        },
    }
})

export const { insert_productList,insert_select_productList } = productSelectSlice.actions
export default productSelectSlice.reducer

