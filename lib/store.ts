import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import { authApi } from "./api/authApi";
import { userApi } from "./api/userApi";
import { promotionsApi } from "./api/promotionsApi";
import { reviewsApi } from "./api/reviewsApi";
import { adminApi } from "./api/adminApi";
import { newsApi } from "./api/newsApi";
import { paymentsApi } from "./api/paymentsApi";
import authReducer from "./authSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [promotionsApi.reducerPath]: promotionsApi.reducer,
    [reviewsApi.reducerPath]: reviewsApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [newsApi.reducerPath]: newsApi.reducer,
    [paymentsApi.reducerPath]: paymentsApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefault) =>
    getDefault().concat(
      apiSlice.middleware,
      authApi.middleware,
      userApi.middleware,
      promotionsApi.middleware,
      reviewsApi.middleware,
      adminApi.middleware,
      newsApi.middleware,
      paymentsApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
