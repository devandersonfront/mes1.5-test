import userInfoReducer from './userInfo'
import menuStateReducer from './menuState'
import menuSelectStateReducer from "./menuSelectState";
import MachineSelectReducer from "./machineSelect";
import productSelect from "./ProductSelect";
import infoModal from './infoModal'
import modifyInfo from './modifyInfo'
import deliveryRegisterState from "./deliveryRegisterState";
import toolInfo from './toolInfo'
import OperationRegisterState from "./operationRegisterState";
import searchModalState from "./searchModalState"
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
        productSelect,
        infoModal,
        modifyInfo,
        deliveryRegisterState,
        toolInfo,
        OperationRegisterState,
        searchModalState,
      })(state, action)
    }
  }
}

export type RootState = ReturnType<typeof rootReducer>
export {rootReducer}
