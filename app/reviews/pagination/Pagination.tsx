"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

type PageItem = number | "dots";

/** 1 2 3 4 5 … 231 — joriy sahifa atrofida `siblings` ta raqam */
function getPageNumbers(
  current: number,
  total: number,
  siblings: number,
): PageItem[] {
  if (total <= siblings * 2 + 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const count = siblings * 2 + 3;

  if (current - siblings <= 3) {
    return [...Array.from({ length: count }, (_, i) => i + 1), "dots", total];
  }

  if (current + siblings >= total - 2) {
    return [
      1,
      "dots",
      ...Array.from({ length: count }, (_, i) => total - count + 1 + i),
    ];
  }

  return [
    1,
    "dots",
    ...Array.from(
      { length: siblings * 2 + 1 },
      (_, i) => current - siblings + i,
    ),
    "dots",
    total,
  ];
}

/** 360 / 768 (maket): ← 1 2 3 → */
function getCompactPages(current: number, total: number): PageItem[] {
  const count = Math.min(3, total);
  const start = Math.max(1, Math.min(current - 1, total - count + 1));
  return Array.from({ length: count }, (_, i) => start + i);
}

const base =
  "flex h-[46px] min-w-[46px] items-center justify-center rounded-[6px] border px-3 text-[15px] transition-colors md:h-14 md:min-w-[56px]";

function PageButtons({
  items,
  currentPage,
  onPageChange,
}: {
  items: PageItem[];
  currentPage: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <>
      {items.map((item, index) =>
        item === "dots" ? (
          <span
            key={`dots-${index}`}
            className={cn(base, "border-[#DCE0E5] text-[#8A9098]")}
          >
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onPageChange(item)}
            aria-current={item === currentPage ? "page" : undefined}
            className={cn(
              base,
              item === currentPage
                ? "border-[#011120] bg-[#011120] font-semibold text-white"
                : "border-[#DCE0E5] text-[#303640] hover:bg-[#F5F6F8]",
            )}
          >
            {item}
          </button>
        ),
      )}
    </>
  );
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const go = (page: number) =>
    onPageChange(Math.min(totalPages, Math.max(1, page)));

  const arrow = cn(
    base,
    "gap-2.5 border-[#DCE0E5] text-[#303640] hover:bg-[#F5F6F8] disabled:cursor-not-allowed disabled:opacity-40 lg:min-w-[124px] lg:px-5",
  );

  return (
    <nav
      aria-label="Пагинация"
      className="flex items-center justify-center gap-[5px] lg:gap-2.5"
    >
      <button
        type="button"
        onClick={() => go(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Предыдущая страница"
        className={arrow}
      >
        <ArrowLeft className="size-5" />
        <span className="hidden lg:inline">Назад</span>
      </button>

      <div className="flex gap-[5px] lg:hidden">
        <PageButtons
          items={getCompactPages(currentPage, totalPages)}
          currentPage={currentPage}
          onPageChange={go}
        />
      </div>
      <div className="hidden gap-2.5 lg:flex">
        <PageButtons
          items={getPageNumbers(currentPage, totalPages, 1)}
          currentPage={currentPage}
          onPageChange={go}
        />
      </div>

      <button
        type="button"
        onClick={() => go(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Следующая страница"
        className={arrow}
      >
        <span className="hidden lg:inline">Далее</span>
        <ArrowRight className="size-5" />
      </button>
    </nav>
  );
}
