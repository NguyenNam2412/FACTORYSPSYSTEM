import { combineReducers } from '@reduxjs/toolkit';
import fetchDataSlices from '../slices/fetchDataSlices';
import authSlice from '../slices/authSlices'

const rootReducer = combineReducers({
  fetchData: fetchDataSlices,
  auth:  authSlice,
});

export default rootReducer;
