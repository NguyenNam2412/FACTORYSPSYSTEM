import { all } from "redux-saga/effects";
import authSaga from "./authSagas";
import mealMenusSaga from "./mealMenusSagas";
import mealRegSaga from "./mealRegSagas";

export default function* rootSaga() {
  yield all([authSaga(), mealMenusSaga(), mealRegSaga()]);
}
