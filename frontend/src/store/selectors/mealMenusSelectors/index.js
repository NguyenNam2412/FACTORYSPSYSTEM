import { createSelector } from "reselect";

const selectListMealMenus = (state) => {
  return state.mealMenus.listMealMenus;
};

const selectListMealMenusByDate = (date) =>
  createSelector([selectListMealMenus], (menus) =>
    menus.filter((menu) => menu.date === date)
  );

const selectListFilesMealMenus = (state) => {
  return state.mealMenus.listFilesMealMenus;
};

const selectMealMenusUploadStatus = (state) => {
  return state.mealMenus.uploadStatus;
};

const selectMealMenusDownloadFile = (state) => {
  return state.mealMenus.downloadFile;
};

const mealMenusSelectors = {
  selectListMealMenus,
  selectListMealMenusByDate,
  selectListFilesMealMenus,
  selectMealMenusUploadStatus,
  selectMealMenusDownloadFile,
};

export default mealMenusSelectors;
