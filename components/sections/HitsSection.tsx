"use client";

import { useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Container from "@/components/ui/Container";
import ProductCard from "@/components/ui/ProductCard";
import { Product } from "@/types/product";
import { EmptyState } from "../ui/EmptyState";

const filters = [
  { label: "Все товары", value: "all" },
  { label: "Инструменты", value: "instruments" },
  { label: "Сантехника", value: "santehnika" },
  { label: "Для дома", value: "home" },
  { label: "Для сада", value: "garden" },
];

export const HitsSection = ({ products }: { products: Product[] }) => {
  const [activeCategory, setActiveCategory] = useState("all");
  const scrollRef = useRef<HTMLDivElement>(null);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") return products;
    return products.filter((product) => product.category === activeCategory);
  }, [products, activeCategory]);

  const scrollBy = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.9;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-6 sm:py-8">
      <Container>
        <h2 className="mb-4 text-xl font-semibold text-gray-900 sm:text-2xl">
          Хиты продаж
        </h2>

        {/* Filter tabs */}
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

        {/* Carousel */}
        {/* Carousel */}
{filteredProducts.length === 0 ? (
  <EmptyState />
) : (
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto scroll-smooth pb-2 sm:gap-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="w-[46%] shrink-0 snap-start sm:w-[31%] md:w-[23%] lg:w-[19%]"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Arrows */}
          <button
            onClick={() => scrollBy("left")}
            aria-label="Назад"
            className="absolute left-0 top-[35%] hidden h-9 w-9 -translate-x-4 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm hover:bg-gray-50 sm:flex"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scrollBy("right")}
            aria-label="Вперёд"
            className="absolute right-0 top-[35%] hidden h-9 w-9 -translate-y-1/2 translate-x-4 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm hover:bg-gray-50 sm:flex"
          >
            <ChevronRight size={18} />
          </button>
        </div>
)}
      </Container>
    </section>
  );
};