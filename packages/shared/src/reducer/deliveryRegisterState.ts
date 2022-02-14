
// interface DeliveryRegisterState
// {
//     shipment_id?: number
//     identification?: string
//     contract: {
//         contract_id: number
//         identification: string
//         date: string
//         deadline: string
//         product: {
//             product_id?:number
//             customer: {
//                 customer_id: number
//                 name: string
//                 rep: string
//                 manager: string
//                 telephone: string
//                 cellphone: string
//                 fax: string
//                 address: string
//                 crn: string
//                 photo: string
//                 additional: Array<any>
//             },
//             model: {
//                 cm_id: number
//                 // customer: { ... }
//                 model: string
//                 additional: Array<any>
//             },
//             code: string
//             name?: string
//             type: number
//             unit: string
//             process: {
//                 process_id: number
//                 name: string
//                 additional: Array<any>
//             },
//             // molds: [ ... ]
//             // machines: [ ... ],
//             standard_uph: number
//             work_standard_image: string
//             version?: number
//             // additional: [ ... ],
//         },
//     },
//     product: {
//         product_id?: number
//         customer: {
//             customer_id: number
//             name: string
//             rep: string
//             manager: string
//             telephone: string
//             cellphone: string
//             fax: string
//             address: string
//             crn: string
//             photo: string
//             additional: Array<any>
//         },
//         model: {
//             cm_id: number
//             // customer: { ... }
//             model: string
//             additional: Array<any>,
//         },
//         code: string
//         name?: string
//         type: number
//         unit: string
//         process: {
//             process_id: number
//             name: string
//             additional: Array<any>
//         },
//         // molds: [ ... ]
//         // machines: [ ... ],
//         standard_uph: number
//         work_standard_image: string
//         version?: number
//         additional: Array<any>
//     },
//     date: string
//     lots: [
//         {
//             amount: number
//             group: {
//                 sum: {
//
//                 },
//                 elements: [
//
//                 ]
//             }
//         }
// ],
// version?: number
// }

import {delete_machine_list, insert_machine_list, insert_machine_list_index} from "./machineSelect";

interface deliveryRegisterState {
    identification:string
}


const initialState:deliveryRegisterState = {
    identification:""
}


const LOAD_DELIVERY_IDENTIFICATION = "LOAD_DELIVERY_IDENTIFICATION"
const CHANGE_DELIVERY_IDENTIFICATION = "CHANGE_DELIVERY_IDENTIFICATION"
const DELETE_DELIVERY_IDENTIFICATION = "DELETE_DELIVERY_IDENTIFICATION"


export const load_delivery_identification = (payload:deliveryRegisterState) => ({
    type:LOAD_DELIVERY_IDENTIFICATION,
    payload:payload
})

export const change_delivery_identification = (payload:deliveryRegisterState) => ({
    type:CHANGE_DELIVERY_IDENTIFICATION,
    payload:payload
})

export const delete_delivery_identification = () => ({
    type:DELETE_DELIVERY_IDENTIFICATION,
    payload:""
})

type DefaultAction = ReturnType<typeof load_delivery_identification> | ReturnType<typeof change_delivery_identification> | ReturnType<typeof delete_delivery_identification>;

const DeliveryRegisterState = (state = initialState,{type, payload}:DefaultAction )  => {
    switch(type){
        case LOAD_DELIVERY_IDENTIFICATION :

            return state;

        case CHANGE_DELIVERY_IDENTIFICATION :
            const change_state = {...state}
            change_state.identification = payload as string
            return change_state

        case DELETE_DELIVERY_IDENTIFICATION  :
            const delete_state = {...state}
            delete_state.identification = payload as string
            return delete_state

        default:
            return state
    }
}


export default DeliveryRegisterState
