import type { Metadata } from "next";
import Link from "next/link";

import BackButton from "@/components/ui/BackButton";
import { styles } from "@/styles/index.styles";

const buttonBase =
  "flex h-16 w-full items-center justify-center rounded-[7px] text-[14px] font-bold transition-colors md:w-[290px] lg:w-[219px]";

export const metadata: Metadata = {
  title: "Страница не найдена — Стройоптторг",
};

/** 404 — mavjud bo'lmagan har qanday manzil va notFound() uchun */
export default function NotFound() {
  return (
    <div className={`${styles.container} pb-20 text-[#2C333D] lg:pb-[110px]`}>
      <nav
        aria-label="Хлебные крошки"
        className="pt-3 text-[14px] text-[#8A9098] lg:pt-[18px]"
      >
        <Link href="/" className="text-[#2C333D] hover:text-[#186FD4]">
          Стройоптторг
        </Link>
        <span className="mx-2.5">/</span>
        <span aria-current="page">Страница не найдена</span>
      </nav>

      <h1 className="mt-5 text-[28px] leading-[1.15] font-bold tracking-[-0.5px] md:text-[30px] lg:mt-[19px] lg:text-[40px] 2xl:text-[44px]">
        Страница не найдена
      </h1>

      <div className="mt-10 flex flex-col items-center text-center md:mt-[60px] lg:mt-[106px]">
        {/* Maketdagi 404: ko'k raqamlar + o'ngga-pastga siljigan och ko'k "soya" */}
        <div
          aria-hidden
          className="relative h-[150px] w-[330px] select-none lg:h-[280px] lg:w-[614px]"
        >
          <span className="absolute top-[11px] left-[11px] text-[190px] leading-[150px] font-bold tracking-[-0.03em] text-[#DCEBFD] lg:top-[21px] lg:left-[21px] lg:text-[356px] lg:leading-[280px]">
            404
          </span>
          <span className="absolute top-0 left-0 text-[190px] leading-[150px] font-bold tracking-[-0.03em] text-[#1F72D9] lg:text-[356px] lg:leading-[280px]">
            404
          </span>
        </div>

        <p className="mt-[60px] max-w-[540px] text-[16px] lg:max-w-[720px] leading-[24px] text-[#555B63] lg:mt-[62px] lg:text-[18px] lg:leading-[28px]">
          Запрашиваемая страница не найдена. Возможно она была удалена, либо её
          адрес был изменен. Попробуйте воспользоваться поиском.
        </p>

        <div className="mt-[50px] flex w-full flex-col items-center gap-[15px] lg:mt-[54px] lg:w-auto lg:flex-row">
          <BackButton
            className={`${buttonBase} bg-[#F6F8FB] text-[#186FD4] hover:bg-[#EAF2FC]`}
          >
            Вернуться назад
          </BackButton>

          <Link
            href="/"
            className={`${buttonBase} bg-[#186FD4] text-white uppercase hover:bg-[#0F5BB5]`}
          >
            На главную
          </Link>
        </div>
      </div>
    </div>
  );
}
