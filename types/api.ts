export interface ApiCategory {
  id: number;
  name: string;
  slug: string;
  sort: number;
  is_active: boolean;
  parent: number | null;
}

export interface ApiBrand {
  id: number;
  name: string;
  slug: string;
  logo?: string;
}

/** Kategoriya/brendning qisqa ko'rinishi (mahsulot ichida keladi) */
export interface ApiShortRef {
  id: number;
  name: string;
  slug: string;
}

export interface ApiProduct {
  id: number;
  category: ApiShortRef | null;
  brand: ApiShortRef | null;
  product_type?: ApiShortRef | null;
  name: string;
  slug: string;
  article: string;
  material?: string;
  color?: string;
  length_mm?: string | null;
  width_mm?: string | null;
  height_mm?: string | null;
  weight_kg?: string | null;
  price: string;
  old_price: string | null;
  stock_quantity?: number;
  in_stock?: boolean;
  image?: string | null;
  image_url?: string | null;
  /** Galereya: to'liq manzillar ro'yxati (eski format: { image }[]) */
  images?: (string | { image: string })[];
  attributes?: Record<string, unknown>;
  /** Eski backend formati */
  attrs_json?: Record<string, unknown>;
  description: string;
  is_active: boolean;
  is_hit?: boolean;
  rating_avg?: number | null;
  reviews_count?: number;
  created_at: string;
}

export interface ApiListResponse<T> {
  count: number;
  pages: number;
  results: T[];
}