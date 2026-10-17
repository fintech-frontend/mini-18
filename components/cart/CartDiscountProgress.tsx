"use client";

import { useState } from "react";

import { DISCOUNT_TIERS } from "@/lib/cartDiscount";
import { formatPrice } from "@/lib/utils";
import type { CartDiscount } from "@/types/shopTypes";

type Props = {
  subtotal: number;
  discount: CartDiscount;
};

/** Pog'ona belgilarining ranglari (DISCOUNT_TIERS tartibida) */
const TIER_COLORS = ["bg-[#10b981]", "bg-[#f59e0b]", "bg-[#e11d48]"];

/** "Ваша скидка от суммы заказа" — progress bar va pog'onalar haqida tooltip */
export default function CartDiscountProgress({ subtotal, discount }: Props) {
  const [showTiers, setShowTiers] = useState(false);

  const maxTier = DISCOUNT_TIERS[DISCOUNT_TIERS.length - 1];
  const target = discount.nextTier?.from ?? maxTier.from;
  const progress = Math.min(100, (subtotal / target) * 100);

  return (
    <div className="relative rounded-2xl border border-gray-200 bg-white p-4 shadow-xs md:p-6">
      <p className="mb-3 text-base font-bold text-gray-900">
        Ваша скидка от суммы заказа:{" "}
        <span className="text-[#0066cc]">
          {formatPrice(discount.amount)} ₽
          {discount.percent > 0 && ` (−${discount.percent}%)`}
        </span>
      </p>

      <div className="mb-4">
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={target}
          aria-valuenow={Math.min(subtotal, target)}
          aria-label="Прогресс до следующей скидки"
          className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100"
        >
          <div
            className="h-2.5 rounded-full bg-[#0066cc] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-1.5 flex items-center justify-between text-xs font-medium text-gray-400">
          <span>{formatPrice(subtotal)} ₽</span>
          <span>
            {discount.nextTier
              ? `${formatPrice(target)} ₽`
              : `от ${formatPrice(target)} ₽ — −${maxTier.percent}%`}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <p className="text-sm text-gray-700">
          {discount.nextTier ? (
            <>
              Добавьте в корзину товаров на{" "}
              <span className="font-bold text-[#0066cc]">
                {formatPrice(discount.amountToNextTier)} ₽
              </span>{" "}
              и получите скидку {discount.nextTier.percent}%
            </>
          ) : (
            <>Вы получили максимальную скидку {discount.percent}%</>
          )}
        </p>

        <div className="relative">
          {showTiers && (
            <div className="animate-in fade-in zoom-in-95 absolute right-0 bottom-full z-30 mb-3 w-[min(360px,calc(100vw-48px))] rounded-2xl border border-gray-100 bg-white p-4 shadow-2xl md:right-auto md:left-1/2 md:-translate-x-1/2">
              <p className="mb-3 text-sm font-bold text-[#0066cc]">
                Сейчас у нас действуют следующие пороги:
              </p>

              <ul className="flex flex-wrap items-center justify-between gap-x-2 gap-y-2 text-xs font-semibold text-gray-800">
                {DISCOUNT_TIERS.map((tier, index) => (
                  <li key={tier.from} className="flex items-center gap-1.5">
                    <span>
                      от <strong>{formatPrice(tier.from)} ₽</strong>
                    </span>
                    <span
                      className={`${TIER_COLORS[index] ?? "bg-[#0066cc]"} rounded-md px-2 py-0.5 text-[11px] font-bold text-white`}
                    >
                      −{tier.percent}%
                    </span>
                  </li>
                ))}
              </ul>

              <span className="absolute right-10 -bottom-2 size-4 rotate-45 border-r border-b border-gray-100 bg-white md:right-auto md:left-1/2 md:-translate-x-1/2" />
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowTiers((prev) => !prev)}
            aria-expanded={showTiers}
            className="cursor-pointer rounded-xl bg-[#f1f5f9] px-4 py-2 text-xs font-semibold text-[#0066cc] transition-colors hover:bg-[#e2e8f0]"
          >
            Информация о скидках от суммы корзины
          </button>
        </div>
      </div>
    </div>
  );
}
