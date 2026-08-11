"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function CartDiscountBanner() {
  const [showTooltip, setShowTooltip] = useState(false);

  // Misol uchun hozirgi savat summasi va keyingi chegirma chegaralari
  const currentTotal = 3567;
  const nextTier = 7000;
  const progressPercent = Math.min((currentTotal / nextTier) * 100, 100);
  const remainingForDiscount = nextTier - currentTotal;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-4 font-sans text-[#2c3e50]">
      {/* 1. Breadcrumbs (Non ushoqlari) */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:underline text-gray-600">
          Стройоптторг
        </Link>
        <span>/</span>
        <span className="text-gray-400">Корзина товаров</span>
      </nav>

      {/* 2. Sarlavha (Page Title) */}
      <h1 className="text-3xl sm:text-4xl font-bold text-[#1f2937] mb-6">
        Корзина товаров
      </h1>

      {/* 3. Chegirma va Progress Bar bloki */}
      <div className="relative border border-gray-200 rounded-xl p-5 bg-white shadow-sm">
        {/* Yuqori qism: Tekst va Progress line */}
        <div className="flex flex-col gap-2 mb-4">
          <div className="text-sm font-semibold text-gray-800">
            Ваша скидка от суммы заказа:{" "}
            <span className="text-[#0066cc]">0 ₽</span>
          </div>

          {/* Progress Bar va Narx ko'rsatkichlari */}
          <div className="relative pt-1">
            <div className="overflow-hidden h-2 mb-1 text-xs flex rounded-full bg-gray-100">
              <div
                style={{ width: `${progressPercent}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#2563eb] transition-all duration-300"
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 font-medium">
              <span>{currentTotal.toLocaleString()} ₽</span>
              <span>{nextTier.toLocaleString()} ₽</span>
            </div>
          </div>
        </div>

        {/* Pastki qism: Ma'lumot va Popup tugmasi */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100 text-sm">
          <div className="text-gray-700">
            Добавьте в корзину товаров на{" "}
            <span className="font-bold text-[#1e3a8a]">
              {remainingForDiscount.toLocaleString()} ₽
            </span>{" "}
            и получите скидку 7%
          </div>

          {/* Tooltip tugmasi */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowTooltip(!showTooltip)}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="px-4 py-2 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#2563eb] text-xs font-semibold rounded-lg transition-colors"
            >
              Информация о скидках от суммы корзины
            </button>

            {/* Popover / Tooltip (Rasmdagi xabar oynasi) */}
            {showTooltip && (
              <div className="absolute right-0 bottom-full mb-3 w-[340px] sm:w-[420px] bg-white border border-gray-100 shadow-2xl rounded-2xl p-5 z-50">
                <div className="text-[#2563eb] font-bold text-sm mb-3">
                  Сейчас у нас действуют следующие пороги:
                </div>
                <div className="flex items-center justify-between gap-2 text-xs font-medium text-gray-800">
                  <div className="flex items-center gap-1">
                    от <span className="font-bold">3 000₽</span>
                    <span className="bg-[#10b981] text-white text-[11px] px-1.5 py-0.5 rounded font-semibold">
                      -5%
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    от <span className="font-bold">7 000₽</span>
                    <span className="bg-[#f59e0b] text-white text-[11px] px-1.5 py-0.5 rounded font-semibold">
                      -10%
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    от <span className="font-bold">20 000₽</span>
                    <span className="bg-[#f43f5e] text-white text-[11px] px-1.5 py-0.5 rounded font-semibold">
                      -15%
                    </span>
                  </div>
                </div>

                {/* Popover strelkasi (Pastroqqa qaragan uch) */}
                <div className="absolute -bottom-2 right-12 w-4 h-4 bg-white border-b border-r border-gray-100 rotate-45"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}