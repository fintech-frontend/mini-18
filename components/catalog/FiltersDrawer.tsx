"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

import type { FilterState } from "@/types/productsTypes";
import CatalogFilters from "./CatalogFilters";

type Props = {
  open: boolean;
  value: FilterState;
  onClose: () => void;
  onApply: (next: FilterState) => void;
};

/**
 * 360 / 768 uchun chap tomondan chiquvchi filtr paneli.
 * O'zgarishlar "Применить фильтры" bosilgandagina qo'llanadi.
 */
export default function FiltersDrawer({
  open,
  value,
  onClose,
  onApply,
}: Props) {
  // Body scroll'ni bloklash va Escape bilan yopish
  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Фильтры"
    >
      <div
        className="absolute inset-0 bg-[#011120]/70"
        onClick={onClose}
        aria-hidden
      />

      {/* Ichki holat har ochilishda joriy filtrlardan boshlanadi */}
      <DrawerPanel value={value} onClose={onClose} onApply={onApply} />
    </div>
  );
}

function DrawerPanel({ value, onClose, onApply }: Omit<Props, "open">) {
  const [draft, setDraft] = useState<FilterState>(value);

  return (
    <aside className="relative flex h-full w-[min(370px,calc(100%-40px))] flex-col bg-white shadow-2xl animate-in slide-in-from-left duration-200">
      <div className="flex items-center justify-between px-[15px] pt-5 pb-1 md:px-[25px]">
        <h2 className="text-[18px] font-bold text-[#303640]">Фильтры</h2>

        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть фильтры"
          className="flex size-8 items-center justify-center rounded-full bg-[#F2F7FD] text-[#1976E8] transition-colors hover:bg-[#E3EEFB]"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto overscroll-contain px-[15px] md:px-[25px]">
        <CatalogFilters value={draft} onChange={setDraft} />
      </div>

      <div className="border-t border-[#ECEEF1] bg-white p-[15px] md:px-[25px]">
        <button
          type="button"
          onClick={() => onApply(draft)}
          className="h-[52px] w-full rounded-[7px] bg-[#1976E8] text-[13px] font-bold tracking-wide text-white uppercase transition-colors hover:bg-[#0F67D0]"
        >
          Применить фильтры
        </button>
      </div>
    </aside>
  );
}
