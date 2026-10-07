import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

const BANNERS = [
  {
    title: "Все для отопления",
    label: "до -30%",
    image: "/images/reviews/rectangle-32.png",
    bg: "bg-[#F4F1ED]",
    href: "/promotions",
  },
  {
    title: "Лакокрасочные материалы",
    label: "до -30%",
    image: "/images/reviews/rectangle-31.png",
    bg: "bg-[#E8EDF2]",
    href: "/promotions",
  },
];

type Props = {
  /** Joylashuvni sahifa belgilaydi (masalan, 768 da ikki ustun) */
  className?: string;
};

/** Aksiya bannerlari: katalog sidebar'i va "Отзывы" sahifasida ishlatiladi */
export default function PromoBanners({ className }: Props) {
  return (
    <div className={cn("flex flex-col gap-[30px]", className)}>
      {BANNERS.map((banner) => (
        <Link
          key={banner.title}
          href={banner.href}
          className={`group relative block h-[273px] overflow-hidden rounded-lg ${banner.bg}`}
        >
          <Image
            src={banner.image}
            alt=""
            fill
            sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 331px"
            className="object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-[1.03]"
          />

          <div className="absolute inset-0 z-10 flex flex-col items-start justify-center gap-3 p-6">
            <h3 className="max-w-[180px] text-[22px] leading-tight font-medium text-[#2C333D]">
              {banner.title}
            </h3>
            <span className="rounded-md bg-[#011120] px-2.5 py-1.5 text-[14px] font-bold text-white">
              {banner.label}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
