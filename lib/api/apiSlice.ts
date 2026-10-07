import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiListResponse, ApiProduct, ApiCategory, ApiBrand } from "@/types/api";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://fixingtools.pythonanywhere.com/api",
  }),
  tagTypes: ["Product", "Category", "Brand"],
  endpoints: (builder) => ({
    getProducts: builder.query<
      ApiListResponse<ApiProduct>,
      { category?: string; search?: string; page?: number } | void
    >({
      query: (params) => {
        const query = new URLSearchParams();
        if (params?.category) query.set("category", params.category);
        if (params?.search) query.set("search", params.search);
        if (params?.page) query.set("page", String(params.page));
        const qs = query.toString();
        return `/products/${qs ? `?${qs}` : ""}`;
      },
      providesTags: ["Product"],
    }),

    getProductBySlug: builder.query<ApiProduct, string>({
      query: (slug) => `/products/${slug}/`,
      providesTags: ["Product"],
    }),

    getCategories: builder.query<ApiListResponse<ApiCategory>, void>({
      query: () => "/categories/",
      providesTags: ["Category"],
    }),

    getBrands: builder.query<ApiListResponse<ApiBrand>, void>({
      query: () => "/brands/",
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