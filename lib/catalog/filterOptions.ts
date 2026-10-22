import { PRICE_STEP } from "@/data/catalogData";
import type { ApiFilterOptions } from "@/types/apiTypes";
import type { FilterListKey, FilterOptions, FilterState } from "@/types/productsTypes";

/**
 * /products/filters/ javobini filtr paneli formatiga o'tkazadi.
 * Tur va brend uchun qiymat — slug (API shuni qabul qiladi), nom — label.
 */
export function mapApiFilterOptions(api: ApiFilterOptions): FilterOptions {
  const min = api.price.min ?? 0;
  const max = api.price.max ?? PRICE_STEP;

  return {
    types: api.product_types.map((t) => ({
      value: t.slug,
      label: t.name,
      count: t.count,
    })),
    brands: api.brands.map((b) => ({
      value: b.slug,
      label: b.name,
      count: b.count,
    })),
    materials: api.materials.map((m) => ({ value: m.value, count: m.count })),
    colors: api.colors.map((c) => ({ value: c.value, count: c.count })),
    price: {
      min: Math.floor(min / PRICE_STEP) * PRICE_STEP,
      max: Math.max(Math.ceil(max / PRICE_STEP) * PRICE_STEP, PRICE_STEP),
      step: PRICE_STEP,
    },
    total: api.total,
  };
}

/** Hech narsa tanlanmagan holat (narx — to'liq oraliq) */
export function createDefaultFilters(options: FilterOptions): FilterState {
  return {
    minPrice: options.price.min,
    maxPrice: options.price.max,
    types: [],
    brands: [],
    materials: [],
    colors: [],
    lengthMin: "",
    lengthMax: "",
    widthMin: "",
    widthMax: "",
    heightMin: "",
    heightMax: "",
  };
}

/** Variant nomi: slug o'rniga "MAKITA" ko'rsatish uchun */
export function optionLabel(
  options: FilterOptions,
  key: FilterListKey,
  value: string,
) {
  return options[key].find((option) => option.value === value)?.label ?? value;
}
