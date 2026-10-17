"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, ShoppingCart } from "lucide-react";
import { FiBarChart2 } from "react-icons/fi";
import { GoHeart, GoHeartFill } from "react-icons/go";

import { useCart } from "@/hooks/useCart";
import { MAX_COMPARE_ITEMS, useCompare } from "@/hooks/useCompare";
import { useFavorites } from "@/hooks/useFavorites";
import ProductImage from "@/components/ui/ProductImage";
import { routes } from "@/lib/routes";
import { cn, formatPrice } from "@/lib/utils";
import type { Product } from "@/types/productsTypes";

type Props = {
  product: Product;
};

/** Taqqoslash limiti haqidagi xabar necha ms ko'rinib turadi */
const LIMIT_NOTICE_MS = 2500;

const buyButton =
  "flex h-10 min-w-0 flex-1 items-center justify-center gap-2 rounded-[6px] text-[14px] font-medium text-white transition-colors md:max-w-[130px] md:text-[15px]";

const iconButton =
  "flex size-10 shrink-0 items-center justify-center rounded-[6px] border text-[18px] transition-colors";

export default function ProductCard({ product }: Props) {
  const { addToCart, isInCart } = useCart();
  const { toggleFavorite, isFavorite: checkFavorite } = useFavorites();
  const { toggleCompare, isInCompare } = useCompare();
  const [showLimitNotice, setShowLimitNotice] = useState(false);

  const inCart = isInCart(product.id);
  const isFavorite = checkFavorite(product.id);
  const inCompare = isInCompare(product.id);

  useEffect(() => {
    if (!showLimitNotice) return;
    const timer = setTimeout(() => setShowLimitNotice(false), LIMIT_NOTICE_MS);
    return () => clearTimeout(timer);
  }, [showLimitNotice]);

  const handleCompare = () => {
    if (toggleCompare(product.id) === "limit") setShowLimitNotice(true);
  };

  return (
    <article className="group flex min-w-0 flex-col">
      <Link href={routes.product(product.id)} className="block">
        {/* IMAGE */}
        <div className="relative h-[150px] md:h-[200px] xl:h-[220px]">
          {product.hit && (
            <span className="absolute top-0 left-0 z-10 rounded-[4px] border border-[#F3AD24] bg-white px-2 py-1 text-[10px] leading-none font-bold text-[#F3A600] uppercase">
              Хит
            </span>
          )}

          <ProductImage
            src={product.image}
            alt={product.title}
            sizes="(max-width: 767px) 50vw, (max-width: 1535px) 33vw, 300px"
            className="transition-transform duration-300 group-hover:scale-[1.03]"
          />
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
        {/* Savatda bo'lsa qayta qo'shmaymiz — savat sahifasiga olib boradi */}
        {inCart ? (
          <Link
            href="/cart"
            aria-label={`${product.title} — в корзине, перейти в корзину`}
            className={cn(buyButton, "bg-[#1AA36F] hover:bg-[#178F61]")}
          >
            <Check className="size-[18px] shrink-0" />
            <span className="hidden md:inline">В корзине</span>
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => addToCart(product.id)}
            aria-label={`Купить ${product.title}`}
            className={cn(buyButton, "bg-[#186FD4] hover:bg-[#0F67D0]")}
          >
            <ShoppingCart className="size-[18px] shrink-0" />
            <span className="hidden md:inline">Купить</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => toggleFavorite(product.id)}
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
          onClick={handleCompare}
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

      {showLimitNotice && (
        <p role="status" className="mt-2 text-[12px] leading-[1.3] text-[#D93829]">
          В сравнении может быть не больше {MAX_COMPARE_ITEMS} товаров.{" "}
          <Link href="/compare" className="underline underline-offset-2">
            Открыть сравнение
          </Link>
        </p>
      )}
    </article>
  );
}
