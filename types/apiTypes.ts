/**
 * Backend (Django) javoblarining shakli — fixingtools.pythonanywhere.com/api/v1
 * Swagger: /api/docs/
 */

export type ApiRef = {
  id: number;
  name: string;
  slug: string;
};

export type ApiPaginated<T> = {
  count: number;
  pages: number;
  results: T[];
};

export type ApiProduct = {
  id: number;
  brand: ApiRef | null;
  category: ApiRef;
  product_type: ApiRef | null;
  name: string;
  slug: string;
  article: string;
  material: string;
  color: string;
  length_mm: string | null;
  width_mm: string | null;
  height_mm: string | null;
  weight_kg: string | null;
  /** Decimal — matn ko'rinishida: "12789.00" */
  price: string;
  old_price: string | null;
  stock_quantity: number;
  in_stock: boolean;
  image_url: string | null;
  images: string[];
  attributes: Record<string, unknown>;
  description: string;
  is_active: boolean;
  is_hit: boolean;
  rating_avg: number | null;
  reviews_count: number;
  created_at: string;
};

type ApiRange = { min: number | null; max: number | null };

export type ApiFilterOptions = {
  total: number;
  in_stock_count: number;
  price: ApiRange;
  length_mm: ApiRange;
  width_mm: ApiRange;
  height_mm: ApiRange;
  brands: (ApiRef & { count: number })[];
  product_types: (ApiRef & { count: number })[];
  materials: { value: string; count: number }[];
  colors: { value: string; count: number }[];
};

export type ApiCategory = {
  id: number;
  name: string;
  slug: string;
  sort: number;
  is_active: boolean;
  parent: number | null;
};

export type ApiReview = {
  id: number;
  product: number;
  product_name: string;
  user_name: string;
  rating: number;
  text: string;
  created_at: string;
};

/** Do'kon haqidagi sharh — /store-reviews/ (mahsulot sharhi emas) */
export type ApiStoreReview = {
  id: number;
  name: string;
  text: string;
  /** To'liq manzillar */
  images: string[];
  is_approved: boolean;
  created_at: string;
};
