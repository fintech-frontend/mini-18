"use client";

import { useCallback, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import {
  parseCatalogQuery,
  serializeCatalogQuery,
} from "@/lib/catalog/catalogQuery";
import type { CatalogQuery, FilterOptions } from "@/types/productsTypes";

const normalize = (query: string) => query.replace(/%2C/g, ",");

/**
 * Katalog holati (filtr, saralash, sahifa, qidiruv) — URL'da saqlanadi.
 * Sahifa yangilansa, "Orqaga" bosilsa yoki link ulashilsa holat saqlanib qoladi.
 *
 * UI darhol lokal state'dan yangilanadi (input "qotib" qolmaydi),
 * URL esa history API orqali shu zahoti yoziladi.
 */
export function useCatalogQuery(options: FilterOptions) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentQuery = normalize(searchParams.toString());

  const [query, setQuery] = useState<CatalogQuery>(() =>
    parseCatalogQuery(searchParams, options),
  );
  const [syncedQuery, setSyncedQuery] = useState(currentQuery);

  // URL tashqaridan o'zgardi (Orqaga tugmasi, navbar qidiruvi) — holatni qayta o'qiymiz
  if (currentQuery !== syncedQuery) {
    setSyncedQuery(currentQuery);
    setQuery(parseCatalogQuery(searchParams, options));
  }

  const updateQuery = useCallback(
    (next: CatalogQuery, mode: "replace" | "push" = "replace") => {
      const serialized = serializeCatalogQuery(next, options);
      const url = serialized ? `${pathname}?${serialized}` : pathname;

      setQuery(next);
      setSyncedQuery(serialized);

      if (mode === "push") window.history.pushState(null, "", url);
      else window.history.replaceState(null, "", url);
    },
    [options, pathname],
  );

  return [query, updateQuery] as const;
}
