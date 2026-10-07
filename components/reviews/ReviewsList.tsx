"use client";

import { useCallback, useMemo, useRef, useState } from "react";

import Pagination from "@/app/reviews/pagination/Pagination";
import { REVIEWS_PER_PAGE, reviewsData } from "@/data/reviewsData";
import { cn } from "@/lib/utils";
import PhotoLightbox from "./PhotoLightbox";
import ReviewCard from "./ReviewCard";

type SortOrder = "new" | "old";

const SORT_BUTTONS: { value: SortOrder; label: string }[] = [
  { value: "new", label: "Сначала новые" },
  { value: "old", label: "Сначала старые" },
];

/** "дд.мм.гггг" -> timestamp */
function parseDate(value: string) {
  const [day, month, year] = value.split(".").map(Number);
  return new Date(year, month - 1, day).getTime();
}

type LightboxState = { images: string[]; index: number; author: string } | null;

/** Saralash tugmalari + sharhlar ro'yxati + sahifalash + rasm ko'rish */
export default function ReviewsList() {
  const [sortOrder, setSortOrder] = useState<SortOrder>("new");
  const [currentPage, setCurrentPage] = useState(1);
  const [lightbox, setLightbox] = useState<LightboxState>(null);

  const listTopRef = useRef<HTMLDivElement>(null);

  const sortedReviews = useMemo(
    () =>
      [...reviewsData].sort((a, b) => {
        const diff = parseDate(b.date) - parseDate(a.date);
        // Sana bir xil bo'lsa — tartib barqaror qolsin (id bo'yicha)
        const result = diff !== 0 ? diff : b.id - a.id;
        return sortOrder === "new" ? result : -result;
      }),
    [sortOrder],
  );

  const totalPages = Math.max(
    1,
    Math.ceil(sortedReviews.length / REVIEWS_PER_PAGE),
  );
  const pageReviews = sortedReviews.slice(
    (currentPage - 1) * REVIEWS_PER_PAGE,
    currentPage * REVIEWS_PER_PAGE,
  );

  const changeSort = (order: SortOrder) => {
    setSortOrder(order);
    setCurrentPage(1);
  };

  const changePage = (page: number) => {
    setCurrentPage(page);
    listTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const closeLightbox = useCallback(() => setLightbox(null), []);
  const changeLightboxIndex = useCallback(
    (index: number) =>
      setLightbox((prev) => (prev ? { ...prev, index } : prev)),
    [],
  );

  return (
    <div>
      <div
        ref={listTopRef}
        role="group"
        aria-label="Сортировка отзывов"
        className="flex scroll-mt-[230px] flex-wrap gap-2.5 lg:scroll-mt-[180px]"
      >
        {SORT_BUTTONS.map((button) => (
          <button
            key={button.value}
            type="button"
            onClick={() => changeSort(button.value)}
            aria-pressed={sortOrder === button.value}
            className={cn(
              "h-[45px] rounded-[6px] border px-5 text-[14px] transition-colors",
              sortOrder === button.value
                ? "border-[#EAF2FC] bg-[#EAF2FC] font-medium text-[#186FD4]"
                : "border-[#E5E7EB] text-[#414446] hover:border-[#CBD5E1] hover:bg-[#F8F9FA]",
            )}
          >
            {button.label}
          </button>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-[15px] lg:mt-10 lg:gap-[30px]">
        {pageReviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            onOpenPhoto={(images, index, author) =>
              setLightbox({ images, index, author })
            }
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-[50px] lg:mt-[60px]">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={changePage}
          />
        </div>
      )}

      {lightbox && (
        <PhotoLightbox
          images={lightbox.images}
          index={lightbox.index}
          alt={`Фото от ${lightbox.author}`}
          onClose={closeLightbox}
          onIndexChange={changeLightboxIndex}
        />
      )}
    </div>
  );
}
