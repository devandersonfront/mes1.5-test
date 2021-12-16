import {RequestMethod} from "../common/RequestFunctions";
import {TransferCodeToValue} from "../common/TransferFunction";

interface ModalType {
  index: number,
  datas: {
    headerData:any,
    title:string
    code:string
    data:any
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
const ADD_SUMMARY_INFO_DATA = "ADD_SUMMARY_INFO_DATA";


export const insert_summary_info = (payload: {code:string, title:string, data:any[], headerData:any}) => {
  return {
    type:INSERT_SUMMARY_INFO,
    payload:payload
  }
}

export const add_summary_info = (payload:{code:string, title:string, index:number}) => ({
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

type DefaultAction = ReturnType<typeof insert_summary_info> | ReturnType<typeof reset_summary_info> |
                     ReturnType<typeof delete_summary_info> | ReturnType<typeof add_summary_info> |
                     ReturnType<typeof change_summary_info_index> | ReturnType<typeof add_summary_info_data>
    ;

const infoModal = (state = initalState, {type, payload}:DefaultAction) => {
  const changeRow = (tmpRow: any, key?: string) => {
    let tmpData = []
    let row = [];
    if(typeof tmpRow === 'string'){
      let tmpRowArray = tmpRow.split('\n')

      row = tmpRowArray.map(v => {
        if(v !== ""){
          let tmp = JSON.parse(v)
          return tmp
        }
      }).filter(v=>v)
    }else{
      row = [{...tmpRow}]
    }

    tmpData = row.map((v, i) => {
      let childData: any = {}
      switch(v.type){
        case 0:{
          childData = v.child_rm
          break;
        }
        case 1:{
          childData = v.child_sm
          break;
        }
        case 2:{
          childData = v.child_product
          break;
        }
      }
      return {
        ...childData,
        seq: i+1,
        code: childData.code,
        type: v.type,
        tab: v.type,
        type_name: TransferCodeToValue(v.type, 'material'),
        unit: childData.unit,
        usage: v.usage,
        version: v.version,
        processArray: childData.process ?? null,
        process: childData.process ? childData.process.name : null,
        // bom_root_id: childData.bom_root_id,
        product: v.type === 2 ?{
          ...childData,
        }: null,
        product_id: v.parent.product_id,
        raw_material: v.type === 0 ?{
          ...childData,
        }: null,
        sub_material: v.type === 1 ?{
          ...childData,
        }: null,
        parent:v.parent
      }
    })
    return tmpData
  }

  switch (type){
    case INSERT_SUMMARY_INFO :
      const insertState = {...state};
      const insertPayload = payload as {code:string, title:string, data:any[], headerData:any};

      insertState.datas[0].title = insertPayload.title;
      insertState.datas[0].code = insertPayload.code;
      insertState.datas[0].data = insertPayload.data;
      insertState.datas[0].headerData = insertPayload.headerData;

      console.log("insertState : ", insertState)

      return insertState;

    case ADD_SUMMARY_INFO:
      const addState = {...state};
      const addPayload = payload as {code:string, title:string, index:number};
      console.log("addPayload : ", addPayload)
      const addDataObject:any = {};
      // addState.datas[addPayload.index].title = addPayload.title;
      // addState.datas[addPayload.index].code = addPayload.code;
        addDataObject.title = addPayload.title;
        addDataObject.code = addPayload.code;

      // addState.code.push(addPayload.code);
      addState.index = addPayload.index;

      addState.datas.push(addDataObject);
      console.log("addState : ", addState )

      return addState;

    case CHANGE_SUMMARY_INFO_INDEX:
      const changeIndexState = {...state};
      const changeIndexPayload = payload as number;
      changeIndexState.index = changeIndexPayload;

      return changeIndexState;

    case RESET_SUMMARY_INFO :
      return {
        index: 0,
        datas:[
          {
            code:"",
            title:"",
            data:{},
            headerData:[],
          }
        ]
      }

    case DELETE_SUMMARY_INFO:
      const deleteState = {...state};
      console.log("DELETE_SUMMARY_INFO : ", payload)
      const deletePayload = payload as number;
      // deleteState.code.splice(payload, 1);
      // deleteState.title.splice(payload, 1);
      deleteState.datas.splice(deletePayload, 1);

      if(deleteState.index === deletePayload){
        deleteState.index = deleteState.index-1;
      }else if(deleteState.datas.length === 1){
        deleteState.index = 0;
      }

      return deleteState;

    case ADD_SUMMARY_INFO_DATA:
      const addDataState = {...state};
      console.log("ADD_SUMMARY_INFO_DATA : ", payload);
      const addDataPayload = payload as {code:string, title:string, index:number};

      // addDataState.data.push(addDataPayload)




      return addDataState;
    default :
      return state
  }
}


export default infoModal;
