import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiListResponse, ApiProduct, ApiCategory, ApiBrand } from "@/types/api";

// Backend ro'yxatni ba'zan massiv, ba'zan { count, pages, results } ko'rinishida qaytaradi —
// komponentlar doim bir xil shaklni olishi uchun shu yerda moslaymiz
export function toListResponse<T>(res: unknown): ApiListResponse<T> {
  if (Array.isArray(res)) return { count: res.length, pages: 1, results: res as T[] };
  const obj = (res ?? {}) as Partial<ApiListResponse<T>>;
  const results = Array.isArray(obj.results) ? obj.results : [];
  return {
    count: typeof obj.count === "number" ? obj.count : results.length,
    pages: typeof obj.pages === "number" ? obj.pages : 1,
    results,
  };
}

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://fixingtools.pythonanywhere.com/api",
  }),
  tagTypes: ["Product", "Category", "Brand"],
  endpoints: (builder) => ({
    getProducts: builder.query<
      ApiListResponse<ApiProduct>,
      {
        category?: string;
        search?: string;
        page?: number;
        page_size?: number;
        ordering?: string;
      } | void
    >({
      query: (params) => {
        const query = new URLSearchParams();
        if (params?.category) query.set("category", params.category);
        if (params?.search) query.set("search", params.search);
        if (params?.page) query.set("page", String(params.page));
        if (params?.page_size) query.set("page_size", String(params.page_size));
        if (params?.ordering) query.set("ordering", params.ordering);
        const qs = query.toString();
        return `/products/${qs ? `?${qs}` : ""}`;
      },
      transformResponse: (res: unknown) => toListResponse<ApiProduct>(res),
      providesTags: ["Product"],
    }),

    getProductBySlug: builder.query<ApiProduct, string>({
      query: (slug) => `/products/${slug}/`,
      providesTags: ["Product"],
    }),

    getCategories: builder.query<ApiListResponse<ApiCategory>, void>({
      query: () => "/categories/",
      transformResponse: (res: unknown) => toListResponse<ApiCategory>(res),
      providesTags: ["Category"],
    }),

    getBrands: builder.query<ApiListResponse<ApiBrand>, void>({
      query: () => "/brands/",
      transformResponse: (res: unknown) => toListResponse<ApiBrand>(res),
      providesTags: ["Brand"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductBySlugQuery,
  useGetCategoriesQuery,
  useGetBrandsQuery,
} = apiSlice;