"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Heart, ShoppingCart, ChevronRight, ChevronDown } from "lucide-react";
import Container from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { useCompare } from "@/context/CompareContext";
import { useFavorites } from "@/context/FavoritesContext";
import { Product } from "@/types/product";

type Row = { label: string; getValue: (p: Product) => string };

export default function ComparePage() {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [onlyDifferences, setOnlyDifferences] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("all");

  const categories = useMemo(() => {
    const unique = Array.from(new Set(compareItems.map((p) => p.category).filter(Boolean)));
    return unique as string[];
  }, [compareItems]);

  const filteredItems = useMemo(() => {
    if (categoryFilter === "all") return compareItems;
    return compareItems.filter((p) => p.category === categoryFilter);
  }, [compareItems, categoryFilter]);

  // 1. Asosiy maydonlar (Тип товара, Бренд)
  const baseRows: Row[] = [
    { label: "Тип товара", getValue: (p) => p.productType ?? "—" },
    { label: "Бренд", getValue: (p) => p.brand ?? "—" },
  ];

  // 2. Har bir mahsulotning specs obyektidan dinamik qatorlar
const specRows: Row[] = useMemo(() => {
  if (filteredItems.length === 0) return [];

  const keySets = filteredItems.map((p) => new Set(Object.keys(p.specs ?? {})));
  const commonKeys = [...keySets[0]].filter((key) =>
    keySets.every((set) => set.has(key))
  );

  return commonKeys.map((key) => ({
    label: key,
    getValue: (p: Product) => p.specs?.[key] ?? "—",
  }));
}, [filteredItems]);

  // 3. Narx va boshqa umumiy maydonlar
  const priceRows: Row[] = [
    { label: "Цена", getValue: (p) => `${p.price.toLocaleString("ru-RU")} ₽` },
    { label: "Старая цена", getValue: (p) => (p.oldPrice ? `${p.oldPrice.toLocaleString("ru-RU")} ₽` : "—") },
    { label: "Скидка", getValue: (p) => (p.discountPercentage ? `-${p.discountPercentage}%` : "—") },
    { label: "Артикул", getValue: (p) => p.article },
    { label: "Категория", getValue: (p) => p.category ?? "—" },
    { label: "Хит продаж", getValue: (p) => (p.isHit ? "Да" : "Нет") },
  ];

  const allRows: Row[] = useMemo(
    () => [...baseRows, ...specRows, ...priceRows],
    [specRows]
  );

  const rows = useMemo(() => {
    if (!onlyDifferences) return allRows;
    return allRows.filter((row) => {
      const values = filteredItems.map((p) => row.getValue(p));
      return new Set(values).size > 1;
    });
  }, [onlyDifferences, filteredItems, allRows]);

  if (compareItems.length === 0) {
    return (
      <Container className="py-8 sm:py-12">
        <h1 className="mb-6 text-xl font-bold text-gray-900 sm:text-2xl">
          Сравнение
        </h1>
        <EmptyState
          title="Список сравнения пуст"
          description="Добавьте товары для сравнения с помощью значка на карточке товара"
        />
      </Container>
    );
  }

  return (
    <div className="bg-white">
      <Container className="py-6 sm:py-8">
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-1 text-xs text-gray-400">
          <Link href="/" className="hover:text-gray-600">
            Главная
          </Link>
          <ChevronRight size={12} />
          <span className="text-gray-600">Сравнение</span>
        </div>

        {/* Title */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Сравнение
          </h1>
          <button
            onClick={clearCompare}
            className="text-sm font-medium text-gray-400 transition hover:text-red-500"
          >
            Очистить всё
          </button>
        </div>

        {/* Sidebar + content: stacked on mobile, side-by-side on lg+ */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          {/* Filters sidebar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 lg:w-52 lg:shrink-0 lg:flex-col lg:items-stretch">
            <div className="relative sm:w-48 lg:w-full">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none"
              >
                <option value="all">Все категории</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>

            <div className="flex items-center gap-4 lg:flex-col lg:items-start lg:gap-2">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
                <input
                  type="radio"
                  name="diffMode"
                  checked={!onlyDifferences}
                  onChange={() => setOnlyDifferences(false)}
                  className="h-4 w-4 accent-blue-600"
                />
                Все характеристики
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
                <input
                  type="radio"
                  name="diffMode"
                  checked={onlyDifferences}
                  onChange={() => setOnlyDifferences(true)}
                  className="h-4 w-4 accent-blue-600"
                />
                Только различия
              </label>
            </div>
          </div>

          {/* Content: table on desktop, cards on mobile */}
          <div className="min-w-0 flex-1">
            {/* DESKTOP TABLE */}
            <div className="hidden lg:block">
              <div className="overflow-x-auto">
             <table className="table-fixed border-separate border-spacing-0">
                  <thead>
                    <tr>
                      <th className="w-44" />
                      {filteredItems.map((product) => {
                        const favorite = isFavorite(product.id);
                        return (
                          <th key={product.id} className="w-[200px] p-3 text-left align-top">
                            <ProductCompareCard
                              product={product}
                              favorite={favorite}
                              onRemove={() => removeFromCompare(product.id)}
                              onToggleFavorite={() => toggleFavorite(product)}
                            />
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, i) => (
                      <tr key={row.label} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                        <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-500">
                          {row.label}
                        </td>
                        {filteredItems.map((product) => (
                          <td key={product.id} className="px-4 py-3 text-sm text-gray-800">
                            {row.getValue(product)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* MOBILE / TABLET CARDS */}
            <div className="lg:hidden">
              <div className="flex gap-3 overflow-x-auto pb-4 sm:gap-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {filteredItems.map((product) => {
                  const favorite = isFavorite(product.id);
                  return (
                    <div
                      key={product.id}
                      className="w-[150px] shrink-0 rounded-xl border border-gray-200 p-3 shadow-sm sm:w-[190px] sm:p-4"
                    >
                      <ProductCompareCard
                        product={product}
                        favorite={favorite}
                        onRemove={() => removeFromCompare(product.id)}
                        onToggleFavorite={() => toggleFavorite(product)}
                      />
                      <div className="border-t border-gray-100 pt-3">
                        {rows.map((row) => (
                          <div key={row.label} className="border-b border-gray-100 py-2 last:border-b-0">
                            <p className="mb-0.5 text-xs text-gray-400">{row.label}</p>
                            <p className="text-sm text-gray-800">{row.getValue(product)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

function ProductCompareCard({
  product,
  favorite,
  onRemove,
  onToggleFavorite,
}: {
  product: Product;
  favorite: boolean;
  onRemove: () => void;
  onToggleFavorite: () => void;
}) {
  return (
    <div className="relative rounded-xl border border-gray-200 p-3 shadow-sm lg:border-0 lg:p-0 lg:shadow-none">
      <button
        onClick={onRemove}
        aria-label="Убрать из сравнения"
        className="absolute right-1 top-1 z-10 flex h-7 w-7 items-center justify-center rounded-lg text-gray-300 transition hover:bg-red-50 hover:text-red-500"
      >
        <Trash2 size={15} />
      </button>

      <Link href={`/products/${product.id}`} className="block">
        <div className="relative mb-3 flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-gray-50">
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            className="object-contain p-3 lg:p-4"
            sizes="200px"
          />
        </div>
        <p className="mb-2 line-clamp-2 min-h-[2.5rem] text-sm text-gray-800 hover:text-blue-600">
          {product.title}
        </p>
      </Link>

      <div className="mb-3 flex flex-wrap items-baseline gap-1.5">
        {product.oldPrice && (
          <span className="text-xs text-gray-400 line-through">
            {product.oldPrice.toLocaleString("ru-RU")} ₽
          </span>
        )}
        <span className="text-base font-bold text-gray-900">
          {product.price.toLocaleString("ru-RU")} ₽
        </span>
        {product.discountPercentage && (
          <span className="rounded bg-green-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
            -{product.discountPercentage}%
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Link
          href={`/products/${product.id}`}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-blue-600 py-2 text-xs font-medium text-white transition hover:bg-blue-700"
        >
          <ShoppingCart size={14} />
          Купить
        </Link>
        <button
          onClick={onToggleFavorite}
          aria-label="В избранное"
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition ${
            favorite
              ? "border-red-300 bg-red-50 text-red-500"
              : "border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-500"
          }`}
        >
          <Heart size={14} fill={favorite ? "currentColor" : "none"} />
        </button>
      </div>
    </div>
  );
}