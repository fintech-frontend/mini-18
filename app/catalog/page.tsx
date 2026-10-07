"use client";

import Link from "next/link";
import { useCallback, useMemo, useRef, useState } from "react";
import { SlidersHorizontal } from "lucide-react";

import ActiveFilterChips, {
  type FilterChip,
} from "@/components/catalog/ActiveFilterChips";
import CatalogFilters from "@/components/catalog/CatalogFilters";
import CatalogPagination from "@/components/catalog/CatalogPagination";
import CatalogSeoText from "@/components/catalog/CatalogSeoText";
import CatalogToolbar from "@/components/catalog/CatalogToolbar";
import FiltersDrawer from "@/components/catalog/FiltersDrawer";
import ProductCard from "@/components/catalog/ProductCard";
import PromoBanners from "@/components/catalog/PromoBanners";
import {
  DEFAULT_FILTERS,
  DEFAULT_PER_PAGE,
  DEFAULT_SORT,
  PRODUCTS,
} from "@/data/catalogData";
import { formatPrice } from "@/lib/utils";
import { styles } from "@/styles/index.styles";
import type {
  FilterListKey,
  FilterState,
  Product,
  SortValue,
} from "@/types/productsTypes";

/* =========================
   FILTR / SARALASH MANTIG'I
========================= */

function toRange(min: string, max: string) {
  return {
    min: min === "" ? 0 : Number(min),
    max: max === "" ? Infinity : Number(max),
  };
}

function filterProducts(
  products: Product[],
  filters: FilterState,
  sort: SortValue,
) {
  const length = toRange(filters.lengthMin, filters.lengthMax);
  const width = toRange(filters.widthMin, filters.widthMax);
  const height = toRange(filters.heightMin, filters.heightMax);

  const inList = (list: string[], value: string) =>
    list.length === 0 || list.includes(value);

  const result = products.filter(
    (product) =>
      product.price >= filters.minPrice &&
      product.price <= filters.maxPrice &&
      inList(filters.types, product.type) &&
      inList(filters.brands, product.brand) &&
      inList(filters.materials, product.material) &&
      inList(filters.colors, product.color) &&
      product.length >= length.min &&
      product.length <= length.max &&
      product.width >= width.min &&
      product.width <= width.max &&
      product.height >= height.min &&
      product.height <= height.max,
  );

  return result.sort((a, b) => {
    switch (sort) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "name-asc":
        return a.title.localeCompare(b.title, "ru");
      case "discount-desc":
        return (b.discount ?? 0) - (a.discount ?? 0);
      default:
        return 0;
    }
  });
}

function pluralizeProducts(count: number) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return "товар";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "товара";
  return "товаров";
}

function toggleInSet(set: Set<number>, id: number) {
  const next = new Set(set);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  return next;
}

/* =========================
   SAHIFA
========================= */

export default function ElectroInstrumentCatalog() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortValue>(DEFAULT_SORT);
  const [perPage, setPerPage] = useState(DEFAULT_PER_PAGE);
  const [page, setPage] = useState(1);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Global savat / izbrannoe hali yo'q — hozircha sahifa ichida saqlanadi
  const [cart, setCart] = useState<Set<number>>(() => new Set());
  const [favorites, setFavorites] = useState<Set<number>>(() => new Set());
  const [compare, setCompare] = useState<Set<number>>(() => new Set());

  const productsTopRef = useRef<HTMLDivElement>(null);

  const filteredProducts = useMemo(
    () => filterProducts(PRODUCTS, filters, sort),
    [filters, sort],
  );

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / perPage));
  const currentPage = Math.min(page, totalPages);

  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );

  /* ---------- handlers ---------- */

  const applyFilters = useCallback((next: FilterState) => {
    setFilters(next);
    setPage(1);
  }, []);

  const clearAll = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  const removeFromList = (key: FilterListKey, value: string) =>
    applyFilters({
      ...filters,
      [key]: filters[key].filter((item) => item !== value),
    });

  const changePage = (next: number) => {
    setPage(next);
    productsTopRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const closeDrawer = useCallback(() => setIsFiltersOpen(false), []);

  /* ---------- tanlangan filtrlar (chip) ---------- */

  const listChips = (key: FilterListKey): FilterChip[] =>
    filters[key].map((value) => ({
      key: `${key}-${value}`,
      label: value,
      onRemove: () => removeFromList(key, value),
    }));

  const dimensionChip = (
    id: "length" | "width" | "height",
    label: string,
  ): FilterChip[] => {
    const min = filters[`${id}Min`];
    const max = filters[`${id}Max`];
    if (!min && !max) return [];

    const parts = [min && `от ${min}`, max && `до ${max}`].filter(Boolean);
    return [
      {
        key: id,
        label: `${label}: ${parts.join(" ")} мм`,
        onRemove: () =>
          applyFilters({ ...filters, [`${id}Min`]: "", [`${id}Max`]: "" }),
      },
    ];
  };

  const isPriceChanged =
    filters.minPrice !== DEFAULT_FILTERS.minPrice ||
    filters.maxPrice !== DEFAULT_FILTERS.maxPrice;

  const chips: FilterChip[] = [
    ...listChips("types"),
    ...listChips("brands"),
    ...listChips("materials"),
    ...listChips("colors"),
    ...(isPriceChanged
      ? [
          {
            key: "price",
            label: `от ${formatPrice(filters.minPrice)} до ${formatPrice(filters.maxPrice)} ₽`,
            onRemove: () =>
              applyFilters({
                ...filters,
                minPrice: DEFAULT_FILTERS.minPrice,
                maxPrice: DEFAULT_FILTERS.maxPrice,
              }),
          },
        ]
      : []),
    ...dimensionChip("length", "Длина"),
    ...dimensionChip("width", "Ширина"),
    ...dimensionChip("height", "Высота"),
  ];

  return (
    <div className="w-full bg-white pb-12 md:pb-16 lg:pb-20">
      <div className={styles.container}>
        {/* BREADCRUMB */}
        <nav
          aria-label="Хлебные крошки"
          className="pt-3 text-[14px] text-[#8A9098] lg:pt-[18px]"
        >
          <Link href="/" className="text-[#2C333D] hover:text-[#1976E8]">
            Стройоптторг
          </Link>
          <span className="mx-2.5">/</span>
          <span>Электроинструмент</span>
        </nav>

        {/* TITLE */}
        <div className="mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-1 lg:mt-[19px]">
          <h1 className="text-[28px] leading-[1.15] font-bold tracking-[-0.5px] text-[#303640] md:text-[30px] lg:text-[40px] 2xl:text-[44px]">
            Электроинструмент
          </h1>

          <span className="hidden text-[14px] text-[#8A9098] lg:inline">
            {filteredProducts.length}{" "}
            {pluralizeProducts(filteredProducts.length)}
          </span>
        </div>
      </div>

      {/* "ПОКАЗАТЬ ФИЛЬТРЫ" (360 / 768) — maketda ekranning to'liq kengligida */}
      <button
        type="button"
        onClick={() => setIsFiltersOpen(true)}
        className="mt-5 flex h-[54px] w-full items-center justify-center gap-2.5 border-y border-[#ECEEF1] bg-[#F8F9FA] text-[15px] font-medium text-[#303640] transition-colors hover:bg-[#F0F2F5] lg:hidden"
      >
        <SlidersHorizontal className="size-4" />
        Показать фильтры
        {chips.length > 0 && (
          <span className="flex size-5 items-center justify-center rounded-full bg-[#1976E8] text-[11px] font-bold text-white">
            {chips.length}
          </span>
        )}
      </button>

      <div className={styles.container}>
        <div className="mt-5 lg:mt-[50px] lg:grid lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-x-5 xl:grid-cols-[290px_minmax(0,1fr)] 2xl:grid-cols-[331px_minmax(0,1fr)]">
          {/* SIDEBAR (desktop) */}
          <aside className="hidden lg:block" aria-label="Фильтры">
            <CatalogFilters
              value={filters}
              onChange={applyFilters}
              className="-mt-4"
            />

            <div className="mt-10">
              <PromoBanners />
            </div>
          </aside>

          {/* PRODUCTS */}
          <section className="flex min-w-0 flex-col gap-5 lg:gap-[30px]">
            <div
              ref={productsTopRef}
              className="flex scroll-mt-[220px] flex-col gap-5 lg:scroll-mt-[180px]"
            >
              <CatalogToolbar
                sort={sort}
                perPage={perPage}
                onSortChange={(value) => {
                  setSort(value);
                  setPage(1);
                }}
                onPerPageChange={(value) => {
                  setPerPage(value);
                  setPage(1);
                }}
              />

              <ActiveFilterChips chips={chips} onClearAll={clearAll} />
            </div>

            {currentProducts.length === 0 ? (
              <div className="flex min-h-[320px] items-center justify-center rounded-xl border border-dashed border-[#D9DDE3] px-5 md:min-h-[450px]">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-[#303640]">
                    Ничего не найдено
                  </h3>
                  <p className="mt-2 text-sm text-[#858C95]">
                    Попробуйте изменить параметры фильтра.
                  </p>
                  <button
                    type="button"
                    onClick={clearAll}
                    className="mt-4 rounded-[7px] bg-[#1976E8] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0F67D0]"
                  >
                    Очистить фильтры
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-x-[17px] gap-y-[25px] md:grid-cols-3 md:gap-y-[35px] lg:gap-x-5 2xl:grid-cols-4 2xl:gap-x-[30px] 2xl:gap-y-10">
                  {currentProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      inCart={cart.has(product.id)}
                      isFavorite={favorites.has(product.id)}
                      inCompare={compare.has(product.id)}
                      onBuy={(id) => setCart((prev) => new Set(prev).add(id))}
                      onToggleFavorite={(id) =>
                        setFavorites((prev) => toggleInSet(prev, id))
                      }
                      onToggleCompare={(id) =>
                        setCompare((prev) => toggleInSet(prev, id))
                      }
                    />
                  ))}
                </div>

                <div className="mt-5 md:mt-[15px] lg:mt-[60px]">
                  <CatalogPagination
                    page={currentPage}
                    totalPages={totalPages}
                    onChange={changePage}
                  />
                </div>
              </>
            )}

            <div className="mt-5 lg:mt-[45px]">
              <CatalogSeoText />
            </div>
          </section>
        </div>
      </div>

      <FiltersDrawer
        open={isFiltersOpen}
        value={filters}
        onClose={closeDrawer}
        onApply={(next) => {
          applyFilters(next);
          closeDrawer();
        }}
      />
    </div>
  );
}
