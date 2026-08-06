"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Container from "@/components/ui/Container";
import { Product } from "@/types/product";
import ProductCard from "../ui/ProductCard";

const filters = ["Все товары", "Инструменты", "Сантехника", "Для дома", "Для сада"];

export const HitsSection = ({ products }: { products: Product[] }) => {
  const [activeFilter, setActiveFilter] = useState(filters[0]);

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
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`whitespace-nowrap rounded-lg border px-4 py-2 text-sm font-medium transition ${
                activeFilter === f
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Products row */}
        <div className="relative">
          <div className="flex gap-3 overflow-x-auto pb-2 sm:gap-4">
            {products.map((product) => (
              <div key={product.id} className="w-[220px] shrink-0 sm:w-[240px]">
                <ProductCard product={product} />
              </div>
            ))}

            {/* Promo card oxirida */}
           
          </div>

          <button
            aria-label="Назад"
            className="absolute -left-3 top-1/3 hidden h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white shadow sm:flex"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            aria-label="Вперёд"
            className="absolute -right-3 top-1/3 hidden h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white shadow sm:flex"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </Container>
    </section>
  );
};