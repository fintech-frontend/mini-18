import type { ApiProduct } from "@/types/apiTypes";
import type { Product } from "@/types/productsTypes";

const toNumber = (value: string | number | null | undefined) => {
  if (value === null || value === undefined || value === "") return 0;
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

/** Eski narxdan chegirma foizi — backend bermaydi, frontendda hisoblanadi */
export function discountPercent(price: number, oldPrice?: number) {
  if (!oldPrice || oldPrice <= price) return undefined;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

/** attributes ({"Мощность": "1450 Вт", ...}) -> faqat matnli qiymatlar */
function toSpecs(attributes: Record<string, unknown>) {
  const entries = Object.entries(attributes ?? {})
    .filter(([, value]) => value !== null && value !== undefined && value !== "")
    .map(([key, value]) => [key, String(value)]);
  return entries.length ? Object.fromEntries(entries) : undefined;
}

/**
 * API mahsulotini UI'dagi Product turiga o'tkazadi.
 * Backend maydon nomini o'zgartirsa — faqat shu funksiya tuzatiladi.
 */
export function mapApiProduct(api: ApiProduct): Product {
  const price = toNumber(api.price);
  const oldPrice = api.old_price ? toNumber(api.old_price) : undefined;
  const image = api.image_url ?? "";
  const gallery = [image, ...(api.images ?? [])].filter(Boolean);

  return {
    id: api.id,
    slug: api.slug,
    category: api.category?.slug ?? "",
    categoryTitle: api.category?.name ?? "",

    title: api.name,
    article: api.article,

    price,
    oldPrice: oldPrice && oldPrice > price ? oldPrice : undefined,
    discount: discountPercent(price, oldPrice),

    brand: api.brand?.name ?? "",
    type: api.product_type?.name ?? "",
    material: api.material ?? "",
    color: api.color ?? "",

    length: toNumber(api.length_mm),
    width: toNumber(api.width_mm),
    height: toNumber(api.height_mm),

    image,
    gallery: gallery.length > 1 ? gallery : undefined,

    hit: api.is_hit,
    description: api.description || undefined,
    stock: api.stock_quantity,

    rating: api.rating_avg ?? undefined,
    reviewsCount: api.reviews_count,

    specs: toSpecs(api.attributes),
  };
}
