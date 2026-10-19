"use client";

import { Database } from "lucide-react";
import { Badge, type Tone } from "./ui";
import { STATUS_LABEL, statusOf, type OrderStatus } from "@/lib/admin/orders";

const STATUS_TONE: Record<OrderStatus, Tone> = {
  pending: "red",
  processing: "amber",
  shipping: "blue",
  delivered: "green",
  cancelled: "gray",
  returned: "red",
};

export function OrderStatusBadge({ status }: { status: string }) {
  const s = statusOf({ status });
  return <Badge tone={STATUS_TONE[s]}>{STATUS_LABEL[s]}</Badge>;
}

export function Avatar({ name, className = "" }: { name: string; className?: string }) {
  const ini = name
    .replace(/["«»#]/g, "")
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

/** Backend'da kerakli endpoint yo'qligini ko'rsatadigan blok (soxta ma'lumot o'rniga) */
export function ApiMissing({ title, text, endpoint }: { title: string; text: string; endpoint?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#d5deec] bg-[#fafbfe] px-6 py-10 text-center">
      <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#eef2fb] text-[#186FD4]">
        <Database size={22} />
      </span>
      <p className="text-[15px] font-semibold text-[#0f1d3a]">{title}</p>
      <p className="mt-1 max-w-md text-[13px] text-[#6b7a90]">{text}</p>
      {endpoint && (
        <code className="mt-3 rounded-md bg-[#eef2fb] px-2.5 py-1 text-[12px] text-[#16335f]">{endpoint}</code>
      )}
    </div>
  );
}
