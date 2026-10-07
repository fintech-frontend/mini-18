import type { Metadata } from "next";
import Link from "next/link";

import { deliveryData } from "@/data/delivery";
import { styles } from "@/styles/index.styles";
import DeliveryDataMap from "./DeliveryDataMap";
import DeliveryGallery from "./DeliveryGallery";
import DeliverySidebar from "./DeliverySidebar";

export const metadata: Metadata = {
  title: "Доставка — Стройоптторг",
  description:
    "Способы и условия доставки заказов интернет-магазина «Стройоптторг».",
};

export default function DeliveryPage() {
  return (
    <section className={`${styles.container} pb-20 lg:pb-[110px]`}>
      {/* Breadcrumb */}
      <nav
        aria-label="Хлебные крошки"
        className="pt-3 text-[14px] text-[#8A9098] lg:pt-[18px]"
      >
        <Link href="/" className="text-[#2C333D] hover:text-[#186FD4]">
          Стройоптторг
        </Link>
        <span className="mx-2.5">/</span>
        <span aria-current="page">Доставка</span>
      </nav>

      <h1 className="mt-5 text-[28px] leading-[1.15] font-bold tracking-[-0.5px] text-[#2C333D] md:text-[30px] lg:mt-[19px] lg:text-[40px] 2xl:text-[44px]">
        {deliveryData.header.title}
      </h1>

      {/* Matn + sidebar: 1024+ yonma-yon, 360 / 768 da sidebar matndan keyin */}
      <div className="mt-5 grid grid-cols-1 items-start gap-y-[50px] lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-x-5 xl:grid-cols-[minmax(0,1fr)_331px]">
        <DeliveryDataMap />
        <DeliverySidebar />
      </div>

      {/* Maketda galereya faqat desktop'da bor */}
      <div className="mt-[60px] hidden lg:block">
        <DeliveryGallery />
      </div>
    </section>
  );
}
