"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Container from "@/components/ui/Container";

const brands = [
  { name: "КЕРАМИН", logo: "/assets/icons/brand-keramin.svg" },
  { name: "Electrolux", logo: "/assets/icons/brand-electrolux.svg" },
  { name: "BOSCH", logo: "/assets/icons/brand-bosch.svg" },
  { name: "oasis", logo: "/assets/icons/brand-oasis.svg" },
  { name: "KINPLAST", logo: "/assets/icons/brand-kinplast.svg" },
  { name: "Ceresit", logo: "/assets/icons/brand-ceresit.svg" },
  { name: "BAUPROFFE", logo: "/assets/icons/brand-bauproffe.svg" },
];

export const BrandsCarousel = () => {
  return (
    <section className="border-y border-gray-100 py-6 sm:py-8">
      <Container>
        <h2 className="mb-4 text-xl font-semibold text-gray-900 sm:mb-6 sm:text-2xl">
          Популярные бренды
        </h2>
        <div className="relative flex items-center gap-2">
          <button
            aria-label="Назад"
            className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 sm:flex"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex flex-1 gap-3 overflow-x-auto pb-1">
            {brands.map((brand) => (
              <div
                key={brand.name}
                className="flex h-16 w-37 shrink-0 items-center justify-center rounded-xl border border-gray-100 bg-white px-4"
              >
                <img src={brand.logo} alt={brand.name} className="max-h-8 max-w-full object-contain" />
              </div>
            ))}
          </div>
          <button
            aria-label="Вперёд"
            className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 sm:flex"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </Container>
    </section>
  );
};