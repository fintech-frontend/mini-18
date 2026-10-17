"use client";

import { useCallback, useSyncExternalStore } from "react";

import { useProductsByIds } from "@/hooks/useProductsByIds";
import { createPersistentStore, parseIdList } from "@/lib/store/persistentStore";

const favoritesStore = createPersistentStore<number[]>(
  "favorites",
  [],
  parseIdList,
);

/** Izbrannoe: localStorage'da faqat id'lar saqlanadi */
export function useFavorites() {
  const ids = useSyncExternalStore(
    favoritesStore.subscribe,
    favoritesStore.getSnapshot,
    favoritesStore.getServerSnapshot,
  );

  const { products, isLoading } = useProductsByIds(ids);

  const isFavorite = useCallback((id: number) => ids.includes(id), [ids]);

  const toggleFavorite = useCallback((id: number) => {
    favoritesStore.set((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }, []);

  const removeFavorite = useCallback((id: number) => {
    favoritesStore.set((prev) => prev.filter((item) => item !== id));
  }, []);

  const clearFavorites = useCallback(() => favoritesStore.set(() => []), []);

  return {
    products,
    isLoading,
    // Hisoblagich mahsulotlar yuklanishini kutmaydi
    count: ids.length,
    isFavorite,
    toggleFavorite,
    removeFavorite,
    clearFavorites,
  };
}
