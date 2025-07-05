import { call, put, takeLatest } from "redux-saga/effects";
import { loginRequest as loginApi } from "../../../api";
import authConstants from '../../constants/authConstants';


function* handleLogin(action) {
  try {
    const response = yield call(loginApi, action.payload);
    yield put({ type: authConstants.LOGIN_SUCCESS, payload: response.data});
  } catch (error) {
    yield put({type: authConstants.LOGIN_FAILURE, payload: error.response?.data?.error || "Login failed"});
  }
}

export default function* authSaga() {
  yield takeLatest(authConstants.LOGIN_REQUEST, handleLogin);
}
