// src/store/mealMenus/mealMenusSaga.js
import { call, put, takeLatest } from "redux-saga/effects";
import {
  getMyMealReg,
  getAllMealReg,
  getExportFileMealReg,
  getUpdateRegMeal,
} from "@api/mealRegApi";

import mealRegConstants from "@store/constants/mealRegConstants";

// ===== get my reg =====
function* fetchMyRegMeal(action) {
  try {
    const res = yield call(getMyMealReg, action.payload);
    yield put({
      type: mealRegConstants.GET_MY_REG_MEAL_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    yield put({
      type: mealRegConstants.GET_MY_REG_MEAL_FAILURE,
      payload: err.message,
    });
  }
}

// ===== all reg =====
function* fetchAllMealReg(action) {
  try {
    const res = yield call(getAllMealReg, action.payload);
    yield put({
      type: mealRegConstants.GET_ALL_REG_MEAL_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    yield put({
      type: mealRegConstants.GET_ALL_REG_MEAL_FAILURE,
      payload: err.message,
    });
  }
}

// ===== export file reg =====
function* exportFileMealReg(action) {
  try {
    const res = yield call(getExportFileMealReg, action.payload);

    const disposition = res.headers["content-disposition"];
    let fileName = "download.xlsx";
    if (disposition) {
      const match = disposition.match(/filename\*=UTF-8''(.+)/);
      if (match && match[1]) {
        fileName = decodeURIComponent(match[1]);
      }
    }

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    yield put({
      type: mealRegConstants.EXPORT_FILE_REG_MEAL_SUCCESS,
    });
  } catch (err) {
    yield put({
      type: mealRegConstants.EXPORT_FILE_REG_MEAL_FAILURE,
      payload: err.message,
    });
  }
}

// ===== update reg =====
function* updateMyMealReg(action) {
  try {
    const res = yield call(getUpdateRegMeal, action.payload);
    yield put({
      type: mealRegConstants.UPDATE_REG_MEAL_SUCCESS,
      payload: res.data?.assigned_data,
    });
  } catch (err) {
    yield put({
      type: mealRegConstants.UPDATE_REG_MEAL_FAILURE,
      payload: err.message,
    });
  }
}

export default function* mealRegSaga() {
  yield takeLatest(mealRegConstants.GET_MY_REG_MEAL_REQUEST, fetchMyRegMeal);
  yield takeLatest(mealRegConstants.GET_ALL_REG_MEAL_REQUEST, fetchAllMealReg);
  yield takeLatest(
    mealRegConstants.EXPORT_FILE_REG_MEAL_REQUEST,
    exportFileMealReg
  );
  yield takeLatest(mealRegConstants.UPDATE_REG_MEAL_REQUEST, updateMyMealReg);
}
