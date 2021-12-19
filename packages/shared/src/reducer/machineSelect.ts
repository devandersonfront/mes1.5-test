import {MachineType} from "../common/@types/type";
import moment from "moment";

export type MachineSelectType = {
    process_length:number
    machineList:MachineType[]
    selectRow?:number
}



export const initalState:any = {
    process_length:0,
    selectRow:0,
    machineList:[
        {
            // machine_id : "",
            // machine_idPK : "",
            // seq : 0,
            // process_id : 0,
            // mold_id : 0,
            // ln_id:undefined,
            // goal : 0,
            // last : false,
            // mold : {mold_id:0, name:""},
            // process_idPK: 0
            name: "", id: "", index: 1, date: moment().format('YYYY-MM-DD')
        }
    ]
}

const INSERT_MACHINE_LIST = "INSERT_MACHINE_LIST";
const INSERT_MACHINE_LIST_INDEX = "INSERT_MACHINE_LIST_INDEX";

const INSERT_MACHINE_LIST_RECENT = "INSERT_MACHINE_LIST_RECENT";

const DELETE_MACHINE_LIST = "DELETE_MACHINE_LIST";
const DELETE_ALL_MACHINE_LIST = "DELETE_ALL_MACHINE_LIST";

export const insert_machine_list = (payload:any) => {
    return {
    type:INSERT_MACHINE_LIST,
    payload:payload
    }
}

export const insert_machine_list_index = (payload:number) => {
    return {
        type: INSERT_MACHINE_LIST_INDEX,
        payload:payload
    }
}

export const delete_machine_list = () => {
    return {
        type: DELETE_MACHINE_LIST,
        payload:0
    }
}

export const delete_all_machine_list = () => {
    return{
        type:DELETE_ALL_MACHINE_LIST,
        payload:0
    }
}

type DefaultAction = ReturnType<typeof insert_machine_list> | ReturnType<typeof insert_machine_list_index> | ReturnType<typeof delete_machine_list>;

const MachineSelectReducer = (state = initalState, {type, payload}:DefaultAction) => {
    switch (type){
        case INSERT_MACHINE_LIST :
            let tmp_state = {...state};
            tmp_state = {...payload as MachineSelectType}
            return tmp_state

        case INSERT_MACHINE_LIST_INDEX:
            let temp_state =  {...state};
            temp_state.selectRow = payload as number;
            return temp_state

        case DELETE_MACHINE_LIST :
            let temp_delete_state = {...state};
            temp_delete_state.machineList[1].date = temp_delete_state.machineList[0].date;
            temp_delete_state.machineList[1].customer_id = temp_delete_state.machineList[0].customer_id;
            temp_delete_state.machineList[1].customer_idPK = temp_delete_state.machineList[0].customer_idPK;
            temp_delete_state.machineList[1].cm_id = temp_delete_state.machineList[0].cm_id;
            temp_delete_state.machineList[1].cm_idPK = temp_delete_state.machineList[0].cm_idPK;
            temp_delete_state.machineList[1].product_id = temp_delete_state.machineList[0].product_id;
            temp_delete_state.machineList[1].index = 1;
            temp_delete_state.machineList[1].name = temp_delete_state.machineList[0].name;
            temp_delete_state.machineList[1].code = temp_delete_state.machineList[0].code;


            temp_delete_state.machineList.splice(0, 1);

            return temp_delete_state;

        case DELETE_ALL_MACHINE_LIST:
            let reset = {    process_length:0,
                selectRow:0,
                machineList:[
                    {
                        name: "", id: "", index: 1, date: moment().format('YYYY-MM-DD')
                    }
                ]}
            return reset

        default :
            return state
    }
}


export default MachineSelectReducer;
