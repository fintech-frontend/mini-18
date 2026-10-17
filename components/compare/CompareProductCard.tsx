"use client";

import Link from "next/link";
import { Check, ShoppingCart, X } from "lucide-react";
import { GoHeart, GoHeartFill } from "react-icons/go";

import ProductImage from "@/components/ui/ProductImage";
import { useCart } from "@/hooks/useCart";
import { useCompare } from "@/hooks/useCompare";
import { useFavorites } from "@/hooks/useFavorites";
import { routes } from "@/lib/routes";
import { cn, formatPrice } from "@/lib/utils";
import type { Product } from "@/types/productsTypes";

/** Taqqoslash jadvalining sarlavhasidagi mahsulot kartochkasi */
export default function CompareProductCard({ product }: { product: Product }) {
  const { addToCart, isInCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { removeFromCompare } = useCompare();

  const inCart = isInCart(product.id);
  const favorite = isFavorite(product.id);
  const href = routes.product(product.id);

  return (
    <div className="relative flex h-full flex-col text-left">
      <button
        type="button"
        onClick={() => removeFromCompare(product.id)}
        aria-label={`Убрать ${product.title} из сравнения`}
        className="absolute top-0 right-0 z-10 flex size-8 items-center justify-center rounded-full bg-white/90 text-[#A0A5AC] shadow-sm transition-colors hover:text-[#D93829]"
      >
        <X className="size-4" />
      </button>

      <Link href={href} className="group block">
        <div className="relative h-[120px] md:h-[150px]">
          <ProductImage
            src={product.image}
            alt={product.title}
            sizes="220px"
            className="transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </div>
        <p className="mt-3 line-clamp-2 min-h-[40px] text-[14px] leading-[1.4] font-medium text-[#1F252C] transition-colors group-hover:text-[#1976E8]">
          {product.title}
        </p>
      </Link>

      <p className="mt-2 text-[17px] font-bold text-[#1267C6]">
        {formatPrice(product.price)} ₽
      </p>

      <div className="mt-auto flex items-center gap-2 pt-3">
        {inCart ? (
          <Link
            href="/cart"
            className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-[6px] bg-[#1AA36F] text-[13px] font-medium text-white transition-colors hover:bg-[#178F61]"
          >
            <Check className="size-4" />В корзине
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => addToCart(product.id)}
            className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-[6px] bg-[#186FD4] text-[13px] font-medium text-white transition-colors hover:bg-[#0F67D0]"
          >
            <ShoppingCart className="size-4" />
            Купить
          </button>
        )}

        <button
          type="button"
          onClick={() => toggleFavorite(product.id)}
          aria-label={favorite ? "Убрать из избранного" : "В избранное"}
          aria-pressed={favorite}
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-[6px] border text-[16px] transition-colors",
            favorite
              ? "border-[#FAD4D0] bg-[#FFF4F3] text-[#D93829]"
              : "border-[#E0E3E7] text-[#1F252C] hover:bg-[#F5F6F8]",
          )}
        >
          {favorite ? <GoHeartFill /> : <GoHeart />}
        </button>
      </div>
    </div>
  );
}
