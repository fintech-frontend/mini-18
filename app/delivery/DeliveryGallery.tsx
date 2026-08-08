"use client";

import { useRef } from "react";
import Image from "next/image";

export default function DeliveryGallery() {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Tugmalar bosilganda yon tomonga surish funksiyasi
  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75; // Bosilganda qancha masofaga surilishi
      scrollRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Rasmlar ro'yxati (o'zingizning rasmlar manzili bilan almashtirasiz)
  const galleryImages = [
    "/images/delivery/delivery-1.png",
    "/images/delivery/delivery-2.png",
    "/images/delivery/delivery-3.png",
    "/images/delivery/delivery-4.png",
  ];

  return (
    <div className="relative w-full py-6 md:py-8">
      
      {/* Chapga surish tugmasi */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 sm:left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white shadow-lg rounded-full flex items-center justify-center text-gray-700 transition-all border border-gray-100 cursor-pointer"
        aria-label="Previous"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Rasmlar konteyneri (Gorizontal Scroll) */}
      <div
        ref={scrollRef}
        className="flex gap-4 md:gap-6 overflow-x-auto scroll-smooth px-2 md:px-4 py-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }} // Scrollbar chizig'ini yashirish uchun
      >
        {galleryImages.map((src, index) => (
          <div
            key={index}
            className="relative min-w-[280px] sm:min-w-[340px] md:min-w-[380px] lg:min-w-[420px] h-[180px] sm:h-[200px] md:h-[230px] rounded-lg overflow-hidden flex-shrink-0 shadow-sm bg-gray-100"
          >
            <Image
              src={src}
              alt={`Delivery warehouse ${index + 1}`}
              fill
              sizes="(max-width: 640px) 280px, (max-width: 1024px) 340px, 420px"
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>

      {/* O'ngga surish tugmasi */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 sm:right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white shadow-lg rounded-full flex items-center justify-center text-gray-700 transition-all border border-gray-100 cursor-pointer"
        aria-label="Next"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>

    </div>
  );
}