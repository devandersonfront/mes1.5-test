// import {IMenuType} from '../common/@types/type'

export const initalState = {
  product_ids_for_selected_rows: [],
}

export const ADD_PRODUCT_IDS_FOR_SELECTED_ROWS = 'ADD_PRODUCT_IDS_FOR_SELECTED_ROWS'
export const REMOVE_PRODUCT_IDS_FOR_SELECTED_ROWS = 'REMOVE_PRODUCT_IDS_FOR_SELECTED_ROWS'
export const REMOVE_ALL_PRODUCT_IDS_FOR_SELECTED_ROWS = 'REMOVE_ALL_PRODUCT_IDS_FOR_SELECTED_ROWS'

interface IType {
    product_ids_for_selected_rows : String[]
}

export const add_product_ids_for_selected_rows = (selctedRowProductId: IType) => {
  return {
    type: ADD_PRODUCT_IDS_FOR_SELECTED_ROWS,
    selctedRowProductId: selctedRowProductId
  }
}

export const remove_product_ids_for_selected_rows = (selctedRowProductId: IType) => {
  return {
    type: REMOVE_PRODUCT_IDS_FOR_SELECTED_ROWS,
    selctedRowProductId: selctedRowProductId
  }
}

export const remove_all_product_ids_for_selected_rows = () => {
  // alert("실행 확인")
  return {
    type: REMOVE_ALL_PRODUCT_IDS_FOR_SELECTED_ROWS,
    // selctedRowProductId: selctedRowProductId
  }
}


const reducer = (state: IType=initalState, action) => {
  switch(action.type){
    case ADD_PRODUCT_IDS_FOR_SELECTED_ROWS:
      return {
        ...state,
        product_ids_for_selected_rows: [...state.product_ids_for_selected_rows, action.selctedRowProductId]
      }

    case REMOVE_PRODUCT_IDS_FOR_SELECTED_ROWS:
      return {
       ...state,
       product_ids_for_selected_rows: state.product_ids_for_selected_rows.filter((el)=> {
         return el !== action.selctedRowProductId
       })
      }
      
    case REMOVE_ALL_PRODUCT_IDS_FOR_SELECTED_ROWS:
      return {
       ...state,
       product_ids_for_selected_rows: []
      }
      
      
    default:
      return state
  }
}

export default reducer
