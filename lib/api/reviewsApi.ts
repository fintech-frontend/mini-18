import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth as baseQuery } from "./baseQuery";

export const REVIEWS_PAGE_SIZE = 8;

/** Swagger: GET/POST /api/reviews/ */
export interface ApiReview {
  id: number;
  product: number;
  product_name?: string;
  user?: number;
  user_email?: string;
  rating: number;
  text?: string;
  is_approved?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface Paginated<T> {
  count: number;
  results: T[];
}

export interface Review {
  id: number;
  productId: number;
  productName: string;
  author: string;
  rating: number;
  text: string;
  date: string;
}

export interface ReviewsList {
  items: Review[];
  count: number;
}

export interface CreateReviewRequest {
  product: number;
  rating: number;
  text: string;
}

const formatDate = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  return isNaN(date.getTime()) ? value : date.toLocaleDateString("ru-RU");
};

// Email to'liq ko'rsatilmaydi, faqat "@" gacha bo'lgan qismi
const authorFromEmail = (email?: string) =>
  email ? email.split("@")[0] : "Покупатель";

export const mapReview = (r: ApiReview): Review => ({
  id: r.id,
  productId: r.product,
  productName: r.product_name ?? "",
  author: authorFromEmail(r.user_email),
  rating: Number(r.rating) || 0,
  text: r.text ?? "",
  date: formatDate(r.created_at),
});

export const reviewsApi = createApi({
  reducerPath: "reviewsApi",
  baseQuery,
  tagTypes: ["Review"],
  endpoints: (builder) => ({
    getReviews: builder.query<
      ReviewsList,
      { page?: number; ordering?: string } | void
    >({
      query: (arg) => ({
        url: "/reviews/",
        params: {
          page: arg?.page ?? 1,
          page_size: REVIEWS_PAGE_SIZE,
          ordering: arg?.ordering ?? "-created_at",
        },
      }),
      transformResponse: (res: Paginated<ApiReview> | ApiReview[]) => {
        if (Array.isArray(res)) {
          return { items: res.map(mapReview), count: res.length };
        }
        return { items: res.results.map(mapReview), count: res.count };
      },
      providesTags: ["Review"],
    }),

    createReview: builder.mutation<ApiReview, CreateReviewRequest>({
      query: (body) => ({ url: "/reviews/", method: "POST", body }),
      invalidatesTags: ["Review"],
    }),
  }),
});

export const { useGetReviewsQuery, useCreateReviewMutation } = reviewsApi;
