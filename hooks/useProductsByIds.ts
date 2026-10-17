"use client";

import { useEffect, useMemo, useSyncExternalStore } from "react";

import { productCache } from "@/lib/api/productCache";
import type { Product } from "@/types/productsTypes";

/**
 * id ro'yxati bo'yicha mahsulotlar (berilgan tartibda).
 * Hali yuklanayotganlari ro'yxatga kirmaydi, `isLoading` true bo'ladi.
 * O'chirilgan mahsulotlar `missingIds` da qaytadi.
 */
export function useProductsByIds(ids: number[]) {
  const version = useSyncExternalStore(
    productCache.subscribe,
    productCache.getVersion,
    () => 0,
  );

  const key = ids.join(",");

  useEffect(() => {
    if (key) productCache.load(key.split(",").map(Number));
  }, [key]);

  return useMemo(() => {
    const products: Product[] = [];
    const missingIds: number[] = [];
    let isLoading = false;

    for (const id of ids) {
      const product = productCache.get(id);
      if (product) products.push(product);
      else if (product === null) missingIds.push(id);
      else isLoading = true;
    }

    return { products, missingIds, isLoading };
    // version: kesh yangilanganda qayta hisoblash uchun
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, version]);
}
