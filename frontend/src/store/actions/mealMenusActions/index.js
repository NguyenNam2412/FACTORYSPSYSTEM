import { createAction } from "@reduxjs/toolkit";

import mealMenusConstants from "@store/constants/mealMenusConstants";

const getListMealMenusRequest = createAction(
  mealMenusConstants.GET_LIST_MEAL_MENUS_REQUEST
);
const getListMealMenusSuccess = createAction(
  mealMenusConstants.GET_LIST_MEAL_MENUS_SUCCESS
);
const getListMealMenusFailure = createAction(
  mealMenusConstants.GET_LIST_MEAL_MENUS_FAILURE
);

const getListFilesMealMenusRequest = createAction(
  mealMenusConstants.GET_LIST_FILES_MEAL_MENUS_REQUEST
);
const getListFilesMealMenusSuccess = createAction(
  mealMenusConstants.GET_LIST_FILES_MEAL_MENUS_SUCCESS
);
const getListFilesMealMenusFailure = createAction(
  mealMenusConstants.GET_LIST_FILES_MEAL_MENUS_FAILURE
);

const mealMenusUploadRequest = createAction(
  mealMenusConstants.UPLOAD_MEAL_MENUS_REQUEST
);
const mealMenusUploadSuccess = createAction(
  mealMenusConstants.UPLOAD_MEAL_MENUS_SUCCESS
);
const mealMenusUploadFailure = createAction(
  mealMenusConstants.UPLOAD_MEAL_MENUS_FAILURE
);

const mealMenusDownloadRequest = createAction(
  mealMenusConstants.DOWNLOAD_MEAL_MENUS_REQUEST
);
const mealMenusDownloadSuccess = createAction(
  mealMenusConstants.DOWNLOAD_MEAL_MENUS_SUCCESS
);
const mealMenusDownloadFailure = createAction(
  mealMenusConstants.DELETE_MULTI_MEAL_MENUS_FAILURE
);

const mealMenusDeleteRequest = createAction(
  mealMenusConstants.DELETE_MEAL_MENUS_REQUEST
);
const mealMenusDeleteSuccess = createAction(
  mealMenusConstants.DELETE_MEAL_MENUS_SUCCESS
);
const mealMenusDeleteFailure = createAction(
  mealMenusConstants.DELETE_MEAL_MENUS_FAILURE
);

const mealMenusDeleteMultipleRequest = createAction(
  mealMenusConstants.DELETE_MULTI_MEAL_MENUS_REQUEST
);
const mealMenusDeleteMultipleSuccess = createAction(
  mealMenusConstants.DELETE_MULTI_MEAL_MENUS_SUCCESS
);
const mealMenusDeleteMultipleFailure = createAction(
  mealMenusConstants.DELETE_MULTI_MEAL_MENUS_FAILURE
);

const mealMenusActions = {
  getListMealMenusRequest,
  getListMealMenusSuccess,
  getListMealMenusFailure,

  getListFilesMealMenusRequest,
  getListFilesMealMenusSuccess,
  getListFilesMealMenusFailure,

  mealMenusUploadRequest,
  mealMenusUploadSuccess,
  mealMenusUploadFailure,

  mealMenusDownloadRequest,
  mealMenusDownloadSuccess,
  mealMenusDownloadFailure,

  mealMenusDeleteRequest,
  mealMenusDeleteSuccess,
  mealMenusDeleteFailure,

  mealMenusDeleteMultipleRequest,
  mealMenusDeleteMultipleSuccess,
  mealMenusDeleteMultipleFailure,
};

export default mealMenusActions;
