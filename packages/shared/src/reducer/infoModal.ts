interface ModalType {
  code: string[],
  title: string[],
  index: number,
  data?: any[]
}

export const initalState:ModalType = {
  code: [],
  title: [],
  index: 0,
  data:[]
}

const INSERT_SUMMARY_INFO = "INSERT_SUMMARY_INFO";
const ADD_SUMMARY_INFO = "ADD_SUMMARY_INFO";
const CHANGE_SUMMARY_INFO_INDEX = "CHANGE_SUMMARY_INFO_INDEX";
const DELETE_SUMMARY_INFO = "DELETE_SUMMARY_INFO";
const RESET_SUMMARY_INFO = "RESET_SUMMARY_INFO";
const ADD_SUMMARY_INFO_DATA = "ADD_SUMMARY_INFO_DATA";


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

export const add_summary_info_data = (payload:any[]) => ({
  type:ADD_SUMMARY_INFO_DATA,
  payload: payload
})

// factory
// device
// mold
// product
// product_no_cavity

type DefaultAction = ReturnType<typeof insert_summary_info> | ReturnType<typeof reset_summary_info> |
                     ReturnType<typeof delete_summary_info> | ReturnType<typeof add_summary_info> |
                     ReturnType<typeof change_summary_info_index> | ReturnType<typeof add_summary_info_data>
    ;

const infoModal = (state = initalState, {type, payload}:DefaultAction) => {
  switch (type){
    case INSERT_SUMMARY_INFO :
      const insertState = {...state};
      const insertPayload = payload as {code, title};

      insertState.title.push(insertPayload.title);
      insertState.code.push(insertPayload.code);
      return insertState;

    case ADD_SUMMARY_INFO:
      const addState = {...state};
      const addPayload = payload as {code, title, index};
      addState.title.push(addPayload.title);
      addState.code.push(addPayload.code);
      addState.index = addPayload.index;
      return addState;

    case CHANGE_SUMMARY_INFO_INDEX:
      const changeIndexState = {...state};
      const changeIndexPayload = payload as number;
      changeIndexState.index = changeIndexPayload;

      return changeIndexState;

    case RESET_SUMMARY_INFO :
      return {
        code: [],
        title: [],
        index: 0
      }

    case DELETE_SUMMARY_INFO:
      const deleteState = {...state};
      console.log("DELETE_SUMMARY_INFO : ", payload)
      // const deletePayload = payload as number;
      deleteState.code.splice(payload, 1);
      deleteState.title.splice(payload, 1);

      return deleteState;

    case ADD_SUMMARY_INFO_DATA:
      const addDataState = {...state};
      console.log("ADD_SUMMARY_INFO_DATA : ", payload);
      const addDataPayload = payload as any[];

      addDataState.data.push(addDataPayload)

      return addDataState;

    default :
      return state
}
}


export default infoModal;
