"use client";

import React, { useState } from "react";
import { X, ShoppingBag } from "lucide-react";

interface CartDiscountBannerProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function CartDiscountBanner({
  isOpen: initialOpen = false,
  onClose,
}: CartDiscountBannerProps) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [showTooltip, setShowTooltip] = useState(true);

  const currentAmount = 3567;
  const targetAmount = 7000;
  const neededAmount = targetAmount - currentAmount;
  const progressPercent = (currentAmount / targetAmount) * 100;

  const handleClose = () => {
    setIsOpen(true);
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40"
        onClick={handleClose}
      />

      {/* Drawer */}
      <aside className="relative z-10 flex h-full w-full max-w-2xl flex-col overflow-hidden bg-white font-sans shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 p-6">
          <div className="flex items-center gap-3">
            <ShoppingBag className="h-6 w-6 text-[#0066cc]" />

            <h2 className="text-2xl font-bold text-[#1e293b]">
              Корзина товаров
            </h2>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="cursor-pointer rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* Discount Banner */}
          <div className="relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            {/* Title */}
            <div className="mb-3 text-base font-bold text-gray-900">
              Ваша скидка от суммы заказа:{" "}
              <span className="text-[#0066cc]">
                0 ₽
              </span>
            </div>

            {/* Progress */}
            <div className="mb-4">
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-2.5 rounded-full bg-[#0066cc] transition-all duration-300"
                  style={{
                    width: `${progressPercent}%`,
                  }}
                />
              </div>

              <div className="mt-1.5 flex items-center justify-between text-xs font-medium text-gray-400">
                <span>
                  {currentAmount.toLocaleString("ru-RU")} ₽
                </span>

                <span>
                  {targetAmount.toLocaleString("ru-RU")} ₽
                </span>
              </div>
            </div>

            {/* Text + Tooltip */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">

              <div className="text-sm text-gray-700">
                Добавьте в корзину товаров на{" "}
                <span className="font-bold text-[#0066cc]">
                  {neededAmount.toLocaleString("ru-RU")} ₽
                </span>{" "}
                и получите скидку 7%
              </div>

              {/* Tooltip */}
              <div className="relative">

                {showTooltip && (
                  <div className="absolute bottom-full left-1/2 z-30 mb-3 w-90 -translate-x-1/2 rounded-2xl border border-gray-100 bg-white p-4 shadow-2xl">

                    <div className="mb-3 text-sm font-bold text-[#0066cc]">
                      Сейчас у нас действуют следующие пороги:
                    </div>

                    <div className="flex items-center justify-between gap-2 text-xs font-semibold text-gray-800">

                      {/* 3000 */}
                      <div className="flex items-center gap-1.5">
                        <span>
                          от{" "}
                          <strong>
                            3 000 ₽
                          </strong>
                        </span>

                        <span className="rounded-md bg-[#10b981] px-2 py-0.5 text-[11px] font-bold text-white">
                          -5%
                        </span>
                      </div>

                      {/* 7000 */}
                      <div className="flex items-center gap-1.5">
                        <span>
                          от{" "}
                          <strong>
                            7 000 ₽
                          </strong>
                        </span>

                        <span className="rounded-md bg-[#f59e0b] px-2 py-0.5 text-[11px] font-bold text-white">
                          -10%
                        </span>
                      </div>

                      {/* 20000 */}
                      <div className="flex items-center gap-1.5">
                        <span>
                          от{" "}
                          <strong>
                            20 000 ₽
                          </strong>
                        </span>

                        <span className="rounded-md bg-[#e11d48] px-2 py-0.5 text-[11px] font-bold text-white">
                          -15%
                        </span>
                      </div>

                    </div>

                    {/* Arrow */}
                    <div className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-b border-r border-gray-100 bg-white" />
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setShowTooltip(!showTooltip)}
                  className="cursor-pointer rounded-xl bg-[#f1f5f9] px-4 py-2 text-xs font-semibold text-[#0066cc] transition hover:bg-[#e2e8f0]"
                >
                  Информация о скидках от суммы корзины
                </button>

              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 bg-white p-6">

          <div className="mb-4 flex items-center justify-between text-lg font-bold text-gray-900">
            <span>
              Итого:
            </span>

            <span className="text-2xl text-[#0066cc]">
              3 567 ₽
            </span>
          </div>

          <button
            type="button"
            className="w-full cursor-pointer rounded-xl bg-[#2563eb] py-4 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-blue-700"
          >
            ПЕРЕЙТИ В КОРЗИНУ
          </button>

        </div>
      </aside>
    </div>
  );
}