import userInfoReducer from './userInfo'
import menuStateReducer from './menuState'
import menuSelectStateReducer from "./menuSelectState";
import MachineSelectReducer from "./machineSelect";
import MulitpleSelectModal from "./ProductSelect";
import infoModal from './infoModal'
import modifyInfo from './modifyInfo'
import deliveryRegisterState from "./deliveryRegisterState";
import toolInfo from './toolInfo'
import OperationRegisterState from "./operationRegisterState";
import searchModalState from "./searchModalState"
import product_ids_for_selected_rows_state from "./product_ids_for_selected_rows_state"
import { AnyAction, combineReducers, configureStore } from '@reduxjs/toolkit'
import { CombinedState } from 'redux'
import { HYDRATE } from 'next-redux-wrapper'


const rootReducer= (state: any, action: AnyAction) : CombinedState<any>=> {
  switch(action.type) {
    case HYDRATE:
      return action.payload;
    default: {
      return combineReducers({
        userInfo : userInfoReducer,
        menuState: menuStateReducer,
        menuSelectState: menuSelectStateReducer,
        MachineSelectReducer,
        MulitpleSelectModal,
        infoModal,
        modifyInfo,
        deliveryRegisterState,
        toolInfo,
        OperationRegisterState,
        searchModalState,
        product_ids_for_selected_rows_state,
      })(state, action)
    }
  }
}

export type RootState = ReturnType<typeof rootReducer>
export {rootReducer}
