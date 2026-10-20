"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

type Props = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
};

type PageItem = number | "dots";

/**
 * 1 … (joriy ± siblings) … oxirgi.
 * Masalan: 1 2 3 4 5 … 231
 */
function getPages(
  current: number,
  total: number,
  siblings: number,
): PageItem[] {
  const windowSize = siblings * 2 + 5; // 1, …, oyna, …, oxirgi

  if (total <= windowSize) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const showLeftDots = current - siblings > 3;
  const showRightDots = current + siblings < total - 2;

  if (!showLeftDots) {
    const count = siblings * 2 + 3;
    return [...Array.from({ length: count }, (_, i) => i + 1), "dots", total];
  }

  if (!showRightDots) {
    const count = siblings * 2 + 3;
    return [
      1,
      "dots",
      ...Array.from({ length: count }, (_, i) => total - count + 1 + i),
    ];
  }

  const middle = Array.from(
    { length: siblings * 2 + 1 },
    (_, i) => current - siblings + i,
  );
  return [1, "dots", ...middle, "dots", total];
}

/** 360 uchun: joriy sahifa atrofidagi 3 ta raqam (maketdagidek: ← 1 2 3 →) */
function getCompactPages(current: number, total: number): PageItem[] {
  const count = Math.min(3, total);
  const start = Math.max(1, Math.min(current - 1, total - count + 1));
  return Array.from({ length: count }, (_, i) => start + i);
}

const base =
  "flex h-[46px] items-center justify-center rounded-[6px] border text-[15px] transition-colors md:h-14";

function PageList({
  items,
  page,
  onChange,
}: {
  items: PageItem[];
  page: number;
  onChange: (page: number) => void;
}) {
  return (
    <>
      {items.map((item, index) =>
        item === "dots" ? (
          <span
            key={`dots-${index}`}
            className={cn(
              base,
              "min-w-[46px] border-[#DCE0E5] px-3 text-[#8A9098] md:min-w-[57px]",
            )}
          >
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            aria-current={item === page ? "page" : undefined}
            className={cn(
              base,
              "min-w-[46px] px-3 md:min-w-[57px]",
              item === page
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

/** Sahifalash: katalog, sharhlar va boshqa ro'yxatlar uchun umumiy */
export default function Pagination({
  page,
  totalPages,
  onChange,
}: Props) {
  if (totalPages <= 1) return null;

  const go = (next: number) =>
    onChange(Math.min(totalPages, Math.max(1, next)));

  return (
    <nav
      aria-label="Пагинация"
      className="flex items-center justify-center gap-[5px] md:gap-2.5"
    >
      <button
        type="button"
        onClick={() => go(page - 1)}
        disabled={page === 1}
        aria-label="Предыдущая страница"
        className={cn(
          base,
          "min-w-[46px] gap-2.5 border-[#DCE0E5] text-[#303640] hover:bg-[#F5F6F8] disabled:cursor-not-allowed disabled:opacity-40 md:min-w-[124px] md:px-5",
        )}
      >
        <ArrowLeft className="size-5" />
        <span className="hidden md:inline">Назад</span>
      </button>

      {/* Ekran kengligiga qarab: 360 -> ixcham, 768 -> o'rtacha, 1280+ -> to'liq */}
      <div className="flex gap-[5px] md:hidden">
        <PageList
          items={getCompactPages(page, totalPages)}
          page={page}
          onChange={go}
        />
      </div>
      <div className="hidden gap-2.5 md:flex xl:hidden">
        <PageList
          items={getPages(page, totalPages, 0)}
          page={page}
          onChange={go}
        />
      </div>
      <div className="hidden gap-2.5 xl:flex">
        <PageList
          items={getPages(page, totalPages, 1)}
          page={page}
          onChange={go}
        />
      </div>

      <button
        type="button"
        onClick={() => go(page + 1)}
        disabled={page === totalPages}
        aria-label="Следующая страница"
        className={cn(
          base,
          "min-w-[46px] gap-2.5 border-[#DCE0E5] text-[#303640] hover:bg-[#F5F6F8] disabled:cursor-not-allowed disabled:opacity-40 md:min-w-[124px] md:px-5",
        )}
      >
        <span className="hidden md:inline">Далее</span>
        <ArrowRight className="size-5" />
      </button>
    </nav>
  );
}
