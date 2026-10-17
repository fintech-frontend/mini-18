"use client";

import { useEffect, useState } from "react";

import {
  fetchFilterOptions,
  fetchProducts,
  type ProductPage,
} from "@/lib/api/catalog";
import type { QueryParams } from "@/lib/api/client";
import { productCache } from "@/lib/api/productCache";
import type { FilterOptions } from "@/types/productsTypes";

type State<T> =
  | { status: "loading"; key: string }
  | { status: "error"; key: string }
  | { status: "ready"; key: string; data: T };

/** Kategoriya filtr paneli variantlari (/products/filters/) */
export function useFilterOptions(category?: string) {
  const key = category ?? "";
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<State<FilterOptions>>({ status: "loading", key });

  useEffect(() => {
    const controller = new AbortController();
    fetchFilterOptions(category, { signal: controller.signal })
      .then((data) => setState({ status: "ready", key, data }))
      .catch(() => {
        if (!controller.signal.aborted) setState({ status: "error", key });
      });
    return () => controller.abort();
  }, [category, key, attempt]);

  // Kategoriya almashgan bo'lsa, eski javob ko'rsatilmaydi
  const current = state.key === key ? state : { status: "loading" as const, key };

  return {
    options: current.status === "ready" ? current.data : null,
    isError: current.status === "error",
    retry: () => {
      setState({ status: "loading", key });
      setAttempt((n) => n + 1);
    },
  };
}

/** Kutish vaqti: input'da yozilayotganda har harfda so'rov ketmasligi uchun */
const DEBOUNCE_MS = 250;

/**
 * Katalog mahsulotlari. Parametr o'zgarganda yangi so'rov yuboriladi,
 * eski javob yangisi kelguncha ko'rinib turadi (sahifa "sakramaydi").
 */
export function useProductPage(params: QueryParams) {
  const key = JSON.stringify(params);
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<State<ProductPage>>({ status: "loading", key });
  const [lastData, setLastData] = useState<ProductPage | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => {
      fetchProducts(JSON.parse(key) as QueryParams, { signal: controller.signal })
        .then((data) => {
          productCache.prime(data.items);
          setState({ status: "ready", key, data });
          setLastData(data);
        })
        .catch(() => {
          if (!controller.signal.aborted) setState({ status: "error", key });
        });
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [key, attempt]);

  const isCurrent = state.key === key;

  return {
    data: isCurrent && state.status === "ready" ? state.data : lastData,
    isLoading: !isCurrent || state.status === "loading",
    isError: isCurrent && state.status === "error",
    retry: () => {
      setState({ status: "loading", key });
      setAttempt((n) => n + 1);
    },
  };
}
