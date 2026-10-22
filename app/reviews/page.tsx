import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import PromoBanners from "@/components/catalog/PromoBanners";
import ReviewForm from "@/components/reviews/ReviewForm";
import ReviewsList from "@/components/reviews/ReviewsList";
import SubscribeCard from "@/components/reviews/SubscribeCard";
import LoadingState from "@/components/ui/LoadingState";
import { styles } from "@/styles/index.styles";

export const metadata: Metadata = {
  title: "Отзывы — Стройоптторг",
  description:
    "Отзывы покупателей интернет-магазина строительных материалов «Стройоптторг».",
};

export default function ReviewsPage() {
  return (
    <div className={`${styles.container} pb-20 text-[#2C333D] lg:pb-[110px]`}>
      {/* Breadcrumb */}
      <nav
        aria-label="Хлебные крошки"
        className="pt-3 text-[14px] text-[#8A9098] lg:pt-[18px]"
      >
        <Link href="/" className="text-[#2C333D] hover:text-[#186FD4]">
          Стройоптторг
        </Link>
        <span className="mx-2.5">/</span>
        <span aria-current="page">Отзывы</span>
      </nav>

      <h1 className="mt-5 text-[28px] leading-[1.15] font-bold tracking-[-0.5px] md:text-[30px] lg:mt-[19px] lg:text-[40px] 2xl:text-[44px]">
        Отзывы
      </h1>

      <div className="mt-5 lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-x-5 xl:grid-cols-[minmax(0,1fr)_331px]">
        {/* Asosiy qism */}
        <div className="min-w-0">
          {/* Saralash va sahifa URL'da (useSearchParams) — Suspense ichida bo'lishi shart */}
          <Suspense fallback={<LoadingState label="Загрузка отзывов..." />}>
            <ReviewsList />
          </Suspense>

          <section
            aria-labelledby="review-form-title"
            className="mt-[50px] lg:mt-[105px]"
          >
            <h2
              id="review-form-title"
              className="text-[26px] leading-[1.2] font-bold md:text-[28px]"
            >
              Оставить отзыв
            </h2>
            <div className="mt-5 lg:mt-9">
              <ReviewForm />
            </div>
          </section>
        </div>

        {/* Sidebar: 1024+ o'ngda, 360 / 768 da sahifa oxirida */}
        <aside
          aria-label="Акции и рассылка"
          className="mt-[50px] flex flex-col gap-[30px] md:gap-5 lg:mt-0 lg:gap-[30px]"
        >
          <PromoBanners className="grid grid-cols-1 gap-[30px] md:grid-cols-2 md:gap-5 lg:grid-cols-1 lg:gap-[30px]" />
          <SubscribeCard />
        </aside>
      </div>
    </div>
  );
}
