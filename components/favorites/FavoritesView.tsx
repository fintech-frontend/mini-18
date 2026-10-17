"use client";

import { Heart } from "lucide-react";

import ProductCard from "@/components/catalog/ProductCard";
import EmptyState from "@/components/ui/EmptyState";
import LoadingState from "@/components/ui/LoadingState";
import { useFavorites } from "@/hooks/useFavorites";
import { pluralizeProducts } from "@/lib/utils";

/** /favorites sahifasining mazmuni */
export default function FavoritesView() {
  const { products, count, isLoading, clearFavorites } = useFavorites();

  if (count > 0 && products.length === 0 && isLoading) return <LoadingState />;

  if (count === 0) {
    return (
      <EmptyState
        icon={Heart}
        title="В избранном пока пусто"
        description="Нажмите на сердечко на карточке товара, чтобы сохранить его здесь."
      />
    );
  }

  return (
    <>
      <div className="flex items-center justify-between border-b border-[#ECEEF1] pb-3">
        <p className="text-[14px] text-[#858C95]">
          {products.length} {pluralizeProducts(products.length)}
        </p>
        <button
          type="button"
          onClick={clearFavorites}
          className="text-[14px] font-medium text-[#858C95] transition-colors hover:text-[#D93829]"
        >
          Очистить избранное
        </button>
      </div>

      {/* Katalogdagi grid bilan bir xil, sidebar yo'qligi uchun ustunlar ko'proq */}
      <div className="mt-6 grid grid-cols-2 gap-x-[17px] gap-y-[25px] md:grid-cols-3 md:gap-y-[35px] lg:grid-cols-4 lg:gap-x-5 2xl:grid-cols-5 2xl:gap-x-[30px] 2xl:gap-y-10">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}
