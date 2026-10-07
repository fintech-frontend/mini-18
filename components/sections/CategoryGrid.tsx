"use client";

import Link from "next/link";
import { ChevronRight, Package } from "lucide-react";
import { styles } from "@/styles/index.styles";
import { useGetCategoriesQuery } from "@/lib/api/apiSlice";

const fallbackCategories = [
  { name: "Сантехника", slug: "santehnika" },
  { name: "Отделочные материалы", slug: "otdelka" },
  { name: "Электротовары", slug: "electro" },
  { name: "Инструменты", slug: "instrumenty" },
  { name: "Столярные изделия", slug: "stolyarnye" },
  { name: "Общестроительные материалы", slug: "obshestroy" },
  { name: "Все для сауны и бани", slug: "sauna" },
];

export const CategoryGrid = () => {
  const { data, isLoading, isError } = useGetCategoriesQuery();

  const categories =
    !isLoading && !isError && data && data.results.length > 0
      ? data.results
          .filter((c) => c.is_active)
          .slice(0, 7)
          .map((c) => ({ name: c.name, slug: c.slug }))
      : fallbackCategories;

  return (
    <section className="py-6 sm:py-8">
      <div className={styles.container}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/catalog/${cat.slug}`}
              className="flex flex-col items-center gap-2 rounded-xl border border-gray-100 bg-white p-4 text-center transition hover:border-blue-200 hover:shadow-sm"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-500">
                <Package size={24} />
              </div>
              <span className="text-xs text-gray-600 sm:text-sm">{cat.name}</span>
            </Link>
          ))}

          <Link
            href="/catalog"
            className="flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-100 bg-white p-4 text-center transition hover:border-blue-200 hover:shadow-sm"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-gray-200 text-gray-500">
              <ChevronRight size={20} />
            </div>
            <span className="text-xs text-gray-600 sm:text-sm">Перейти в каталог</span>
          </Link>
        </div>
      </div>
    </section>
  );
};