import {combineReducers} from 'redux'
import userInfo from './userInfo'
import menuState from './menuState'
import MachineSelectReducer from "./machineSelect";
import MulitpleSelectModal from "./ProductSelect";
import infoModal from './infoModal'
import modifyInfo from './modifyInfo'
import mainUserInfo from '../../../main/reducer/userInfo'
import deliveryRegisterState from "./deliveryRegisterState";

const rootReducer = combineReducers({
  userInfo,
  menuState,
  MachineSelectReducer,
  MulitpleSelectModal,
  infoModal,
  modifyInfo,
  mainUserInfo,
  deliveryRegisterState
})

export {rootReducer};
export type RootState = ReturnType<typeof rootReducer>
