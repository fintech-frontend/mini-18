"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useGetPromotionsQuery } from "@/lib/api/promotionsApi";

/* Ma'lumot sahifalari (Оплата va h.k.) uchun o'ng yon panel:
   aksiya bannerlari API'dan (/api/promotions/), pastida — obuna kartasi */

const BANNER_IMAGES = ["/assets/images/promo-otoplenie.svg", "/assets/images/promo-lak.svg"];

const FALLBACK_BANNERS = [
  { id: "heating", title: "Все для отопления", discount: "до -30%", href: "/akcii" },
  { id: "paint", title: "Лакокрасочные материалы", discount: "до -30%", href: "/akcii" },
];

export default function InfoSidebar() {
  const { data } = useGetPromotionsQuery();

  const fromApi = (data?.items ?? []).slice(0, 2).map((p) => ({
    id: String(p.id),
    title: p.title,
    discount: p.discount ? `до ${p.discount}` : "",
    href: `/akcii/${p.id}`,
  }));
  const banners = fromApi.length > 0 ? fromApi : FALLBACK_BANNERS;

  return (
    <aside className="flex w-full shrink-0 flex-col gap-4 lg:w-72">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-1 lg:gap-4">
        {banners.map((b, i) => (
          <Link key={b.id} href={b.href} className="group relative flex h-40 items-end overflow-hidden rounded-xl bg-gray-300 p-3 lg:p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={BANNER_IMAGES[i % BANNER_IMAGES.length]}
              alt=""
              onError={(e) => (e.currentTarget.style.display = "none")}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative">
              <p className="mb-2 line-clamp-2 text-sm font-semibold leading-tight text-white">{b.title}</p>
              {b.discount && (
                <span className="inline-block rounded-md bg-gray-900/80 px-2 py-1 text-[11px] font-medium text-white">{b.discount}</span>
              )}
            </div>
          </Link>
        ))}
      </div>

      <NewsletterCard />
    </aside>
  );
}

function NewsletterCard() {
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [done, setDone] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!agreed || !/^\S+@\S+\.\S+$/.test(email.trim())) return;
    // Obuna uchun backend'da endpoint yo'q — hozircha faqat tasdiq ko'rsatiladi
    setDone(true);
  };

  return (
    <form onSubmit={submit} className="rounded-xl bg-[#F5F8FC] p-5 text-center">
      <p className="mb-1 text-sm font-semibold text-gray-900">Подпишитесь на рассылку</p>
      <p className="mb-4 text-xs text-gray-500">Регулярные скидки и спецпредложения, а так же новости компании.</p>
      {done ? (
        <p className="rounded-lg bg-green-50 px-3 py-3 text-xs text-green-700">Спасибо! Вы подписались на рассылку.</p>
      ) : (
        <>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="mb-3 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-400"
          />
          <button
            type="submit"
            disabled={!agreed}
            className="mb-3 w-full rounded-lg bg-[#1E73E8] py-2.5 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-[#1667D6] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Подписаться
          </button>
          <label className="flex cursor-pointer items-start gap-2 text-left text-xs text-gray-400">
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-blue-600" />
            Согласен с обработкой персональных данных в соответствии с политикой конфиденциальности
          </label>
        </>
      )}
    </form>
  );
}
