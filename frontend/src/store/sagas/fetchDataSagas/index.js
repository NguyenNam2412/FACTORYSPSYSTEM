import { takeLatest, call, put } from 'redux-saga/effects';
import { fetchTableData } from '../../../api';
import fetchDataConstants from '../../constants/fetchDataConstants';

function* fetchOracleData(action) {
  try {
    const response = yield call(fetchTableData, action.payload.table, action.payload.params);
    yield put({ type: fetchDataConstants.FETCH_DATA_SUCCESS, payload: response.data });
  } catch (error) {
    yield put({ type: fetchDataConstants.FETCH_DATA_FAILURE, payload: error.message });
  }
}

export default function* oracleSaga() {
  yield takeLatest(fetchDataConstants.FETCH_DATA_START, fetchOracleData);
}

