"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ShoppingCart } from "lucide-react";
import { FiBarChart2 } from "react-icons/fi";
import { GoHeart, GoHeartFill } from "react-icons/go";

import QuantityStepper from "@/components/ui/QuantityStepper";
import { MAX_QUANTITY, useCart } from "@/hooks/useCart";
import { MAX_COMPARE_ITEMS, useCompare } from "@/hooks/useCompare";
import { useFavorites } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/productsTypes";

const secondaryButton =
  "flex h-11 items-center justify-center gap-2 rounded-[7px] border text-sm font-medium transition-colors";

/** Mahsulot sahifasidagi: soni, "Купить", "В избранное", "Сравнить" */
export default function ProductPurchasePanel({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [compareLimitHit, setCompareLimitHit] = useState(false);

  const { addToCart, isInCart, entries } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { toggleCompare, isInCompare } = useCompare();

  const inCart = isInCart(product.id);
  const quantityInCart =
    entries.find((entry) => entry.product.id === product.id)?.quantity ?? 0;
  const favorite = isFavorite(product.id);
  const inCompare = isInCompare(product.id);
  const outOfStock = !product.stock;

  const handleCompare = () => {
    setCompareLimitHit(toggleCompare(product.id) === "limit");
  };

  return (
    <div className="mt-6">
      <div className="flex gap-3">
        <QuantityStepper
          value={quantity}
          max={product.stock || MAX_QUANTITY}
          onChange={setQuantity}
        />

        <button
          type="button"
          disabled={outOfStock}
          onClick={() => addToCart(product.id, quantity)}
          className="flex h-11 flex-1 items-center justify-center gap-2 rounded-[7px] bg-[#1976E8] text-sm font-semibold text-white transition-colors hover:bg-[#0F67D0] disabled:cursor-not-allowed disabled:bg-[#A0A5AC]"
        >
          <ShoppingCart className="size-[18px]" />
          {outOfStock ? "Нет в наличии" : inCart ? "Добавить ещё" : "Купить"}
        </button>
      </div>

      {inCart && (
        <p role="status" className="mt-2 flex items-center gap-1.5 text-[13px] text-[#1AA36F]">
          <Check className="size-4" />В корзине: {quantityInCart} шт.
          <Link href="/cart" className="ml-1 text-[#1976E8] underline-offset-2 hover:underline">
            Перейти в корзину
          </Link>
        </p>
      )}

      <div className="mt-3 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => toggleFavorite(product.id)}
          aria-pressed={favorite}
          className={cn(
            secondaryButton,
            favorite
              ? "border-[#FAD4D0] bg-[#FFF4F3] text-[#D93829]"
              : "border-[#DCE0E5] hover:bg-[#F5F6F8]",
          )}
        >
          {favorite ? <GoHeartFill /> : <GoHeart />}
          {favorite ? "В избранном" : "В избранное"}
        </button>

        <button
          type="button"
          onClick={handleCompare}
          aria-pressed={inCompare}
          className={cn(
            secondaryButton,
            inCompare
              ? "border-[#BBD6F7] bg-[#F0F5FB] text-[#1976E8]"
              : "border-[#DCE0E5] hover:bg-[#F5F6F8]",
          )}
        >
          <FiBarChart2 />
          {inCompare ? "В сравнении" : "Сравнить"}
        </button>
      </div>

      {compareLimitHit && (
        <p role="status" className="mt-2 text-[13px] text-[#D93829]">
          В сравнении может быть не больше {MAX_COMPARE_ITEMS} товаров.{" "}
          <Link href="/compare" className="underline underline-offset-2">
            Открыть сравнение
          </Link>
        </p>
      )}
    </div>
  );
}
