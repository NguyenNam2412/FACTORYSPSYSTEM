// src/store/mealMenus/mealMenusSaga.js
import { call, put, takeLatest } from "redux-saga/effects";
import {
  getListMealMenus,
  getListFilesMealMenus,
  mealMenusUpload,
  mealMenusDownload,
  mealMenusDelete,
  mealMenusDeleteMultiple,
} from "../../../api/mealMenusApi";

import mealMenusConstants from "../../constants/mealMenusConstants";

// ===== GET ALL =====
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

// ===== GET BY DATE =====
function* fetchMealMenusByDate(action) {
  try {
    const res = yield call(getListFilesMealMenus, action.payload);
    yield put({
      type: mealMenusConstants.GET_LIST_FILES_MEAL_MENUS_SUCCESS,
      payload: res.data,
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
    yield call(mealMenusUpload, action.payload);
    yield put({ type: mealMenusConstants.UPLOAD_MEAL_MENUS_SUCCESS });
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
    mealMenusConstants.GET_LIST_FILES_MEAL_MENUS_FAILURE,
    fetchMealMenusByDate
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
