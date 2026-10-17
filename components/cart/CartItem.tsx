"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";

import ProductImage from "@/components/ui/ProductImage";
import QuantityStepper from "@/components/ui/QuantityStepper";
import { MAX_QUANTITY, useCart } from "@/hooks/useCart";
import { routes } from "@/lib/routes";
import { formatPrice } from "@/lib/utils";
import type { CartEntry } from "@/types/shopTypes";

type Props = {
  entry: CartEntry;
  /** Mahsulot havolasi bosilganda (masalan, drawer'ni yopish uchun) */
  onNavigate?: () => void;
};

/** Savatdagi bitta mahsulot qatori: drawer'da ham, /cart sahifasida ham */
export default function CartItem({ entry, onNavigate }: Props) {
  const { product, quantity, total } = entry;
  const { setQuantity, removeFromCart } = useCart();
  const href = routes.product(product.id);

  return (
    <li className="grid grid-cols-[72px_minmax(0,1fr)] gap-x-4 gap-y-3 border-b border-[#ECEEF1] py-4 last:border-b-0 md:grid-cols-[88px_minmax(0,1fr)_auto_120px_auto] md:items-center md:gap-x-5">
      <Link
        href={href}
        onClick={onNavigate}
        className="relative row-span-2 size-[72px] shrink-0 md:row-span-1 md:size-[88px]"
      >
        <ProductImage src={product.image} alt={product.title} sizes="88px" />
      </Link>

      <div className="min-w-0">
        <p className="text-[11px] text-[#A0A5AC]">Артикул: {product.article}</p>
        <Link
          href={href}
          onClick={onNavigate}
          className="mt-1 line-clamp-2 text-[14px] leading-[1.4] font-medium text-[#1F252C] transition-colors hover:text-[#1976E8] md:text-[15px]"
        >
          {product.title}
        </Link>
        <p className="mt-1 text-[13px] text-[#858C95]">
          {formatPrice(product.price)} ₽ / шт.
        </p>
      </div>

      <div className="col-start-2 flex items-center justify-between gap-3 md:contents">
        <QuantityStepper
          size="sm"
          value={quantity}
          max={MAX_QUANTITY}
          onChange={(next) => setQuantity(product.id, next)}
          label={`Количество: ${product.title}`}
        />

        <p className="text-[16px] font-bold whitespace-nowrap text-[#1267C6] md:text-right md:text-[17px]">
          {formatPrice(total)} ₽
        </p>

        <button
          type="button"
          onClick={() => removeFromCart(product.id)}
          aria-label={`Удалить ${product.title} из корзины`}
          className="flex size-9 shrink-0 items-center justify-center rounded-[6px] text-[#A0A5AC] transition-colors hover:bg-[#FFF4F3] hover:text-[#D93829]"
        >
          <Trash2 className="size-[18px]" />
        </button>
      </div>
    </li>
  );
}
