import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";
import { logout, setAccessToken } from "../authSlice";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL; // https://fixingtools.pythonanywhere.com/api

// Swagger: POST /api/auth/token/refresh/  { refresh } -> { access }
const REFRESH_URL = "/auth/token/refresh/";

// Ochiq endpointlar: Authorization header YUBORILMAYDI
// (eskirgan token bo'lsa, server ularni ham 401 bilan rad etishi mumkin)
const PUBLIC_PATHS = [
  "/auth/login/",
  "/auth/register/",
  REFRESH_URL,
  "/auth/password/reset/",
];

// Bu yo'llarda 401 bo'lsa tokenni yangilashga urinmaymiz
const NO_REAUTH = [...PUBLIC_PATHS, "/auth/logout/"];

// Tokensiz so'rovlar
const publicBaseQuery = fetchBaseQuery({ baseUrl: BASE_URL });

// Tokenli so'rovlar
const authBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

/**
 * Har bir so'rov shu orqali o'tadi. Access token eskirgan bo'lsa (401),
 * refresh token bilan yangisini olib, so'rovni avtomatik qayta yuboradi.
 * Refresh ham ishlamasa, foydalanuvchi tizimdan chiqariladi.
 */
export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const url = typeof args === "string" ? args : args.url;

  // Ochiq endpoint: tokensiz yuboramiz
  if (PUBLIC_PATHS.some((path) => url.includes(path))) {
    return publicBaseQuery(args, api, extraOptions);
  }

  let result = await authBaseQuery(args, api, extraOptions);

  const skipReauth = NO_REAUTH.some((path) => url.includes(path));

  if (result.error?.status === 401 && !skipReauth) {
    const refresh = (api.getState() as RootState).auth.refresh;

    if (refresh) {
      const refreshResult = await publicBaseQuery(
        { url: REFRESH_URL, method: "POST", body: { refresh } },
        api,
        extraOptions
      );

      const access = (refreshResult.data as { access?: string } | undefined)
        ?.access;

      if (access) {
        api.dispatch(setAccessToken(access));
        result = await authBaseQuery(args, api, extraOptions); // qayta urinish
      } else {
        api.dispatch(logout());
      }
    }
  }

  return result;
};