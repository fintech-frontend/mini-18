"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Newspaper } from "lucide-react";
import { styles } from "@/styles/index.styles";
import { useGetNewsQuery, useGetNewsRubricsQuery } from "@/lib/api/newsApi";
import { formatApiError } from "@/lib/apiError";

const PAGE_SIZE = 12;

export default function NewsPage() {
  const [rubric, setRubric] = useState("");
  const [page, setPage] = useState(1);
  const { data: rubrics = [] } = useGetNewsRubricsQuery();
  const { data, isLoading, isFetching, error } = useGetNewsQuery({ page, page_size: PAGE_SIZE, rubric: rubric || undefined });

  const items = data?.items ?? [];
  const pages = Math.max(1, Math.ceil((data?.count ?? 0) / PAGE_SIZE));

  return (
    <div className="bg-white">
      <div className={`${styles.container} py-6 sm:py-8`}>
        <div className="mb-4 flex items-center gap-1 text-xs text-gray-400">
          <Link href="/" className="hover:text-gray-600">
            Стройоптторг
          </Link>
          <ChevronRight size={12} />
          <span className="text-gray-600">Новости</span>
        </div>

        <h1 className="mb-6 text-2xl font-bold text-gray-900 sm:text-3xl">Новости</h1>

        {rubrics.length > 0 && (
          <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
            {[{ slug: "", name: "Все" }, ...rubrics].map((r) => (
              <button
                key={r.slug || "all"}
                onClick={() => {
                  setRubric(r.slug);
                  setPage(1);
                }}
                className={`shrink-0 rounded-lg border px-4 py-2 text-sm font-medium transition ${
                  rubric === r.slug ? "border-blue-600 bg-blue-600 text-white" : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                {r.name}
              </button>
            ))}
          </div>
        )}

        {isLoading ? (
          <p className="py-16 text-center text-sm text-gray-500">Загрузка...</p>
        ) : error ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">Не удалось загрузить новости: {formatApiError(error)}</p>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center rounded-xl border border-dashed border-gray-200 bg-gray-50/50 px-6 py-16 text-center">
            <Newspaper size={36} className="mb-3 text-gray-300" />
            <p className="text-sm text-gray-500">Новостей пока нет.</p>
          </div>
        ) : (
          <div className={`grid grid-cols-1 gap-6 transition-opacity sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${isFetching ? "opacity-60" : ""}`}>
            {items.map((item) => (
              <Link key={item.id} href={`/news/${item.id}`} className="group flex flex-col overflow-hidden rounded-xl border border-gray-100">
                <div className="h-44 overflow-hidden bg-gray-100">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image} alt={item.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Newspaper size={36} className="text-gray-300" />
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-4">
                  {item.rubricLabel && <span className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-blue-600">{item.rubricLabel}</span>}
                  <h2 className="mb-2 line-clamp-2 text-base font-semibold text-gray-900 group-hover:text-blue-600">{item.title}</h2>
                  <p className="mb-3 line-clamp-3 flex-1 text-sm text-gray-500">{item.excerpt}</p>
                  <span className="text-xs text-gray-400">{item.date}</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {pages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex h-9 items-center gap-1 rounded-lg px-3 text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-40"
            >
              <ChevronLeft size={16} /> Назад
            </button>
            <span className="text-sm text-gray-600">
              {page} / {pages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              disabled={page === pages}
              className="flex h-9 items-center gap-1 rounded-lg px-3 text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-40"
            >
              Дальше <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
