import { combineReducers } from 'redux'
import userInfo from './userInfo'
import menuState from './menuState'
import MachineSelectReducer from "./machineSelect";
import MulitpleSelectModal from "./ProductSelect";
import infoModal from './infoModal'

const rootReducer = combineReducers({
  userInfo,
  menuState,
  MachineSelectReducer,
  MulitpleSelectModal,
  infoModal
})

export {rootReducer};
export type RootState = ReturnType<typeof rootReducer>
