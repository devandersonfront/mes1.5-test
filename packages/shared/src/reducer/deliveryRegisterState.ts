interface deliveryRegisterState {
    identification:any
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
            delete_state.identification = ""
            return delete_state

        default:
            return state
    }
}


export default DeliveryRegisterState
