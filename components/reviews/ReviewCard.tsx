import Image from "next/image";

import type { StoreReview } from "@/types/reviewTypes";

type Props = {
  review: StoreReview;
  onOpenPhoto: (images: string[], index: number, author: string) => void;
};

/** "Отзывы" sahifasidagi bitta sharh kartochkasi */
export default function ReviewCard({ review, onOpenPhoto }: Props) {
  return (
    <article className="flex flex-col gap-2.5 rounded-[8px] border border-[#EDF0F2] bg-white p-5 lg:p-[25px]">
      <header className="flex flex-col">
        <h3 className="text-[18px] leading-[26px] font-semibold text-[#2C333D] lg:font-medium">
          {review.name}
        </h3>
        <time
          dateTime={review.createdAt}
          className="text-[14px] leading-[26px] text-[#8A9098] md:text-[15px]"
        >
          {review.date}
        </time>
      </header>

      {/* whitespace-pre-line: foydalanuvchi qo'ygan qator tashlashlar saqlanadi */}
      <p className="text-[15px] leading-[26px] whitespace-pre-line text-[#2C333D] md:text-[16px]">
        {review.text}
      </p>

      {review.images.length > 0 && (
        <ul className="mt-2.5 flex flex-wrap gap-2.5">
          {review.images.map((src, index) => (
            <li key={src}>
              <button
                type="button"
                onClick={() => onOpenPhoto(review.images, index, review.name)}
                aria-label={`Открыть фото ${index + 1} от ${review.name}`}
                className="group relative block h-[75px] w-[133px] overflow-hidden rounded-[4px] bg-[#F5F7F9] focus-visible:ring-2 focus-visible:ring-[#186FD4] focus-visible:outline-none lg:h-[111px] lg:w-[197px]"
              >
                <Image
                  src={src}
                  alt={`Фото от ${review.name}`}
                  fill
                  sizes="(max-width: 1023px) 133px, 197px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
