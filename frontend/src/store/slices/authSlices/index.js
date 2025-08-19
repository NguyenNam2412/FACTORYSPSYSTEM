import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    session: null,
    loading: false,
    error: null,
  },
  reducers: {
    loginRequest: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      state.session = action.payload;
      state.loading = false;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload || "login error";
    },
    logout: (state) => {
      state.session = null;
      state.error = null;
    },
  },
});

export default authSlice.reducer;
