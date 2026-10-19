"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, Newspaper } from "lucide-react";
import { styles } from "@/styles/index.styles";
import { useGetNewsByIdQuery } from "@/lib/api/newsApi";
import { formatApiError } from "@/lib/apiError";

export default function NewsArticle({ id }: { id: number }) {
  const { data: item, isLoading, error } = useGetNewsByIdQuery(id, { skip: !Number.isFinite(id) });

  return (
    <div className="bg-white">
      <div className={`${styles.container} py-6 sm:py-8`}>
        <div className="mb-4 flex flex-wrap items-center gap-1 text-xs text-gray-400">
          <Link href="/" className="hover:text-gray-600">
            Стройоптторг
          </Link>
          <ChevronRight size={12} />
          <Link href="/news" className="hover:text-gray-600">
            Новости
          </Link>
          {item && (
            <>
              <ChevronRight size={12} />
              <span className="line-clamp-1 text-gray-600">{item.title}</span>
            </>
          )}
        </div>

        {isLoading ? (
          <p className="py-16 text-center text-sm text-gray-500">Загрузка...</p>
        ) : error || !item ? (
          <div className="flex flex-col items-center py-16 text-center">
            <Newspaper size={40} className="mb-3 text-gray-300" />
            <p className="text-sm text-gray-500">
              {error && (error as { status?: number }).status !== 404 ? `Не удалось загрузить новость: ${formatApiError(error)}` : "Новость не найдена."}
            </p>
            <Link href="/news" className="mt-4 text-sm font-medium text-blue-600 hover:underline">
              ← Все новости
            </Link>
          </div>
        ) : (
          <article className="mx-auto max-w-3xl">
            {item.rubricLabel && <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">{item.rubricLabel}</span>}
            <h1 className="mb-3 mt-2 text-2xl font-bold leading-tight text-gray-900 sm:text-4xl">{item.title}</h1>
            <p className="mb-6 text-sm text-gray-400">{item.date}</p>

            {item.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.image} alt={item.title} className="mb-6 max-h-[460px] w-full rounded-xl object-cover" />
            )}

            {item.excerpt && <p className="mb-6 text-lg leading-relaxed text-gray-700">{item.excerpt}</p>}
            <div className="whitespace-pre-line text-base leading-relaxed text-gray-700">{item.content}</div>

            {item.product && (
              <Link
                href={`/products/${item.product.slug}`}
                className="mt-8 flex items-center justify-between gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4 hover:border-blue-200"
              >
                <div>
                  <p className="text-xs text-gray-400">Товар из статьи</p>
                  <p className="font-medium text-gray-900">{item.product.name}</p>
                </div>
                <span className="whitespace-nowrap font-semibold text-gray-900">{item.product.price.toLocaleString("ru-RU")} ₽</span>
              </Link>
            )}

            <Link href="/news" className="mt-10 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline">
              <ChevronLeft size={16} /> Все новости
            </Link>
          </article>
        )}
      </div>
    </div>
  );
}
