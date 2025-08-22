import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  myReg: [],
  allReg: [],
  loading: false,
  error: null,
  download: null,
};

const regMealSlices = createSlice({
  name: "mealReg",
  initialState,
  reducers: {
    // ===== my reg =====
    getMyMealRegRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getMyMealRegSuccess: (state, action) => {
      state.loading = false;
      state.myReg = action.payload;
    },
    getMyMealRegFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ===== all reg =====
    getAllRefRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getAllRegSuccess: (state, action) => {
      state.loading = false;
      state.allReg = action.payload;
    },
    getAllRegFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ===== export all reg =====
    exportFileRegRequest: (state) => {
      state.loading = true;
    },
    exportFileRegSuccess: (state, action) => {
      state.loading = false;
      state.download = "success";
    },
    exportFileRegFailure: (state, action) => {
      state.loading = false;
      state.download = "failure";
      state.error = action.payload;
    },

    // ===== update reg =====
    updateRegRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateRegSuccess: (state, action) => {
      state.loading = false;
      state.caseReducers.getMyMealRegSuccess(state, action);
    },
    updateRegFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export default regMealSlices.reducer;
