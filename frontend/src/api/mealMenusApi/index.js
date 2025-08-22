import { createAxiosWithToken } from "@api/axiosWithToken";

const mealMenusUploadApi = createAxiosWithToken(
  "http://localhost:5000/meal-menus",
  { "Content-Type": "multipart/form-data" }
);

const mealMenusApi = createAxiosWithToken("http://localhost:5000/meal-menus", {
  "Content-Type": "application/json",
});

const getListMealMenus = () => {
  return mealMenusApi.get("/all");
};

const getListFilesMealMenus = () => {
  return mealMenusApi.get("/listFilesMealMenus");
};

const mealMenusUpload = (attachFile) => {
  return mealMenusUploadApi.post("/upload", attachFile);
};

const mealMenusDownload = (fileId) => {
  return mealMenusApi.post(`/file/${fileId}/download`, {
    responseType: "blob",
  });
};

const mealMenusDelete = (fileId) => {
  return mealMenusApi.delete(`/file/${fileId}/delete`);
};

const mealMenusDeleteMultiple = (fileIds) => {
  return mealMenusApi.post("/file/files/delete", { fileIds });
};

export {
  getListMealMenus,
  getListFilesMealMenus,
  mealMenusUpload,
  mealMenusDownload,
  mealMenusDelete,
  mealMenusDeleteMultiple,
};
