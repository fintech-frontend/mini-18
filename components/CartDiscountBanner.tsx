"use client";

import React, { useState } from "react";
import { X, ShoppingBag } from "lucide-react";

interface CartDiscountBannerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDiscountBanner({ isOpen, onClose }: CartDiscountBannerProps) {
  const [showTooltip, setShowTooltip] = useState(true); // Standart holatda ochiq (1-rasm kabi)

  const currentAmount = 3567;
  const targetAmount = 7000;
  const neededAmount = targetAmount - currentAmount; // 3 433 ₽
  const progressPercent = (currentAmount / targetAmount) * 100;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Background Overlay */}
      <div
        className="fixed inset-0 bg-black/40 transition-opacity"
        onClick={onClose}
      />

      {/* Side Drawer */}
      <aside className="relative w-full max-w-2xl bg-white z-10 flex flex-col h-full shadow-2xl font-sans overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-[#0066cc]" />
            <h2 className="text-2xl font-bold text-[#1e293b]">Корзина товаров</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* ================= 1-RASMDEGI CHEGIRMA BANNERI ================= */}
          <div className="relative border border-gray-200 rounded-2xl p-6 bg-white shadow-xs">
            
            {/* 1. Sarlavha va Chegirma summasi */}
            <div className="text-base font-bold text-gray-900 mb-3">
              Ваша скидка от суммы заказа: <span className="text-[#0066cc]">0 ₽</span>
            </div>

            {/* 2. Progress Bar */}
            <div className="mb-4">
              <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-[#0066cc] h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-xs text-gray-400 font-medium mt-1.5">
                <span>3 567 ₽</span>
                <span>7 000 ₽</span>
              </div>
            </div>

            {/* 3. Matn va Tooltip Tugmasi */}
            <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
              <div className="text-sm text-gray-700">
                Добавьте в корзину товаров на{" "}
                <span className="font-bold text-[#0066cc]">3 433 ₽</span>{" "}
                и получите скидку 7%
              </div>

              {/* Tooltip Tugmasi va Popover */}
              <div className="relative">
                
                {/* 1-RASMDEGI POPOVER / TOOLTIP */}
                {showTooltip && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-[360px] bg-white rounded-2xl p-4 shadow-2xl border border-gray-100 z-30 animate-in fade-in zoom-in-95">
                    
                    {/* Sarlavha */}
                    <div className="text-[#0066cc] font-bold text-sm mb-3">
                      Сейчас у нас действуют следующие пороги:
                    </div>

                    {/* Poroglar ro'yxati */}
                    <div className="flex items-center justify-between gap-2 text-xs font-semibold text-gray-800">
                      
                      {/* 3 000 P -5% */}
                      <div className="flex items-center gap-1.5">
                        <span>от <strong className="font-bold">3 000P</strong></span>
                        <span className="bg-[#10b981] text-white text-[11px] px-2 py-0.5 rounded-md font-bold">
                          -5%
                        </span>
                      </div>

                      {/* 7 000 P -10% */}
                      <div className="flex items-center gap-1.5">
                        <span>от <strong className="font-bold">7 000P</strong></span>
                        <span className="bg-[#f59e0b] text-white text-[11px] px-2 py-0.5 rounded-md font-bold">
                          -10%
                        </span>
                      </div>

                      {/* 20 000 P -15% */}
                      <div className="flex items-center gap-1.5">
                        <span>от <strong className="font-bold">20 000P</strong></span>
                        <span className="bg-[#e11d48] text-white text-[11px] px-2 py-0.5 rounded-md font-bold">
                          -15%
                        </span>
                      </div>

                    </div>

                    {/* Pastga qaragan strelka (Arrow) */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b border-r border-gray-100 rotate-45" />
                  </div>
                )}

                {/* Tugma */}
                <button
                  type="button"
                  onClick={() => setShowTooltip(!showTooltip)}
                  className="px-4 py-2 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#0066cc] text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Информация о скидках от суммы корзины
                </button>
              </div>

            </div>
          </div>
          {/* ============================================================= */}

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-white">
          <div className="flex justify-between items-center mb-4 text-lg font-bold text-gray-900">
            <span>Итого:</span>
            <span className="text-2xl text-[#0066cc]">3 567 ₽</span>
          </div>

          <button
            type="button"
            className="w-full bg-[#2563eb] hover:bg-blue-700 text-white font-bold py-4 rounded-xl text-xs uppercase tracking-wider transition-colors shadow-md cursor-pointer"
          >
            ПЕРЕЙТИ В КОРЗИНУ
          </button>
        </div>

      </aside>
    </div>
  );
}