import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";
import { apiSlice, toListResponse } from "./apiSlice";
import { promotionsApi } from "./promotionsApi";
import { reviewsApi } from "./reviewsApi";
import { userApi } from "./userApi";
import { newsApi } from "./newsApi";
import type { ApiBrand, ApiCategory, ApiListResponse, ApiProduct } from "@/types/api";

/* =========================================================
   ADMIN API — katalog, buyurtmalar, aksiyalar, yangiliklar, sharhlar.
   Yozish so'rovlari token bilan yuboriladi (admin login'dagi JWT).
   Har bir o'zgarishdan keyin saytdagi (apiSlice) kesh ham
   yangilanadi — admin'da qo'shilgan narsa saytda darhol ko'rinadi.
========================================================= */

export interface AdminProductsArgs {
  page?: number;
  page_size?: number;
  search?: string;
  category?: string | number;
  brand?: string | number;
  ordering?: string;
  in_stock?: boolean;
  is_hit?: boolean;
}

/** POST/PATCH /api/products/ — yoziladigan maydonlar */
export interface ProductWrite {
  name: string;
  slug: string;
  article: string;
  category_id: number;
  brand_id: number | null;
  price: string;
  old_price: string | null;
  stock_quantity: number;
  description: string;
  is_active: boolean;
  is_hit: boolean;
  material: string;
  color: string;
  length_mm: string | null;
  width_mm: string | null;
  height_mm: string | null;
  weight_kg: string | null;
}

/* ---------- Buyurtma / aksiya / yangilik / sharh ---------- */

export interface ApiOrder {
  id: number;
  number: string;
  status: string;
  subtotal: string;
  total: string;
  created_at: string;
  user: number | null;
}

export interface ApiPromotion {
  id: number;
  title: string;
  description: string;
  discount_value: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  is_current?: string | boolean;
}
export type PromotionWrite = Omit<ApiPromotion, "id" | "is_current">;

export type NewsRubric = "news" | "articles" | "tips" | "reviews";
export interface ApiNews {
  id: number;
  title: string;
  slug: string | null;
  rubric: NewsRubric;
  rubric_label?: string;
  excerpt: string;
  content: string;
  image: string | null;
  image_url?: string | null;
  product?: { id: number; name: string; slug: string } | null;
  is_published: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
}
export interface NewsWrite {
  title: string;
  slug: string;
  rubric: NewsRubric;
  excerpt: string;
  content: string;
  is_published: boolean;
  published_at: string;
  product_id: number | null;
}

export interface ApiAdminReview {
  id: number;
  product: number;
  product_name?: string;
  user?: number;
  user_name?: string;
  user_email?: string;
  rating: number;
  text?: string;
  is_approved?: boolean;
  created_at: string;
}

export type CategoryWrite = Pick<ApiCategory, "name" | "slug" | "sort" | "is_active" | "parent">;
export type BrandWrite = Pick<ApiBrand, "name" | "slug">;

/** Rasm alohida multipart so'rov bilan yuklanadi (ma'lumotlar esa JSON'da) */
function fileForm(field: string, file: File) {
  const fd = new FormData();
  fd.append(field, file);
  return fd;
}

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["AdminProduct", "AdminCategory", "AdminBrand", "AdminOrder", "AdminPromotion", "AdminNews", "AdminReview"],
  endpoints: (builder) => ({
    /* ---------- MAHSULOTLAR ---------- */
    getAdminProducts: builder.query<ApiListResponse<ApiProduct>, AdminProductsArgs>({
      query: (args) => {
        const params: Record<string, string> = {};
        Object.entries(args).forEach(([k, v]) => {
          if (v !== undefined && v !== "" && v !== null) params[k] = String(v);
        });
        return { url: "/products/", params };
      },
      transformResponse: (res: unknown) => toListResponse<ApiProduct>(res),
      providesTags: ["AdminProduct"],
    }),

    createProduct: builder.mutation<ApiProduct, Partial<ProductWrite>>({
      query: (body) => ({ url: "/products/", method: "POST", body }),
      invalidatesTags: ["AdminProduct"],
      onQueryStarted: refreshSite(["Product"]),
    }),

    updateProduct: builder.mutation<
      ApiProduct,
      { id: number; body: Partial<ProductWrite> & { image?: null } }
    >({
      query: ({ id, body }) => ({ url: `/products/${id}/`, method: "PATCH", body }),
      invalidatesTags: ["AdminProduct"],
      onQueryStarted: refreshSite(["Product"]),
    }),

    uploadProductImage: builder.mutation<ApiProduct, { id: number; file: File }>({
      query: ({ id, file }) => ({ url: `/products/${id}/`, method: "PATCH", body: fileForm("image", file) }),
      invalidatesTags: ["AdminProduct"],
      onQueryStarted: refreshSite(["Product"]),
    }),

    deleteProduct: builder.mutation<void, number>({
      query: (id) => ({ url: `/products/${id}/`, method: "DELETE" }),
      invalidatesTags: ["AdminProduct"],
      onQueryStarted: refreshSite(["Product"]),
    }),

    /* ---------- KATEGORIYALAR ---------- */
    getAdminCategories: builder.query<ApiCategory[], void>({
      query: () => ({ url: "/categories/", params: { page_size: 1000 } }),
      transformResponse: (res: unknown) => toListResponse<ApiCategory>(res).results,
      providesTags: ["AdminCategory"],
    }),

    createCategory: builder.mutation<ApiCategory, CategoryWrite>({
      query: (body) => ({ url: "/categories/", method: "POST", body }),
      invalidatesTags: ["AdminCategory"],
      onQueryStarted: refreshSite(["Category"]),
    }),

    updateCategory: builder.mutation<ApiCategory, { id: number; body: Partial<CategoryWrite> }>({
      query: ({ id, body }) => ({ url: `/categories/${id}/`, method: "PATCH", body }),
      // Kategoriya nomi mahsulot ro'yxatida ham ko'rinadi
      invalidatesTags: ["AdminCategory", "AdminProduct"],
      onQueryStarted: refreshSite(["Category", "Product"]),
    }),

    deleteCategory: builder.mutation<void, number>({
      query: (id) => ({ url: `/categories/${id}/`, method: "DELETE" }),
      invalidatesTags: ["AdminCategory", "AdminProduct"],
      onQueryStarted: refreshSite(["Category", "Product"]),
    }),

    /* ---------- BRENDLAR ---------- */
    getAdminBrands: builder.query<ApiBrand[], void>({
      query: () => ({ url: "/brands/", params: { page_size: 1000 } }),
      transformResponse: (res: unknown) => toListResponse<ApiBrand>(res).results,
      providesTags: ["AdminBrand"],
    }),

    createBrand: builder.mutation<ApiBrand, BrandWrite>({
      query: (body) => ({ url: "/brands/", method: "POST", body }),
      invalidatesTags: ["AdminBrand"],
      onQueryStarted: refreshSite(["Brand"]),
    }),

    updateBrand: builder.mutation<
      ApiBrand,
      { id: number; body: Partial<BrandWrite> & { logo?: null } }
    >({
      query: ({ id, body }) => ({ url: `/brands/${id}/`, method: "PATCH", body }),
      invalidatesTags: ["AdminBrand", "AdminProduct"],
      onQueryStarted: refreshSite(["Brand", "Product"]),
    }),

    uploadBrandLogo: builder.mutation<ApiBrand, { id: number; file: File }>({
      query: ({ id, file }) => ({ url: `/brands/${id}/`, method: "PATCH", body: fileForm("logo", file) }),
      invalidatesTags: ["AdminBrand"],
      onQueryStarted: refreshSite(["Brand"]),
    }),

    deleteBrand: builder.mutation<void, number>({
      query: (id) => ({ url: `/brands/${id}/`, method: "DELETE" }),
      invalidatesTags: ["AdminBrand", "AdminProduct"],
      onQueryStarted: refreshSite(["Brand", "Product"]),
    }),

    /* ---------- BUYURTMALAR ---------- */
    // Statistika uchun hammasi bitta so'rovda olinadi
    getAdminOrders: builder.query<ApiOrder[], void>({
      query: () => ({ url: "/orders/", params: { page_size: 1000, ordering: "-created_at" } }),
      transformResponse: (res: unknown) => toListResponse<ApiOrder>(res).results,
      providesTags: ["AdminOrder"],
    }),

    createOrder: builder.mutation<ApiOrder, Pick<ApiOrder, "number" | "status" | "subtotal" | "total">>({
      query: (body) => ({ url: "/orders/", method: "POST", body }),
      invalidatesTags: ["AdminOrder"],
      onQueryStarted: afterSuccess(() => userApi.util.invalidateTags(["Orders"])),
    }),

    updateOrder: builder.mutation<ApiOrder, { id: number; body: Partial<Pick<ApiOrder, "status" | "subtotal" | "total">> }>({
      query: ({ id, body }) => ({ url: `/orders/${id}/`, method: "PATCH", body }),
      invalidatesTags: ["AdminOrder"],
      onQueryStarted: afterSuccess(() => userApi.util.invalidateTags(["Orders"])),
    }),

    deleteOrder: builder.mutation<void, number>({
      query: (id) => ({ url: `/orders/${id}/`, method: "DELETE" }),
      invalidatesTags: ["AdminOrder"],
      onQueryStarted: afterSuccess(() => userApi.util.invalidateTags(["Orders"])),
    }),

    /* ---------- AKSIYALAR ---------- */
    getAdminPromotions: builder.query<ApiPromotion[], void>({
      query: () => ({ url: "/promotions/", params: { page_size: 1000 } }),
      transformResponse: (res: unknown) => toListResponse<ApiPromotion>(res).results,
      providesTags: ["AdminPromotion"],
    }),

    createPromotion: builder.mutation<ApiPromotion, PromotionWrite>({
      query: (body) => ({ url: "/promotions/", method: "POST", body }),
      invalidatesTags: ["AdminPromotion"],
      onQueryStarted: afterSuccess(() => promotionsApi.util.invalidateTags(["Promotion"])),
    }),

    updatePromotion: builder.mutation<ApiPromotion, { id: number; body: Partial<PromotionWrite> }>({
      query: ({ id, body }) => ({ url: `/promotions/${id}/`, method: "PATCH", body }),
      invalidatesTags: ["AdminPromotion"],
      onQueryStarted: afterSuccess(() => promotionsApi.util.invalidateTags(["Promotion"])),
    }),

    deletePromotion: builder.mutation<void, number>({
      query: (id) => ({ url: `/promotions/${id}/`, method: "DELETE" }),
      invalidatesTags: ["AdminPromotion"],
      onQueryStarted: afterSuccess(() => promotionsApi.util.invalidateTags(["Promotion"])),
    }),

    /* ---------- YANGILIKLAR ---------- */
    getAdminNews: builder.query<ApiNews[], void>({
      query: () => ({ url: "/news/", params: { page_size: 1000, ordering: "-published_at" } }),
      transformResponse: (res: unknown) => toListResponse<ApiNews>(res).results,
      providesTags: ["AdminNews"],
    }),

    createNews: builder.mutation<ApiNews, Partial<NewsWrite>>({
      query: (body) => ({ url: "/news/", method: "POST", body }),
      invalidatesTags: ["AdminNews"],
      onQueryStarted: afterSuccess(() => newsApi.util.invalidateTags(["News"])),
    }),

    updateNews: builder.mutation<ApiNews, { id: number; body: Partial<NewsWrite> & { image?: null } }>({
      query: ({ id, body }) => ({ url: `/news/${id}/`, method: "PATCH", body }),
      invalidatesTags: ["AdminNews"],
      onQueryStarted: afterSuccess(() => newsApi.util.invalidateTags(["News"])),
    }),

    uploadNewsImage: builder.mutation<ApiNews, { id: number; file: File }>({
      query: ({ id, file }) => ({ url: `/news/${id}/`, method: "PATCH", body: fileForm("image", file) }),
      invalidatesTags: ["AdminNews"],
      onQueryStarted: afterSuccess(() => newsApi.util.invalidateTags(["News"])),
    }),

    deleteNews: builder.mutation<void, number>({
      query: (id) => ({ url: `/news/${id}/`, method: "DELETE" }),
      invalidatesTags: ["AdminNews"],
      onQueryStarted: afterSuccess(() => newsApi.util.invalidateTags(["News"])),
    }),

    /* ---------- SHARHLAR ---------- */
    getAdminReviews: builder.query<ApiAdminReview[], void>({
      query: () => ({ url: "/reviews/", params: { page_size: 1000, ordering: "-created_at" } }),
      transformResponse: (res: unknown) => toListResponse<ApiAdminReview>(res).results,
      providesTags: ["AdminReview"],
    }),

    deleteReview: builder.mutation<void, number>({
      query: (id) => ({ url: `/reviews/${id}/`, method: "DELETE" }),
      invalidatesTags: ["AdminReview"],
      onQueryStarted: afterSuccess(() => reviewsApi.util.invalidateTags(["Review"])),
    }),
  }),
});

// Muvaffaqiyatli o'zgarishdan keyin boshqa API keshini (sayt) yangilaydi
function afterSuccess(makeAction: () => unknown) {
  return async (
    _arg: unknown,
    { dispatch, queryFulfilled }: { dispatch: (a: unknown) => unknown; queryFulfilled: Promise<unknown> }
  ) => {
    try {
      await queryFulfilled;
      dispatch(makeAction());
    } catch {
      /* xato komponentda ko'rsatiladi */
    }
  };
}

// Muvaffaqiyatli o'zgarishdan keyin saytning keshini eskirgan deb belgilaydi
function refreshSite(tags: ("Product" | "Category" | "Brand")[]) {
  return async (
    _arg: unknown,
    { dispatch, queryFulfilled }: { dispatch: (a: unknown) => unknown; queryFulfilled: Promise<unknown> }
  ) => {
    try {
      await queryFulfilled;
      dispatch(apiSlice.util.invalidateTags(tags));
    } catch {
      /* xato komponentda ko'rsatiladi */
    }
  };
}

export const {
  useGetAdminProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUploadProductImageMutation,
  useDeleteProductMutation,
  useGetAdminCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetAdminBrandsQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useUploadBrandLogoMutation,
  useDeleteBrandMutation,
  useGetAdminOrdersQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useGetAdminPromotionsQuery,
  useCreatePromotionMutation,
  useUpdatePromotionMutation,
  useDeletePromotionMutation,
  useGetAdminNewsQuery,
  useCreateNewsMutation,
  useUpdateNewsMutation,
  useUploadNewsImageMutation,
  useDeleteNewsMutation,
  useGetAdminReviewsQuery,
  useDeleteReviewMutation,
} = adminApi;
