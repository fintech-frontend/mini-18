import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth as baseQuery } from "./baseQuery";
import { toListResponse } from "./apiSlice";

const MEDIA_BASE = "https://fixingtools.pythonanywhere.com";

/** Swagger: GET /api/news/, /api/news/{id}/, /api/news/rubrics/ */
export interface ApiNewsItem {
  id: number;
  title: string;
  slug: string | null;
  rubric: string;
  rubric_label?: string;
  excerpt: string;
  content: string;
  image: string | null;
  image_url?: string | null;
  product?: { id: number; name: string; slug: string; price: string } | null;
  is_published?: boolean;
  published_at?: string;
  created_at: string;
}

export interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  rubric: string;
  rubricLabel: string;
  product: { name: string; slug: string; price: number } | null;
}

export interface NewsRubricItem {
  slug: string;
  name: string;
  count: number;
}

const toImageUrl = (src?: string | null) => {
  if (!src) return "";
  if (/^https?:\/\//.test(src)) return src;
  return `${MEDIA_BASE}${src.startsWith("/") ? "" : "/"}${src}`;
};

const formatDate = (value?: string) => {
  if (!value) return "";
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? value
    : d.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
};

export const mapNews = (n: ApiNewsItem): NewsItem => ({
  id: n.id,
  title: n.title,
  excerpt: n.excerpt ?? "",
  content: n.content ?? "",
  image: toImageUrl(n.image_url ?? n.image),
  date: formatDate(n.published_at ?? n.created_at),
  rubric: n.rubric,
  rubricLabel: n.rubric_label ?? "",
  product: n.product ? { name: n.product.name, slug: n.product.slug, price: parseFloat(n.product.price) || 0 } : null,
});

export const newsApi = createApi({
  reducerPath: "newsApi",
  baseQuery,
  tagTypes: ["News"],
  endpoints: (builder) => ({
    getNews: builder.query<{ items: NewsItem[]; count: number }, { page?: number; page_size?: number; rubric?: string } | void>({
      query: (arg) => ({
        url: "/news/",
        params: {
          page: arg?.page ?? 1,
          page_size: arg?.page_size ?? 12,
          ordering: "-published_at",
          ...(arg?.rubric ? { rubric: arg.rubric } : {}),
        },
      }),
      transformResponse: (res: unknown) => {
        const list = toListResponse<ApiNewsItem>(res);
        // Qoralama (chop etilmagan) yangiliklar saytda ko'rinmaydi
        const items = list.results.filter((n) => n.is_published !== false).map(mapNews);
        return { items, count: list.count };
      },
      providesTags: ["News"],
    }),

    getNewsById: builder.query<NewsItem, number>({
      query: (id) => `/news/${id}/`,
      transformResponse: (res: ApiNewsItem) => mapNews(res),
      providesTags: (_r, _e, id) => [{ type: "News", id }],
    }),

    getNewsRubrics: builder.query<NewsRubricItem[], void>({
      query: () => "/news/rubrics/",
      transformResponse: (res: unknown) => toListResponse<NewsRubricItem>(res).results,
      providesTags: ["News"],
    }),
  }),
});

export const { useGetNewsQuery, useGetNewsByIdQuery, useGetNewsRubricsQuery } = newsApi;
