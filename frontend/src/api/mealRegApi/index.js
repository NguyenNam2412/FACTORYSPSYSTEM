import { createAxiosWithToken } from "@api/axiosWithToken";

const mealRegApi = createAxiosWithToken(
  "http://localhost:5000/meal-registrations",
  { "Content-Type": "application/json" }
);

const getMyMealReg = () => {
  return mealRegApi.get("/my-reg");
};

const getAllMealReg = () => {
  return mealRegApi.get("/meal-reg");
};

const getExportFileMealReg = () => {
  return mealRegApi.get("/meal-reg/export");
};

const getUpdateRegMeal = () => {
  return mealRegApi.get("/update");
};

export { getMyMealReg, getAllMealReg, getExportFileMealReg, getUpdateRegMeal };
