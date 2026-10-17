import type { CartDiscount, DiscountTier } from "@/types/shopTypes";

/** Savat summasidan chegirma pog'onalari (o'sish tartibida) */
export const DISCOUNT_TIERS: DiscountTier[] = [
  { from: 3000, percent: 5 },
  { from: 7000, percent: 10 },
  { from: 20000, percent: 15 },
];

export function getCartDiscount(subtotal: number): CartDiscount {
  const current = DISCOUNT_TIERS.filter((tier) => subtotal >= tier.from).at(-1);
  const nextTier = DISCOUNT_TIERS.find((tier) => subtotal < tier.from) ?? null;
  const percent = current?.percent ?? 0;

  return {
    percent,
    amount: Math.round((subtotal * percent) / 100),
    nextTier,
    amountToNextTier: nextTier ? nextTier.from - subtotal : 0,
  };
}
