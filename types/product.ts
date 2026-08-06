export interface Product {
  id: string | number;
  title: string;
  article: string;
  price: number;
  oldPrice?: number;
  discountPercentage?: number;
  imageUrl: string;
  isHit?: boolean;
}