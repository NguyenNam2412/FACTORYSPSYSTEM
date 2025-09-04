import { createSelector } from "reselect";
import { parseWeekAndMonth } from "@helpers/fileName/mealMenusFileName";
import { formatDate } from "@utils/dateTime/formatDate";

const selectMealMenusState = (state) => state.mealMenus.listMealMenus;

const selectListMealMenus = createSelector(
  [selectMealMenusState],
  (listMealMenus) => {
    const grouped = listMealMenus.reduce((acc, item) => {
      const date = item.MENU_DATE;
      if (!acc[date]) acc[date] = [];
      acc[date].push(item);
      return acc;
    }, {});

    const sortedKeys = Object.keys(grouped).sort(
      (a, b) => formatDate.toEpochTime(b) - formatDate.toEpochTime(a)
    );

    const sorted = {};
    sortedKeys.forEach((key) => {
      sorted[key] = grouped[key];
    });

    return sorted;
  }
);

const selectListFilesMealMenus = createSelector(
  (state) => state.mealMenus.listFilesMealMenus,
  (listFiles) => {
    return [...listFiles].sort((a, b) => {
      const { from: fromA } = parseWeekAndMonth(a.fileName);
      const { from: fromB } = parseWeekAndMonth(b.fileName);

      const timeA = formatDate.toEpochTime(fromA);
      const timeB = formatDate.toEpochTime(fromB);

      return timeB - timeA;
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
