// src/store/mealMenus/mealMenusSaga.js
import { call, put, select, takeLatest } from "redux-saga/effects";
import {
  getListMealMenus,
  getListFilesMealMenus,
  mealMenusUpload,
  mealMenusDownload,
  mealMenusDelete,
  mealMenusDeleteMultiple,
} from "@api/mealMenusApi";

import mealMenusConstants from "@store/constants/mealMenusConstants";
import { parseWeekAndMonth } from "@helpers/fileName/mealMenusFileName";

// ===== GET MEAL =====
function* fetchListMealMenus(action) {
  try {
    const res = yield call(getListMealMenus, action.payload);
    yield put({
      type: mealMenusConstants.GET_LIST_MEAL_MENUS_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    yield put({
      type: mealMenusConstants.GET_LIST_MEAL_MENUS_FAILURE,
      payload: err.message,
    });
  }
}

// ===== GET LIST FILE =====
function* fetchListFileMealMenus(action) {
  try {
    const res = yield call(getListFilesMealMenus, action.payload);
    yield put({
      type: mealMenusConstants.GET_LIST_FILES_MEAL_MENUS_SUCCESS,
      payload: res.data?.listFile,
    });
  } catch (err) {
    yield put({
      type: mealMenusConstants.GET_LIST_FILES_MEAL_MENUS_FAILURE,
      payload: err.message,
    });
  }
}

// ===== UPLOAD =====
function* uploadMealMenus(action) {
  try {
    const file = action.payload;
    const formData = new FormData();
    formData.append("file", file);

    const compare = file?.name.match(/tuần.*(?=\.xlsx$)/i)?.[0].trim();
    const { from, to, week } = parseWeekAndMonth(file.name);

    const listFile = yield select((state) => {
      return state.mealMenus.listFilesMealMenus;
    });

    const existFile = listFile.find(
      (f) =>
        f.fileName.includes(compare) ||
        JSON.stringify(parseWeekAndMonth(f.fileName)) ===
          JSON.stringify({ from, to, week })
    );

    const res = yield call(mealMenusUpload, formData);

    yield put({
      type: mealMenusConstants.UPLOAD_MEAL_MENUS_SUCCESS,
      payload: existFile ? null : res.data,
    });
  } catch (err) {
    yield put({
      type: mealMenusConstants.UPLOAD_MEAL_MENUS_FAILURE,
      payload: err.message,
    });
  }
}

// ===== DOWNLOAD =====
function* downloadMealMenus(action) {
  try {
    const res = yield call(mealMenusDownload, action.payload);
    yield put({
      type: mealMenusConstants.DOWNLOAD_MEAL_MENUS_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    yield put({
      type: mealMenusConstants.DOWNLOAD_MEAL_MENUS_FAILURE,
      payload: err.message,
    });
  }
}

// ===== DELETE SINGLE =====
function* deleteMealMenus(action) {
  try {
    yield call(mealMenusDelete, action.payload);
    yield put({ type: mealMenusConstants.DELETE_MEAL_MENUS_SUCCESS });
  } catch (err) {
    yield put({
      type: mealMenusConstants.DELETE_MEAL_MENUS_FAILURE,
      payload: err.message,
    });
  }
}

// ===== DELETE MULTIPLE =====
function* deleteMultipleMealMenus(action) {
  try {
    yield call(mealMenusDeleteMultiple, action.payload);
    yield put({ type: mealMenusConstants.DELETE_MULTI_MEAL_MENUS_REQUEST });
  } catch (err) {
    yield put({
      type: mealMenusConstants.DELETE_MULTI_MEAL_MENUS_FAILURE,
      payload: err.payload,
    });
  }
}

export default function* mealMenusSaga() {
  yield takeLatest(
    mealMenusConstants.GET_LIST_MEAL_MENUS_REQUEST,
    fetchListMealMenus
  );
  yield takeLatest(
    mealMenusConstants.GET_LIST_FILES_MEAL_MENUS_REQUEST,
    fetchListFileMealMenus
  );
  yield takeLatest(
    mealMenusConstants.UPLOAD_MEAL_MENUS_REQUEST,
    uploadMealMenus
  );
  yield takeLatest(
    mealMenusConstants.DOWNLOAD_MEAL_MENUS_REQUEST,
    downloadMealMenus
  );
  yield takeLatest(
    mealMenusConstants.DELETE_MEAL_MENUS_REQUEST,
    deleteMealMenus
  );
  yield takeLatest(
    mealMenusConstants.DELETE_MULTI_MEAL_MENUS_REQUEST,
    deleteMultipleMealMenus
  );
}
