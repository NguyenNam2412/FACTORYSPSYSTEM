import { createSelector } from "reselect";
import { parseWeekAndMonth } from "@helpers/fileName/mealMenusFileName";

const selectListMealMenus = (state) => {
  return state.mealMenus.listMealMenus;
};

const selectListFilesMealMenus = createSelector(
  (state) => state.mealMenus.listFilesMealMenus,
  (listFiles) => {
    return [...listFiles].sort((a, b) => {
      const { week: weekA, month: monthA } = parseWeekAndMonth(a.fileName);
      const { week: weekB, month: monthB } = parseWeekAndMonth(b.fileName);

      if (monthA !== monthB) return monthA - monthB;
      return weekA - weekB;
    });
  }
);

const selectMealMenusUploadStatus = (state) => {
  return state.mealMenus.uploadStatus;
};

const selectMealMenusDownloadFile = (state) => {
  return state.mealMenus.downloadFile;
};

const mealMenusSelectors = {
  selectListMealMenus,
  selectListFilesMealMenus,
  selectMealMenusUploadStatus,
  selectMealMenusDownloadFile,
};

export default mealMenusSelectors;
