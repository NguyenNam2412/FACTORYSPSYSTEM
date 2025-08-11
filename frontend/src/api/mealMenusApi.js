import axios from "axios";

const mealMenusUploadApi = axios.create({
  baseURL: "http://localhost:5000/meal-menus",
});

const mealMenusApi = axios.create({
  baseURL: "http://localhost:5000/meal-menus",
  headers: {
    "Content-Type": "application/json",
  },
});

const getListMealMenus = () => {
  return mealMenusApi.post("/all");
};

const getListFilesMealMenus = () => {
  return mealMenusApi.post("/listFilesMealMenus");
};

const mealMenusUpload = (attachFile) => {
  const formData = new FormData();
  formData.append("file", attachFile);
  return mealMenusUploadApi.post("/upload", formData);
};

const mealMenusDownload = (fileId) => {
  return mealMenusApi.post(`/file/${fileId}/download`, {
    responseType: "blob",
  });
};

const mealMenusDelete = (fileId) => {
  return mealMenusApi.post(`/file/${fileId}/delete`);
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
