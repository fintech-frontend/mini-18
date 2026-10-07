"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

const GALLERY_IMAGES = [
  "/images/delivery/delivery-1.png",
  "/images/delivery/delivery-2.png",
  "/images/delivery/delivery-3.png",
  "/images/delivery/delivery-4.png",
];

function Arrow({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      className="size-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d={direction === "left" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
      />
    </svg>
  );
}

/** Ombor rasmlari karuseli (maket: 4 ta 390×233, oraliq 20px) */
export default function DeliveryGallery() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 1);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const step = el.clientWidth / 2;
    el.scrollBy({
      left: direction === "left" ? -step : step,
      behavior: "smooth",
    });
  };

  const arrowClass =
    "absolute top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#EDF0F2] bg-white text-[#2C333D] shadow-md transition-opacity hover:bg-[#F8F9FA] disabled:cursor-default disabled:opacity-40";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => scroll("left")}
        disabled={!canPrev}
        aria-label="Предыдущие фото"
        className={`${arrowClass} -left-5`}
      >
        <Arrow direction="left" />
      </button>

      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {GALLERY_IMAGES.map((src, index) => (
          <div
            key={src}
            className="relative aspect-[390/233] w-[calc((100%-60px)/4)] shrink-0 snap-start overflow-hidden rounded-lg bg-[#F4F5F7]"
          >
            <Image
              src={src}
              alt={`Склад «Стройоптторг», фото ${index + 1}`}
              fill
              sizes="(max-width: 1919px) 25vw, 390px"
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => scroll("right")}
        disabled={!canNext}
        aria-label="Следующие фото"
        className={`${arrowClass} -right-5`}
      >
        <Arrow direction="right" />
      </button>
    </div>
  );
}
