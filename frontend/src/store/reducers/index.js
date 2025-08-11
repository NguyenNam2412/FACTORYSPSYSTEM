import { combineReducers } from "@reduxjs/toolkit";
import fetchDataSlices from "../slices/fetchDataSlices";
import authSlice from "../slices/authSlices";
import mealMenusSlices from "../slices/mealMenusSlices";

const rootReducer = combineReducers({
  fetchData: fetchDataSlices,
  auth: authSlice,
  mealMenus: mealMenusSlices,
});

export default rootReducer;
