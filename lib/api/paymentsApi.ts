import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

/* =========================================================
   TO'LOV (Swagger: /api/payments/ — FintechHub/Click proksi)
   Karta orqali to'lash tartibi:
     1) card/request  { card_number, expiry, amount } → card_token (SMS yuboriladi)
     2) card/verify   { card_token, otp }
     3) card/payment  { card_token, amount }
   prepare/ va complete/ — to'lov tizimining server callback'lari,
   frontend ularni chaqirmaydi. login/register — do'kon (merchant) akkaunti uchun.
========================================================= */
export const PAYMENT_ENDPOINTS = {
  init: "/payments/pay/init/",
  cardRequest: "/payments/card/request/",
  cardVerify: "/payments/card/verify/",
  cardPayment: "/payments/card/payment/",
};

export type PaymentResponse = Record<string, unknown>;

export interface CardRequestBody {
  card_number: string; // faqat raqamlar
  expiry: string; // MMYY
  amount: number;
}

export interface CardVerifyBody {
  card_token: string;
  otp: string;
}

export interface CardPaymentBody {
  card_token: string;
  amount: number;
}

export interface PayInitBody {
  amount: number;
  merchant_trans_id: string; // buyurtma raqami
  user_id?: number;
}

/** Javobdan maydonni topadi: { card_token } yoki { data: { card_token } } */
export function pickField(res: unknown, ...keys: string[]): string {
  const sources = [res, (res as { data?: unknown })?.data];
  for (const src of sources) {
    if (!src || typeof src !== "object") continue;
    for (const key of keys) {
      const v = (src as Record<string, unknown>)[key];
      if (typeof v === "string" || typeof v === "number") return String(v);
    }
  }
  return "";
}

/** Click uslubidagi xato: HTTP 200, lekin { error_code: -5, error_note: "..." } */
export function paymentErrorNote(res: unknown): string | null {
  const sources = [res, (res as { data?: unknown })?.data];
  for (const src of sources) {
    if (!src || typeof src !== "object") continue;
    const o = src as Record<string, unknown>;
    const code = Number(o.error_code ?? (typeof o.error === "number" ? o.error : 0));
    if (code && code < 0) return String(o.error_note ?? o.message ?? `Ошибка оплаты (${code})`);
    if (o.success === false || o.status === "error") {
      return String(o.error_note ?? o.message ?? o.error ?? "Ошибка оплаты");
    }
  }
  return null;
}

export const paymentsApi = createApi({
  reducerPath: "paymentsApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    payInit: builder.mutation<PaymentResponse, PayInitBody>({
      query: (body) => ({ url: PAYMENT_ENDPOINTS.init, method: "POST", body }),
    }),
    cardRequest: builder.mutation<PaymentResponse, CardRequestBody>({
      query: (body) => ({ url: PAYMENT_ENDPOINTS.cardRequest, method: "POST", body }),
    }),
    cardVerify: builder.mutation<PaymentResponse, CardVerifyBody>({
      query: (body) => ({ url: PAYMENT_ENDPOINTS.cardVerify, method: "POST", body }),
    }),
    cardPayment: builder.mutation<PaymentResponse, CardPaymentBody>({
      query: (body) => ({ url: PAYMENT_ENDPOINTS.cardPayment, method: "POST", body }),
    }),
  }),
});

export const {
  usePayInitMutation,
  useCardRequestMutation,
  useCardVerifyMutation,
  useCardPaymentMutation,
} = paymentsApi;
