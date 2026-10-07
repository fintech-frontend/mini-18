"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, ChevronLeft, Upload } from "lucide-react";
import { styles } from "@/styles/index.styles";

type Review = {
  id: number;
  name: string;
  date: string;
  text: string;
  images?: string[];
};

const mockReviews: Review[] = [
  {
    id: 1,
    name: "Оксана Гончарова",
    date: "2.01.2023",
    text: "Просто ШИКАРНЕЙШИЙ магазин! Огромный ассортимент, демократичные цены, большая гарантия, персональный менеджер (от работников склада до руководства). Надёжный, ответственный и порядочный партнёр.",
  },
  {
    id: 2,
    name: "Шкрефдт Акбарова",
    date: "2.01.2023",
    text: "Была не раз, рекомендую.",
  },
  {
    id: 3,
    name: "MindClick",
    date: "16.06.2023",
    text: "Всегда всё находу здесь. Ассортимент большой. Удобно расположен. Есть доставка. Есть система скидок по карте. Есть грузчики, которые всегда попадут все погрузить.",
  },
  {
    id: 4,
    name: "Василий",
    date: "19.06.2023",
    text: "Очень рад, что нечаялся на этот интернет-магазин строительных материалов! У них огромный выбор товаров, и цены приемлемые. Заказывал здесь материалы для ремонта в доме, и доставка была быстрой и без каких-либо проблем. К тому же, клиентская поддержка отвечает оперативно на все вопросы. Определенно буду советовать этот магазин друзьям и очень воспользуюсь его услугами.",
    images: ["/assets/images/review-1.svg", "/assets/images/review-2.svg"],
  },
  {
    id: 5,
    name: "Марина",
    date: "21.12.2023",
    text: "Большой выбор товаров, важный персонал, доступный ценовой сегмент но ограничивались, удобны месторасположено, гараже.",
  },
  {
    id: 6,
    name: "Иван",
    date: "13.06.2023",
    text: "Как профессиональные строители, в всегда над надежным поставщиком строительных материалов, и этот магазин — один из них. Здесь есть всё, что нужно для стройки: от хорошей и дешевой до сантиники и электроинструментов. Качество товара всегда на высоте, а цены конкурентоспособные. Доставка всегда происходит вовремя, что важно для нас в частности плотном графике работ.",
    images: [
      "/assets/images/review-3.svg",
      "/assets/images/review-4.svg",
      "/assets/images/review-5.svg",
    ],
  },
  {
    id: 7,
    name: "Евгений",
    date: "14.06.2022",
    text: "Мой опыт работы в интернет-магазине строительных материалов был удивительным. Они предлагают не только широкий выбор строящихся стройматериалов, но и превосходное обслуживание клиентов в отрасли. У них есть удивительно ценные материалы, которые делают весь процесс покупки удобным и приятным. Определенно рекомендую этот магазин всем, кто ищет качественные строительные принадлежности.",
  },
  {
    id: 8,
    name: "Евгений",
    date: "14.06.2022",
    text: "Для меня, как начинающего строителя, важно иметь доступ к надежным поставщикам строительных материалов. Этот интернет-магазин помог мне на голову выбрать материалы, но и дал советы по их применению. Цены очень доступные, а даже при моем ограниченном бюджете я смог найти всё необходимое. Доставка была быстрой и без проблем. Спасибо этому магазину за поддержку начинающих строителей!",
  },
];

const promoBanners = [
  { title: "Все для отопления", discount: "до -30%", image: "/assets/images/promo-otoplenie.svg", href: "/catalog/otoplenie" },
  { title: "Лакокрасочные материалы", discount: "до -30%", image: "/assets/images/promo-lak.svg", href: "/catalog/lak" },
];

export default function ReviewsPage() {
  const [sortOrder, setSortOrder] = useState<"new" | "old">("new");
  const [currentPage, setCurrentPage] = useState(1);
  const [agreed, setAgreed] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", text: "" });

  const totalPages = 231;

  const sortedReviews =
    sortOrder === "new" ? mockReviews : [...mockReviews].reverse();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Отзыв отправлен (демо)");
    setForm({ name: "", email: "", text: "" });
  };

  const pageNumbers = () => {
    const pages: (number | "...")[] = [1];
    if (currentPage > 3) pages.push("...");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  return (
    <div className="bg-white">
      <div className={`${styles.container} py-6 sm:py-8`}>
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-1 text-xs text-gray-400">
          <Link href="/" className="hover:text-gray-600">
            Стройопттрог
          </Link>
          <ChevronRight size={12} />
          <span className="text-gray-600">Отзывы</span>
        </div>

        <h1 className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl">
          Отзывы
        </h1>

        {/* Sort tabs */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setSortOrder("new")}
            className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${sortOrder === "new"
              ? "border-blue-600 bg-blue-600 text-white"
              : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
          >
            Сначала новые
          </button>
          <button
            onClick={() => setSortOrder("old")}
            className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${sortOrder === "old"
              ? "border-blue-600 bg-blue-600 text-white"
              : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
          >
            Сначала старые
          </button>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Left: reviews list */}
          <div className="min-w-0 flex-1">
            <div className="divide-y divide-gray-100">
              {sortedReviews.map((review) => (
                <div key={review.id} className="py-5 first:pt-0">
                  <p className="mb-1 text-sm font-semibold text-gray-900">
                    {review.name}
                  </p>
                  <p className="mb-2 text-xs text-gray-400">{review.date}</p>
                  <p className="mb-3 text-sm leading-relaxed text-gray-600">
                    {review.text}
                  </p>
                  {review.images && review.images.length > 0 && (
                    <div className="flex gap-2">
                      {review.images.map((img, i) => (
                        <div
                          key={i}
                          className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:h-20 sm:w-20"
                        >
                          <Image
                            src={img}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-6 flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="flex h-9 items-center gap-1 rounded-lg px-3 text-sm text-gray-500 hover:bg-gray-50"
              >
                <ChevronLeft size={16} />
                Назад
              </button>

              {pageNumbers().map((p, i) =>
                p === "..." ? (
                  <span key={`dots-${i}`} className="px-2 text-sm text-gray-400">
                    ...
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p as number)}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition ${currentPage === p
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-50"
                      }`}
                  >
                    {p}
                  </button>
                )
              )}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="flex h-9 items-center gap-1 rounded-lg px-3 text-sm text-gray-500 hover:bg-gray-50"
              >
                Дальше
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Leave a review form */}
            <div className="mt-10 border-t border-gray-100 pt-8">
              <h2 className="mb-4 text-lg font-semibold text-gray-900 sm:text-xl">
                Оставить отзыв
              </h2>
              <form onSubmit={handleSubmit} className="max-w-lg">
                <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs text-gray-500">
                      Ваше имя *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Введите ваше имя"
                      className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-gray-500">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="Введите ваш электронный адрес"
                      className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="mb-1 block text-xs text-gray-500">
                    Текст отзыва *
                  </label>
                  <textarea
                    required
                    value={form.text}
                    onChange={(e) => setForm({ ...form, text: e.target.value })}
                    placeholder="Ваш отзыв"
                    rows={4}
                    className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400"
                  />
                </div>

                <div className="mb-4">
                  <label className="mb-1 block text-xs text-gray-500">
                    Прикрепить фото
                  </label>
                  <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-gray-300 text-gray-400 hover:border-blue-400 hover:text-blue-500">
                    <Upload size={20} />
                    <span className="text-[10px]">Загрузить</span>
                    <input type="file" accept="image/*" multiple className="hidden" />
                  </label>
                </div>

                <label className="mb-4 flex cursor-pointer items-start gap-2 text-xs text-gray-400">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5 h-3.5 w-3.5 accent-blue-600"
                  />
                  Согласен с обработкой персональных данных в соответствии с
                  политикой конфиденциальности
                </label>

                <button
                  type="submit"
                  disabled={!agreed}
                  className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Отправить
                </button>
              </form>
            </div>
          </div>

          {/* Right: sidebar */}
          <div className="flex w-full shrink-0 flex-col gap-4 lg:w-72">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-1 lg:gap-4">
              {promoBanners.map((b) => (
                <Link
                  key={b.title}
                  href={b.href}
                  className="group relative flex h-32 items-end overflow-hidden rounded-xl bg-gray-300 p-3 lg:p-4"
                >
                  <img
                    src={b.image}
                    alt=""
                    onError={(e) => (e.currentTarget.style.display = "none")}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="relative">
                    <p className="mb-2 text-xs font-semibold leading-tight text-white sm:text-sm">
                      {b.title}
                    </p>
                    <span className="inline-block rounded-md bg-gray-900/80 px-2 py-1 text-[10px] font-medium text-white sm:text-[11px]">
                      {b.discount}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="rounded-xl border border-gray-100 p-4">
              <p className="mb-1 text-sm font-semibold text-gray-900">
                Подпишитесь на рассылку
              </p>
              <p className="mb-3 text-xs text-gray-500">
                Регулярные скидки и спецпредложения, а так же новости компании.
              </p>
              <input
                type="email"
                placeholder="Email"
                className="mb-3 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none"
              />
              <button className="w-full rounded-lg bg-blue-600 py-2.5 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-blue-700">
                Подписаться
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}