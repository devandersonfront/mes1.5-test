import {combineReducers} from 'redux'
import userInfo from './userInfo'
import menuState from './menuState'
import MachineSelectReducer from "./machineSelect";
import MulitpleSelectModal from "./ProductSelect";
import infoModal from './infoModal'
import modifyInfo from './modifyInfo'
import mainUserInfo from '../../../main/reducer/userInfo'
import deliveryRegisterState from "./deliveryRegisterState";
import toolInfo from './toolInfo'
import OperationRegisterState from "./operationRegisterState";
import menuSelectState from "./menuSelectState";
import searchModalState from "./searchModalState"

const rootReducer = combineReducers({
  mainUserInfo,
  userInfo,
  menuState,
  MachineSelectReducer,
  MulitpleSelectModal,
  infoModal,
  modifyInfo,
  deliveryRegisterState,
  toolInfo,
  OperationRegisterState,
  menuSelectState,
  searchModalState
})

export {rootReducer};
export type RootState = ReturnType<typeof rootReducer>
