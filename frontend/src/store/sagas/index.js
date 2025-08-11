import { all } from "redux-saga/effects";
import fetchDataSagas from "./fetchDataSagas";
import authSaga from "./authSagas";
import mealMenusSaga from "./mealMenusSagas";

export default function* rootSaga() {
  yield all([authSaga(), fetchDataSagas(), mealMenusSaga()]);
}
