// src/store/mealMenus/mealMenusSaga.js
import { call, put, takeLatest } from "redux-saga/effects";
import {
  getMyMealReg,
  getAllMealReg,
  getExportFileMealReg,
  getUpdateRegMeal,
} from "@api/mealRegApi";

import mealRegConstants from "@store/constants/mealRegConstants";

const dishTypeConstants = {
  LUNCH_REG: "LUNCH_REG",
  DINNER_REG: "DINNER_REG",
  LATE_REG: "LATE_REG",
};

// ===== get my reg =====
function* fetchMyRegMeal() {
  try {
    const res = yield call(getMyMealReg, dishTypeConstants.LUNCH_REG);
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
    const data = {
      dish_type: dishTypeConstants.LUNCH_REG,
      reg_date: action.payload,
    };

    const res = yield call(getAllMealReg, data);
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
    const data = {
      dish_type: dishTypeConstants.LUNCH_REG,
      reg_data: JSON.stringify(action.payload),
    };
    if (data.reg_data.length > 0) {
      const res = yield call(getUpdateRegMeal, data);
      yield put({
        type: mealRegConstants.UPDATE_REG_MEAL_SUCCESS,
        payload: res.data?.assigned_data,
      });
    }
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
