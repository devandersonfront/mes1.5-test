interface ModalType {
  index: number,
  datas: {
    headerData:any,
    title:string
    code:string
    data:any
    product_id:number
  }[]
}



export const initalState:ModalType = {
  index: 0,
  datas:[]
}

const INSERT_SUMMARY_INFO = "INSERT_SUMMARY_INFO";
const ADD_SUMMARY_INFO = "ADD_SUMMARY_INFO";
const CHANGE_SUMMARY_INFO_INDEX = "CHANGE_SUMMARY_INFO_INDEX";
const DELETE_SUMMARY_INFO = "DELETE_SUMMARY_INFO";
const RESET_SUMMARY_INFO = "RESET_SUMMARY_INFO";

export const insert_summary_info = (payload: {code:string, title:string, data:any[], headerData:any}) => {
  return {
    type:INSERT_SUMMARY_INFO,
    payload:payload
  }
}

export const add_summary_info = (payload:{code:string, title:string, index:number, product_id:number}) => ({
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

type DefaultAction = ReturnType<typeof insert_summary_info> | ReturnType<typeof reset_summary_info> |
                     ReturnType<typeof delete_summary_info> | ReturnType<typeof add_summary_info> |
                     ReturnType<typeof change_summary_info_index>;

const infoModal = (state = initalState, {type, payload}:DefaultAction) => {
  switch (type){
    case INSERT_SUMMARY_INFO :
      const insertState = {...state, datas: [...state.datas]};
      const insertPayload = payload as {code:string, title:string, data:any[], headerData:any, product_id:number};
      insertState.datas.push({
        title: insertPayload.title,
        code: insertPayload.code,
        data: insertPayload.data,
        headerData: insertPayload.headerData,
        product_id: insertPayload.product_id
      })

      return insertState;

    case ADD_SUMMARY_INFO:
      const addState = {...state, datas: [...state.datas]};
      const addPayload = payload as {code:string, title:string, index:number, product_id:number};
      const addDataObject:any = {};
      addDataObject.title = addPayload.title;
      addDataObject.code = addPayload.code;
      addDataObject.product_id = addPayload.product_id;
      addState.index = addPayload.index;
      addState.datas.splice(addPayload.index, 0, addDataObject);

      return addState;

    case CHANGE_SUMMARY_INFO_INDEX:
      const changeIndexState = {...state};
      const changeIndexPayload = payload as number;
      changeIndexState.index = changeIndexPayload;
      return changeIndexState;

    case RESET_SUMMARY_INFO :
      return {
        index: 0,
        datas:[]
      }

    case DELETE_SUMMARY_INFO:
      const deleteState = {...state, datas: [...state.datas]};
      const deletePayload = payload as number;
      deleteState.datas.splice(deletePayload, 1);
      if(deleteState.index === deletePayload){
        deleteState.index = deleteState.index-1;
      }else if(deleteState.datas.length === 1){
        deleteState.index = 0;
      }else {
        deleteState.index = deleteState.index < deletePayload ? deleteState.index : deleteState.index-1 ;
      }

      return deleteState;

    default :
      return state
  }
}


export default infoModal;
