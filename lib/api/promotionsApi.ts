import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth as baseQuery } from "./baseQuery";

const MEDIA_BASE = "https://fixingtools.pythonanywhere.com";
export const PAGE_SIZE = 12; // backend sahifa hajmiga moslang

/** API'dan keladigan xom shakl */
export interface ApiPromotion {
  id: number;
  title: string;
  description?: string | null;
  full_description?: string | null;
  discount?: string | number | null;
  image?: string | null;
  end_date?: string | null;
  promo_code?: string | null;
}

interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/** UI ishlatadigan shakl */
export interface Action {
  id: number;
  title: string;
  description: string;
  fullDescription: string;
  discount: string;
  image: string;
  endDate: string;
  promoCode: string;
}

export interface ActionsList {
  items: Action[];
  count: number;
}

const toImageUrl = (src?: string | null) => {
  if (!src) return "";
  if (src.startsWith("http")) return src;
  return `${MEDIA_BASE}${src.startsWith("/") ? "" : "/"}${src}`;
};

const formatDiscount = (d?: string | number | null) => {
  if (d === null || d === undefined || d === "") return "";
  const s = String(d);
  return /^-?\d+(\.\d+)?$/.test(s) ? `-${s.replace("-", "")}%` : s;
};

const formatDate = (value?: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  return isNaN(date.getTime()) ? value : date.toLocaleDateString("ru-RU");
};

// Maydon nomlari boshqacha bo'lsa, faqat shu funksiyani o'zgartiring
export const mapPromotion = (p: ApiPromotion): Action => ({
  id: p.id,
  title: p.title,
  description: p.description ?? "",
  fullDescription: p.full_description ?? p.description ?? "",
  discount: formatDiscount(p.discount),
  image: toImageUrl(p.image),
  endDate: formatDate(p.end_date),
  promoCode: p.promo_code ?? "",
});

export const promotionsApi = createApi({
  reducerPath: "promotionsApi",
  baseQuery,
  tagTypes: ["Promotion"],
  endpoints: (builder) => ({
    getPromotions: builder.query<ActionsList, { page?: number } | void>({
      query: (arg) => ({
        url: "/promotions/",
        params: { page: arg?.page ?? 1 },
      }),
      transformResponse: (res: Paginated<ApiPromotion> | ApiPromotion[]) => {
        if (Array.isArray(res)) {
          return { items: res.map(mapPromotion), count: res.length };
        }
        return { items: res.results.map(mapPromotion), count: res.count };
      },
      providesTags: ["Promotion"],
    }),

    getPromotionById: builder.query<Action, number>({
      query: (id) => `/promotions/${id}/`,
      transformResponse: (res: ApiPromotion) => mapPromotion(res),
      providesTags: (_r, _e, id) => [{ type: "Promotion", id }],
    }),
  }),
});

export const { useGetPromotionsQuery, useGetPromotionByIdQuery } =
  promotionsApi;