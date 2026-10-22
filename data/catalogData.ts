/**
 * Katalog sozlamalari: kategoriya nomlari / SEO matn, saralash va sahifalash.
 * Mahsulotlar — API'dan (lib/api/catalog.ts).
 */

import type { CatalogCategory, SortValue } from "@/types/productsTypes";

/* =========================
   KATEGORIYALAR
========================= */

const POWER_TOOLS_SEO: CatalogCategory["seo"] = {
  title: "Купить электроинструмент",
  paragraphs: [
    "Здесь вы найдете самый широкий выбор высококачественных электроинструментов для любых задач. Независимо от того, являетесь ли вы профессиональным мастером или занимаетесь ремонтами и строительством в домашних условиях, у нас есть все необходимое, чтобы сделать вашу работу эффективной и комфортной.",
    'У нас представлены электроинструменты от ведущих мировых производителей, гарантирующие надежность, долгий срок службы и безупречное качество. В категории "Электроинструмент" вы найдете широкий ассортимент:',
  ],
  list: [
    {
      title: "Дрели и Шуруповерты",
      text: "От мощных перфораторов для бурения бетона до удобных шуруповертов для быстрой и точной забивки и вывинчивания винтов. Все инструменты обладают разными скоростями, настройками и функциями для наилучшего результата.",
    },
    {
      title: "Пилы и Фрезеры",
      text: "Выбор пил и фрезеров позволит вам точно резать и обрабатывать различные материалы, будь то древесина, пластик или металл. Продуманные дизайны и системы пылеудаления обеспечивают чистоту рабочей зоны.",
    },
    {
      title: "Лобзики и Торцовочные Пилы",
      text: "Для максимально точной резки по контурам и наклонам, а также для продольной резки длинных материалов, таких как доски или трубы.",
    },
    {
      title: "Шлифовальные машины",
      text: "От шлифования поверхности перед покраской до полировки, наши инструменты позволят вам добиться гладкой и равномерной отделки.",
    },
    {
      title: "Сварочные аппараты",
      text: "Для профессиональных сварщиков и тех, кто нуждается в точной и надежной сварке различных материалов.",
    },
    {
      title: "Измерительные Приборы",
      text: "Широкий выбор лазерных дальномеров, электронных угломеров и других инструментов для точных измерений и маркировки.",
    },
  ],
};

/** Navbar'dagi katalog menyusi bilan bir xil slug'lar */
export const CATEGORIES: CatalogCategory[] = [
  { slug: "building-materials", title: "Строительные материалы" },
  { slug: "finishing-materials", title: "Отделочные материалы" },
  { slug: "power-tools", title: "Электроинструмент", seo: POWER_TOOLS_SEO },
  { slug: "hand-tools", title: "Ручной инструмент" },
  { slug: "plumbing", title: "Сантехника" },
  { slug: "fasteners", title: "Сантехника и крепеж" },
  { slug: "electrical", title: "Электротовары" },
  { slug: "garden", title: "Сад и огород" },
];

/* =========================
   FILTR / SAHIFALASH SOZLAMALARI
========================= */

/** Ro'yxatda dastlab nechta variant ko'rinadi ("Показать все" dan oldin) */
export const VISIBLE_FILTER_OPTIONS = 5;

/** Narx slayderi qadami, ₽ */
export const PRICE_STEP = 100;

export const PER_PAGE_OPTIONS = [9, 12, 18, 24] as const;

export const DEFAULT_PER_PAGE = 18;

export const SORT_OPTIONS: { value: SortValue; label: string }[] = [
  { value: "price-desc", label: "Цена по убыванию" },
  { value: "price-asc", label: "Цена по возрастанию" },
  { value: "name-asc", label: "По названию" },
  { value: "discount-desc", label: "По скидке" },
];

export const DEFAULT_SORT: SortValue = "price-desc";

/* =========================
   YORDAMCHI FUNKSIYALAR
========================= */

/** Navbar ro'yxatidagi kategoriya (nom va SEO matn uchun) */
export function getCategoryBySlug(slug: string) {
  return CATEGORIES.find((category) => category.slug === slug);
}
