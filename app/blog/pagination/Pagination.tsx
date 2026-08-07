"use client";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function getPageNumbers(current: number, total: number): (number | "...")[] {
  const pages: (number | "...")[] = [];
  const siblings = 1; // how many pages to show around current

  const start = Math.max(2, current - siblings);
  const end = Math.min(total - 1, current + siblings);

  pages.push(1);

  if (start > 2) pages.push("...");

  for (let i = start; i <= end; i++) pages.push(i);

  if (end < total - 1) pages.push("...");

  if (total > 1) pages.push(total);

  return pages;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages = getPageNumbers(currentPage, totalPages);

  const baseBtn =
    "flex h-10 min-w-10 items-center justify-center rounded-md border text-sm font-medium transition";

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mt-12.5 mb-22.5">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`${baseBtn} gap-1 border-gray-200 px-4 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40`}
      >
        ← Назад
      </button>

      {pages.map((page, idx) =>
        page === "..." ? (
          <span
            key={`dots-${idx}`}
            className="flex h-10 min-w-10 items-center justify-center text-sm text-gray-400"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`${baseBtn} px-3 ${
              page === currentPage
                ? "border-blue-800 bg-blue-800 text-white"
                : "border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`${baseBtn} gap-1 border-gray-200 px-4 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40`}
      >
        Далее →
      </button>
    </div>
  );
}