"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Container from "@/components/ui/Container";

const SLIDES_COUNT = 4;

export const HeroBanner = () => {
  const [active, setActive] = useState(1);

  const prev = () => setActive((p) => (p === 0 ? SLIDES_COUNT - 1 : p - 1));
  const next = () => setActive((p) => (p === SLIDES_COUNT - 1 ? 0 : p + 1));

  return (
    <section className="py-4 sm:py-6">
      <Container>
        <div className="relative overflow-hidden rounded-2xl bg-gray-800">
          {/* Background image — o'zingizniki bilan almashtiring */}
          <div className="absolute inset-0">
            <img
            src="/assets/images/heroBanner.svg"
              alt=""
              className="h-full w-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-liner-to-r from-black/50 via-black/10 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative flex min-h-[220px] flex-col justify-center px-6 py-10 sm:min-h-[320px] sm:px-12">
            <h1 className="mb-3 max-w-md text-2xl font-bold leading-tight text-white sm:text-4xl">
              Электроинструмент для любых нужд
            </h1>
            <p className="mb-6 max-w-sm text-sm text-gray-200 sm:text-base">
              У нас обновился ассортимент сантехники, мебели для ванной
              комнаты, а так же других сопутствующих товаров.
            </p>
            <button className="w-fit rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-black">
              ПЕРЕЙТИ К ТОВАРАМ →
            </button>
          </div>

          {/* Arrows */}
          <button
            onClick={prev}
            aria-label="Назад"
            className="absolute left-3 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white/90 p-2 text-gray-700 shadow hover:bg-white sm:flex"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={next}
            aria-label="Вперёд"
            className="absolute right-3 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white/90 p-2 text-gray-700 shadow hover:bg-white sm:flex"
          >
            <ChevronRight size={20} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {Array.from({ length: SLIDES_COUNT }).map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Слайд ${i + 1}`}
                className={`h-2 rounded-full transition-all ${
                  active === i ? "w-6 bg-blue-600" : "w-2 bg-white/70"
                }`}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};