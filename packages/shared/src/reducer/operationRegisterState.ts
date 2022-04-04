interface OperationRegister {
    searchKey:string
}

const initialState:OperationRegister = {
    searchKey:""
}

const CHANGE_OPERATION_SEARCHKEY = "CHANGE_OPERATION_SEARCHKEY"
const DELETE_OPERATION_SEARCHKEY = "DELETE_OPERATION_SEARCHKEY"

export const change_operation_searchKey = (searchKey:string) => ({
    type:CHANGE_OPERATION_SEARCHKEY,
    payload:searchKey
})

//삭제 메소드 만들기

export const delete_operation_searchKey = () => ({
    type:DELETE_OPERATION_SEARCHKEY,
    payload:""
})

type DefaultAction = ReturnType<typeof change_operation_searchKey> | ReturnType<typeof delete_operation_searchKey>

const OperationRegisterState = (state:OperationRegister = initialState, {type, payload}:DefaultAction) => {
    switch(type){
        case CHANGE_OPERATION_SEARCHKEY:
            const change_state = {...state}
            change_state.searchKey = payload as string

            return change_state
        case DELETE_OPERATION_SEARCHKEY:

            return {searchKey:""}
        default:
            return state
    }
}

export default OperationRegisterState
