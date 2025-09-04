import { createAxiosWithToken } from "@api/axiosWithToken";

const mealRegApi = createAxiosWithToken(
  "http://localhost:5000/meal-registrations",
  { "Content-Type": "application/json" }
);

const getMyMealReg = (dishType) => {
  return mealRegApi.post("/my-reg", { dish_type: dishType });
};

const getAllMealReg = (data) => {
  return mealRegApi.post("/meal-reg", data);
};

const getExportFileMealReg = () => {
  return mealRegApi.get("/meal-reg/export");
};

const getUpdateRegMeal = (data) => {
  return mealRegApi.post("/update", data);
};

export { getMyMealReg, getAllMealReg, getExportFileMealReg, getUpdateRegMeal };
