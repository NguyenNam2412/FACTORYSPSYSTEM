// src/store/mealMenus/mealMenusSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listMealMenus: [], // Danh sách meal menus (nội dung món ăn)
  listFilesMealMenus: [], // Danh sách file meal menus đã upload
  loading: false,
  error: null,
  uploadStatus: null,
  downloadFile: null,
};

const mealMenusSlice = createSlice({
  name: "mealMenus",
  initialState,
  reducers: {
    // ===== GET LIST MEAL MENUS =====
    getListMealMenusRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getListMealMenusSuccess: (state, action) => {
      state.loading = false;
      state.listMealMenus = action.payload;
    },
    getListMealMenusFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ===== GET LIST FILE MEAL =====
    getListFilesMealMenusRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getListFilesMealMenusSuccess: (state, action) => {
      state.loading = false;
      state.listFilesMealMenus = action.payload;
    },
    getListFilesMealMenusFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ===== UPLOAD =====
    mealMenusUploadRequest: (state) => {
      state.loading = true;
      state.uploadStatus = "loading";
      state.error = null;
    },
    mealMenusUploadSuccess: (state, action) => {
      state.loading = false;
      state.uploadStatus = "success";
      if (action.payload) {
        state.listFilesMealMenus = [
          action.payload,
          ...state.listFilesMealMenus,
        ];
      }
    },
    mealMenusUploadFailure: (state, action) => {
      state.loading = false;
      state.uploadStatus = "failure";
      state.error = action.payload;
    },

    // ===== DOWNLOAD =====
    mealMenusDownloadRequest: (state) => {
      state.loading = true;
      state.downloadFile = null;
    },
    mealMenusDownloadSuccess: (state, action) => {
      state.loading = false;
      state.downloadFile = action.payload; // blob file
    },
    mealMenusDownloadFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ===== DELETE SINGLE =====
    mealMenusDeleteRequest: (state) => {
      state.loading = true;
    },
    mealMenusDeleteSuccess: (state, action) => {
      state.loading = false;
      state.listFilesMealMenus = state.listFilesMealMenus.filter(
        (file) => file.id !== action.payload
      );
    },
    mealMenusDeleteFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ===== DELETE MULTIPLE =====
    mealMenusDeleteMultipleRequest: (state) => {
      state.loading = true;
    },
    mealMenusDeleteMultipleSuccess: (state, action) => {
      state.loading = false;
      const idsToDelete = action.payload;
      state.listFilesMealMenus = state.listFilesMealMenus.filter(
        (file) => !idsToDelete.includes(file.id)
      );
    },
    mealMenusDeleteMultipleFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export default mealMenusSlice.reducer;
