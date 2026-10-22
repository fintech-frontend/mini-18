"use client";

import Link from "next/link";
import { Newspaper } from "lucide-react";
import { useGetNewsQuery, type NewsItem } from "@/lib/api/newsApi";

/* «Последние новости» — oxirgi 4 ta yangilik API'dan (/api/news/).
   compact — bosh sahifa ko'rinishi, large — «О компании» sahifasi ko'rinishi */
export default function LatestNewsGrid({ variant = "compact" }: { variant?: "compact" | "large" }) {
  const { data, isLoading, isError } = useGetNewsQuery({ page_size: 4 });
  const items = data?.items ?? [];
  const large = variant === "large";

  return (
    <>
      <div
        className={
          large
            ? "mb-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"
            : "mb-4 flex items-center justify-between sm:mb-6"
        }
      >
        <h2 className={large ? "text-3xl font-bold text-[#2F3640] sm:text-4xl lg:text-[42px]" : "text-xl font-semibold text-gray-900 sm:text-2xl"}>
          Последние новости
        </h2>
        <Link
          href="/news"
          className={
            large
              ? "w-fit rounded-md bg-[#F5F8FD] px-6 py-3 text-sm font-medium text-[#1D73E8] transition hover:bg-[#EAF2FF]"
              : "text-sm font-medium text-blue-600 hover:underline"
          }
        >
          Больше новостей
        </Link>
      </div>

      {isLoading ? (
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 ${large ? "gap-8" : "gap-4"}`}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className={`${large ? "h-56" : "h-40"} rounded-xl bg-gray-100`} />
              <div className="mt-4 h-4 w-3/4 rounded bg-gray-100" />
              <div className="mt-2 h-3 w-1/2 rounded bg-gray-100" />
            </div>
          ))}
        </div>
      ) : isError || items.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-dashed border-gray-200 bg-gray-50/50 px-6 py-10 text-center">
          <Newspaper size={32} className="mb-3 text-gray-300" />
          <p className="text-sm text-gray-500">{isError ? "Не удалось загрузить новости." : "Новостей пока нет."}</p>
        </div>
      ) : (
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 ${large ? "gap-8" : "gap-4"}`}>
          {items.map((item) => (large ? <LargeCard key={item.id} item={item} /> : <CompactCard key={item.id} item={item} />))}
        </div>
      )}
    </>
  );
}

function NewsImage({ item, className }: { item: NewsItem; className: string }) {
  return item.image ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={item.image} alt={item.title} className={className} />
  ) : (
    <div className={`${className} flex items-center justify-center bg-gray-100`}>
      <Newspaper size={36} className="text-gray-300" />
    </div>
  );
}

function CompactCard({ item }: { item: NewsItem }) {
  return (
    <Link href={`/news/${item.id}`} className="group flex flex-col overflow-hidden rounded-xl border border-gray-100">
      <div className="relative h-36 overflow-hidden bg-gray-100 sm:h-40">
        <NewsImage item={item} className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105" />
      </div>
      <div className="flex flex-1 flex-col p-3">
        <h3 className="mb-2 line-clamp-2 text-sm font-medium text-gray-900">{item.title}</h3>
        <p className="mb-3 line-clamp-2 flex-1 text-xs text-gray-500">{item.excerpt}</p>
        <span className="text-xs text-gray-400">{item.date}</span>
      </div>
    </Link>
  );
}

function LargeCard({ item }: { item: NewsItem }) {
  return (
    <Link href={`/news/${item.id}`} className="group block">
      <div className="overflow-hidden rounded-xl">
        <NewsImage item={item} className="h-55 w-full rounded-xl object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <h3 className="mt-5 line-clamp-2 text-lg font-semibold leading-7 text-[#2F3640] transition group-hover:text-[#1D73E8] sm:text-[22px]">
        {item.title}
      </h3>
      <p className="mt-4 line-clamp-3 text-sm leading-7 text-[#7B8794] sm:text-[15px]">{item.excerpt}</p>
      <p className="mt-4 text-sm text-[#9CA3AF]">{item.date}</p>
    </Link>
  );
}
