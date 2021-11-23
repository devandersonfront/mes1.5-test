export const initalState:any = {
  data: [],
  index: 0
}

const INSERT_SUMMARY_INFO = "INSERT_SUMMARY_INFO";

export const insert_summary_info = (payload:any) => {
  return {
    type:INSERT_SUMMARY_INFO,
    payload:payload
  }

}

// factory
// device
// mold
// product
// product_no_cavity

type DefaultAction = ReturnType<typeof insert_summary_info>;

const infoModal = (state = initalState, {type, payload}:DefaultAction) => {
  switch (type){
    case INSERT_SUMMARY_INFO :
      let tmp_state = {...state}
      tmp_state.data.splice(payload.index, 0, payload.data)
      return {...tmp_state}

    default :
      return state
  }
}


export default infoModal;
