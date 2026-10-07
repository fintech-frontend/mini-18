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

export interface ApiProduct {
  id: number;
  category: ApiCategory;
  brand: ApiBrand | null;
  name: string;
  slug: string;
  article: string;
  price: string;
  old_price: string | null;
  attrs_json: Record<string, unknown>;
  description: string;
  is_active: boolean;
  created_at: string;
  image?: string;
  images?: { image: string }[];
}

export interface ApiListResponse<T> {
  count: number;
  pages: number;
  results: T[];
}