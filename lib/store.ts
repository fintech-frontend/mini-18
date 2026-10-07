import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./api/authApi";
import { userApi } from "./api/userApi";
import { promotionsApi } from "./api/promotionsApi";
import authReducer from "./authSlice";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [promotionsApi.reducerPath]: promotionsApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefault) =>
    getDefault().concat(
      authApi.middleware,
      userApi.middleware,
      promotionsApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;