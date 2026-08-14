import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { actions, getActionById } from "../actions-data";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AkciyaDetailPage({
  params,
}: PageProps) {
  const { id } = await params;

  const action = getActionById(Number(id));

  if (!action) {
    notFound();
  }

  const sidebarActions = actions
    .filter((item) => item.id !== action.id)
    .slice(0, 2);

  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto w-full max-w-[1080px] px-4 py-4 sm:px-6 lg:px-0">

        {/* ================= BREADCRUMB ================= */}
        <div className="mb-5 flex flex-wrap items-center gap-2 text-[10px] text-[#999] sm:text-[11px]">
          <Link
            href="/"
            className="hover:text-[#0071ce]"
          >
            Стройдом
          </Link>

          <span>/</span>

          <Link
            href="/akcii"
            className="hover:text-[#0071ce]"
          >
            Акции
          </Link>

          <span>/</span>

          <span className="max-w-[400px] truncate">
            {action.title}
          </span>
        </div>

        {/* ================= TITLE ================= */}
        <h1 className="mb-5 max-w-[900px] text-[27px] font-bold leading-[1.15] text-[#303640] sm:text-[32px] lg:text-[34px]">
          {action.title}
        </h1>

        {/* ================= CONTENT ================= */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_215px] lg:gap-3">

          {/* =====================================================
              LEFT
          ====================================================== */}
          <article className="min-w-0">

            {/* Action status */}
            <div className="flex min-h-[38px] items-center gap-3 border-2 border-[#168cf0] px-3 text-[10px] text-[#555] sm:text-[11px]">

              <span className="font-medium text-[#333]">
                Акция
              </span>

              <span className="text-[#ccc]">
                •
              </span>

              <span>
                Действует до {action.endDate}
              </span>

            </div>

            {/* Description */}
            <div className="border-x-2 border-[#168cf0] px-3 py-3">
              <p className="text-[11px] leading-[18px] text-[#333] sm:text-[12px] sm:leading-[20px]">
                {action.fullDescription}
              </p>
            </div>

            {/* =====================================================
                MAIN IMAGE
            ====================================================== */}
            <div className="relative aspect-[16/8] w-full overflow-hidden border-2 border-[#168cf0]">

              <Image
                src={action.image}
                alt={action.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 830px"
                className="object-cover"
              />

            </div>

            {/* =====================================================
                OFFER
            ====================================================== */}
            <div className="border-x-2 border-b-2 border-[#168cf0] px-3 py-4 sm:px-4 sm:py-5">

              <h2 className="mb-3 text-[20px] font-bold leading-tight text-[#303640] sm:text-[23px]">
                Что мы предлагаем:
              </h2>

              <p className="mb-3 text-[11px] leading-[19px] text-[#333] sm:text-[12px] sm:leading-[21px]">
                Широкий ассортимент качественных товаров для любых
                поверхностей. Разнообразие цветов и оттенков, чтобы
                удовлетворить самые изысканные вкусы.
              </p>

              <p className="mb-3 text-[11px] leading-[19px] text-[#333] sm:text-[12px] sm:leading-[21px]">
                Продукция от проверенных производителей,
                гарантирующих долговечность и качество.
              </p>

              <p className="mb-5 text-[11px] leading-[19px] text-[#333] sm:text-[12px] sm:leading-[21px]">
                Используйте промокод{" "}
                <span className="font-bold text-[#0071ce]">
                  LAKOART20
                </span>{" "}
                при оформлении заказа и получите дополнительную
                скидку 20% на все лакокрасочные материалы.
                Это время для обновления вашего дома по самым
                доступным ценам!
              </p>

              {/* Promo title */}
              <p className="mb-2 text-[12px] font-bold text-[#333]">
                Промокод для скидки:
              </p>

              {/* Promo */}
              <div className="inline-flex items-center gap-3 rounded border border-[#e5e7eb] bg-white px-3 py-2">

                <span className="text-[11px] font-medium text-[#0071ce]">
                  LAKOART20
                </span>

                <button
                  type="button"
                  aria-label="Скопировать промокод"
                  className="text-[13px] text-[#aaa] transition hover:text-[#333]"
                >
                  ⧉
                </button>

              </div>

            </div>

            {/* Back */}
            <div className="py-7">

              <Link
                href="/akcii"
                className="inline-flex items-center rounded border border-[#071522] px-5 py-2.5 text-[12px] font-medium text-[#071522] transition hover:bg-[#071522] hover:text-white"
              >
                ← Все акции
              </Link>

            </div>

          </article>

          {/* =====================================================
              RIGHT SIDEBAR
          ====================================================== */}
          <aside className="space-y-5">

            {/* Other actions */}
            {sidebarActions.map((item) => (
              <Link
                key={item.id}
                href={`/akcii/${item.id}`}
                className="group block"
              >

                <div className="relative h-[140px] w-full overflow-hidden rounded-[5px] sm:h-[170px] lg:h-[180px]">

                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="215px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Dark discount */}
                  <div className="absolute bottom-3 left-3">

                    <p className="max-w-[145px] text-[12px] font-medium leading-[15px] text-[#222] sm:text-[13px] sm:leading-[16px]">
                      {item.title}
                    </p>

                    <span className="mt-1 inline-block rounded-[3px] bg-black px-2 py-1 text-[9px] font-semibold text-white">
                      {item.discount}
                    </span>

                  </div>

                </div>

              </Link>
            ))}

            {/* =====================================================
                NEWSLETTER
            ====================================================== */}
            <div className="rounded-[5px] bg-[#f7f8fa] px-4 py-5">

              <h3 className="text-center text-[13px] font-semibold text-[#333]">
                Подпишитесь на рассылку
              </h3>

              <p className="mt-3 text-center text-[9px] leading-[15px] text-[#888]">
                Регулярные скидки и спецпредложения,
                а также новости компании.
              </p>

              {/* Email */}
              <input
                type="email"
                placeholder="Email"
                className="mt-4 h-10 w-full rounded border border-[#e5e7eb] bg-white px-3 text-[10px] text-[#333] outline-none placeholder:text-[#aaa] focus:border-[#1976d2]"
              />

              {/* Subscribe */}
              <button
                type="button"
                className="mt-2 h-10 w-full rounded-[4px] bg-[#1976d2] text-[10px] font-semibold text-white transition hover:bg-[#1264b5]"
              >
                ПОДПИСАТЬСЯ
              </button>

              {/* Checkbox */}
              <label className="mt-4 flex cursor-pointer gap-2">

                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 shrink-0"
                />

                <span className="text-[8px] leading-[12px] text-[#888]">
                  Согласен с обработкой персональных данных
                  в соответствии с политикой конфиденциальности
                </span>

              </label>

            </div>

          </aside>

        </div>

      </section>
    </main>
  );
}