"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { styles } from "@/styles/index.styles";
import ProductCard from "@/components/ui/ProductCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { useFavorites } from "@/context/FavoritesContext";

export default function FavoritesPage() {
  const { favorites } = useFavorites();

  return (
    <div className="bg-white">
      <div className={`${styles.container} py-6 sm:py-8`}>
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-1 text-xs text-gray-400">
          <Link href="/" className="hover:text-gray-600">
            Стройопттрог
          </Link>
          <ChevronRight size={12} />
          <span className="text-gray-600">Избранное</span>
        </div>

        <h1 className="mb-6 text-2xl font-bold text-gray-900 sm:text-3xl">
          Избранное
          {favorites.length > 0 && (
            <span className="ml-2 text-base font-normal text-gray-400">
              {favorites.length}
            </span>
          )}
        </h1>

        {favorites.length === 0 ? (
          <EmptyState
            title="В избранном пока пусто"
            description="Нажмите на сердечко у товара, чтобы добавить его сюда"
          />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
            {favorites.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
