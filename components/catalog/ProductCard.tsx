"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, ImageOff, ShoppingCart } from "lucide-react";
import { FiBarChart2 } from "react-icons/fi";
import { GoHeart, GoHeartFill } from "react-icons/go";

import { cn, formatPrice } from "@/lib/utils";
import type { Product } from "@/types/productsTypes";

type Props = {
  product: Product;
  inCart: boolean;
  isFavorite: boolean;
  inCompare: boolean;
  onBuy: (id: number) => void;
  onToggleFavorite: (id: number) => void;
  onToggleCompare: (id: number) => void;
};

function ProductImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-lg bg-[#F5F7F9] text-[#C3C8CF]">
        <ImageOff className="size-8" aria-hidden />
        <span className="sr-only">{alt}</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 767px) 50vw, (max-width: 1535px) 33vw, 300px"
      onError={() => setFailed(true)}
      className="object-contain transition-transform duration-300 group-hover:scale-[1.03]"
    />
  );
}

const iconButton =
  "flex size-10 shrink-0 items-center justify-center rounded-[6px] border text-[18px] transition-colors";

export default function ProductCard({
  product,
  inCart,
  isFavorite,
  inCompare,
  onBuy,
  onToggleFavorite,
  onToggleCompare,
}: Props) {
  return (
    <article className="group flex min-w-0 flex-col">
      <Link href={`/catalog/${product.id}`} className="block">
        {/* IMAGE */}
        <div className="relative h-[150px] md:h-[200px] xl:h-[220px]">
          {product.hit && (
            <span className="absolute top-0 left-0 z-10 rounded-[4px] border border-[#F3AD24] bg-white px-2 py-1 text-[10px] leading-none font-bold text-[#F3A600] uppercase">
              Хит
            </span>
          )}

          <ProductImage src={product.image} alt={product.title} />
        </div>

        {/* ARTICLE */}
        <p className="mt-3 truncate text-[11px] text-[#A0A5AC] md:mt-4 md:text-[12px]">
          Артикул: {product.article}
        </p>

        {/* TITLE */}
        <h3 className="mt-1.5 line-clamp-3 min-h-[60px] text-[14px] leading-[1.4] font-medium text-[#1F252C] transition-colors group-hover:text-[#1976E8] md:min-h-[66px] md:text-[15px] lg:line-clamp-2 lg:min-h-[44px]">
          {product.title}
        </h3>
      </Link>

      {/* PRICE */}
      <div className="mt-2 flex min-h-[44px] flex-wrap content-end items-center gap-x-2 gap-y-0.5 md:min-h-0 md:content-normal">
        {product.oldPrice && (
          <span className="w-full text-[12px] text-[#A4A8AE] line-through md:w-auto md:text-[13px]">
            {formatPrice(product.oldPrice)} ₽
          </span>
        )}

        <span className="text-[16px] font-bold whitespace-nowrap text-[#1267C6] md:text-[18px]">
          {formatPrice(product.price)} ₽
        </span>

        {product.discount && (
          <span className="rounded-[4px] bg-[#1AA36F] px-1.5 py-0.5 text-[11px] font-bold text-white">
            -{product.discount}%
          </span>
        )}
      </div>

      {/* ACTIONS */}
      <div className="mt-3 flex items-center gap-2 md:gap-2.5">
        <button
          type="button"
          onClick={() => onBuy(product.id)}
          aria-label={inCart ? "Товар в корзине" : `Купить ${product.title}`}
          className={cn(
            "flex h-10 min-w-0 flex-1 items-center justify-center gap-2 rounded-[6px] text-[14px] font-medium text-white transition-colors md:max-w-[130px] md:text-[15px]",
            inCart
              ? "bg-[#1AA36F] hover:bg-[#178F61]"
              : "bg-[#186FD4] hover:bg-[#0F67D0]",
          )}
        >
          {inCart ? (
            <Check className="size-[18px] shrink-0" />
          ) : (
            <ShoppingCart className="size-[18px] shrink-0" />
          )}
          <span className="hidden md:inline">
            {inCart ? "В корзине" : "Купить"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onToggleFavorite(product.id)}
          aria-label={isFavorite ? "Убрать из избранного" : "В избранное"}
          aria-pressed={isFavorite}
          className={cn(
            iconButton,
            isFavorite
              ? "border-[#FAD4D0] bg-[#FFF4F3] text-[#D93829]"
              : "border-[#E0E3E7] text-[#1F252C] hover:bg-[#F5F6F8]",
          )}
        >
          {isFavorite ? <GoHeartFill /> : <GoHeart />}
        </button>

        <button
          type="button"
          onClick={() => onToggleCompare(product.id)}
          aria-label={inCompare ? "Убрать из сравнения" : "Сравнить"}
          aria-pressed={inCompare}
          className={cn(
            iconButton,
            inCompare
              ? "border-[#BBD6F7] bg-[#F0F5FB] text-[#1976E8]"
              : "border-[#E0E3E7] text-[#1F252C] hover:bg-[#F5F6F8]",
          )}
        >
          <FiBarChart2 />
        </button>
      </div>
    </article>
  );
}
