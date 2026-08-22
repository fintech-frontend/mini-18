"use client";

import React, { useState } from "react";
import Link from "next/link";
import { styles } from "@/styles/index.styles";
import Pagination from "./pagination/Pagination";
import { reviewsData } from "@/data/reviewsData";

const ITEMS_PER_PAGE = 5; // Har bir sahifada nechta sharh ko'rinishi

export default function ReviewsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"new" | "old">("new");

  // Sanani formatlash
  const parseDate = (dateString: string) => {
    const [day, month, year] = dateString.split(".");
    return new Date(Number(year), Number(month) - 1, Number(day)).getTime();
  };

  // 1. Saralash (Sort)
  const sortedReviews = [...reviewsData].sort((a, b) => {
    const dateA = parseDate(a.date);
    const dateB = parseDate(b.date);

    return sortOrder === "new" ? dateB - dateA : dateA - dateB;
  });

  // 2. Sahifalash (Pagination)
  const totalPages = Math.ceil(sortedReviews.length / ITEMS_PER_PAGE);
  const paginatedReviews = sortedReviews.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // Filter o'zgarganda 1-sahifaga qaytarish
  const handleSortChange = (order: "new" | "old") => {
    setSortOrder(order);
    setCurrentPage(1);
  };

  return (
    <section className={`${styles.container} py-6 font-sans text-[#2C333D]`}>
      {/* Breadcrumb */}
      <nav className="mb-6 md:mb-8 text-[13px] md:text-[15px]">
        <Link href="/" className="hover:text-[#186FD4] transition-colors">
          Стройоптторг
        </Link>{" "}
        <span className="text-[#91969D] mx-1">/</span>{" "}
        <span className="text-[#91969D]">Отзывы</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Asosiy kontent qismi (Chap tomon) */}
        <div className="w-full lg:w-3/4 flex flex-col">
          <h1 className="text-[30px] md:text-[48px] font-bold leading-tight mb-5">
            Отзывы
          </h1>

          {/* Filter tugmalari */}
          <div className="flex gap-2 mb-8 border-b border-gray-200 pb-4">
            <button
              onClick={() => handleSortChange("new")}
              className={`px-4 py-2 rounded-md text-[14px] font-medium transition-colors ${
                sortOrder === "new"
                  ? "bg-[#EAF2FC] text-[#186FD4]"
                  : "text-[#555B63] hover:bg-gray-100"
              }`}
            >
              Сначала новые
            </button>
            <button
              onClick={() => handleSortChange("old")}
              className={`px-4 py-2 rounded-md text-[14px] font-medium transition-colors ${
                sortOrder === "old"
                  ? "bg-[#EAF2FC] text-[#186FD4]"
                  : "text-[#555B63] hover:bg-gray-100"
              }`}
            >
              Сначала старые
            </button>
          </div>

          {/* Sharhlar ro'yxati (paginatedReviews ishlatiladi) */}
          <div className="flex flex-col gap-3.75 md:gap-7.5 ">
            {paginatedReviews.map((review) => (
              <article
                key={review.id}
                className="bg-white border border-[#EDF0F2] rounded-[8px] p-[25px] flex flex-col gap-[10px]"
              >
                <div className="flex flex-col">
                  <span className="font-medium text-[19px]">{review.name}</span>
                  <span className="text-[#60656C] text-[15px] mt-1">
                    {review.date}
                  </span>
                </div>

                <p className="text-[16px] text-[#2C333D] leading-relaxed">
                  {review.text}
                </p>

                {review.images && (
                  <div className="flex gap-2.5 mt-2.5 overflow-x-auto pb-1">
                    {review.images.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`Фото от ${review.name}`}
                        className="w-[133px] h-[75px] md:w-[197px] md:h-[111px] object-cover shrink-0"
                      />
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>

          {/* Claude yozib bergan dinamik Pagination komponenti */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          )}

          {/* Fikr qoldirish formasi */}
          <div className="bg-white rounded-lg pt-6 md:pt-10">
            <h2 className="text-[24px] md:text-[30px] font-bold mb-8">
              Оставить отзыв
            </h2>

            <form className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="text-[14px] text-[#555B63] mb-2">
                    Ваше имя *
                  </label>
                  <input
                    type="text"
                    placeholder="Введите ваше имя"
                    className="w-full border border-[#E5E7EB] rounded-md px-4 py-3.5 outline-none focus:border-[#186FD4] transition-colors text-[15px]"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-[14px] text-[#555B63] mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    placeholder="Введите ваш электронный адрес"
                    className="w-full border border-[#E5E7EB] rounded-md px-4 py-3.5 outline-none focus:border-[#186FD4] transition-colors text-[15px]"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-[14px] text-[#555B63] mb-2">
                  Текст отзыва *
                </label>
                <textarea
                  placeholder="Ваш отзыв"
                  rows={5}
                  className="w-full border border-[#E5E7EB] rounded-md px-4 py-3.5 outline-none focus:border-[#186FD4] transition-colors text-[15px] resize-none"
                ></textarea>
              </div>

              <div className="flex flex-col">
                <label className="text-[14px] text-[#555B63] mb-2">
                  Прикрепить фото
                </label>
                <div className="border border-dashed border-[#CBD5E1] rounded-md p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors">
                  <svg
                    className="w-8 h-8 text-[#91969D] mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                  <span className="text-[#91969D] text-[14px]">
                    Нажмите для загрузки или перетащите файл в это поле
                  </span>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mt-4">
                <button
                  type="button"
                  className="w-full md:w-[220px] bg-[#186FD4] text-white font-bold py-4 rounded-md text-[15px] hover:bg-[#0f54a3] transition-colors text-center"
                >
                  ОТПРАВИТЬ
                </button>
                <label className="flex items-start gap-3 cursor-pointer select-none max-w-sm">
                  <input
                    type="checkbox"
                    className="mt-1 w-6.5 h-6.5 rounded border-gray-300 text-[#186FD4] focus:ring-[#186FD4]"
                  />
                  <span className="text-[#91969D] text-[13px] leading-snug">
                    Согласен с обработкой персональных данных в соответствии с
                    политикой конфиденциальности
                  </span>
                </label>
              </div>
            </form>
          </div>
        </div>

        {/* O'ng tomon (Sidebar / Banners / Obuna) */}
        {/* O'ng tomon (Sidebar / Banners / Obuna) */}
        <div className="w-full lg:w-[331px] shrink-0 flex flex-col gap-[20px] lg:gap-[30px] mt-10 lg:mt-0">
          {/* Promo bannerlar konteyneri (Tabletda yonma-yon, Desktop va Mobile-da ustma-ust) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-[20px] lg:gap-[30px]">
            {/* Promo rasm 1 */}
            <div className="relative rounded-lg overflow-hidden h-[273px] bg-[#F4F1ED]">
              <img
                src={"/images/reviews/rectangle-32.png"}
                alt="Все для отопления"
                className="absolute inset-0 w-full h-full object-cover mix-blend-multiply"
              />
              <div className="absolute inset-0 p-5 lg:p-6 flex flex-col justify-center items-start gap-3 z-10">
                <h3 className="text-[22px] font-medium leading-tight max-w-[150px] text-[#2C333D]">
                  Все для <br /> отопления
                </h3>
                <span className="bg-[#011120] text-white text-[13px] lg:text-[14px] font-bold px-2.5 py-1.5 rounded-md">
                  до -30%
                </span>
              </div>
            </div>

            {/* Promo rasm 2 */}
            <div className="relative rounded-lg overflow-hidden h-[273px] bg-[#E8EDF2]">
              <img
                src={"/images/reviews/rectangle-31.png"}
                alt="Лакокрасочные материалы"
                className="absolute inset-0 w-full h-full object-cover mix-blend-multiply"
              />
              <div className="absolute inset-0 p-5 lg:p-6 flex flex-col justify-center items-start gap-3 z-10">
                <h3 className="text-[22px] font-medium leading-tight max-w-[180px] text-[#2C333D]">
                  Лакокрасочные материалы
                </h3>
                <span className="bg-[#011120] text-white text-[13px] lg:text-[14px] font-bold px-2.5 py-1.5 rounded-md">
                  до -30%
                </span>
              </div>
            </div>
          </div>

          {/* Obuna bloki */}
          <div className="w-full bg-[#F9FAFB] rounded-lg px-3.75 py-5 md:py-7.5 md:px-6.25 flex flex-col items-center text-center border border-gray-100">
            <h3 className="text-[18px] font-medium mb-2 text-[#2C333D]">
              Подпишитесь на рассылку
            </h3>
            <p className="text-[#6A6F75] text-[14px] mb-6 max-w-[360px] lg:max-w-none">
              Регулярные скидки и спецпредложения, а так же новости компании.
            </p>

            {/* Form: Mobile/Desktop-da ustma-ust, Tablet (768px)-da yonma-yon */}
            <div className="w-full flex flex-col md:flex-row lg:flex-col gap-3">
              <input
                type="email"
                placeholder="Email"
                className="w-full border border-[#E5E7EB] rounded-md px-4 py-3 outline-none focus:border-[#186FD4] text-[14px] bg-white"
              />
              <button className="w-full md:w-auto lg:w-full whitespace-nowrap bg-[#186FD4] text-white font-bold px-6 py-3 rounded-md text-[14px] hover:bg-[#0f54a3] transition-colors">
                ПОДПИСАТЬСЯ
              </button>
            </div>

            <label className="flex items-start gap-2 mt-4 cursor-pointer text-left w-full">
              <input
                type="checkbox"
                className="mt-0.5 min-w-4 w-6.5 h-6.5 rounded border-gray-300 accent-[#186FD4]"
              />
              <span className="text-[#91969D] text-[11px] leading-tight">
                Согласен с обработкой персональных данных в соответствии с{" "}
                <a href="#" className="underline hover:text-[#186FD4]">
                  политикой конфиденциальности
                </a>
              </span>
            </label>
          </div>
        </div>
      </div>
    </section>
  );
}
