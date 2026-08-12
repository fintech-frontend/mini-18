"use client";
import { EmptyState } from "@/components/ui/EmptyState";
import { useMemo, useState } from "react";
import Container from "@/components/ui/Container";
import ProductCard from "@/components/ui/ProductCard";
import { Product } from "@/types/product";

const filters = [
  { label: "Все товары", value: "all" },
  { label: "Инструменты", value: "instruments" },
  { label: "Сантехника", value: "santehnika" },
  { label: "Для дома", value: "home" },
  { label: "Для сада", value: "garden" },
];

export const BestOffers = ({ products }: { products: Product[] }) => {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") return products;
    return products.filter((product) => product.category === activeCategory);
  }, [products, activeCategory]);

  return (
    <section className="py-6 sm:py-8">
      <Container>
        <h2 className="mb-4 text-xl font-semibold text-gray-900 sm:text-2xl">
          Лучшее предложения
        </h2>
        <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveCategory(f.value)}
              className={`whitespace-nowrap rounded-lg border px-4 py-2 text-sm font-medium transition ${
                activeCategory === f.value
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
};