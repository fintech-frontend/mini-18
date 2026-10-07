import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

/* =========================================================
   ENDPOINT YO'LLARI
   Swagger (/api/docs/) bilan solishtiring. Faqat SHU YERDA
   o'zgartirsangiz yetadi.
   Tasdiqlangan (Swagger): logout, profile, changePassword, addresses
   Taxminiy:               orders, favorites
========================================================= */
export const ENDPOINTS = {
  logout: "/auth/logout/",
  profile: "/auth/profile/",
  changePassword: "/auth/password/change/",
  addresses: "/auth/addresses/",
  orders: "/orders/", // <-- taxminiy
  favorites: "/favorites/", // <-- taxminiy
};

/* =========================
   TYPES
========================= */

// Profil maydonlari backend'ga qarab o'zgaradi, shuning uchun erkin obyekt
export type Profile = Record<string, unknown>;

// Manzil, buyurtma, sevimli: maydonlari backend'ga qarab o'zgaradi
export type AnyRecord = Record<string, unknown>;

// [..] yoki { results: [..] } yoki { data: [..] } -> massiv
export function toList(res: unknown): AnyRecord[] {
  if (Array.isArray(res)) return res as AnyRecord[];
  if (res && typeof res === "object") {
    const obj = res as Record<string, unknown>;
    for (const key of ["results", "data", "items"]) {
      if (Array.isArray(obj[key])) return obj[key] as AnyRecord[];
    }
  }
  return [];
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
  new_password_confirm: string;
  confirm_password: string;
  password_confirm: string;
}

/* =========================
   API
========================= */

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Profile", "Addresses", "Favorites"],
  endpoints: (builder) => ({
    logout: builder.mutation<unknown, { refresh: string }>({
      query: (body) => ({ url: ENDPOINTS.logout, method: "POST", body }),
    }),

    getProfile: builder.query<Profile, void>({
      query: () => ENDPOINTS.profile,
      providesTags: ["Profile"],
    }),

    updateProfile: builder.mutation<Profile, Record<string, string>>({
      query: (body) => ({ url: ENDPOINTS.profile, method: "PATCH", body }),
      invalidatesTags: ["Profile"],
    }),

    /* ---------- MANZILLAR ---------- */
    getAddresses: builder.query<AnyRecord[], void>({
      query: () => ENDPOINTS.addresses,
      transformResponse: (res: unknown) => toList(res),
      providesTags: ["Addresses"],
    }),

    addAddress: builder.mutation<AnyRecord, Record<string, string>>({
      query: (body) => ({ url: ENDPOINTS.addresses, method: "POST", body }),
      invalidatesTags: ["Addresses"],
    }),

    updateAddress: builder.mutation<
      AnyRecord,
      { id: number | string; body: Record<string, string> }
    >({
      query: ({ id, body }) => ({
        url: `${ENDPOINTS.addresses}${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Addresses"],
    }),

    deleteAddress: builder.mutation<unknown, number | string>({
      query: (id) => ({
        url: `${ENDPOINTS.addresses}${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Addresses"],
    }),

    /* ---------- BUYURTMALAR ---------- */
    getOrders: builder.query<AnyRecord[], void>({
      query: () => ENDPOINTS.orders,
      transformResponse: (res: unknown) => toList(res),
    }),

    /* ---------- SEVIMLILAR ---------- */
    getFavorites: builder.query<AnyRecord[], void>({
      query: () => ENDPOINTS.favorites,
      transformResponse: (res: unknown) => toList(res),
      providesTags: ["Favorites"],
    }),

    removeFavorite: builder.mutation<unknown, number | string>({
      query: (id) => ({
        url: `${ENDPOINTS.favorites}${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Favorites"],
    }),

    changePassword: builder.mutation<unknown, ChangePasswordRequest>({
      query: (body) => ({
        url: ENDPOINTS.changePassword,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useLogoutMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useGetAddressesQuery,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useGetOrdersQuery,
  useGetFavoritesQuery,
  useRemoveFavoriteMutation,
} = userApi;