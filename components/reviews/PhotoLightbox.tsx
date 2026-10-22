"use client";

import { useCallback, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type Props = {
  images: string[];
  index: number;
  alt: string;
  onClose: () => void;
  onIndexChange: (index: number) => void;
};

/** Sharhdagi rasmni kattalashtirib ko'rish (Esc, ← → klavishlari ishlaydi) */
export default function PhotoLightbox({
  images,
  index,
  alt,
  onClose,
  onIndexChange,
}: Props) {
  const total = images.length;
  const hasMany = total > 1;

  const prev = useCallback(
    () => onIndexChange((index - 1 + total) % total),
    [index, total, onIndexChange],
  );
  const next = useCallback(
    () => onIndexChange((index + 1) % total),
    [index, total, onIndexChange],
  );

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (hasMany && e.key === "ArrowLeft") prev();
      if (hasMany && e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, prev, next, hasMany]);

  const navButton =
    "absolute top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#2C333D] shadow-md transition-colors hover:bg-white";

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[#011120]/85 p-4 md:p-10 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Закрыть"
        className="absolute top-4 right-4 z-10 flex size-11 items-center justify-center rounded-full bg-white/90 text-[#2C333D] transition-colors hover:bg-white"
      >
        <X className="size-5" />
      </button>

      <div
        className="relative h-[70vh] w-full max-w-[1000px]"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={images[index]}
          alt={`${alt} — ${index + 1} из ${total}`}
          fill
          sizes="(max-width: 1000px) 100vw, 1000px"
          className="object-contain"
        />

        {hasMany && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Предыдущее фото"
              className={`${navButton} left-2 md:-left-16`}
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Следующее фото"
              className={`${navButton} right-2 md:-right-16`}
            >
              <ChevronRight className="size-5" />
            </button>

            <span className="absolute -bottom-9 left-1/2 -translate-x-1/2 text-[14px] text-white/80">
              {index + 1} / {total}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
