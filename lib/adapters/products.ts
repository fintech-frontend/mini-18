import { Product } from "@/types/product";
import { ApiProduct } from "@/types/api";

const PLACEHOLDER_IMAGE = "/assets/images/placeholder.svg";
const MEDIA_BASE = "https://fixingtools.pythonanywhere.com";

const toAbsolute = (src?: string | null) => {
  if (!src) return "";
  if (/^https?:\/\//.test(src)) return src;
  return `${MEDIA_BASE}${src.startsWith("/") ? "" : "/"}${src}`;
};

// Mahsulotning asosiy rasmi: image_url → image → galereyaning birinchisi
export function productImage(api: Pick<ApiProduct, "image_url" | "image" | "images">): string {
  const first = api.images?.[0];
  const fromGallery = typeof first === "string" ? first : first?.image;
  return toAbsolute(api.image_url ?? api.image ?? fromGallery) || PLACEHOLDER_IMAGE;
}

// Texnik xususiyatlar: attributes + material/rang/o'lchamlar
function productSpecs(api: ApiProduct): Record<string, string> {
  const specs: Record<string, string> = {};
  const attrs = api.attributes ?? api.attrs_json ?? {};
  Object.entries(attrs).forEach(([k, v]) => {
    if (v !== null && v !== undefined && v !== "") specs[k] = String(v);
  });
  const extra: [string, string | null | undefined][] = [
    ["Материал", api.material],
    ["Цвет", api.color],
    ["Длина, мм", api.length_mm],
    ["Ширина, мм", api.width_mm],
    ["Высота, мм", api.height_mm],
    ["Вес, кг", api.weight_kg],
  ];
  extra.forEach(([k, v]) => {
    if (v) specs[k] = String(v);
  });
  return specs;
}

export function mapApiProductToProduct(api: ApiProduct): Product {
  const price = parseFloat(api.price);
  const oldPrice = api.old_price ? parseFloat(api.old_price) : undefined;

  const discountPercentage =
    oldPrice && oldPrice > price
      ? Math.round(((oldPrice - price) / oldPrice) * 100)
      : undefined;

  return {
    id: api.id,
    slug: api.slug,
    title: api.name,
    article: api.article,
    price,
    oldPrice,
    discountPercentage,
    imageUrl: productImage(api),
    isHit: !!api.is_hit,
    section: api.is_hit ? "hits" : undefined,
    category: api.category?.slug as Product["category"],
    brand: api.brand?.name,
    productType: api.product_type?.name ?? api.category?.name,
    specs: productSpecs(api),
  };
}
