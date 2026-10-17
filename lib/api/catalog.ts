import { mapApiProduct } from "@/lib/adapters/product";
import { ApiError, apiGet, toList, type QueryParams } from "@/lib/api/client";
import { mapApiFilterOptions } from "@/lib/catalog/filterOptions";
import type {
  ApiCategory,
  ApiFilterOptions,
  ApiPaginated,
  ApiProduct,
  ApiReview,
} from "@/types/apiTypes";
import type { CatalogQuery, FilterOptions, Product, SortValue } from "@/types/productsTypes";

/* =========================
   KATALOG HOLATI -> API PARAMETRLARI
========================= */

/** "По скидке" backend'da yo'q — sahifa ichida frontend saralaydi (sortByDiscount) */
const ORDERING: Record<SortValue, string | undefined> = {
  "price-desc": "-price",
  "price-asc": "price",
  "name-asc": "name",
  "discount-desc": undefined,
};

const join = (values: string[]) => (values.length ? values.join(",") : undefined);

export function toProductParams(
  query: CatalogQuery,
  options: FilterOptions,
  category?: string,
): QueryParams {
  const { filters } = query;

  return {
    category,
    search: query.search || undefined,
    product_type: join(filters.types),
    brand: join(filters.brands),
    material: join(filters.materials),
    color: join(filters.colors),
    price_min: filters.minPrice > options.price.min ? filters.minPrice : undefined,
    price_max: filters.maxPrice < options.price.max ? filters.maxPrice : undefined,
    length_mm__gte: filters.lengthMin,
    length_mm__lte: filters.lengthMax,
    width_mm__gte: filters.widthMin,
    width_mm__lte: filters.widthMax,
    height_mm__gte: filters.heightMin,
    height_mm__lte: filters.heightMax,
    has_discount: query.sort === "discount-desc" ? true : undefined,
    ordering: ORDERING[query.sort],
    page: query.page,
    page_size: query.perPage,
  };
}

export function sortByDiscount(products: Product[]) {
  return [...products].sort((a, b) => (b.discount ?? 0) - (a.discount ?? 0));
}

/* =========================
   SO'ROVLAR
========================= */

export type ProductPage = {
  items: Product[];
  count: number;
  pages: number;
};

export async function fetchProducts(
  params: QueryParams,
  init?: { signal?: AbortSignal; revalidate?: number },
): Promise<ProductPage> {
  const data = await apiGet<ApiPaginated<ApiProduct>>("products/", params, init);
  return {
    items: data.results.map(mapApiProduct),
    count: data.count,
    pages: data.pages,
  };
}

/** id yoki slug bo'yicha; topilmasa null */
export async function fetchProduct(
  idOrSlug: string | number,
  init?: { signal?: AbortSignal; revalidate?: number },
): Promise<Product | null> {
  try {
    const data = await apiGet<ApiProduct>(`products/${idOrSlug}/`, undefined, init);
    return mapApiProduct(data);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export async function fetchFilterOptions(
  category?: string,
  init?: { signal?: AbortSignal },
): Promise<FilterOptions> {
  const data = await apiGet<ApiFilterOptions>("products/filters/", { category }, init);
  return mapApiFilterOptions(data);
}

export async function fetchCategories(): Promise<ApiCategory[]> {
  const data = await apiGet<ApiCategory[] | ApiPaginated<ApiCategory>>(
    "categories/",
    { page_size: 100 },
    { revalidate: 300 },
  );
  return toList(data).filter((category) => category.is_active);
}

/** Shu kategoriyadan o'xshash mahsulotlar: avval bir xil turdagilar */
export async function fetchSimilarProducts(product: Product, limit = 4) {
  const { items } = await fetchProducts(
    { category: product.category, page_size: limit * 3 },
    { revalidate: 300 },
  );
  return items
    .filter((item) => item.id !== product.id)
    .sort((a, b) => Number(b.type === product.type) - Number(a.type === product.type))
    .slice(0, limit);
}

export async function fetchProductReviews(
  productId: number,
  init?: { signal?: AbortSignal },
): Promise<ApiPaginated<ApiReview>> {
  return apiGet<ApiPaginated<ApiReview>>(
    "reviews/",
    { product: productId, page_size: 20 },
    init,
  );
}
