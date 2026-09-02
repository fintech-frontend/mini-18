"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { actions } from "./actions-data";
import { styles } from "@/styles/index.styles";

export default function AKciiPage() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <main className="w-full">
      {/* ASOSIY CONTAINER */}
      <div className={styles.container}>
        <section className="w-full py-4 sm:py-6 lg:py-8">

          {/* TITLE */}
          <h1 className="mb-6 text-[30px] font-bold text-[#333] sm:text-[34px] lg:text-[38px]">
            Акции
          </h1>

          {/* CARDS */}
          <div className="grid grid-cols-1 gap-x-5 gap-y-7 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-7 lg:gap-y-8">
            {actions.map((item) => (
              <article
                key={item.id}
                className="group min-w-0"
              >
                {/* IMAGE */}
                <Link
                  href={`/akcii/${item.id}`}
                  className="block"
                >
                  <div className="relative h-45 overflow-hidden rounded-[6px] sm:h-52.5 lg:h-55">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* IMAGE TEXT */}
                    <div className="absolute bottom-4 left-4 max-w-47.5">
                      <p className="text-[14px] font-medium leading-4.25 text-[#222] sm:text-[15px] lg:text-[16px]">
                        {item.title}
                      </p>

                      <span className="mt-2 inline-block rounded-[3px] bg-black px-2 py-1 text-[10px] font-medium text-white sm:text-[11px]">
                        {item.discount}
                      </span>
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

          {/* PAGINATION */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-1.5 pb-6">

            {/* BACK */}
            <button
              onClick={() =>
                setCurrentPage((page) => Math.max(1, page - 1))
              }
              disabled={currentPage === 1}
              className="flex h-10 items-center gap-1 rounded border border-gray-200 px-4 text-[12px] hover:bg-gray-50 disabled:opacity-40"
            >
              ←
              <span className="hidden sm:inline">
                Назад
              </span>
            </button>

            {/* PAGES */}
            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`h-10 min-w-10 rounded border text-[12px] ${
                  currentPage === page
                    ? "border-[#071522] bg-[#071522] text-white"
                    : "border-gray-200 bg-white text-[#333] hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}

            {/* DOTS */}
            <span className="px-2 text-[12px]">
              ...
            </span>

            {/* LAST PAGE */}
            <button
              onClick={() => setCurrentPage(231)}
              className={`hidden h-10 min-w-10 rounded border text-[12px] sm:block ${
                currentPage === 231
                  ? "border-[#071522] bg-[#071522] text-white"
                  : "border-gray-200 bg-white"
              }`}
            >
              231
            </button>

            {/* NEXT */}
            <button
              onClick={() =>
                setCurrentPage((page) => Math.min(231, page + 1))
              }
              disabled={currentPage === 231}
              className="flex h-10 items-center gap-1 rounded border border-gray-200 px-4 text-[12px] hover:bg-gray-50 disabled:opacity-40"
            >
              <span className="hidden sm:inline">
                Далее
              </span>
              →
            </button>

          </div>
        </section>
      </div>
    </main>
  );
}