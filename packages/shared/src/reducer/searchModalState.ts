export const CHANGE_SEARCH_NUMBER = "CHANGE_SEARCH_NUMBER";


export interface SearchModalNumber {
    index:number
}


export const initalState: SearchModalNumber = {
    index:0
}

export const changeSearchModalNumber = (index: number) => {
    return {
        type: CHANGE_SEARCH_NUMBER,
        payload: index
    }
}

type DefaultAction = ReturnType<typeof changeSearchModalNumber>

const tooUploadReducer = (state:SearchModalNumber=initalState, action:DefaultAction) => {
    switch(action.type){
        case CHANGE_SEARCH_NUMBER:
            const modifyInit = action.payload as any
            // state.data = modifyInit;
            return modifyInit

        // case TEST_TOOL:
        //     console.log(action.payload)
        //     return action.payload

        default:
            return state
    }
}

export default tooUploadReducer
