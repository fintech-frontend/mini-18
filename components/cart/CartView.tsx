"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import CartDiscountProgress from "@/components/cart/CartDiscountProgress";
import CartItem from "@/components/cart/CartItem";
import EmptyState from "@/components/ui/EmptyState";
import LoadingState from "@/components/ui/LoadingState";
import { useCart } from "@/hooks/useCart";
import { formatPrice, pluralizeProducts } from "@/lib/utils";

/** /cart sahifasining mazmuni: mahsulotlar ro'yxati va "Итого" bloki */
export default function CartView() {
  const { entries, isLoading, totalCount, subtotal, discount, total, clearCart } =
    useCart();

  if (entries.length === 0 && isLoading) return <LoadingState />;

  if (entries.length === 0) {
    return (
      <EmptyState
        icon={ShoppingCart}
        title="Корзина пуста"
        description="Добавьте товары из каталога — они появятся здесь."
      />
    );
  }

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8 xl:grid-cols-[minmax(0,1fr)_400px]">
      <section aria-label="Товары в корзине" className="min-w-0">
        <div className="flex items-center justify-between border-b border-[#ECEEF1] pb-3">
          <p className="text-[14px] text-[#858C95]">
            {totalCount} {pluralizeProducts(totalCount)}
          </p>
          <button
            type="button"
            onClick={clearCart}
            className="text-[14px] font-medium text-[#858C95] transition-colors hover:text-[#D93829]"
          >
            Очистить корзину
          </button>
        </div>

        <ul>
          {entries.map((entry) => (
            <CartItem key={entry.product.id} entry={entry} />
          ))}
        </ul>

        <div className="mt-6">
          <CartDiscountProgress subtotal={subtotal} discount={discount} />
        </div>
      </section>

      <aside
        aria-label="Итого"
        className="rounded-xl border border-[#E5E8EC] bg-[#F8F9FA] p-5 md:p-6 lg:sticky lg:top-[180px]"
      >
        <h2 className="text-[20px] font-bold text-[#303640]">Ваш заказ</h2>

        <dl className="mt-5 flex flex-col gap-3 text-[15px]">
          <div className="flex justify-between gap-4">
            <dt className="text-[#737A84]">
              Товары ({totalCount})
            </dt>
            <dd className="font-medium text-[#303640]">
              {formatPrice(subtotal)} ₽
            </dd>
          </div>

          <div className="flex justify-between gap-4">
            <dt className="text-[#737A84]">
              Скидка{discount.percent > 0 && ` ${discount.percent}%`}
            </dt>
            <dd className="font-medium text-[#1AA36F]">
              {discount.amount > 0 ? `−${formatPrice(discount.amount)} ₽` : "—"}
            </dd>
          </div>

          <div className="mt-2 flex items-baseline justify-between gap-4 border-t border-[#E5E8EC] pt-4">
            <dt className="text-[17px] font-bold text-[#303640]">Итого</dt>
            <dd className="text-[26px] font-bold text-[#1267C6]">
              {formatPrice(total)} ₽
            </dd>
          </div>
        </dl>

        <Link
          href="/checkout"
          className="mt-6 flex h-12 w-full items-center justify-center rounded-[7px] bg-[#1976E8] text-[14px] font-bold tracking-wide text-white uppercase transition-colors hover:bg-[#0F67D0]"
        >
          Оформить заказ
        </Link>
        <Link
          href="/catalog"
          className="mt-3 flex h-11 w-full items-center justify-center rounded-[7px] border border-[#DCE0E5] text-[14px] font-medium text-[#303640] transition-colors hover:bg-white"
        >
          Продолжить покупки
        </Link>
      </aside>
    </div>
  );
}
