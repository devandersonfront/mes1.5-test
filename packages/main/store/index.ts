import { AnyAction, configureStore, Reducer } from '@reduxjs/toolkit'
import {rootReducer} from 'shared'
import { createWrapper } from 'next-redux-wrapper'


const makeStore = () => configureStore({
  reducer: rootReducer as Reducer,
  devTools: process.env.NODE_ENV === 'development',
});

const wrapper = createWrapper(makeStore);
export default wrapper;