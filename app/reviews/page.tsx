"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { ChevronRight, ChevronLeft, Star } from "lucide-react";
import { styles } from "@/styles/index.styles";
import type { RootState } from "@/lib/store";
import { useGetProductsQuery } from "@/lib/api/apiSlice";
import {
  REVIEWS_PAGE_SIZE,
  useCreateReviewMutation,
  useGetReviewsQuery,
} from "@/lib/api/reviewsApi";
import { formatApiError } from "@/lib/apiError";

const promoBanners = [
  { title: "Все для отопления", discount: "до -30%", image: "/assets/images/promo-otoplenie.svg", href: "/catalog/otoplenie" },
  { title: "Лакокрасочные материалы", discount: "до -30%", image: "/assets/images/promo-lak.svg", href: "/catalog/lak" },
];

const inputClass =
  "w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400";

function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={i <= value ? "fill-amber-400 text-amber-400" : "text-gray-300"}
        />
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const isLoggedIn = useSelector((state: RootState) => !!state.auth.token);

  const [sortOrder, setSortOrder] = useState<"new" | "old">("new");
  const [currentPage, setCurrentPage] = useState(1);
  const [agreed, setAgreed] = useState(false);
  const [form, setForm] = useState({ product: "", rating: 0, text: "" });
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const { data, isLoading, isFetching, error } = useGetReviewsQuery({
    page: currentPage,
    ordering: sortOrder === "new" ? "-created_at" : "created_at",
  });
  const { data: productsData } = useGetProductsQuery();
  const [createReview, { isLoading: sending }] = useCreateReviewMutation();

  const reviews = data?.items ?? [];
  const products = productsData?.results ?? [];
  const totalPages = Math.max(1, Math.ceil((data?.count ?? 0) / REVIEWS_PAGE_SIZE));

  const changeSort = (order: "new" | "old") => {
    setSortOrder(order);
    setCurrentPage(1);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!form.product) {
      setMessage({ type: "err", text: "Выберите товар" });
      return;
    }
    if (form.rating < 1) {
      setMessage({ type: "err", text: "Поставьте оценку" });
      return;
    }

    try {
      await createReview({
        product: Number(form.product),
        rating: form.rating,
        text: form.text.trim(),
      }).unwrap();
      setForm({ product: "", rating: 0, text: "" });
      setAgreed(false);
      setMessage({
        type: "ok",
        text: "Спасибо! Отзыв отправлен и появится после модерации.",
      });
    } catch (err) {
      setMessage({ type: "err", text: formatApiError(err) });
    }
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
    if (totalPages > 1) pages.push(totalPages);
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
            onClick={() => changeSort("new")}
            className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${sortOrder === "new"
              ? "border-blue-600 bg-blue-600 text-white"
              : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
          >
            Сначала новые
          </button>
          <button
            onClick={() => changeSort("old")}
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
            {isLoading ? (
              <p className="py-8 text-sm text-gray-500">Загрузка...</p>
            ) : error ? (
              <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
                Не удалось загрузить отзывы: {formatApiError(error)}
              </p>
            ) : reviews.length === 0 ? (
              <p className="py-8 text-sm text-gray-500">
                Отзывов пока нет. Станьте первым!
              </p>
            ) : (
              <div
                className={`divide-y divide-gray-100 transition-opacity ${isFetching ? "opacity-60" : ""}`}
              >
                {reviews.map((review) => (
                  <div key={review.id} className="py-5 first:pt-0">
                    <p className="mb-1 text-sm font-semibold text-gray-900">
                      {review.author}
                    </p>
                    <div className="mb-2 flex flex-wrap items-center gap-3">
                      <Stars value={review.rating} />
                      <span className="text-xs text-gray-400">{review.date}</span>
                    </div>
                    {review.productName && (
                      <p className="mb-2 text-xs text-gray-500">
                        Товар: <span className="text-gray-700">{review.productName}</span>
                      </p>
                    )}
                    {review.text && (
                      <p className="text-sm leading-relaxed text-gray-600">
                        {review.text}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex h-9 items-center gap-1 rounded-lg px-3 text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-40"
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
                      onClick={() => setCurrentPage(p)}
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
                  disabled={currentPage === totalPages}
                  className="flex h-9 items-center gap-1 rounded-lg px-3 text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-40"
                >
                  Дальше
                  <ChevronRight size={16} />
                </button>
              </div>
            )}

            {/* Leave a review form */}
            <div className="mt-10 border-t border-gray-100 pt-8">
              <h2 className="mb-4 text-lg font-semibold text-gray-900 sm:text-xl">
                Оставить отзыв
              </h2>

              {!isLoggedIn ? (
                <p className="text-sm text-gray-600">
                  Чтобы оставить отзыв,{" "}
                  <Link href="/login" className="font-medium text-blue-600 hover:underline">
                    войдите в аккаунт
                  </Link>
                  .
                </p>
              ) : (
                <form onSubmit={handleSubmit} className="max-w-lg">
                  <div className="mb-4">
                    <label htmlFor="review-product" className="mb-1 block text-xs text-gray-500">
                      Товар *
                    </label>
                    <select
                      id="review-product"
                      value={form.product}
                      onChange={(e) => setForm({ ...form, product: e.target.value })}
                      className={`${inputClass} bg-white`}
                    >
                      <option value="">Выберите товар</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <span className="mb-1 block text-xs text-gray-500">Оценка *</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setForm({ ...form, rating: i })}
                          aria-label={`Оценка ${i}`}
                        >
                          <Star
                            size={24}
                            className={
                              i <= form.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-gray-300 hover:text-amber-300"
                            }
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="review-text" className="mb-1 block text-xs text-gray-500">
                      Текст отзыва
                    </label>
                    <textarea
                      id="review-text"
                      value={form.text}
                      onChange={(e) => setForm({ ...form, text: e.target.value })}
                      placeholder="Ваш отзыв"
                      rows={4}
                      className={`${inputClass} resize-none`}
                    />
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

                  {message && (
                    <p
                      className={`mb-4 rounded-md border px-4 py-3 text-xs ${message.type === "ok"
                        ? "border-green-200 bg-green-50 text-green-700"
                        : "border-red-200 bg-red-50 text-red-700"
                        }`}
                    >
                      {message.text}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={!agreed || sending}
                    className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {sending ? "Отправка..." : "Отправить"}
                  </button>
                </form>
              )}
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
