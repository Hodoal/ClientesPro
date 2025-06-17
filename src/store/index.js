import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import clientsReducer from "./slices/clientsSlice.js";
import dashboardReducer from "./slices/dashboardSlice.js"; // This slice will be created in the next step

export const store = configureStore({
  reducer: {
    auth: authReducer,
    clients: clientsReducer,
    dashboard: dashboardReducer,
  },
  // Additional middleware or enhancers can be added here
});

// export default store; // App.js uses named import: import { store } from ./src/store;
