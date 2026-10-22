"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { PAGE_SIZE, useGetPromotionsQuery } from "@/lib/api/promotionsApi";

function getPages(current: number, total: number): (number | "...")[] {
  const base = [...new Set([1, total, current - 1, current, current + 1])]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);

  const result: (number | "...")[] = [];
  base.forEach((p, i) => {
    if (i > 0 && p - base[i - 1] > 1) result.push("...");
    result.push(p);
  });
  return result;
}

export default function AKciiPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isFetching, isError, refetch } =
    useGetPromotionsQuery({ page: currentPage });

  const actions = data?.items ?? [];
  const totalPages = Math.max(1, Math.ceil((data?.count ?? 0) / PAGE_SIZE));

  const goTo = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="w-full">
      <div className="w-full">
        <section className="w-full py-4 sm:py-6 lg:py-8">
          {/* TITLE */}
          <h1 className="mb-6 text-[30px] font-bold text-[#333] sm:text-[34px] lg:text-[38px]">
            Акции
          </h1>

          {/* LOADING */}
          {isLoading && (
            <div className="grid grid-cols-1 gap-x-5 gap-y-7 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-7 lg:gap-y-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-45 rounded-[6px] bg-gray-200 sm:h-52.5 lg:h-55" />
                  <div className="mt-3 h-4 w-3/4 rounded bg-gray-200" />
                  <div className="mt-2 h-3 w-1/3 rounded bg-gray-200" />
                </div>
              ))}
            </div>
          )}

          {/* ERROR */}
          {isError && (
            <div className="rounded border border-red-200 bg-red-50 p-4 text-[14px] text-red-700">
              Не удалось загрузить акции.{" "}
              <button onClick={refetch} className="underline">
                Повторить
              </button>
            </div>
          )}

          {/* EMPTY */}
          {!isLoading && !isError && actions.length === 0 && (
            <p className="text-[14px] text-[#666]">Сейчас нет активных акций.</p>
          )}

          {/* CARDS */}
          {!isLoading && !isError && actions.length > 0 && (
            <div
              className={`grid grid-cols-1 gap-x-5 gap-y-7 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-7 lg:gap-y-8 transition-opacity ${
                isFetching ? "opacity-60" : ""
              }`}
            >
              {actions.map((item) => (
                <article key={item.id} className="group min-w-0">
                  {/* IMAGE */}
                  <Link href={`/akcii/${item.id}`} className="block">
                    <div className="relative h-45 overflow-hidden rounded-[6px] bg-gray-100 sm:h-52.5 lg:h-55">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      )}

                      {/* IMAGE TEXT */}
                      <div className="absolute bottom-4 left-4 max-w-47.5">
                        <p className="text-[14px] font-medium leading-4.25 text-[#222] sm:text-[15px] lg:text-[16px]">
                          {item.title}
                        </p>

                        {item.discount && (
                          <span className="mt-2 inline-block rounded-[3px] bg-black px-2 py-1 text-[10px] font-medium text-white sm:text-[11px]">
                            {item.discount}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>

                  {/* DESCRIPTION */}
                  <div className="pt-3">
                    <p className="min-h-10.5 text-[13px] font-medium leading-4.5 text-[#222] sm:text-[14px] sm:leading-5 lg:text-[15px]">
                      {item.description}
                    </p>

                    <Link
                      href={`/akcii/${item.id}`}
                      className="mt-2 inline-block text-[11px] text-[#0071ce] hover:underline sm:text-[12px]"
                    >
                      Подробнее об акции
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="mt-10 flex flex-wrap items-center justify-center gap-1.5 pb-6">
              <button
                onClick={() => goTo(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex h-10 items-center gap-1 rounded border border-gray-200 px-4 text-[12px] hover:bg-gray-50 disabled:opacity-40"
              >
                ←<span className="hidden sm:inline">Назад</span>
              </button>

              {getPages(currentPage, totalPages).map((page, i) =>
                page === "..." ? (
                  <span key={`dots-${i}`} className="px-2 text-[12px]">
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => goTo(page)}
                    className={`h-10 min-w-10 rounded border text-[12px] ${
                      currentPage === page
                        ? "border-[#071522] bg-[#071522] text-white"
                        : "border-gray-200 bg-white text-[#333] hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() => goTo(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="flex h-10 items-center gap-1 rounded border border-gray-200 px-4 text-[12px] hover:bg-gray-50 disabled:opacity-40"
              >
                <span className="hidden sm:inline">Далее</span>→
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}