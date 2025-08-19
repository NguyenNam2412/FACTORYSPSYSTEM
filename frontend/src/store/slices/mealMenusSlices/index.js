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
    getListRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getListSuccess: (state, action) => {
      state.loading = false;
      state.listMealMenus = action.payload;
    },
    getListFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ===== GET LIST FILE MEAL =====
    getFilesRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getFilesSuccess: (state, action) => {
      state.loading = false;
      state.listFilesMealMenus = action.payload;
    },
    getFilesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ===== UPLOAD =====
    uploadRequest: (state) => {
      state.loading = true;
      state.uploadStatus = "loading";
      state.error = null;
    },
    uploadSuccess: (state, action) => {
      state.loading = false;
      state.uploadStatus = "success";
      if (action.payload) {
        state.listFilesMealMenus = [
          action.payload,
          ...state.listFilesMealMenus,
        ];
      }
    },
    uploadFailure: (state, action) => {
      state.loading = false;
      state.uploadStatus = "failure";
      state.error = action.payload;
    },

    // ===== DOWNLOAD =====
    downloadRequest: (state) => {
      state.loading = true;
      state.downloadFile = null;
    },
    downloadSuccess: (state, action) => {
      state.loading = false;
      state.downloadFile = action.payload; // blob file
    },
    downloadFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ===== DELETE SINGLE =====
    deleteRequest: (state) => {
      state.loading = true;
    },
    deleteSuccess: (state, action) => {
      state.loading = false;
      state.listFilesMealMenus = state.listFilesMealMenus.filter(
        (file) => file.id !== action.payload
      );
    },
    deleteFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ===== DELETE MULTIPLE =====
    deleteMultiRequest: (state) => {
      state.loading = true;
    },
    deleteMultiSuccess: (state, action) => {
      state.loading = false;
      const idsToDelete = action.payload;
      state.listFilesMealMenus = state.listFilesMealMenus.filter(
        (file) => !idsToDelete.includes(file.id)
      );
    },
    deleteMultiFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export default mealMenusSlice.reducer;
