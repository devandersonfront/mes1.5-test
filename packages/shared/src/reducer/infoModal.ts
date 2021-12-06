interface ModalType {
  data: string[],
  title: string[],
  index: number,
}

export const initalState:ModalType = {
  data: [],
  title: [],
  index: 0
}

const INSERT_SUMMARY_INFO = "INSERT_SUMMARY_INFO";
const ADD_SUMMARY_INFO = "ADD_SUMMARY_INFO";
const CHANGE_SUMMARY_INFO_INDEX = "CHANGE_SUMMARY_INFO_INDEX";
const DELETE_SUMMARY_INFO = "DELETE_SUMMARY_INFO";
const RESET_SUMMARY_INFO = "RESET_SUMMARY_INFO";

export const insert_summary_info = (payload:any) => {
  return {
    type:INSERT_SUMMARY_INFO,
    payload:payload
  }
}

export const add_summary_info = (payload:any) => ({
  type: ADD_SUMMARY_INFO,
  payload: payload
})

export const change_summary_info_index = (payload:number) => ({
  type: CHANGE_SUMMARY_INFO_INDEX,
  payload: payload
})

export const delete_summary_info = (payload:number) => ({
  type:DELETE_SUMMARY_INFO,
  payload:payload
})

export const reset_summary_info = () => {
  return {
    type: RESET_SUMMARY_INFO,
    payload:""
  }
}

// factory
// device
// mold
// product
// product_no_cavity

type DefaultAction = ReturnType<typeof insert_summary_info> | ReturnType<typeof reset_summary_info> |
                     ReturnType<typeof delete_summary_info> | ReturnType<typeof add_summary_info> |
                     ReturnType<typeof change_summary_info_index>
    ;

const infoModal = (state = initalState, {type, payload}:DefaultAction) => {
  switch (type){
    case INSERT_SUMMARY_INFO :
      const insertState = {...state};
      const insertPayload = payload as {data, title};

      insertState.title.push(insertPayload.title);
      insertState.data.push(insertPayload.data);
      return insertState;

    case ADD_SUMMARY_INFO:
      const addState = {...state};
      const addPayload = payload as {data, title, index};
      addState.title.push(addPayload.title);
      addState.data.push(addPayload.data);
      addState.index = addPayload.index;
      return addState;

    case CHANGE_SUMMARY_INFO_INDEX:
      const changeIndexState = {...state};
      const changeIndexPayload = payload as number;
      changeIndexState.index = changeIndexPayload;

      return changeIndexState;

    case RESET_SUMMARY_INFO :
      return {
        data: [],
        title: [],
        index: 0
      }

    case DELETE_SUMMARY_INFO:
      const deleteState = {...state};
      console.log("DELETE_SUMMARY_INFO : ", payload)
      // const deletePayload = payload as number;
      deleteState.data.splice(payload, 1);
      deleteState.title.splice(payload, 1);

      return deleteState;

default :
  return state
}
}


export default infoModal;
