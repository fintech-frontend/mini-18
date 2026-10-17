"use client";

import { Badge, type Tone } from "./ui";
import type { OrderStatus, TxStatus, Tier } from "@/lib/admin/db";

export const STATUS_LABEL: Record<OrderStatus, string> = {
  new: "Yangi",
  processing: "Jarayonda",
  shipping: "Yo'lda / Yuklangan",
  delivered: "Yetkazilgan",
  cancelled: "Bekor qilingan",
  returned: "Qaytarilgan",
};

const STATUS_TONE: Record<OrderStatus, Tone> = {
  new: "red",
  processing: "amber",
  shipping: "blue",
  delivered: "green",
  cancelled: "gray",
  returned: "red",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <Badge tone={STATUS_TONE[status]}>{STATUS_LABEL[status]}</Badge>;
}

export function PayBadge({ paid, cancelled }: { paid: boolean; cancelled?: boolean }) {
  if (cancelled) return <Badge tone="gray">Bekor</Badge>;
  return paid ? <Badge tone="green">To&apos;langan</Badge> : <Badge tone="amber">Kutilmoqda</Badge>;
}

export function TxBadge({ status }: { status: TxStatus }) {
  const t: Record<TxStatus, Tone> = {
    Muvaffaqiyatli: "blue",
    Kutilmoqda: "amber",
    Qaytarilgan: "gray",
    "Bekor qilingan": "red",
  };
  return <Badge tone={t[status]}>• {status}</Badge>;
}

export function TierBadge({ tier, discount }: { tier: Tier; discount: number }) {
  const cls: Record<Tier, string> = {
    Platina: "bg-[#06214a] text-white",
    Oltin: "bg-[#d6e8fb] text-[#186FD4]",
    Kumush: "bg-[#eceff5] text-[#5b6a82]",
    Standart: "bg-[#f1f3f8] text-[#6b7a90]",
  };
  return (
    <span className={`inline-flex flex-col rounded-md px-2.5 py-1 text-[11px] font-semibold leading-tight ${cls[tier]}`}>
      <span>{tier} Diler</span>
      <span className="opacity-80">- {discount}%</span>
    </span>
  );
}

export function Avatar({ name, className = "" }: { name: string; className?: string }) {
  const ini = name
    .replace(/["«»]/g, "")
    .replace(/MCHJ|XK|AJ|IP|OOO/g, "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
  return (
    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#06214a] text-[13px] font-bold text-white ${className}`}>
      {ini || "?"}
    </span>
  );
}
