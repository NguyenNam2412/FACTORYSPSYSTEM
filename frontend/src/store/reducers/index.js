import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "@store/slices/authSlices";
import mealMenusSlices from "@store/slices/mealMenusSlices";

const rootReducer = combineReducers({
  auth: authSlice,
  mealMenus: mealMenusSlices,
});

export default rootReducer;
