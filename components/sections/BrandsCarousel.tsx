"use client";

import { Tag } from "lucide-react";
import { styles } from "@/styles/index.styles";
import { useGetBrandsQuery } from "@/lib/api/apiSlice";

const fallbackBrands: { name: string; slug: string; logo?: string }[] = [
  { name: "КЕРАМИН", slug: "keramin" },
  { name: "Electrolux", slug: "electrolux" },
  { name: "BOSCH", slug: "bosch" },
  { name: "oasis", slug: "oasis" },
  { name: "KINPLAST", slug: "kinplast" },
  { name: "Ceresit", slug: "ceresit" },
  { name: "BAUPROFFE", slug: "bauproffe" },
];

export const BrandsCarousel = () => {
  const { data, isLoading, isError } = useGetBrandsQuery();

  const brands =
    !isLoading && !isError && data && data.results.length > 0
      ? data.results.map((b) => ({ name: b.name, slug: b.slug, logo: b.logo }))
      : fallbackBrands;

  return (
    <section className="border-y border-gray-100 py-6 sm:py-8">
      <div className={styles.container}>
        <h2 className="mb-4 text-xl font-semibold text-gray-900 sm:mb-6 sm:text-2xl">
          Популярные бренды
        </h2>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {brands.map((brand) => (
            <div
              key={brand.slug}
              className="flex h-16 w-37 shrink-0 items-center justify-center gap-2 rounded-xl border border-gray-100 bg-white px-4"
            >
              {brand.logo ? (
                <img src={brand.logo} alt={brand.name} className="max-h-8 max-w-full object-contain" />
              ) : (
                <>
                  <Tag size={16} className="shrink-0 text-gray-400" />
                  <span className="truncate text-sm font-medium text-gray-700">
                    {brand.name}
                  </span>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};