"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, X } from "lucide-react";

import CartDiscountProgress from "@/components/cart/CartDiscountProgress";
import CartItem from "@/components/cart/CartItem";
import LoadingState from "@/components/ui/LoadingState";
import { useCart } from "@/hooks/useCart";
import { formatPrice, pluralizeProducts } from "@/lib/utils";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

/** Header'dagi "Корзина" tugmasi ochadigan yon panel */
export default function CartDrawer({ isOpen, onClose }: Props) {
  const { entries, isLoading, totalCount, subtotal, discount, total } = useCart();

  // Esc bilan yopish va orqa fon scroll'ini to'xtatish
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const prevOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isEmpty = entries.length === 0 && !isLoading;
  const isFirstLoad = entries.length === 0 && isLoading;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="animate-in fade-in fixed inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        className="animate-in slide-in-from-right relative z-10 flex h-full w-full max-w-2xl flex-col overflow-hidden bg-white font-sans shadow-2xl duration-200"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-gray-100 p-4 md:p-6">
          <div className="flex items-center gap-3">
            <ShoppingBag className="size-6 text-[#0066cc]" aria-hidden />
            <h2
              id="cart-drawer-title"
              className="text-xl font-bold text-[#1e293b] md:text-2xl"
            >
              Корзина товаров
            </h2>
            {!isEmpty && (
              <span className="text-sm text-gray-400">
                {totalCount} {pluralizeProducts(totalCount)}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть корзину"
            className="cursor-pointer rounded-lg p-2 text-gray-400 transition-colors hover:text-gray-600"
          >
            <X className="size-6" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {isFirstLoad ? (
            <LoadingState className="h-full" />
          ) : isEmpty ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <ShoppingBag className="size-12 text-[#C3C8CF]" aria-hidden />
              <p className="mt-4 text-lg font-semibold text-[#303640]">
                Корзина пуста
              </p>
              <p className="mt-1 text-sm text-[#858C95]">
                Добавьте товары из каталога
              </p>
              <Link
                href="/catalog"
                onClick={onClose}
                className="mt-5 rounded-[7px] bg-[#1976E8] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#0F67D0]"
              >
                Перейти в каталог
              </Link>
            </div>
          ) : (
            <>
              <CartDiscountProgress subtotal={subtotal} discount={discount} />

              <ul className="mt-4">
                {entries.map((entry) => (
                  <CartItem
                    key={entry.product.id}
                    entry={entry}
                    onNavigate={onClose}
                  />
                ))}
              </ul>
            </>
          )}
        </div>

        {/* FOOTER */}
        {!isEmpty && !isFirstLoad && (
          <div className="border-t border-gray-100 bg-white p-4 md:p-6">
            {discount.amount > 0 && (
              <div className="mb-2 flex items-center justify-between text-sm text-gray-500">
                <span>Скидка {discount.percent}%</span>
                <span className="text-[#1AA36F]">
                  −{formatPrice(discount.amount)} ₽
                </span>
              </div>
            )}

            <div className="mb-4 flex items-center justify-between text-lg font-bold text-gray-900">
              <span>Итого:</span>
              <span className="text-2xl text-[#0066cc]">
                {formatPrice(total)} ₽
              </span>
            </div>

            <Link
              href="/cart"
              onClick={onClose}
              className="block w-full cursor-pointer rounded-xl bg-[#2563eb] py-4 text-center text-xs font-bold tracking-wider text-white uppercase shadow-md transition-colors hover:bg-blue-700"
            >
              Перейти в корзину
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
