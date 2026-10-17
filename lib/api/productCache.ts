/**
 * Mahsulotlar keshi (id -> Product).
 *
 * Savat / izbrannoe / taqqoslash localStorage'da faqat id saqlaydi. Ekranda ko'rsatish
 * uchun mahsulot ma'lumoti shu yerdan olinadi: katalogda ko'rilganlar darhol keshga
 * tushadi (prime), qolganlari /products/{id}/ orqali bittadan yuklanadi.
 */

import { fetchProduct } from "@/lib/api/catalog";
import type { Product } from "@/types/productsTypes";

type Entry = { status: "loading" } | { status: "ready"; product: Product | null };

const entries = new Map<number, Entry>();
const listeners = new Set<() => void>();
let version = 0;

const emit = () => {
  version += 1;
  listeners.forEach((listener) => listener());
};

export const productCache = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  getVersion: () => version,

  get(id: number): Product | null | undefined {
    const entry = entries.get(id);
    return entry?.status === "ready" ? entry.product : undefined;
  },

  isLoading: (id: number) => entries.get(id)?.status === "loading",

  /** Katalogdan kelgan mahsulotlarni keshga qo'yish (qayta so'rov bo'lmaydi) */
  prime(products: Product[]) {
    let changed = false;
    for (const product of products) {
      const current = entries.get(product.id);
      if (current?.status === "ready" && current.product === product) continue;
      entries.set(product.id, { status: "ready", product });
      changed = true;
    }
    if (changed) emit();
  },

  /** Keshda yo'q id'larni yuklaydi; topilmagan (o'chirilgan) mahsulot -> null */
  load(ids: number[]) {
    const missing = ids.filter((id) => !entries.has(id));
    if (missing.length === 0) return;

    for (const id of missing) entries.set(id, { status: "loading" });
    emit();

    for (const id of missing) {
      fetchProduct(id)
        .then((product) => entries.set(id, { status: "ready", product }))
        // Tarmoq xatosi: keyingi safar qayta urinish uchun keshdan olib tashlaymiz
        .catch(() => entries.delete(id))
        .finally(emit);
    }
  },
};
