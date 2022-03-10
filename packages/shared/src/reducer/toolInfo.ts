export const SET_TOOL_DATA_ADD = "SET_TOOL_DATA_ADD";
export const TEST_TOOL = "TEST_TOOL";


export interface ToolUploadInterface {
    data:string
}


export const initalState: any = {
    data:""
}

export const setToolDataAdd = (updateToolData: any) => {
    return {
        type: SET_TOOL_DATA_ADD,
        payload: updateToolData
    }
}

export const testTool = (any:any) => {
    return {
        type:TEST_TOOL,
        payload:any
    }
}

type DefaultAction = ReturnType<typeof testTool> | ReturnType<typeof setToolDataAdd>

const tooUploadReducer = (state: ToolUploadInterface=initalState, action:DefaultAction) => {
    switch(action.type){
        case SET_TOOL_DATA_ADD:
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
