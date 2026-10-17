import {
  DEFAULT_PER_PAGE,
  DEFAULT_SORT,
  PER_PAGE_OPTIONS,
  SORT_OPTIONS,
} from "@/data/catalogData";
import { createDefaultFilters } from "@/lib/catalog/filterOptions";
import type {
  CatalogQuery,
  DimensionKey,
  FilterListKey,
  FilterOptions,
  SortValue,
} from "@/types/productsTypes";

/**
 * Katalog holati <-> URL query.
 * Masalan: /catalog/power-tools?brand=MAKITA,STAYER&price_max=20000&sort=price-asc&page=2
 * Standart qiymatlar URL'ga yozilmaydi, link qisqa bo'ladi.
 */

const LIST_PARAMS: Record<FilterListKey, string> = {
  types: "type",
  brands: "brand",
  materials: "material",
  colors: "color",
};

const DIMENSION_PARAMS: Record<DimensionKey, string> = {
  lengthMin: "length_min",
  lengthMax: "length_max",
  widthMin: "width_min",
  widthMax: "width_max",
  heightMin: "height_min",
  heightMax: "height_max",
};

const LIST_SEPARATOR = ",";

type ReadableParams = Pick<URLSearchParams, "get">;

const toInt = (value: string | null) => {
  if (value === null || !/^\d+$/.test(value)) return null;
  return Number(value);
};

export function parseCatalogQuery(
  params: ReadableParams,
  options: FilterOptions,
): CatalogQuery {
  const defaults = createDefaultFilters(options);
  const { min, max } = options.price;

  const filters = { ...defaults };

  for (const [key, param] of Object.entries(LIST_PARAMS) as [FilterListKey, string][]) {
    const raw = params.get(param);
    filters[key] = raw ? raw.split(LIST_SEPARATOR).filter(Boolean) : [];
  }

  for (const [key, param] of Object.entries(DIMENSION_PARAMS) as [DimensionKey, string][]) {
    const value = toInt(params.get(param));
    filters[key] = value === null ? "" : String(value);
  }

  const priceMin = toInt(params.get("price_min"));
  const priceMax = toInt(params.get("price_max"));
  filters.maxPrice = Math.min(max, Math.max(min, priceMax ?? max));
  filters.minPrice = Math.min(filters.maxPrice, Math.max(min, priceMin ?? min));

  const sortParam = params.get("sort");
  const sort = SORT_OPTIONS.some((o) => o.value === sortParam)
    ? (sortParam as SortValue)
    : DEFAULT_SORT;

  const perPageParam = toInt(params.get("per_page"));
  const perPage = PER_PAGE_OPTIONS.some((n) => n === perPageParam)
    ? (perPageParam as number)
    : DEFAULT_PER_PAGE;

  return {
    filters,
    sort,
    perPage,
    page: Math.max(1, toInt(params.get("page")) ?? 1),
    search: (params.get("search") ?? "").trim(),
  };
}

export function serializeCatalogQuery(
  query: CatalogQuery,
  options: FilterOptions,
): string {
  const params = new URLSearchParams();
  const { filters } = query;

  if (query.search) params.set("search", query.search);

  for (const [key, param] of Object.entries(LIST_PARAMS) as [FilterListKey, string][]) {
    if (filters[key].length > 0) params.set(param, filters[key].join(LIST_SEPARATOR));
  }

  if (filters.minPrice > options.price.min) params.set("price_min", String(filters.minPrice));
  if (filters.maxPrice < options.price.max) params.set("price_max", String(filters.maxPrice));

  for (const [key, param] of Object.entries(DIMENSION_PARAMS) as [DimensionKey, string][]) {
    if (filters[key] !== "") params.set(param, filters[key]);
  }

  if (query.sort !== DEFAULT_SORT) params.set("sort", query.sort);
  if (query.perPage !== DEFAULT_PER_PAGE) params.set("per_page", String(query.perPage));
  if (query.page > 1) params.set("page", String(query.page));

  // Vergul query'da ruxsat etilgan — link o'qilishi oson bo'lsin
  return params.toString().replace(/%2C/g, LIST_SEPARATOR);
}
