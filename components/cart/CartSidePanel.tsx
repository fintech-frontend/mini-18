"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import { useCart } from "@/context/CartContext";

const formatPrice = (value: number) => `${value.toLocaleString("ru-RU")} ₽`;

export default function CartSidePanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { cartItems, updateQuantity, removeFromCart, clearCart, totalPrice, totalCount } =
    useCart();

  // Oyna ochiq paytda sahifa skroll bo'lmasin, Esc bilan yopilsin
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={onClose} />

      <aside className="relative z-10 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-lg font-bold text-gray-900">
            Корзина
            {totalCount > 0 && (
              <span className="ml-2 text-sm font-normal text-gray-400">
                {totalCount} шт.
              </span>
            )}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className="cursor-pointer p-1 text-gray-500 hover:text-gray-800"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
              <ShoppingCart size={30} className="text-blue-400" />
            </div>
            <p className="text-base font-semibold text-gray-700">Корзина пуста</p>
            <p className="text-sm text-gray-400">
              Добавьте товары, нажав кнопку «Купить»
            </p>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-gray-100 overflow-y-auto px-5">
              {cartItems.map((item) => (
                <li key={item.id} className="flex gap-3 py-4">
                  <Link
                    href={`/products/${item.slug ?? item.id}`}
                    onClick={onClose}
                    className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-50"
                  >
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-contain p-2"
                      sizes="80px"
                    />
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <Link
                      href={`/products/${item.slug ?? item.id}`}
                      onClick={onClose}
                      className="line-clamp-2 text-sm text-gray-800 hover:text-blue-600"
                    >
                      {item.title}
                    </Link>
                    <p className="mt-0.5 text-xs text-gray-400">Артикул: {item.article}</p>

                    <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                      <div className="flex items-center rounded-lg border border-gray-200">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label="Уменьшить"
                          className="flex h-8 w-8 cursor-pointer items-center justify-center text-gray-500 hover:text-blue-600"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm font-medium text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label="Увеличить"
                          className="flex h-8 w-8 cursor-pointer items-center justify-center text-gray-500 hover:text-blue-600"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <span className="whitespace-nowrap text-sm font-semibold text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                      </span>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        aria-label="Удалить"
                        className="cursor-pointer rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-gray-100 bg-gray-50 p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-gray-500">Итого:</span>
                <span className="text-xl font-bold text-gray-900">
                  {formatPrice(totalPrice)}
                </span>
              </div>
              <Link
                href="/checkout"
                onClick={onClose}
                className="mb-2 block w-full rounded-lg bg-[#2563EB] py-3 text-center text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-blue-700"
              >
                Оформить заказ
              </Link>
              <button
                type="button"
                onClick={clearCart}
                className="w-full cursor-pointer py-2 text-xs text-gray-500 hover:text-red-500"
              >
                Очистить корзину
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
