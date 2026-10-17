"use client";

import { Minus, Plus } from "lucide-react";

import { cn } from "@/lib/utils";

type Props = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  label?: string;
};

/** "− 2 +" son tanlagich; qo'lda yozilgan qiymat min/max oralig'iga keltiriladi */
export default function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 999,
  size = "md",
  label = "Количество",
}: Props) {
  const clamp = (next: number) => Math.min(max, Math.max(min, next));

  const button =
    "flex shrink-0 items-center justify-center text-[#303640] transition-colors hover:bg-[#F0F2F5] disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div
      className={cn(
        "inline-flex items-center overflow-hidden rounded-[6px] border border-[#DCE0E5] bg-white",
        size === "sm" ? "h-9" : "h-11",
      )}
    >
      <button
        type="button"
        onClick={() => onChange(clamp(value - 1))}
        disabled={value <= min}
        aria-label="Уменьшить количество"
        className={cn(button, size === "sm" ? "size-9" : "size-11")}
      >
        <Minus className="size-4" />
      </button>

      <input
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={value}
        aria-label={label}
        onChange={(e) => {
          const next = Number(e.target.value);
          if (Number.isFinite(next) && next > 0) onChange(clamp(next));
        }}
        className={cn(
          "h-full min-w-0 border-x border-[#DCE0E5] text-center text-[14px] font-medium text-[#303640] outline-none [appearance:textfield] focus:bg-[#F8FAFD] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
          size === "sm" ? "w-10" : "w-12",
        )}
      />

      <button
        type="button"
        onClick={() => onChange(clamp(value + 1))}
        disabled={value >= max}
        aria-label="Увеличить количество"
        className={cn(button, size === "sm" ? "size-9" : "size-11")}
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
