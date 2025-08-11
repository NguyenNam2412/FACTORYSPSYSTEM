import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "../slices/authSlices";
import mealMenusSlices from "../slices/mealMenusSlices";

const rootReducer = combineReducers({
  auth: authSlice,
  mealMenus: mealMenusSlices,
});

export default rootReducer;
