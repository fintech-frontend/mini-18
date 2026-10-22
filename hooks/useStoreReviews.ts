"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { ApiError } from "@/lib/api/client";
import { fetchStoreReviews, type StoreReviewPage } from "@/lib/api/storeReviews";
import type { ReviewSortOrder } from "@/types/reviewTypes";

type Query = { sort: ReviewSortOrder; page: number };

function parseQuery(params: Pick<URLSearchParams, "get">): Query {
  const page = Number(params.get("page"));
  return {
    sort: params.get("sort") === "old" ? "old" : "new",
    page: Number.isInteger(page) && page > 1 ? page : 1,
  };
}

function serializeQuery({ sort, page }: Query) {
  const params = new URLSearchParams();
  if (sort === "old") params.set("sort", "old");
  if (page > 1) params.set("page", String(page));
  return params.toString();
}

/**
 * Saralash va sahifa URL'da: /reviews?sort=old&page=2
 * Sahifa yangilansa yoki "Orqaga" bosilsa holat saqlanadi.
 */
export function useReviewsQuery() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.toString();

  const [query, setQuery] = useState<Query>(() => parseQuery(searchParams));
  const [synced, setSynced] = useState(current);

  // URL tashqaridan o'zgardi (Orqaga / Oldinga)
  if (current !== synced) {
    setSynced(current);
    setQuery(parseQuery(searchParams));
  }

  const update = useCallback(
    (next: Query, mode: "replace" | "push") => {
      const serialized = serializeQuery(next);
      setQuery(next);
      setSynced(serialized);
      const url = serialized ? `${pathname}?${serialized}` : pathname;
      if (mode === "push") window.history.pushState(null, "", url);
      else window.history.replaceState(null, "", url);
    },
    [pathname],
  );

  return {
    ...query,
    setSort: (sort: ReviewSortOrder) => update({ sort, page: 1 }, "replace"),
    setPage: (page: number) => update({ ...query, page }, "push"),
    /** Mavjud bo'lmagan sahifadan 1-sahifaga (history'ga yozilmaydi) */
    resetPage: () => update({ ...query, page: 1 }, "replace"),
  };
}

type State =
  | { status: "loading"; key: string }
  | { status: "error"; key: string; pageNotFound: boolean }
  | { status: "ready"; key: string; data: StoreReviewPage };

/** Tasdiqlangan do'kon sharhlari; yangi sahifa kelguncha eskisi ko'rinib turadi */
export function useStoreReviews({ sort, page }: Query) {
  const key = `${sort}:${page}`;
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<State>({ status: "loading", key });
  const [lastData, setLastData] = useState<StoreReviewPage | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetchStoreReviews({ sort, page }, { signal: controller.signal })
      .then((data) => {
        setState({ status: "ready", key, data });
        setLastData(data);
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        // ?page=5, lekin sahifalar kamroq — API 404 "Invalid page" qaytaradi
        const pageNotFound = error instanceof ApiError && error.status === 404;
        setState({ status: "error", key, pageNotFound });
      });
    return () => controller.abort();
  }, [sort, page, key, attempt]);

  const isCurrent = state.key === key;

  return {
    data: isCurrent && state.status === "ready" ? state.data : lastData,
    isLoading: !isCurrent || state.status === "loading",
    isError: isCurrent && state.status === "error",
    isPageNotFound: isCurrent && state.status === "error" && state.pageNotFound,
    retry: () => {
      setState({ status: "loading", key });
      setAttempt((n) => n + 1);
    },
  };
}
