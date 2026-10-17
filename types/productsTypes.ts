export type Product = {
  id: number;
  slug: string;
  /** Kategoriya slug'i (API'dagi category.slug) */
  category: string;
  categoryTitle: string;

  title: string;
  article: string;

  price: number;
  oldPrice?: number;
  discount?: number;

  brand: string;
  type: string;
  material: string;
  color: string;

  length: number;
  width: number;
  height: number;

  image: string;
  gallery?: string[];

  hit?: boolean;

  description?: string;

  stock?: number;

  rating?: number;
  reviewsCount?: number;

  specs?: Record<string, string>;
};

export type FilterState = {
  minPrice: number;
  maxPrice: number;

  types: string[];
  brands: string[];
  materials: string[];
  colors: string[];

  lengthMin: string;
  lengthMax: string;

  widthMin: string;
  widthMax: string;

  heightMin: string;
  heightMax: string;
};

/** Checkbox bilan tanlanadigan filtrlar */
export type FilterListKey = "types" | "brands" | "materials" | "colors";

/** O'lcham (мм) bo'yicha "от / до" filtrlar */
export type DimensionKey =
  | "lengthMin"
  | "lengthMax"
  | "widthMin"
  | "widthMax"
  | "heightMin"
  | "heightMax";

export type SortValue =
  "price-desc" | "price-asc" | "name-asc" | "discount-desc";

/** Filtr panelidagi bitta variant: "MAKITA (8)" */
export type FilterOption = {
  /** URL va API'ga yuboriladigan qiymat (tur / brend uchun — slug) */
  value: string;
  /** Ekranda ko'rinadigan nom (bo'lmasa value ko'rsatiladi) */
  label?: string;
  count: number;
};

export type PriceRange = {
  min: number;
  max: number;
  step: number;
};

/** Filtr paneli variantlari — API'ning /products/filters/ endpointidan */
export type FilterOptions = Record<FilterListKey, FilterOption[]> & {
  price: PriceRange;
  /** Kategoriyadagi jami faol mahsulotlar soni */
  total: number;
};

/** URL'da saqlanadigan katalog holati */
export type CatalogQuery = {
  filters: FilterState;
  sort: SortValue;
  perPage: number;
  page: number;
  search: string;
};

export type CatalogCategory = {
  slug: string;
  title: string;
  /** Sahifa pastidagi SEO matn (bo'lmasa blok ko'rsatilmaydi) */
  seo?: {
    title: string;
    paragraphs: string[];
    list: { title: string; text: string }[];
  };
};
