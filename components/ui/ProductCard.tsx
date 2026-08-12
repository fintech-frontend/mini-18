"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, BarChart2, ShoppingCart } from "lucide-react";
import { Product } from "@/types/product";
import { useFavorites } from "@/context/FavoritesContext";
import { useCompare } from "@/context/CompareContext";

export default function ProductCard({ product }: { product: Product }) {
  const {
    id,
    title,
    article,
    price,
    oldPrice,
    discountPercentage,
    imageUrl,
    isHit,
  } = product;

  const { toggleFavorite, isFavorite } = useFavorites();
  const { toggleCompare, isInCompare } = useCompare();

  const favorite = isFavorite(id);
  const inCompare = isInCompare(id);

  return (
    <div className="group flex flex-col rounded-xl border border-gray-200 bg-white p-3 transition-shadow hover:shadow-md sm:p-4">
      <Link href={`/products/${id}`} className="flex flex-1 flex-col">
        {/* Image */}
        <div className="relative mb-3 flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-gray-50">
          {isHit && (
            <span className="absolute left-2 top-2 z-10 rounded-md bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-600">
              ХИТ
            </span>
          )}
          {discountPercentage && (
            <span className="absolute right-2 top-2 z-10 rounded-md bg-green-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
              -{discountPercentage}%
            </span>
          )}
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-contain p-4 transition-transform duration-200 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        </div>

        {/* Article */}
        <p className="mb-1 text-xs text-gray-400">Артикул: {article}</p>

        {/* Title */}
        <h3 className="mb-2 line-clamp-2 min-h-[2.5rem] text-sm text-gray-800">
          {title}
        </h3>

        {/* Price */}
        <div className="mb-3 mt-auto flex items-baseline gap-2">
          {oldPrice && (
            <span className="text-xs text-gray-400 line-through">
              {oldPrice.toLocaleString("ru-RU")} ₽
            </span>
          )}
          <span className="text-base font-semibold text-gray-900 sm:text-lg">
            {price.toLocaleString("ru-RU")} ₽
          </span>
        </div>
      </Link>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Link
          href={`/products/${id}`}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-blue-600 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <ShoppingCart size={16} />
          Купить
        </Link>
        <button
          type="button"
          onClick={() => toggleFavorite(product)}
          aria-label={favorite ? "Убрать из избранного" : "В избранное"}
          className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${
            favorite
              ? "border-red-300 bg-red-50 text-red-500"
              : "border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-500"
          }`}
        >
          <Heart size={16} fill={favorite ? "currentColor" : "none"} />
        </button>
        <button
          type="button"
          onClick={() => toggleCompare(product)}
          aria-label={inCompare ? "Убрать из сравнения" : "Сравнить"}
          className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${
            inCompare
              ? "border-blue-300 bg-blue-50 text-blue-600"
              : "border-gray-200 text-gray-500 hover:border-blue-300 hover:text-blue-600"
          }`}
        >
          <BarChart2 size={16} />
        </button>
      </div>
    </div>
  );
}