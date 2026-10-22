import Image from "next/image";
import Link from "next/link";

import DeliverySubscribe from "./DeliverySubscribe";

// Bannerlardagi yozuvlar rasmning o'zida (alt shu matnni takrorlaydi)
const BANNERS = [
  {
    title: "Все для отопления — до -30%",
    image: "/images/delivery/banner-heating.png",
    href: "/akcii",
  },
  {
    title: "Лакокрасочные материалы — до -30%",
    image: "/images/delivery/banner-paint.png",
    href: "/akcii",
  },
];

export default function DeliverySidebar() {
  return (
    <aside
      aria-label="Акции и рассылка"
      className="flex w-full flex-col gap-[30px] md:gap-5 lg:gap-[30px]"
    >
      {/* 360: ustma-ust, 768: yonma-yon, 1024+: sidebar'da ustma-ust */}
      <div className="grid w-full grid-cols-1 gap-[30px] md:grid-cols-2 md:gap-5 lg:grid-cols-1 lg:gap-[30px]">
        {BANNERS.map((banner) => (
          <Link
            key={banner.image}
            href={banner.href}
            className="group relative block h-[273px] w-full overflow-hidden rounded-lg"
          >
            <Image
              src={banner.image}
              alt={banner.title}
              fill
              sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 331px"
              className="object-cover object-left transition-transform duration-300 group-hover:scale-105"
            />
          </Link>
        ))}
      </div>

      <DeliverySubscribe />
    </aside>
  );
}
