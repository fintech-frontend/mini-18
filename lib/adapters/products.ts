import { Product } from "@/types/product";
import { ApiProduct } from "@/types/api";

const PLACEHOLDER_IMAGE = "/assets/images/placeholder.svg";

export function mapApiProductToProduct(api: ApiProduct): Product {
  const price = parseFloat(api.price);
  const oldPrice = api.old_price ? parseFloat(api.old_price) : undefined;

  const discountPercentage =
    oldPrice && oldPrice > price
      ? Math.round(((oldPrice - price) / oldPrice) * 100)
      : undefined;

  const imageUrl =
    api.image ?? api.images?.[0]?.image ?? PLACEHOLDER_IMAGE;

  return {
    id: api.id,
    slug: api.slug,
    title: api.name,
    article: api.article,
    price,
    oldPrice,
    discountPercentage,
    imageUrl,
    isHit: false,
    category: api.category?.slug as Product["category"],
    brand: api.brand?.name,
    productType: api.category?.name,
    specs: api.attrs_json as Record<string, string>,
  };
}