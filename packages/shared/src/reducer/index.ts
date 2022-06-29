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
import product_ids_for_selected_rows_state from "./product_ids_for_selected_rows_state"

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
  searchModalState,
  product_ids_for_selected_rows_state
  // searchRowState,
})

export {rootReducer};
export type RootState = ReturnType<typeof rootReducer>
