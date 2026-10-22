"use client";

import { X } from "lucide-react";

export type FilterChip = {
  key: string;
  label: string;
  onRemove: () => void;
};

type Props = {
  chips: FilterChip[];
  onClearAll: () => void;
};

/** Tanlangan filtrlar ("Набор ×", "MAKITA ×", "Очистить все ×") */
export default function ActiveFilterChips({ chips, onClearAll }: Props) {
  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={chip.onRemove}
          aria-label={`Убрать фильтр: ${chip.label}`}
          className="flex h-[45px] items-center gap-2.5 rounded-[6px] bg-[#F5F7F9] px-5 text-[14px] text-[#414446] transition-colors hover:bg-[#ECEFF3]"
        >
          {chip.label}
          <X className="size-3.5 text-[#8A9098]" />
        </button>
      ))}

      <button
        type="button"
        onClick={onClearAll}
        className="flex h-[45px] items-center gap-2.5 rounded-[6px] bg-[#F2F7FD] px-5 text-[14px] font-medium text-[#1976E8] transition-colors hover:bg-[#E3EEFB]"
      >
        Очистить все
        <X className="size-3.5" />
      </button>
    </div>
  );
}
