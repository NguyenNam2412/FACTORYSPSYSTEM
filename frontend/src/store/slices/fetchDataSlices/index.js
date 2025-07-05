import { createSlice } from '@reduxjs/toolkit';

const fetchDataSlices = createSlice({
  name: 'fetchData',
  initialState: {
    loading: false,
    error: null,
    data: [],
  },
  reducers: {
    Start: (state) => {
      state.loading = true;
      state.error = null;
    },
    Success: (state, action) =>{
      state.loading = false;
      state.data = action.payload || [];
    },
    Failure: (state, action) =>{
      state.loading = false;
      state.error = action.payload || 'fetch data error';
    },
  },
});

export default fetchDataSlices.reducer;
