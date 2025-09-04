// import { createSelector } from "reselect";

const selectMyRegMeal = (state) => {
  return state.mealReg.myReg;
};

const selectAllMealReg = (state) => {
  return state.mealReg.allReg;
};

const selectExportFileMealReg = (state) => {
  return state.mealReg.download;
};

const mealMenusSelectors = {
  selectMyRegMeal,
  selectAllMealReg,
  selectExportFileMealReg,
};

export default mealMenusSelectors;
