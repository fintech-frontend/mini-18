"use client";

import { ChevronDown } from "lucide-react";

import { PER_PAGE_OPTIONS, SORT_OPTIONS } from "@/data/catalogData";
import { cn } from "@/lib/utils";
import type { SortValue } from "@/types/productsTypes";

type Props = {
  sort: SortValue;
  perPage: number;
  onSortChange: (value: SortValue) => void;
  onPerPageChange: (value: number) => void;
};

/** "Сортировка" va "Показывать по" qatori */
export default function CatalogToolbar({
  sort,
  perPage,
  onSortChange,
  onPerPageChange,
}: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3">
      <label className="flex min-w-0 flex-1 items-center gap-2.5 md:flex-none">
        <span className="shrink-0 text-[14px] text-[#737A84]">Сортировка:</span>

        <span className="relative min-w-0 flex-1 md:w-[242px] md:flex-none">
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortValue)}
            className="h-[46px] w-full cursor-pointer appearance-none truncate rounded-[6px] border border-[#D9DDE3] bg-white pr-10 pl-4 text-[14px] text-[#303640] outline-none transition-colors focus:border-[#1976E8]"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-[#6E7580]" />
        </span>
      </label>

      {/* 360 da maketda yo'q */}
      <div className="hidden items-center gap-2.5 md:flex">
        <span className="text-[14px] text-[#414446]">Показывать по:</span>

        <div className="flex gap-2.5">
          {PER_PAGE_OPTIONS.map((count) => (
            <button
              key={count}
              type="button"
              onClick={() => onPerPageChange(count)}
              aria-pressed={perPage === count}
              className={cn(
                "h-[45px] min-w-[50px] rounded-[6px] px-3 text-[14px] transition-colors",
                perPage === count
                  ? "bg-[#F0F5FB] font-medium text-[#1976E8]"
                  : "text-[#414141] hover:bg-[#F5F6F8]",
              )}
            >
              {count}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
