import { createSlice, current, PayloadAction } from '@reduxjs/toolkit'

export type ModaInfoState = {
  index: number,
  datas: {
    headerData:any,
    title:string
    code:string
    data:any
    product_id?:number
  }[]
}

export const initialState: ModaInfoState = {
  index: 0,
  datas:[]
}

export const modalInfoSlice = createSlice({
  name: 'infoModal',
  initialState,
  reducers: {
    insert_summary_info(state, action: PayloadAction<{code:string, title:string, data:any[], headerData:any}>) {
      const newInfo = action.payload
      state.datas.push(newInfo)
    },
    change_summary_info_index(state, action: PayloadAction<ModaInfoState['index']>) {
      state.index = action.payload
    },
    delete_summary_info(state, action: PayloadAction<ModaInfoState['index']>) {
      const newInfo = state.datas.filter((data, idx) => idx !== action.payload)
      state.datas = newInfo
      if(state.index === action.payload){
        state.index = state.index-1;
      }else if(newInfo.length === 1){
        state.index = 0;
      }else {
        state.index = state.index < action.payload ? state.index : state.index-1 ;
      }
    },
    add_summary_info(state, action: PayloadAction<{code:string, title:string, index:number, product_id:number, data?:any[]}>) {
      const currentState = current(state)
      if(!state.datas[action.payload.index])
      {
        state.datas.push({
          title : action.payload.title ?? null,
          code : action.payload.code?? null,
          product_id : action.payload.product_id ?? null,
          headerData : currentState.datas[0]?.headerData ?? null,
          data : currentState.datas[0]?.data ?? null,
        })
      } else {
        const toBeUpdated = state.datas.find((data,idx) => idx === action.payload.index)
        toBeUpdated.title = action.payload.title
        toBeUpdated.code = action.payload.code
        toBeUpdated.product_id = action.payload.product_id
      }
      if(currentState.index === 0 && action.payload.data)
      {
        const firstData = state.datas.find((data,idx) => idx === 0)
        firstData.data = action.payload.data
      }

      state.index = action.payload.index
    },
    reset_summary_info(state, action: PayloadAction<ModaInfoState>) {
      return initialState
    },
  }
})

export const selectModalInfo = (state) => state.infoModal
export const { insert_summary_info, add_summary_info, delete_summary_info, reset_summary_info, change_summary_info_index } = modalInfoSlice.actions
export default modalInfoSlice.reducer
