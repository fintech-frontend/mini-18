"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";

import { cn } from "@/lib/utils";

type Props = {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
};

/** Mahsulot rasmi: yuklanmasa kulrang "rasm yo'q" belgisini ko'rsatadi */
export default function ProductImage({ src, alt, sizes, className }: Props) {
  const [failed, setFailed] = useState(false);

  // Rasm yo'q (API image_url: null) yoki yuklanmadi
  if (failed || !src) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-lg bg-[#F5F7F9] text-[#C3C8CF]">
        <ImageOff className="size-1/3 max-h-8 max-w-8" aria-hidden />
        <span className="sr-only">{alt}</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      onError={() => setFailed(true)}
      className={cn("object-contain", className)}
    />
  );
}
