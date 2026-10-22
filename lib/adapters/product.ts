import type { ApiProduct } from "@/types/apiTypes";
import type { Product as ShopProduct } from "@/types/product";
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
    weight: toNumber(api.weight_kg) || undefined,

    image,

    hit: api.is_hit,

    specs: toSpecs(api.attributes),
  };
}

const SHOP_PLACEHOLDER_IMAGE = "/assets/images/placeholder.svg";

/**
 * Katalog mahsulotini savat / izbrannoe / taqqoslash (context/*) turiga o'tkazadi.
 * Xususiyatlar ro'yxati lib/adapters/products.ts (mapApiProductToProduct) bilan bir xil,
 * shunda /compare sahifasida qayerdan qo'shilganidan qat'i nazar bir xil ko'rinadi.
 */
export function toShopProduct(product: Product): ShopProduct {
  const specs: Record<string, string> = { ...product.specs };
  const extra: [string, string | number | undefined][] = [
    ["Материал", product.material],
    ["Цвет", product.color],
    ["Длина, мм", product.length],
    ["Ширина, мм", product.width],
    ["Высота, мм", product.height],
    ["Вес, кг", product.weight],
  ];
  extra.forEach(([key, value]) => {
    if (value) specs[key] = String(value);
  });

  return {
    id: product.id,
    slug: product.slug,
    title: product.title,
    article: product.article,
    price: product.price,
    oldPrice: product.oldPrice,
    discountPercentage: product.discount,
    imageUrl: product.image || SHOP_PLACEHOLDER_IMAGE,
    isHit: product.hit,
    section: product.hit ? "hits" : undefined,
    // main'dagi mapApiProductToProduct kabi: /compare kategoriya bo'yicha guruhlaydi
    category: (product.category || undefined) as ShopProduct["category"],
    brand: product.brand || undefined,
    productType: product.type || product.categoryTitle || undefined,
    specs,
  };
}
