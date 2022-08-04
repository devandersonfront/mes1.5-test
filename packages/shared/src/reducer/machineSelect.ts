import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import moment from 'moment'
import { MachineType } from '../@types/type'

export type MachineSelectState = {
    process_length:number
    machineList:MachineType[]
    selectRow?:number
}
const initialState: MachineSelectState = {
    process_length:0,
    selectRow:0,
    machineList:[
        {
            name: "", id: "", index: 1, date: moment().format('YYYY-MM-DD')
        }
    ]
}

export const machineSelectSlice = createSlice({
    name: 'MachineSelectReducer',
    initialState,
    reducers: {
        insert_machine_list(state, action: PayloadAction<MachineSelectState>) {
            return action.payload
        },
        insert_machine_list_index(state, action: PayloadAction<MachineSelectState['selectRow']>) {
            state.selectRow = action.payload
        },
        delete_machine_list(state, action: PayloadAction<MachineSelectState>) {
            const machine = state.machineList.find((_, idx) => idx === 1)
            machine.index = 1
            const newMachines = state.machineList.filter((_, idx) => idx !== 0)
            state.machineList = newMachines
        },
        delete_all_machine_list(state, action: PayloadAction<MachineSelectState>) {
            return initialState
        },
    }
})

export const selectMachineList = (state) => state.MachineSelectReducer
export const { insert_machine_list, insert_machine_list_index, delete_machine_list, delete_all_machine_list } = machineSelectSlice.actions
export default machineSelectSlice.reducer
