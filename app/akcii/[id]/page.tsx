"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useState } from "react";
import {
  useGetPromotionByIdQuery,
  useGetPromotionsQuery,
} from "@/lib/api/promotionsApi";

export default function AkciyaDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const {
    data: action,
    isLoading,
    isError,
    error,
  } = useGetPromotionByIdQuery(id, { skip: Number.isNaN(id) });

  // Sidebar uchun: ro'yxat keshdan olinadi (yoki bitta so'rov ketadi)
  const { data: list } = useGetPromotionsQuery({ page: 1 });

  const [copied, setCopied] = useState(false);

  if (Number.isNaN(id)) notFound();
  if (isError && error && "status" in error && error.status === 404) {
    notFound();
  }

  const sidebarActions = (list?.items ?? [])
    .filter((item) => item.id !== id)
    .slice(0, 2);

  const handleCopy = async () => {
    if (!action?.promoCode) return;
    try {
      await navigator.clipboard.writeText(action.promoCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard ruxsat bermasa — jim o'tamiz */
    }
  };

  /* ---------- LOADING ---------- */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <section className="mx-auto w-full max-w-270 py-4 animate-pulse">
          <div className="mb-5 h-3 w-48 rounded bg-gray-200" />
          <div className="mb-5 h-9 w-2/3 rounded bg-gray-200" />
          <div className="aspect-16/8 w-full rounded bg-gray-200" />
        </section>
      </div>
    );
  }

  /* ---------- ERROR ---------- */
  if (isError || !action) {
    return (
      <div className="min-h-screen bg-white">
        <section className="mx-auto w-full max-w-270 py-8">
          <p className="mb-4 text-[14px] text-red-700">
            Не удалось загрузить акцию.
          </p>
          <Link href="/akcii" className="text-[13px] text-[#0071ce] hover:underline">
            ← Все акции
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="mx-auto w-full max-w-270 px-0 py-4">
        
        {/* ================= BREADCRUMB ================= */}
        <div className="mb-5 flex flex-wrap items-center gap-2 px-0 text-[10px] text-[#999] sm:text-[11px]">
          <Link href="/" className="transition hover:text-[#0071ce]">
            Стройдом
          </Link>

          <span>/</span>
          <Link href="/akcii" className="transition hover:text-[#0071ce]">
            Акции
          </Link>

          <span>/</span>
          <span className="max-w-100 truncate">{action.title}</span>
        </div>

        {/* ================= TITLE ================= */}
        <h1 className="mb-5 max-w-225 text-[27px] font-bold leading-[1.15] text-[#303640] sm:text-[32px] lg:text-[34px]">
          {action.title}
        </h1>

        {/* ================= CONTENT ================= */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_215px] lg:gap-3">

          {/* ================= LEFT ================= */}
          <article className="min-w-0">

            {/* Action status */}
            <div className="flex min-h-9.5 items-center gap-3 px-3 text-[10px] text-[#555] sm:text-[11px]">
              <span className="font-medium text-[#333]">Акция</span>
              {action.endDate && (
                <>
                  <span className="text-[#ccc]">•</span>
                  <span>Действует до {action.endDate}</span>
                </>
              )}
            </div>

            {/* Description */}
            {action.fullDescription && (
              <div className="px-3 py-3">
                <p className="whitespace-pre-line text-[11px] leading-4.5 text-[#333] sm:text-[12px] sm:leading-5">
                  {action.fullDescription}
                </p>
              </div>
            )}

            {/* ================= MAIN IMAGE ================= */}
            {action.image && (
              <div className="relative aspect-16/8 w-full overflow-hidden">
                <Image
                  src={action.image}
                  alt={action.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 830px"
                  className="object-cover"
                />
              </div>
            )}

            {/* ================= PROMO CODE ================= */}
            {action.promoCode && (
              <div className="px-3 py-4 sm:px-4 sm:py-5">
                <p className="mb-2 text-[12px] font-bold text-[#333]">
                  Промокод для скидки:
                </p>

                <div className="inline-flex items-center gap-3 bg-white px-3 py-2">
                  <span className="text-[11px] font-medium text-[#0071ce]">
                    {action.promoCode}
                  </span>

                  <button
                    type="button"
                    onClick={handleCopy}
                    aria-label="Скопировать промокод"
                    className="cursor-pointer text-[13px] text-[#aaa] transition hover:text-[#333]"
                  >
                    {copied ? "✓" : "⧉"}
                  </button>
                </div>
              </div>
            )}

            {/* ================= BACK ================= */}
            <div className="py-7">
              <Link
                href="/akcii"
                className="inline-flex items-center rounded px-5 py-2.5 text-[12px] font-medium text-[#071522] transition hover:bg-[#071522] hover:text-white"
              >
                ← Все акции
              </Link>
            </div>
          </article>

          {/* ================= RIGHT SIDEBAR ================= */}
          <aside className="space-y-5">

            {sidebarActions.map((item) => (
              <Link
                key={item.id}
                href={`/akcii/${item.id}`}
                className="group block"
              >
                <div className="relative h-35 w-full overflow-hidden rounded-[5px] bg-gray-100 sm:h-42.5 lg:h-45">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="215px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}


                  <div className="absolute bottom-3 left-3">
                    <p className="max-w-36.25 text-[12px] font-medium leading-3.75 text-[#222] sm:text-[13px] sm:leading-4">
                      {item.title}
                    </p>

                    {item.discount && (
                      <span className="mt-1 inline-block rounded-[3px] bg-black px-2 py-1 text-[9px] font-semibold text-white">
                        {item.discount}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}

            {/* ================= NEWSLETTER ================= */}
            <div className="rounded-[5px] bg-[#f7f8fa] px-4 py-5">
              
              <h3 className="text-center text-[13px] font-semibold text-[#333]">
                Подпишитесь на рассылку
              </h3>

              <p className="mt-3 text-center text-[9px] leading-3.75 text-[#888]">
                Регулярные скидки и спецпредложения, а также новости компании.
              </p>


              <input
                type="email"
                placeholder="Email"
                className="mt-4 h-10 w-full rounded bg-white px-3 text-[10px] text-[#333] outline-none placeholder:text-[#aaa] focus:ring-1 focus:ring-[#1976d2]"
              />


              <button
                type="button"
                className="mt-2 h-10 w-full cursor-pointer rounded-lg bg-[#1976d2] text-[10px] font-semibold text-white transition hover:bg-[#1264b5]"
              >
                ПОДПИСАТЬСЯ
              </button>


              <label className="mt-4 flex cursor-pointer gap-2">
                <input type="checkbox" className="mt-0.5 h-4 w-4 shrink-0" />
                <span className="text-[8px] leading-3 text-[#888]">
                  Согласен с обработкой персональных данных в соответствии с
                  политикой конфиденциальности
                </span>
              </label>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}