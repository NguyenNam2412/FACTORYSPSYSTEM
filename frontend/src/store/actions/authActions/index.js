import { createAction } from "@reduxjs/toolkit";

import authConstants from "@store/constants/authConstants";

const loginRequest = createAction(authConstants.LOGIN_REQUEST);
const loginSuccess = createAction(authConstants.LOGIN_SUCCESS);
const loginFailure = createAction(authConstants.LOGIN_FAILURE);

const logOut = createAction(authConstants.LOGOUT);

const loginActions = {
  loginRequest,
  loginSuccess,
  loginFailure,
  logOut,
};

export default loginActions;
