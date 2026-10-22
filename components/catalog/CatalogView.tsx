"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SlidersHorizontal } from "lucide-react";

import ActiveFilterChips, {
  type FilterChip,
} from "@/components/catalog/ActiveFilterChips";
import CatalogFilters from "@/components/catalog/CatalogFilters";
import CatalogSeoText from "@/components/catalog/CatalogSeoText";
import CatalogToolbar from "@/components/catalog/CatalogToolbar";
import FiltersDrawer from "@/components/catalog/FiltersDrawer";
import ProductCard from "@/components/catalog/ProductCard";
import PromoBanners from "@/components/catalog/PromoBanners";
import LoadingState from "@/components/ui/LoadingState";
import Pagination from "@/components/ui/Pagination";
import { useFilterOptions, useProductPage } from "@/hooks/useCatalogData";
import { useCatalogQuery } from "@/hooks/useCatalogQuery";
import { sortByDiscount, toProductParams } from "@/lib/api/catalog";
import { createDefaultFilters, optionLabel } from "@/lib/catalog/filterOptions";
import { routes } from "@/lib/routes";
import { cn, formatPrice, pluralizeProducts } from "@/lib/utils";
import { styles } from "@/styles/index.styles";
import type {
  CatalogCategory,
  FilterListKey,
  FilterOptions,
  FilterState,
} from "@/types/productsTypes";

type Props = {
  /** Berilmasa — butun katalog (/catalog) */
  category?: CatalogCategory;
};

/** Breadcrumb + sarlavha (yuklanish paytida ham ko'rinadi) */
function CatalogHeader({
  category,
  count,
}: {
  category?: CatalogCategory;
  count?: number;
}) {
  const title = category?.title ?? "Каталог товаров";

  return (
    <div className={styles.container}>
      <nav
        aria-label="Хлебные крошки"
        className="pt-3 text-[14px] text-[#8A9098] lg:pt-[18px]"
      >
        <Link href="/" className="text-[#2C333D] hover:text-[#1976E8]">
          Стройоптторг
        </Link>
        <span className="mx-2.5">/</span>
        {category && (
          <>
            <Link href={routes.catalog} className="text-[#2C333D] hover:text-[#1976E8]">
              Каталог
            </Link>
            <span className="mx-2.5">/</span>
          </>
        )}
        <span aria-current="page">{title}</span>
      </nav>

      <div className="mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-1 lg:mt-[19px]">
        <h1 className="text-[28px] leading-[1.15] font-bold tracking-[-0.5px] text-[#303640] md:text-[30px] lg:text-[40px] 2xl:text-[44px]">
          {title}
        </h1>

        {count !== undefined && (
          <span className="hidden text-[14px] text-[#8A9098] lg:inline">
            {count} {pluralizeProducts(count)}
          </span>
        )}
      </div>
    </div>
  );
}

function ErrorBlock({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-dashed border-[#F3C4BE] px-5 text-center">
      <h2 className="text-lg font-semibold text-[#303640]">
        Не удалось загрузить товары
      </h2>
      <p className="mt-2 text-sm text-[#858C95]">
        Проверьте подключение к интернету и попробуйте ещё раз.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 rounded-[7px] bg-[#1976E8] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0F67D0]"
      >
        Повторить
      </button>
    </div>
  );
}

export default function CatalogView({ category }: Props) {
  // Filtr variantlari va narx chegaralari avval yuklanadi — URL holati ular asosida o'qiladi
  const { options, isError, retry } = useFilterOptions(category?.slug);

  if (!options) {
    return (
      <div className="w-full bg-white pb-12 md:pb-16 lg:pb-20">
        <CatalogHeader category={category} />
        <div className={cn(styles.container, "mt-8")}>
          {isError ? <ErrorBlock onRetry={retry} /> : <LoadingState />}
        </div>
      </div>
    );
  }

  if (options.total === 0) {
    return (
      <div className="w-full bg-white pb-12 md:pb-16 lg:pb-20">
        <CatalogHeader category={category} count={0} />
        <div className={cn(styles.container, "mt-8")}>
          <div className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-dashed border-[#D9DDE3] px-5 text-center">
            <h2 className="text-lg font-semibold text-[#303640]">
              В этой категории пока нет товаров
            </h2>
            <p className="mt-2 text-sm text-[#858C95]">
              Мы скоро добавим товары. Посмотрите другие разделы каталога.
            </p>
            <Link
              href={routes.catalog}
              className="mt-4 rounded-[7px] bg-[#1976E8] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0F67D0]"
            >
              Весь каталог
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <CatalogContent category={category} options={options} />;
}

function CatalogContent({
  category,
  options,
}: {
  category?: CatalogCategory;
  options: FilterOptions;
}) {
  const defaultFilters = useMemo(() => createDefaultFilters(options), [options]);

  const [query, updateQuery] = useCatalogQuery(options);
  const { filters, sort, perPage, page, search } = query;

  const params = useMemo(
    () => toProductParams(query, options, category?.slug),
    [query, options, category?.slug],
  );
  const { data, isLoading, isError, isPageNotFound, retry } = useProductPage(params);

  // Havoladagi sahifa endi mavjud emas (mahsulotlar kamaygan) — 1-sahifaga qaytamiz
  useEffect(() => {
    if (isPageNotFound && query.page > 1) updateQuery({ ...query, page: 1 });
  }, [isPageNotFound, query, updateQuery]);

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const productsTopRef = useRef<HTMLDivElement>(null);

  const items = useMemo(() => {
    const list = data?.items ?? [];
    return sort === "discount-desc" ? sortByDiscount(list) : list;
  }, [data, sort]);

  const totalPages = Math.max(1, data?.pages ?? 1);
  const currentPage = Math.min(page, totalPages);

  /* ---------- handlers ---------- */

  // Filtr o'zgarsa birinchi sahifaga qaytamiz
  const applyFilters = useCallback(
    (next: FilterState) => updateQuery({ ...query, filters: next, page: 1 }),
    [query, updateQuery],
  );

  const clearAll = () =>
    updateQuery({ ...query, filters: defaultFilters, search: "", page: 1 });

  const removeFromList = (key: FilterListKey, value: string) =>
    applyFilters({
      ...filters,
      [key]: filters[key].filter((item) => item !== value),
    });

  // Sahifa almashinuvi history'ga yoziladi — "Orqaga" oldingi sahifaga qaytaradi
  const changePage = (next: number) => {
    updateQuery({ ...query, page: next }, "push");
    productsTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const closeDrawer = useCallback(() => setIsFiltersOpen(false), []);

  /* ---------- tanlangan filtrlar (chip) ---------- */

  const listChips = (key: FilterListKey): FilterChip[] =>
    filters[key].map((value) => ({
      key: `${key}-${value}`,
      label: optionLabel(options, key, value),
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
    filters.minPrice !== defaultFilters.minPrice ||
    filters.maxPrice !== defaultFilters.maxPrice;

  const chips: FilterChip[] = [
    ...(search
      ? [
          {
            key: "search",
            label: `Поиск: «${search}»`,
            onRemove: () => updateQuery({ ...query, search: "", page: 1 }),
          },
        ]
      : []),
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
                minPrice: defaultFilters.minPrice,
                maxPrice: defaultFilters.maxPrice,
              }),
          },
        ]
      : []),
    ...dimensionChip("length", "Длина"),
    ...dimensionChip("width", "Ширина"),
    ...dimensionChip("height", "Высота"),
  ];

  const renderProducts = () => {
    if (isError) return <ErrorBlock onRetry={retry} />;
    if (!data) return <LoadingState />;

    if (items.length === 0) {
      return (
        <div className="flex min-h-[320px] items-center justify-center rounded-xl border border-dashed border-[#D9DDE3] px-5 md:min-h-[450px]">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-[#303640]">
              Ничего не найдено
            </h3>
            <p className="mt-2 text-sm text-[#858C95]">
              {search
                ? "Попробуйте изменить запрос или параметры фильтра."
                : "Попробуйте изменить параметры фильтра."}
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
      );
    }

    return (
      <>
        {/* Yangi natija kelguncha eskisi xira ko'rinib turadi */}
        <div
          aria-busy={isLoading}
          className={cn(
            "grid grid-cols-2 gap-x-[17px] gap-y-[25px] transition-opacity md:grid-cols-3 md:gap-y-[35px] lg:gap-x-5 2xl:grid-cols-4 2xl:gap-x-[30px] 2xl:gap-y-10",
            isLoading && "pointer-events-none opacity-50",
          )}
        >
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-5 md:mt-[15px] lg:mt-[60px]">
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onChange={changePage}
          />
        </div>
      </>
    );
  };

  return (
    <div className="w-full bg-white pb-12 md:pb-16 lg:pb-20">
      <CatalogHeader category={category} count={data?.count} />

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
              options={options}
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
                onSortChange={(value) =>
                  updateQuery({ ...query, sort: value, page: 1 })
                }
                onPerPageChange={(value) =>
                  updateQuery({ ...query, perPage: value, page: 1 })
                }
              />

              <ActiveFilterChips chips={chips} onClearAll={clearAll} />
            </div>

            {renderProducts()}

            {category?.seo && (
              <div className="mt-5 lg:mt-[45px]">
                <CatalogSeoText seo={category.seo} />
              </div>
            )}
          </section>
        </div>
      </div>

      <FiltersDrawer
        open={isFiltersOpen}
        value={filters}
        options={options}
        onClose={closeDrawer}
        onApply={(next) => {
          applyFilters(next);
          closeDrawer();
        }}
      />
    </div>
  );
}
