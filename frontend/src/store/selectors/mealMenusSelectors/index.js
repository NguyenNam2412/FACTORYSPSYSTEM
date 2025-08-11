import { createSelector } from "reselect";

const selectListMealMenus = (state) => state.mealMenus.listMealMenus;

const selectListMealMenusByDate = (date) =>
  createSelector([selectListMealMenus], (menus) =>
    menus.filter((menu) => menu.date === date)
  );

const selectListFilesMealMenus = (state) => state.mealMenus.listFilesMealMenus;

const selectMealMenusUploadStatus = (state) => state.mealMenus.uploadStatus;

const selectMealMenusDownloadFile = (state) => state.mealMenus.downloadFile;

const mealMenusSelectors = {
  selectListMealMenus,
  selectListMealMenusByDate,
  selectListFilesMealMenus,
  selectMealMenusUploadStatus,
  selectMealMenusDownloadFile,
};

export default mealMenusSelectors;
