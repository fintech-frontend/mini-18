import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

/* =========================
   TYPES
========================= */

// Swagger: POST /api/auth/register/  (maydonlarni Swagger bilan solishtiring)
export interface RegisterRequest {
  username: string; // email bilan bir xil (login email-based)
  email: string;
  phone: string;
  full_name: string;
  name: string;
  first_name: string;
  last_name: string;
  region: string;
  password: string;
  password_confirm: string;
}

// Swagger: POST /api/auth/login/  (email-based: username ga email yoziladi)
export interface LoginRequest {
  email: string;
  username: string;
  password: string;
}

// Swagger javobi: { access, refresh }, lekin amalda boshqacha bo'lishi mumkin
// ({ tokens: { access } }, { token }, { data: { access } } ...)
export type AuthResponse = Record<string, unknown>;

// Backend xato formati: { error: "..." } yoki { email: ["..."] } yoki { detail: "..." }
export type ApiFieldErrors = Record<string, string[] | string>;

/* =========================
   API
========================= */

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    register: builder.mutation<unknown, RegisterRequest>({
      query: (body) => ({
        url: "/auth/register/",
        method: "POST",
        body,
      }),
    }),

    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({
        url: "/auth/login/",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation } = authApi;