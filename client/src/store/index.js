import { configureStore } from "@reduxjs/toolkit";

import { apiSlice, authSlice } from "../api/apiSlice";
import { uiSlice } from "./slices/uislice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [authSlice.reducerPath]: authSlice.reducer,
    ui: uiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware, authSlice.middleware),
});
