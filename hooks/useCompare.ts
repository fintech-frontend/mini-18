"use client";

import { useCallback, useSyncExternalStore } from "react";

import { useProductsByIds } from "@/hooks/useProductsByIds";
import { createPersistentStore, parseIdList } from "@/lib/store/persistentStore";
import type { CompareToggleResult } from "@/types/shopTypes";

/** Bir vaqtda taqqoslanadigan mahsulotlar soni */
export const MAX_COMPARE_ITEMS = 4;

const compareStore = createPersistentStore<number[]>("compare", [], (raw) =>
  parseIdList(raw)?.slice(0, MAX_COMPARE_ITEMS) ?? null,
);

/** Taqqoslash ro'yxati: localStorage'da faqat id'lar, qo'shilgan tartibda */
export function useCompare() {
  const ids = useSyncExternalStore(
    compareStore.subscribe,
    compareStore.getSnapshot,
    compareStore.getServerSnapshot,
  );

  const { products, isLoading } = useProductsByIds(ids);

  const isInCompare = useCallback((id: number) => ids.includes(id), [ids]);

  /** Limitga yetilgan bo'lsa "limit" qaytaradi va hech narsa qo'shmaydi */
  const toggleCompare = useCallback(
    (id: number): CompareToggleResult => {
      if (ids.includes(id)) {
        compareStore.set((prev) => prev.filter((item) => item !== id));
        return "removed";
      }
      if (ids.length >= MAX_COMPARE_ITEMS) return "limit";

      compareStore.set((prev) => [...prev, id]);
      return "added";
    },
    [ids],
  );

  const removeFromCompare = useCallback((id: number) => {
    compareStore.set((prev) => prev.filter((item) => item !== id));
  }, []);

  const clearCompare = useCallback(() => compareStore.set(() => []), []);

  return {
    products,
    isLoading,
    count: ids.length,
    isFull: ids.length >= MAX_COMPARE_ITEMS,
    isInCompare,
    toggleCompare,
    removeFromCompare,
    clearCompare,
  };
}
