import type { Metadata } from "next";
import Link from "next/link";

import BackButton from "@/components/ui/BackButton";
import { styles } from "@/styles/index.styles";

export const metadata: Metadata = {
  title: "Страница не найдена — Стройоптторг",
};

/** Figma'dagi "404" vektori (shrift emas) — soyasi 21px pastga-o'ngga surilgan */
const DIGITS = [
  "M190.412 153.85V196.566H156.384V254.848H108.6V196.566H0V149.144L110.048 0.724012H156.384V153.85H190.412ZM108.6 153.85V59.73L41.268 153.85H108.6Z",
  "M297.442 0C370.204 0 390.114 70.228 390.114 129.958C390.114 210.322 355.362 259.192 297.804 259.192C239.16 259.192 204.046 211.046 204.046 129.958C204.046 70.228 225.404 0 297.442 0ZM297.08 42.354C254.726 42.354 254.726 102.446 254.726 132.492C254.726 190.05 268.482 217.562 297.442 217.562C325.678 217.562 339.434 188.964 339.434 129.958C339.434 69.504 326.402 42.354 297.08 42.354Z",
  "M592.713 153.85V196.566H558.685V254.848H510.901V196.566H402.301V149.144L512.349 0.724012H558.685V153.85H592.713ZM510.901 153.85V59.73L443.569 153.85H510.901Z",
];

function Illustration404({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 614 281"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={className}
    >
      <g transform="translate(21 21)" fill="#DCECFE">
        {DIGITS.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <g fill="#186FD4">
        {DIGITS.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
    </svg>
  );
}

const button =
  "flex h-16 w-full items-center justify-center rounded-lg text-center transition-colors md:w-[290px] lg:w-[219px]";

/**
 * 404 sahifasi (Figma: 404 / 404.768 / 404.360).
 * 360–1023: tugmalar ustma-ust; 1024+: yonma-yon, "404" kattaroq.
 */
export default function NotFound() {
  return (
    <section className={`${styles.container} pb-20 lg:pb-[110px]`}>
      <nav
        aria-label="Хлебные крошки"
        className="pt-3 text-[13px] leading-5 text-[#91969D] lg:pt-[18px] lg:text-[15px]"
      >
        <Link href="/" className="text-[#2C333D] transition-colors hover:text-[#186FD4]">
          Стройоптторг
        </Link>
        <span className="mx-2.5 lg:mx-[15px]">/</span>
        <span aria-current="page">Страница не найдена</span>
      </nav>

      <h1 className="mt-8 text-[30px] leading-[33px] font-bold text-[#2C333D] lg:mt-[38px] lg:text-[48px] lg:leading-[54px]">
        Страница не найдена
      </h1>

      <div className="flex flex-col items-center text-center">
        <Illustration404 className="mt-10 w-[330px] max-w-full md:mt-[60px] lg:mt-[106px] lg:w-[614px]" />

        <p className="mt-[55px] max-w-[727px] text-[16px] leading-6 text-[#535557] md:mt-10 lg:mt-[55px] lg:text-[18px] lg:leading-[29px]">
          Запрашиваемая страница не найдена. Возможно она была удалена, либо
          её адрес был изменен. Попробуйте воспользоваться поиском.
        </p>

        <div className="mt-[55px] flex w-full flex-col items-center gap-[15px] md:mt-10 lg:mt-[55px] lg:w-auto lg:flex-row">
          <BackButton
            className={`${button} bg-[#F6F8FB] text-[15px] font-[550] text-[#117FE3] hover:bg-[#EAF1FA]`}
          >
            Вернуться назад
          </BackButton>
          <Link
            href="/"
            className={`${button} bg-[#186FD4] text-[13px] leading-[17px] font-bold text-white uppercase hover:bg-[#0F67D0]`}
          >
            На главную
          </Link>
        </div>
      </div>
    </section>
  );
}
