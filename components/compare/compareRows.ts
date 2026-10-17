import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types/productsTypes";

export type CompareRow = {
  key: string;
  label: string;
  getValue: (product: Product) => string;
};

export type CompareGroup = {
  title: string;
  rows: CompareRow[];
};

const EMPTY = "—";

const price = (value?: number) => (value ? `${formatPrice(value)} ₽` : EMPTY);
const mm = (value: number) => (value ? `${formatPrice(value)} мм` : EMPTY);

/** Barcha mahsulotlarda bor bo'lgan asosiy maydonlar */
const MAIN_ROWS: CompareRow[] = [
  { key: "price", label: "Цена", getValue: (p) => price(p.price) },
  { key: "oldPrice", label: "Старая цена", getValue: (p) => price(p.oldPrice) },
  {
    key: "discount",
    label: "Скидка",
    getValue: (p) => (p.discount ? `−${p.discount}%` : EMPTY),
  },
  { key: "brand", label: "Бренд", getValue: (p) => p.brand || EMPTY },
  { key: "type", label: "Тип товара", getValue: (p) => p.type || EMPTY },
  { key: "material", label: "Материал", getValue: (p) => p.material || EMPTY },
  { key: "color", label: "Цвет", getValue: (p) => p.color || EMPTY },
  { key: "length", label: "Длина", getValue: (p) => mm(p.length) },
  { key: "width", label: "Ширина", getValue: (p) => mm(p.width) },
  { key: "height", label: "Высота", getValue: (p) => mm(p.height) },
  {
    key: "stock",
    label: "Наличие",
    getValue: (p) => (p.stock ? `${p.stock} шт.` : "Нет в наличии"),
  },
  {
    key: "rating",
    label: "Рейтинг",
    getValue: (p) =>
      p.rating ? `${p.rating} (${p.reviewsCount ?? 0} отзывов)` : EMPTY,
  },
];

/**
 * Jadval guruhlari. Xususiyatlar (specs) — barcha mahsulotlardagi kalitlar
 * birlashmasi: bir mahsulotda bo'lmasa "—" ko'rsatiladi.
 */
export function buildCompareGroups(products: Product[]): CompareGroup[] {
  const specKeys = Array.from(
    new Set(products.flatMap((p) => Object.keys(p.specs ?? {}))),
  );

  const specRows: CompareRow[] = specKeys.map((key) => ({
    key: `spec-${key}`,
    label: key,
    getValue: (p) => p.specs?.[key] ?? EMPTY,
  }));

  return [
    { title: "Основное", rows: MAIN_ROWS },
    { title: "Характеристики", rows: specRows },
  ].filter((group) => group.rows.length > 0);
}

/** Qator qiymatlari mahsulotlar orasida farq qiladimi */
export function isRowDifferent(row: CompareRow, products: Product[]) {
  return new Set(products.map(row.getValue)).size > 1;
}
