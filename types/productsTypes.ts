export type Product = {
  id: number;

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
