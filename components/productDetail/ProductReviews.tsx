"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";

import { fetchProductReviews } from "@/lib/api/catalog";
import { cn } from "@/lib/utils";
import type { ApiReview } from "@/types/apiTypes";

type Props = {
  productId: number;
  rating?: number;
  reviewsCount: number;
};

const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function Stars({ value, size = "size-4" }: { value: number; size?: string }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`Оценка ${value} из 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          aria-hidden
          className={cn(
            size,
            n <= Math.round(value) ? "fill-[#F5A623] text-[#F5A623]" : "text-[#D9DDE3]",
          )}
        />
      ))}
    </span>
  );
}

/** Mahsulot sahifasidagi tasdiqlangan sharhlar (/reviews/?product=) */
export default function ProductReviews({ productId, rating, reviewsCount }: Props) {
  const [reviews, setReviews] = useState<ApiReview[] | null>(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetchProductReviews(productId, { signal: controller.signal })
      .then((data) => setReviews(data.results))
      .catch(() => {
        if (!controller.signal.aborted) setIsError(true);
      });
    return () => controller.abort();
  }, [productId]);

  return (
    <section
      aria-labelledby="reviews-title"
      className="border-t border-[#ECEEF1] pt-8 pb-12 lg:pt-10"
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <h2 id="reviews-title" className="text-[22px] font-bold text-[#303640]">
          Отзывы
        </h2>
        {rating !== undefined && reviewsCount > 0 && (
          <span className="flex items-center gap-2 text-sm text-[#5E6670]">
            <Stars value={rating} />
            <strong className="text-[#303640]">{rating}</strong>
            <span>({reviewsCount})</span>
          </span>
        )}
      </div>

      <div className="mt-5 max-w-[900px]">
        {isError ? (
          <p className="text-sm text-[#858C95]">Не удалось загрузить отзывы.</p>
        ) : reviews === null ? (
          <p className="text-sm text-[#858C95]">Загрузка отзывов...</p>
        ) : reviews.length === 0 ? (
          <p className="text-sm text-[#858C95]">
            Отзывов пока нет. Станьте первым, кто оценит этот товар.
          </p>
        ) : (
          <ul className="flex flex-col divide-y divide-[#ECEEF1]">
            {reviews.map((review) => (
              <li key={review.id} className="py-4 first:pt-0">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="font-semibold text-[#303640]">{review.user_name}</span>
                  <Stars value={review.rating} />
                  <time dateTime={review.created_at} className="text-[13px] text-[#A0A5AC]">
                    {dateFormatter.format(new Date(review.created_at))}
                  </time>
                </div>
                {review.text && (
                  <p className="mt-2 text-[15px] leading-6 text-[#5E6670]">{review.text}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
