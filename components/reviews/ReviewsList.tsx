"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MessageSquareText } from "lucide-react";

import LoadingState from "@/components/ui/LoadingState";
import Pagination from "@/components/ui/Pagination";
import { useReviewsQuery, useStoreReviews } from "@/hooks/useStoreReviews";
import { cn } from "@/lib/utils";
import type { ReviewSortOrder } from "@/types/reviewTypes";
import PhotoLightbox from "./PhotoLightbox";
import ReviewCard from "./ReviewCard";

const SORT_BUTTONS: { value: ReviewSortOrder; label: string }[] = [
  { value: "new", label: "Сначала новые" },
  { value: "old", label: "Сначала старые" },
];

type LightboxState = { images: string[]; index: number; author: string } | null;

/** Saralash tugmalari + sharhlar ro'yxati (API) + sahifalash + rasm ko'rish */
export default function ReviewsList() {
  const { sort, page, setSort, setPage, resetPage } = useReviewsQuery();
  const { data, isLoading, isError, isPageNotFound, retry } = useStoreReviews({ sort, page });

  // Havoladagi sahifa endi mavjud emas (sharhlar kamaygan) — 1-sahifaga qaytamiz
  useEffect(() => {
    if (isPageNotFound && page > 1) resetPage();
  }, [isPageNotFound, page, resetPage]);
  const [lightbox, setLightbox] = useState<LightboxState>(null);

  const listTopRef = useRef<HTMLDivElement>(null);

  const totalPages = Math.max(1, data?.pages ?? 1);

  const changePage = (next: number) => {
    setPage(next);
    listTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const closeLightbox = useCallback(() => setLightbox(null), []);
  const changeLightboxIndex = useCallback(
    (index: number) =>
      setLightbox((prev) => (prev ? { ...prev, index } : prev)),
    [],
  );

  const renderList = () => {
    if (isError) {
      return (
        <div className="flex min-h-[240px] flex-col items-center justify-center rounded-[8px] border border-dashed border-[#F3C4BE] px-5 text-center">
          <p className="text-[17px] font-semibold text-[#2C333D]">
            Не удалось загрузить отзывы
          </p>
          <button
            type="button"
            onClick={retry}
            className="mt-4 rounded-[7px] bg-[#186FD4] px-5 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-[#0F5BB5]"
          >
            Повторить
          </button>
        </div>
      );
    }

    if (!data) return <LoadingState label="Загрузка отзывов..." />;

    if (data.items.length === 0) {
      return (
        <div className="flex min-h-[240px] flex-col items-center justify-center gap-3 rounded-[8px] border border-dashed border-[#D9DDE3] px-5 text-center">
          <MessageSquareText className="size-9 text-[#C3C8CF]" aria-hidden />
          <p className="text-[17px] font-semibold text-[#2C333D]">Отзывов пока нет</p>
          <p className="text-[14px] text-[#8A9098]">Будьте первым — расскажите о нашем магазине.</p>
        </div>
      );
    }

    return (
      <div
        aria-busy={isLoading}
        className={cn(
          "flex flex-col gap-[15px] transition-opacity lg:gap-[30px]",
          isLoading && "pointer-events-none opacity-50",
        )}
      >
        {data.items.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            onOpenPhoto={(images, index, author) =>
              setLightbox({ images, index, author })
            }
          />
        ))}
      </div>
    );
  };

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
            onClick={() => setSort(button.value)}
            aria-pressed={sort === button.value}
            className={cn(
              "h-[45px] rounded-[6px] border px-5 text-[14px] transition-colors",
              sort === button.value
                ? "border-[#EAF2FC] bg-[#EAF2FC] font-medium text-[#186FD4]"
                : "border-[#E5E7EB] text-[#414446] hover:border-[#CBD5E1] hover:bg-[#F8F9FA]",
            )}
          >
            {button.label}
          </button>
        ))}
      </div>

      <div className="mt-5 lg:mt-10">{renderList()}</div>

      {totalPages > 1 && (
        <div className="mt-[50px] lg:mt-[60px]">
          <Pagination
            page={Math.min(page, totalPages)}
            totalPages={totalPages}
            onChange={changePage}
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
