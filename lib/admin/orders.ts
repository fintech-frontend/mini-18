import type { ApiOrder } from "@/lib/api/adminApi";

/* Buyurtma statuslari. Backend'da status erkin matn (maks. 50 belgi);
   sayt yangi buyurtmani "pending" bilan yaratadi. */
export const ORDER_STATUSES = ["pending", "processing", "shipping", "delivered", "cancelled", "returned"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Yangi",
  processing: "Jarayonda",
  shipping: "Yo'lda",
  delivered: "Yetkazilgan",
  cancelled: "Bekor qilingan",
  returned: "Qaytarilgan",
};

/** Keyingi bosqich (yetkazib berish oqimi) */
export const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  pending: "processing",
  processing: "shipping",
  shipping: "delivered",
};

export const NEXT_ACTION: Partial<Record<OrderStatus, string>> = {
  pending: "Qabul qilish",
  processing: "Yo'lga chiqarish",
  shipping: "Yetkazildi",
};

const ALIASES: Record<string, OrderStatus> = {
  new: "pending",
  created: "pending",
  confirmed: "processing",
  paid: "processing",
  shipped: "shipping",
  completed: "delivered",
  done: "delivered",
  canceled: "cancelled",
};

/** Noma'lum statusni ham ma'lum guruhga keltiradi */
export function statusOf(o: Pick<ApiOrder, "status">): OrderStatus {
  const s = (o.status || "").toLowerCase();
  if ((ORDER_STATUSES as readonly string[]).includes(s)) return s as OrderStatus;
  return ALIASES[s] ?? "pending";
}

export const money = (v: string | number | null | undefined) => {
  const n = typeof v === "number" ? v : parseFloat(String(v ?? ""));
  return Number.isFinite(n) ? n : 0;
};

export const orderTime = (o: Pick<ApiOrder, "created_at">) => {
  const t = new Date(o.created_at).getTime();
  return Number.isFinite(t) ? t : 0;
};

/** Sotuv hisoblanadimi (bekor/qaytarilgan emas) */
export const isSold = (o: Pick<ApiOrder, "status">) => {
  const s = statusOf(o);
  return s !== "cancelled" && s !== "returned";
};

export const DAY = 86_400_000;

export const CURRENCY = "₽";
