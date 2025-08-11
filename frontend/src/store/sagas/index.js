import { all } from "redux-saga/effects";
import authSaga from "./authSagas";
import mealMenusSaga from "./mealMenusSagas";

export default function* rootSaga() {
  yield all([authSaga(), mealMenusSaga()]);
}
