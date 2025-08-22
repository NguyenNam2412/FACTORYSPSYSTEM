import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "@store/slices/authSlices";
import mealMenusSlices from "@store/slices/mealMenusSlices";
import mealRegSlices from "@store/slices/mealRegSlices";

const rootReducer = combineReducers({
  auth: authSlice,
  mealMenus: mealMenusSlices,
  mealReg: mealRegSlices,
});

export default rootReducer;
