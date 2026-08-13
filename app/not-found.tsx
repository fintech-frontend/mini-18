"use client";

import Link from "next/link";
import { styles } from "@/styles/index.styles"; // Agar loyihangizda bo'lsa, moslab olasiz

export default function NotFoundPage() {
  return (
    <section className={`${styles.container || "max-w-[1600px] mx-auto"} py-6`}>
      {/* Navigatsiya (Breadcrumb) */}
      <nav className="mb-8 md:mb-9.5 text-[13px] md:text-[15px]">
        <Link
          href="/"
          className="hover:text-blue-600 transition-colors text-[#2C333D]"
        >
          Стройоптторг
        </Link>{" "}
        / <span className="text-[#91969D]">Страница не найдена</span>
      </nav>

      {/* Sarlavha: Mobilda o'rtada (text-center), planshet va desktopda chapda (sm:text-left) */}
      <h1 className="text-[30px] md:text-[48px] text-center sm:text-left font-bold text-[#2C333D] leading-tight">
        Страница не найдена
      </h1>

      {/* Markaziy kontent bloki */}
      <div className="flex flex-col items-center justify-center text-center pt-10 pb-20 sm:pt-15 md:py-27.5">
        {/* 404 raqami va offset(soya) elementlari */}
        {/* relative inline-flex orqali fon aynan matnga nisbatan joylashadi */}
        <div className="relative inline-flex items-center justify-center select-none mb-16.5 sm:mb-12.5 md:mb-19">
          {/* Figmadagi orqa fondagi och ko'k 404 (Soya vazifasida) */}
          <span className="absolute top-2 left-3 md:top-4 md:left-6 text-[180px] sm:text-[220px] md:text-[260px] font-bold text-[#DCECFE] tracking-wider leading-none -z-10">
            404
          </span>

          {/* Katta ko'k 404 raqami (Asosiy) */}
          <span className="relative text-[180px] sm:text-[220px] md:text-[260px] font-bold text-[#186FD4] tracking-wider leading-none">
            404
          </span>
        </div>

        {/* Izoh matni */}
        <p className="w-82.5 sm:w-179.5 lg:w-181.75 max-w-full text-[16px] md:text-[18px] text-[#555B63] leading-relaxed mx-auto mb-13.75 sm:mb-10 md:mb-13.75">
          Запрашиваемая страница не найдена. Возможно она была удалена, либо её
          адрес был изменен. Попробуйте воспользоваться поиском.
        </p>

        {/* Tugmalar guruhi */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-3.75 w-full">
          {/* Ortga qaytish tugmasi */}
          <button
            onClick={() => window.history.back()}
            className="w-full h-16 min-w-45 sm:w-72.5 md:w-54.75 rounded-lg text-[14px] font-bold text-[#186FD4] bg-[#F6F8FB] hover:bg-blue-50 transition-colors cursor-pointer text-center"
          >
            Вернуться назад
          </button>

          {/* Asosiy sahifaga o'tish tugmasi */}
          <Link
            href="/"
            className="w-full h-16 min-w-45 sm:w-72.5 md:w-54.75 rounded-lg bg-[#186FD4] text-[14px] font-bold text-white hover:bg-blue-700 transition-colors shadow-sm text-center flex items-center justify-center"
          >
            НА ГЛАВНУЮ
          </Link>
        </div>
      </div>
    </section>
  );
}
