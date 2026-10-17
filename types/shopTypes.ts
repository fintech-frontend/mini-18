import type { Product } from "@/types/productsTypes";

/** localStorage'da saqlanadigan savat qatori (faqat id va soni) */
export type CartLine = {
  id: number;
  quantity: number;
};

/** UI uchun: mahsulot ma'lumoti bilan birlashtirilgan savat qatori */
export type CartEntry = {
  product: Product;
  quantity: number;
  /** price * quantity */
  total: number;
};

/** Savat summasiga qarab beriladigan chegirma pog'onasi */
export type DiscountTier = {
  from: number;
  percent: number;
};

export type CartDiscount = {
  /** Hozirgi chegirma foizi (0 — chegirma yo'q) */
  percent: number;
  /** Chegirma summasi, ₽ */
  amount: number;
  /** Keyingi pog'ona (eng yuqorisiga yetilgan bo'lsa null) */
  nextTier: DiscountTier | null;
  /** Keyingi pog'onagacha qolgan summa, ₽ */
  amountToNextTier: number;
};

/** toggle natijasi: UI foydalanuvchiga xabar ko'rsatishi uchun */
export type CompareToggleResult = "added" | "removed" | "limit";
