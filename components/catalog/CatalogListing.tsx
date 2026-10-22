"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { styles } from "@/styles/index.styles";
import ProductCard from "@/components/ui/ProductCard";
import { EmptyNotice } from "@/components/ui/EmptyNotice";
import { useGetCategoriesQuery, useGetProductsQuery } from "@/lib/api/apiSlice";
import { mapApiProductToProduct } from "@/lib/adapters/products";
import { formatApiError } from "@/lib/apiError";

const PAGE_SIZE = 20;

const SORTS = [
  { id: "-created_at", label: "Сначала новые" },
  { id: "price", label: "Сначала дешевле" },
  { id: "-price", label: "Сначала дороже" },
  { id: "name", label: "По названию" },
];

/** Katalog: slug berilsa — shu kategoriya mahsulotlari, aks holda hammasi */
export default function CatalogListing({ slug }: { slug?: string }) {
  const [page, setPage] = useState(1);
  const [ordering, setOrdering] = useState(SORTS[0].id);

  const { data: categoriesData, isLoading: catsLoading } = useGetCategoriesQuery();
  const { data, isLoading, isFetching, error } = useGetProductsQuery({
    category: slug,
    page,
    page_size: PAGE_SIZE,
    ordering,
  });

  const categories = (categoriesData?.results ?? [])
    .filter((c) => c.is_active)
    .sort((a, b) => a.sort - b.sort || a.name.localeCompare(b.name));
  const current = slug ? categories.find((c) => c.slug === slug) : undefined;
  const products = (data?.results ?? []).map(mapApiProductToProduct);
  const total = data?.count ?? 0;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const title = slug ? current?.name ?? (catsLoading ? "" : "Категория не найдена") : "Каталог";

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
      <div className={styles.container}>
        {/* Breadcrumb */}
        <div className="mb-3 flex items-center gap-1 text-xs text-gray-400">
          <Link href="/" className="hover:text-gray-600">
            Стройоптторг
          </Link>
          <ChevronRight size={12} />
          {slug ? (
            <>
              <Link href="/catalog" className="hover:text-gray-600">
                Каталог
              </Link>
              <ChevronRight size={12} />
              <span className="text-gray-600">{title}</span>
            </>
          ) : (
            <span className="text-gray-600">Каталог</span>
          )}
        </div>

        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl">
            {title}
            {total > 0 && <span className="ml-2 text-base font-normal text-gray-400">{total}</span>}
          </h1>
          <select
            value={ordering}
            onChange={(e) => {
              setOrdering(e.target.value);
              setPage(1);
            }}
            aria-label="Сортировка"
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-400"
          >
            {SORTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Kategoriyalar */}
        {categories.length > 0 && (
          <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
            <Link
              href="/catalog"
              className={`shrink-0 rounded-lg border px-4 py-2 text-sm font-medium transition ${
                !slug ? "border-blue-600 bg-blue-600 text-white" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              Все товары
            </Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/catalog/${c.slug}`}
                className={`shrink-0 rounded-lg border px-4 py-2 text-sm font-medium transition ${
                  c.slug === slug ? "border-blue-600 bg-blue-600 text-white" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
              >
                {c.name}
              </Link>
            ))}
          </div>
        )}

        {isLoading ? (
          <p className="py-16 text-center text-sm text-gray-500">Загрузка...</p>
        ) : error ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Не удалось загрузить товары: {formatApiError(error)}
          </p>
        ) : products.length === 0 ? (
          <EmptyNotice />
        ) : (
          <div
            className={`grid grid-cols-2 gap-3 transition-opacity sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 ${
              isFetching ? "opacity-60" : ""
            }`}
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {pages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex h-9 items-center gap-1 rounded-lg px-3 text-sm text-gray-500 hover:bg-white disabled:opacity-40"
            >
              <ChevronLeft size={16} /> Назад
            </button>
            <span className="text-sm text-gray-600">
              {page} / {pages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              disabled={page === pages}
              className="flex h-9 items-center gap-1 rounded-lg px-3 text-sm text-gray-500 hover:bg-white disabled:opacity-40"
            >
              Дальше <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
