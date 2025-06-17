import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
  isLoading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setDashboardData: (state, action) => {
      state.data = action.payload;
      state.isLoading = false;
      state.error = null; // Clear error on new data
    },
    setDashboardLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setDashboardError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearDashboardError: (state) => {
      state.error = null;
    },
  },
  // extraReducers: (builder) => {
  //   // Handle async thunks if any are added later
  //   // builder.addCase(fetchDashboardData.pending, (state) => {
  //   //   state.isLoading = true;
  //   // });
  //   // builder.addCase(fetchDashboardData.fulfilled, (state, action) => {
  //   //   state.isLoading = false;
  //   //   state.data = action.payload;
  //   // });
  //   // builder.addCase(fetchDashboardData.rejected, (state, action) => {
  //   //   state.isLoading = false;
  //   //   state.error = action.error.message;
  //   // });
  // }
});

export const {
  setDashboardData,
  setDashboardLoading,
  setDashboardError,
  clearDashboardError
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
