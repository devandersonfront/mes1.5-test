// import { REMOVE_ALL_PRODUCT_IDS_FOR_SELECTED_ROWS, REMOVE_PRODUCT_IDS_FOR_SELECTED_ROWS } from './product_ids_for_selected_rows_state';
// import {IMenuType} from '../common/@types/type'

export const initialState = {
  total_search_result: [],
  product_ids_for_selected_rows: [],
  product_ids_for_removed_rows: [],
  search_list_for_modal: [],
  product_ids_for_current_basic_row: [],
  is_change_for_modal : false, 
}

export const UPDATE_IS_CHANGE_FOR_MODAL_STATUS = 'UPDATE_IS_CHANGE_FOR_MODAL_STATUS'

export const ADD_PRODUCT_IDS_FOR_SELECTED_ROWS = 'ADD_PRODUCT_IDS_FOR_SELECTED_ROWS'
export const SET_PRODUCT_IDS_FOR_SELECTED_ROWS = 'SET_PRODUCT_IDS_FOR_SELECTED_ROWS'
export const REMOVE_PRODUCT_IDS_FOR_SELECTED_ROWS = 'REMOVE_PRODUCT_IDS_FOR_SELECTED_ROWS'
export const REMOVE_ALL_PRODUCT_IDS_FOR_SELECTED_ROWS = 'REMOVE_ALL_PRODUCT_IDS_FOR_SELECTED_ROWS'
export const REMOVE_ALL_PRODUCT_IDS_FOR_REMOVED_ROWS = 'REMOVE_ALL_PRODUCT_IDS_FOR_REMOVED_ROWS'

export const ADD_PRODUCT_IDS_FOR_REMOVED_ROWS = 'ADD_PRODUCT_IDS_FOR_REMOVED_ROWS'
export const REMOVE_PRODUCT_IDS_FOR_REMOVED_ROWS = 'REMOVE_PRODUCT_IDS_FOR_REMOVED_ROWS'
export const INITIALIZE_SEARCH_LIST = 'INITIALIZE_SEARCH_LIST'

export const CANCEL_FOR_PRODUCTD_IDS_FOR_MODAL = "CANCEL_FOR_PRODUCTD_IDS_FOR_MODAL"

export const INITIALIZE_PRODCT_IDS_FOR_BASICROW = "INITIALIZE_PRODCT_IDS_FOR_BASICROW"

export const ADD_ALL_SELECTED_PRODUCT_IDS_FOR_SEARCH_LIST = "ADD_ALL_SELECTED_PRODUCT_IDS_FOR_SEARCH_LIST"

interface IType {
  product_ids_for_selected_rows?: String[]
  product_ids_for_removed_rows?: String[]
  product_ids_for_current_basic_row?: String[]
  total_search_result? : String[]
  is_change_for_modal?: boolean
  allSearchIds?: string[]
  product_ids?: string[]
}

export const update_is_change = () => ({
  type: UPDATE_IS_CHANGE_FOR_MODAL_STATUS
})

export const initialize_product_ids_for_basicrow = (payload: any[]) => ({
  type: INITIALIZE_PRODCT_IDS_FOR_BASICROW,
  payload: payload
})

////////
export const cancel_for_product_ids_for_modal = () => {

  // let payload;

  // if(initialState.product_ids_for_current_basic_row.length > initialState.product_ids_for_current_basic_row.length){
  //   payload = initialState.product_ids_for_current_basic_row.map((prid)=> {
  //     if(initialState.product_ids_for_current_basic_row.includes(prid)){
  //       return prid
  //     }
  //   })
  // } else {
  //   payload = initialState.product_ids_for_current_basic_row.map((prid)=> {
  //     if(initialState.product_ids_for_current_basic_row.includes(prid)){
  //       return prid
  //     }
  //   })
  // }



  return {
    type: CANCEL_FOR_PRODUCTD_IDS_FOR_MODAL,
    // payload: payload
  }
}


///////
export const add_product_ids_for_selected_rows = (selctedRowProductId: IType) => {

  console.log("selectedRowProductId : ", selctedRowProductId);
  

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

export const cancel_product_ids_for_modal = () => {

  // alert("remove all check !!")
  // alert("실행 확인")
  return {
    type: REMOVE_ALL_PRODUCT_IDS_FOR_SELECTED_ROWS,
    // selctedRowProductId: selctedRowProductId
  }
}
//////

//////
export const add_product_ids_for_removed_rows = (selctedRowProductId: IType) => {
  return {
    type: ADD_PRODUCT_IDS_FOR_REMOVED_ROWS,
    selctedRowProductId: selctedRowProductId
  }
}

export const remove_product_ids_for_removed_rows = (selctedRowProductId: IType) => {
  return {
    type: REMOVE_PRODUCT_IDS_FOR_REMOVED_ROWS,
    selctedRowProductId: selctedRowProductId
  }
}

// ADD_ALL_SELECTED_PRODUCT_IDS_FOR_SEARCH_LIST
export const add_all_selected_product_ids_for_search_list = (allSearchIds: IType) => {
  return {
    type: ADD_ALL_SELECTED_PRODUCT_IDS_FOR_SEARCH_LIST,
    allSearchIds: allSearchIds
  }
}
////// SET_PRODUCT_IDS_FOR_SELECTED_ROWS
export const set_product_ids_for_selected_rows = (product_ids: IType) => {

  console.log("product_ids 리덕스 업데이트 !! ", product_ids);

  return {
    type: SET_PRODUCT_IDS_FOR_SELECTED_ROWS,
    product_ids : product_ids
  }
}

const reducer = (state: IType = initialState, action) => {
  console.log("action.type : ", action.type);
  console.log("action : ", action);
  console.log("action.payload : ", action.payload);
  

  switch (action.type) {

    

    case UPDATE_IS_CHANGE_FOR_MODAL_STATUS:
      return {
        ...state,
        // is_change_for_modal: !state.is_change_for_modal
        is_change_for_modal: state.product_ids_for_removed_rows.length ? "true" : "false"
      }

    case INITIALIZE_PRODCT_IDS_FOR_BASICROW:
      console.log(state, action)
      return {
        ...state,
        product_ids_for_current_basic_row : [...state.product_ids_for_current_basic_row, ...action.payload]

      }

    case CANCEL_FOR_PRODUCTD_IDS_FOR_MODAL:      

      let payload;
      const after_selected_rows = state.product_ids_for_selected_rows.filter((prid)=> {
        if(state.product_ids_for_current_basic_row.includes(prid)){
          return prid;
        }
      })

      console.log("after_selected_rows !!!!!!!!!!! ", after_selected_rows);

      return {
        ...state,
        product_ids_for_selected_rows:[],
        product_ids_for_removed_rows:[],
        // product_ids_for_selected_rows:[...after_selected_rows],
        // product_ids_for_current_basic_row: [],
        // product_ids_for_removed_rows: []
      }

    ///////
    case ADD_PRODUCT_IDS_FOR_SELECTED_ROWS:
      return {
        ...state,
        product_ids_for_selected_rows: [...state.product_ids_for_selected_rows, action.selctedRowProductId]
      }

    case REMOVE_PRODUCT_IDS_FOR_SELECTED_ROWS:
      return {
        ...state,
        product_ids_for_selected_rows: state.product_ids_for_selected_rows.filter((el) => {
          return el !== action.selctedRowProductId
        })
      }

    case REMOVE_ALL_PRODUCT_IDS_FOR_SELECTED_ROWS:
      return {
        ...state,
        product_ids_for_selected_rows: []
      }

    ///////
    case ADD_PRODUCT_IDS_FOR_REMOVED_ROWS:
      return {
        ...state,
        product_ids_for_removed_rows: [...state.product_ids_for_removed_rows, action.selctedRowProductId]
      }

    case REMOVE_PRODUCT_IDS_FOR_REMOVED_ROWS:
      return {
        ...state,
        product_ids_for_removed_rows: state.product_ids_for_removed_rows.filter((el) => {
          return el !== action.selctedRowProductId
        })
      }

    case ADD_ALL_SELECTED_PRODUCT_IDS_FOR_SEARCH_LIST:
      return {
        ...state,
        product_ids_for_selected_rows: action.payload
      }
    ///////

    case SET_PRODUCT_IDS_FOR_SELECTED_ROWS:
      return {
        ...state,
        product_ids_for_selected_rows: action.product_ids
      }

    default:
      return state
  }
}

export default reducer
