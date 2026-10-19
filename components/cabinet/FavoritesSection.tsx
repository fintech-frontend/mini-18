"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

import ProductCard from "@/components/ui/ProductCard";
import { useFavorites } from "@/context/FavoritesContext";

/* Sevimlilar API'da yo'q (/api/favorites/ — 404), shuning uchun header'dagi
   «Избранное» bilan bir xil ro'yxat (FavoritesContext, brauzerda saqlanadi) ko'rsatiladi */
export default function FavoritesSection() {
  const { favorites } = useFavorites();

  return (
    <div className="bg-white p-5 md:p-6 rounded-xl border border-gray-100 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-800">
          Избранные товары
          {favorites.length > 0 && <span className="ml-2 text-sm font-normal text-gray-400">{favorites.length}</span>}
        </h3>
        {favorites.length > 0 && (
          <Link href="/favorites" className="text-xs font-semibold text-[#005bff] hover:underline">
            Открыть страницу →
          </Link>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center py-10 text-center">
          <Heart size={36} className="mb-3 text-gray-300" />
          <p className="text-sm text-gray-500">В избранном пока ничего нет.</p>
          <Link href="/catalog" className="mt-4 rounded-md bg-[#005bff] px-5 py-2.5 text-xs font-bold uppercase text-white hover:bg-[#0049cc]">
            Перейти в каталог
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {favorites.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
