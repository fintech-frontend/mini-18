"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

import { useProductsByIds } from "@/hooks/useProductsByIds";
import { getCartDiscount } from "@/lib/cartDiscount";
import { createPersistentStore } from "@/lib/store/persistentStore";
import type { CartEntry, CartLine } from "@/types/shopTypes";

export const MAX_QUANTITY = 999;

const clampQuantity = (quantity: number) =>
  Math.min(MAX_QUANTITY, Math.max(1, Math.floor(quantity)));

function parseCart(raw: unknown): CartLine[] | null {
  if (!Array.isArray(raw)) return null;

  return raw.flatMap((line) => {
    const { id, quantity } = (line ?? {}) as Partial<CartLine>;
    if (!Number.isInteger(id) || typeof quantity !== "number") return [];
    return [{ id: id as number, quantity: clampQuantity(quantity) }];
  });
}

const cartStore = createPersistentStore<CartLine[]>("cart", [], parseCart);

/**
 * Savat. localStorage'da faqat { id, quantity } saqlanadi,
 * narx va nom har safar API'dan olinadi (eskirgan narx qolmaydi).
 */
export function useCart() {
  const lines = useSyncExternalStore(
    cartStore.subscribe,
    cartStore.getSnapshot,
    cartStore.getServerSnapshot,
  );

  const { products, isLoading } = useProductsByIds(lines.map((line) => line.id));

  const entries = useMemo<CartEntry[]>(() => {
    const byId = new Map(products.map((product) => [product.id, product]));
    return lines.flatMap(({ id, quantity }) => {
      const product = byId.get(id);
      if (!product) return [];
      return [{ product, quantity, total: product.price * quantity }];
    });
  }, [lines, products]);

  // Navbar hisoblagichi mahsulotlar yuklanishini kutmaydi
  const totalCount = lines.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = entries.reduce((sum, entry) => sum + entry.total, 0);
  const discount = getCartDiscount(subtotal);

  const addToCart = useCallback((id: number, quantity = 1) => {
    cartStore.set((prev) => {
      const existing = prev.find((line) => line.id === id);
      if (!existing) return [...prev, { id, quantity: clampQuantity(quantity) }];

      return prev.map((line) =>
        line.id === id
          ? { ...line, quantity: clampQuantity(line.quantity + quantity) }
          : line,
      );
    });
  }, []);

  const setQuantity = useCallback((id: number, quantity: number) => {
    cartStore.set((prev) =>
      prev.map((line) =>
        line.id === id ? { ...line, quantity: clampQuantity(quantity) } : line,
      ),
    );
  }, []);

  const removeFromCart = useCallback((id: number) => {
    cartStore.set((prev) => prev.filter((line) => line.id !== id));
  }, []);

  const clearCart = useCallback(() => cartStore.set(() => []), []);

  const isInCart = useCallback(
    (id: number) => lines.some((line) => line.id === id),
    [lines],
  );

  return {
    entries,
    isLoading,
    totalCount,
    subtotal,
    discount,
    total: subtotal - discount.amount,
    isInCart,
    addToCart,
    setQuantity,
    removeFromCart,
    clearCart,
  };
}
