export interface Product {
  id: string | number;
  slug?: string;   
  title: string;
  article: string;
  price: number;
  oldPrice?: number;
  discountPercentage?: number;
  imageUrl: string;
  isHit?: boolean;
  section?: "hits" | "best";
  category?: "instruments" | "santehnika" | "home" | "garden";
  brand?: string;
  productType?: string;
  specs?: Record<string, string>;
}