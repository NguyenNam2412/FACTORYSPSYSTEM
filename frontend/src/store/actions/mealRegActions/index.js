import { createAction } from "@reduxjs/toolkit";

import mealRegConstants from "@store/constants/mealRegConstants";

const getMyRegMealRequest = createAction(
  mealRegConstants.GET_ALL_REG_MEAL_REQUEST
);
const getMyRegMealSuccess = createAction(
  mealRegConstants.GET_MY_REG_MEAL_SUCCESS
);
const getMyMealRegFailure = createAction(
  mealRegConstants.GET_MY_REG_MEAL_FAILURE
);

const getAllMealRegRequest = createAction(
  mealRegConstants.GET_ALL_REG_MEAL_REQUEST
);
const getAllMealRegSuccess = createAction(
  mealRegConstants.GET_ALL_REG_MEAL_SUCCESS
);
const getAllMealRegFailure = createAction(
  mealRegConstants.GET_ALL_REG_MEAL_FAILURE
);

const exportFileRegMealRequest = createAction(
  mealRegConstants.EXPORT_FILE_REG_MEAL_REQUEST
);
const exportFileRegMealSuccess = createAction(
  mealRegConstants.EXPORT_FILE_REG_MEAL_SUCCESS
);
const exportFileRegMealFailure = createAction(
  mealRegConstants.EXPORT_FILE_REG_MEAL_FAILURE
);

const updateRegMealRequest = createAction(
  mealRegConstants.UPDATE_REG_MEAL_REQUEST
);
const updateRegMealSuccess = createAction(
  mealRegConstants.UPDATE_REG_MEAL_SUCCESS
);
const updateRegMealFailure = createAction(
  mealRegConstants.UPDATE_REG_MEAL_FAILURE
);

const mealRegActions = {
  getMyRegMealRequest,
  getMyRegMealSuccess,
  getMyMealRegFailure,

  getAllMealRegRequest,
  getAllMealRegSuccess,
  getAllMealRegFailure,

  exportFileRegMealRequest,
  exportFileRegMealSuccess,
  exportFileRegMealFailure,

  updateRegMealRequest,
  updateRegMealSuccess,
  updateRegMealFailure,
};

export default mealRegActions;
