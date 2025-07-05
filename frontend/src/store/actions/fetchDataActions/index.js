import { createAction } from "@reduxjs/toolkit";

import fetchDataConstants from "../../constants/fetchDataConstants";

const fetchDataStart = createAction(fetchDataConstants.FETCH_DATA_START);
const fetchDataSuccess = createAction(fetchDataConstants.FETCH_DATA_SUCCESS);
const fetchDataFailure = createAction(fetchDataConstants.FETCH_DATA_FAILURE);

const fetchDataActions = {
  fetchDataStart,
  fetchDataSuccess,
  fetchDataFailure,
};

export default fetchDataActions;
