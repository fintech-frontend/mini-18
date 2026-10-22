"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import { CheckCircle2, ChevronDown, MapPin } from "lucide-react";
import { styles } from "@/styles/index.styles";
import type { RootState } from "@/lib/store";
import { useCart } from "@/context/CartContext";
import { EmptyNotice } from "@/components/ui/EmptyNotice";
import { useCreateOrderMutation, useGetProfileQuery } from "@/lib/api/userApi";
import { useGetPromotionsQuery } from "@/lib/api/promotionsApi";
import { formatApiError } from "@/lib/apiError";
import { saveOrderDetails } from "@/lib/orderHistory";
import { formatPhone, isPhoneComplete } from "@/lib/phone";

/* Hudud/shahar uchun API endpoint yo'q — vaqtincha statik ro'yxat */
const REGIONS: Record<string, string[]> = {
  "Городской округ Черкесский": ["Черкесск"],
  "Карачаево-Черкесская Республика": ["Черкесск", "Карачаевск", "Усть-Джегута"],
  "Ставропольский край": ["Ставрополь", "Пятигорск", "Кисловодск"],
  "Москва и область": ["Москва", "Подольск", "Химки"],
};

const PICKUP_ADDRESS = "г. Черкесск, ул.Октябрьская, д.301";

const DELIVERY_OPTIONS = [
  {
    id: "pickup",
    title: "Самовывоз",
    text: "К вашему приезду заказ будет скомплектован и готов к выдаче.",
  },
  {
    id: "store",
    title: "Доставка магазина",
    text: "Если же вам нужна будет доставка к определенному времени, то укажите это в поле для комментариев к заказу.",
  },
  {
    id: "cdek",
    title: "СДЭК",
    text: "Доставка через сервис СДЭК до ПВЗ или курьером до двери.",
  },
] as const;

const PAYMENT_OPTIONS = [
  { id: "card", label: "Картой на сайте" },
  { id: "cash", label: "Оплата в кассе" },
  { id: "otp", label: "Кредит от ОТП банка", terms: true },
  { id: "sber", label: "Покупай со Сбером (оформление покупки в кредит)", terms: true },
] as const;

type DeliveryId = (typeof DELIVERY_OPTIONS)[number]["id"];
type PaymentId = (typeof PAYMENT_OPTIONS)[number]["id"];

const inputClass =
  "h-11 w-full rounded-md border border-gray-200 bg-white px-4 text-sm text-slate-800 outline-none transition placeholder:text-gray-300 focus:border-[#2563EB]";
const labelClass = "mb-2 block text-xs text-slate-700";

const formatPrice = (value: number) => `${value.toLocaleString("ru-RU")} ₽`;

// Buyurtma raqami: vaqt belgisining oxirgi 8 raqami
const newOrderNumber = () => String(Date.now()).slice(-8);

const PHONE_ERROR =
  "Номер телефона введён не полностью. Пример: +7 (999) 123-45-67 или +998 (90) 123-45-67";

const asText = (v: unknown) => (v === null || v === undefined ? "" : String(v));

function Radio({ checked }: { checked: boolean }) {
  return (
    <span
      className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
        checked ? "border-[#2563EB]" : "border-gray-300"
      }`}
    >
      {checked && <span className="h-2 w-2 rounded-full bg-[#2563EB]" />}
    </span>
  );
}

export default function CheckoutPage() {
  const isLoggedIn = useSelector((state: RootState) => !!state.auth.token);
  const { cartItems, totalPrice, clearCart } = useCart();
  const { data: profile } = useGetProfileQuery(undefined, { skip: !isLoggedIn });
  const { data: promotions } = useGetPromotionsQuery();
  const [createOrder, { isLoading: sending }] = useCreateOrderMutation();

  const regionNames = Object.keys(REGIONS);
  const [region, setRegion] = useState(regionNames[0]);
  const [city, setCity] = useState(REGIONS[regionNames[0]][0]);
  const [delivery, setDelivery] = useState<DeliveryId>("pickup");
  const [payment, setPayment] = useState<PaymentId>("card");

  const [promoOpen, setPromoOpen] = useState(false);
  const [promoInput, setPromoInput] = useState("");
  const [promo, setPromo] = useState<{ code: string; percent: number } | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    company: "",
    email: "",
    phone: "",
    comment: "",
  });
  const [createAccount, setCreateAccount] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placedOrder, setPlacedOrder] = useState<{ number: string; register: boolean } | null>(
    null
  );

  // Kirgan foydalanuvchi ma'lumotlarini oldindan to'ldirish
  useEffect(() => {
    if (!profile) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm((prev) => ({
      ...prev,
      firstName: prev.firstName || asText(profile.first_name),
      lastName: prev.lastName || asText(profile.last_name),
      email: prev.email || asText(profile.email),
      phone: prev.phone || formatPhone(asText(profile.phone ?? profile.phone_number)),
    }));
  }, [profile]);

  const phoneInvalid = error === PHONE_ERROR && !isPhoneComplete(form.phone);

  const discount = promo ? Math.round((totalPrice * promo.percent) / 100) : 0;
  const total = totalPrice - discount;

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const cities = useMemo(() => REGIONS[region] ?? [], [region]);

  const applyPromo = () => {
    setPromoError(null);
    const code = promoInput.trim().toLowerCase();
    if (!code) return;
    const found = promotions?.items.find((p) => p.promoCode.trim().toLowerCase() === code);
    const percent = found ? parseFloat(found.discount.replace(/[^\d.]/g, "")) : NaN;
    if (!found || !percent) {
      setPromo(null);
      setPromoError("Промокод не найден");
      return;
    }
    setPromo({ code: found.promoCode, percent });
  };

  const onSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError("Укажите имя и фамилию");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      setError("Укажите корректный email");
      return;
    }
    if (!isPhoneComplete(form.phone)) {
      setError(PHONE_ERROR);
      document.getElementById("co-phone")?.focus();
      return;
    }

    const number = newOrderNumber();

    try {
      await createOrder({
        number,
        status: "pending",
        subtotal: totalPrice.toFixed(2),
        total: total.toFixed(2),
      }).unwrap();
      saveOrderDetails({
        number,
        createdAt: new Date().toISOString(),
        items: cartItems.map(({ id, slug, title, article, price, quantity, imageUrl }) => ({
          id,
          slug,
          title,
          article,
          price,
          quantity,
          imageUrl,
        })),
        delivery: DELIVERY_OPTIONS.find((o) => o.id === delivery)?.title ?? delivery,
        deliveryAddress: delivery === "pickup" ? PICKUP_ADDRESS : undefined,
        payment: PAYMENT_OPTIONS.find((o) => o.id === payment)?.label ?? payment,
        region,
        city,
        customer: {
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          company: form.company.trim(),
          email: form.email.trim(),
          phone: form.phone,
        },
        comment: form.comment.trim(),
        promoCode: promo?.code,
        subtotal: totalPrice,
        discount,
        total,
      });
      clearCart();
      setPlacedOrder({ number, register: createAccount && !isLoggedIn });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      const status = (err as { status?: number }).status;
      if (status === 401 || status === 403) {
        // Tizimga kirgan bo'lsa-yu server token'ni qabul qilmasa — bu backend tomonidagi xato
        setError(
          isLoggedIn
            ? "Заказ не оформлен: сервер сейчас не принимает авторизацию (ошибка настроек сервера). Ваша корзина сохранена — попробуйте позже."
            : "Чтобы оформить заказ, войдите в аккаунт."
        );
        return;
      }
      setError(formatApiError(err));
    }
  };

  /* ---------- Buyurtma qabul qilindi ---------- */
  if (placedOrder) {
    return (
      <div className="bg-white">
        <div className={`${styles.container} py-10 sm:py-16`}>
          <div className="mx-auto flex max-w-lg flex-col items-center text-center">
            <CheckCircle2 size={56} className="mb-4 text-green-500" />
            <h1 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">
              Заказ оформлен!
            </h1>
            <p className="mb-6 text-sm text-gray-500">
              Номер вашего заказа: <b className="text-gray-900">№ {placedOrder.number}</b>.
              Наш менеджер свяжется с вами для подтверждения.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/"
                className="rounded-lg bg-[#2563EB] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-blue-700"
              >
                На главную
              </Link>
              {placedOrder.register ? (
                <Link
                  href="/register"
                  className="rounded-lg bg-gray-100 px-6 py-3 text-xs font-bold uppercase tracking-wider text-gray-700 hover:bg-gray-200"
                >
                  Создать аккаунт
                </Link>
              ) : (
                isLoggedIn && (
                  <Link
                    href="/profile"
                    className="rounded-lg bg-gray-100 px-6 py-3 text-xs font-bold uppercase tracking-wider text-gray-700 hover:bg-gray-200"
                  >
                    Мои заказы
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className={`${styles.container} py-6 sm:py-8`}>
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-2 text-xs text-gray-400">
          <Link href="/" className="text-gray-700 hover:text-gray-900">
            Стройоптторг
          </Link>
          <span>/</span>
          <span>Оформление заказа</span>
        </div>

        <h1 className="mb-6 text-2xl font-bold text-gray-900 sm:mb-8 sm:text-4xl">
          Оформление заказа
        </h1>

        {cartItems.length === 0 ? (
          <div>
            <EmptyNotice
              title="Корзина пуста"
              description="Добавьте товары в корзину, чтобы оформить заказ"
            />
            <div className="mt-6 text-center">
              <Link
                href="/"
                className="inline-block rounded-lg bg-[#2563EB] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-blue-700"
              >
                Перейти к покупкам
              </Link>
            </div>
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            className="flex flex-col gap-6 lg:flex-row lg:items-start"
          >
            {/* ================= LEFT ================= */}
            <div className="min-w-0 flex-1 rounded-xl border border-gray-100 shadow-sm">
              {!isLoggedIn && (
                <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-3 text-xs text-gray-700 sm:px-6">
                  Уже есть аккаунт?
                  <Link
                    href="/login"
                    className="rounded-md bg-[#EFF6FF] px-3 py-1.5 font-medium text-[#2563EB] hover:bg-[#DBEAFE]"
                  >
                    Войти
                  </Link>
                </div>
              )}

              <div className="space-y-6 p-5 sm:p-6">
                {/* Доставка */}
                <section>
                  <h2 className="mb-4 text-base font-medium text-gray-900">Доставка</h2>

                  <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="relative">
                      <select
                        aria-label="Регион"
                        value={region}
                        onChange={(e) => {
                          setRegion(e.target.value);
                          setCity(REGIONS[e.target.value][0]);
                        }}
                        className={`${inputClass} appearance-none pr-10`}
                      >
                        {regionNames.map((r) => (
                          <option key={r}>{r}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                    <div className="relative">
                      <select
                        aria-label="Город"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className={`${inputClass} appearance-none pr-10`}
                      >
                        {cities.map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    {DELIVERY_OPTIONS.map((opt) => {
                      const active = delivery === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setDelivery(opt.id)}
                          className={`flex cursor-pointer gap-3 rounded-lg border p-4 text-left transition-colors ${
                            active
                              ? "border-[#2563EB]"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <Radio checked={active} />
                          <span className="min-w-0">
                            <span className="mb-1.5 block text-sm text-gray-900">
                              {opt.title}
                            </span>
                            <span className="block text-xs leading-relaxed text-gray-500">
                              {opt.text}
                            </span>
                            {opt.id === "pickup" && (
                              <span className="mt-3 flex items-start gap-2 rounded-md bg-gray-50 px-3 py-2 text-xs text-gray-700">
                                <MapPin size={14} className="mt-0.5 shrink-0 text-gray-400" />
                                {PICKUP_ADDRESS}
                              </span>
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </section>

                {/* Оплата */}
                <section>
                  <h2 className="mb-3 text-base font-medium text-gray-900">Оплата</h2>
                  <div className="space-y-3">
                    {PAYMENT_OPTIONS.map((opt) => (
                      <label
                        key={opt.id}
                        className="flex cursor-pointer items-start gap-3 text-xs text-gray-700"
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={opt.id}
                          checked={payment === opt.id}
                          onChange={() => setPayment(opt.id)}
                          className="sr-only"
                        />
                        <Radio checked={payment === opt.id} />
                        <span>
                          {opt.label}
                          {"terms" in opt && (
                            <>
                              {" "}
                              <Link href="/payment" className="text-[#2563EB] underline">
                                Условия предоставления
                              </Link>
                            </>
                          )}
                        </span>
                      </label>
                    ))}
                  </div>
                </section>

                {/* Промокод */}
                <div className="rounded-md bg-gray-50 px-5 py-4 text-xs text-gray-700">
                  {promo ? (
                    <div className="flex flex-wrap items-center gap-2">
                      Промокод <b>{promo.code}</b> применён: скидка {promo.percent}%
                      <button
                        type="button"
                        onClick={() => {
                          setPromo(null);
                          setPromoInput("");
                        }}
                        className="cursor-pointer text-[#2563EB] underline"
                      >
                        Отменить
                      </button>
                    </div>
                  ) : (
                    <>
                      Есть промокод?{" "}
                      <button
                        type="button"
                        onClick={() => setPromoOpen((v) => !v)}
                        className="cursor-pointer text-[#2563EB] underline"
                      >
                        Нажмите здесь, чтобы ввести его
                      </button>
                      {promoOpen && (
                        <div className="mt-3 flex max-w-sm gap-2">
                          <input
                            value={promoInput}
                            onChange={(e) => setPromoInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                applyPromo();
                              }
                            }}
                            placeholder="Промокод"
                            className={inputClass}
                          />
                          <button
                            type="button"
                            onClick={applyPromo}
                            className="h-11 shrink-0 cursor-pointer rounded-md bg-[#2563EB] px-4 text-xs font-bold uppercase text-white hover:bg-blue-700"
                          >
                            Применить
                          </button>
                        </div>
                      )}
                      {promoError && <p className="mt-2 text-red-600">{promoError}</p>}
                    </>
                  )}
                </div>

                {/* Kontakt ma'lumotlari */}
                <section className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="co-first" className={labelClass}>
                        Ваше имя <span className="text-red-500">*</span>:
                      </label>
                      <input
                        id="co-first"
                        value={form.firstName}
                        onChange={(e) => set("firstName")(e.target.value)}
                        placeholder="Как вас зовут"
                        autoComplete="given-name"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="co-last" className={labelClass}>
                        Фамилия <span className="text-red-500">*</span>:
                      </label>
                      <input
                        id="co-last"
                        value={form.lastName}
                        onChange={(e) => set("lastName")(e.target.value)}
                        placeholder="Введите вашу фамилию"
                        autoComplete="family-name"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="co-company" className={labelClass}>
                      Название компании:
                    </label>
                    <input
                      id="co-company"
                      value={form.company}
                      onChange={(e) => set("company")(e.target.value)}
                      placeholder="Введите название вашей компании"
                      autoComplete="organization"
                      className={inputClass}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="co-email" className={labelClass}>
                        Email <span className="text-red-500">*</span>:
                      </label>
                      <input
                        id="co-email"
                        type="email"
                        value={form.email}
                        onChange={(e) => set("email")(e.target.value)}
                        placeholder="Введите ваш email адрес"
                        autoComplete="email"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="co-phone" className={labelClass}>
                        Номер телефона <span className="text-red-500">*</span>:
                      </label>
                      <input
                        id="co-phone"
                        type="tel"
                        value={form.phone}
                        onChange={(e) => set("phone")(formatPhone(e.target.value))}
                        placeholder="+7 (___) ___-__-__"
                        autoComplete="tel"
                        aria-invalid={phoneInvalid}
                        className={`${inputClass} ${phoneInvalid ? "border-red-400 focus:border-red-500" : ""}`}
                      />
                      <p className={`mt-1.5 text-[11px] ${phoneInvalid ? "text-red-600" : "text-gray-400"}`}>
                        {phoneInvalid
                          ? "Введите номер полностью"
                          : "Для номера Узбекистана начните с +998"}
                      </p>
                    </div>
                  </div>

                  {!isLoggedIn && (
                    <label className="flex cursor-pointer items-center gap-3 text-xs text-gray-700">
                      <input
                        type="checkbox"
                        checked={createAccount}
                        onChange={(e) => setCreateAccount(e.target.checked)}
                        className="h-4 w-4 accent-[#2563EB]"
                      />
                      Создать аккаунт
                    </label>
                  )}

                  <div>
                    <label htmlFor="co-comment" className={labelClass}>
                      Комментарий к заказу:
                    </label>
                    <textarea
                      id="co-comment"
                      value={form.comment}
                      onChange={(e) => set("comment")(e.target.value)}
                      placeholder="Текстовое поле"
                      rows={4}
                      className={`${inputClass} h-auto resize-none py-3`}
                    />
                  </div>
                </section>
              </div>
            </div>

            {/* ================= RIGHT: Ваш заказ ================= */}
            <aside className="w-full shrink-0 rounded-xl border border-gray-100 p-5 shadow-sm sm:p-6 lg:sticky lg:top-40 lg:w-87.5">
              <h2 className="mb-5 text-xl font-medium text-gray-900">Ваш заказ</h2>

              <ul className="mb-5 max-h-105 space-y-4 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <li key={item.id} className="flex items-center gap-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-gray-50">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-contain p-1"
                        sizes="56px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-xs text-gray-900">{item.title}</p>
                      <p className="mt-1 text-[11px] text-gray-400">
                        Артикул: {item.article}
                        {item.quantity > 1 && ` · ${item.quantity} шт.`}
                      </p>
                    </div>
                    <span className="shrink-0 whitespace-nowrap text-sm text-[#1B365D]">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              <dl className="mb-5 space-y-3 text-sm">
                <div className="flex items-end gap-2">
                  <dt className="text-gray-900">Сумма</dt>
                  <span className="mb-1.5 flex-1 border-b border-dotted border-gray-300" />
                  <dd className="text-[#1B365D]">{formatPrice(totalPrice)}</dd>
                </div>
                {promo && (
                  <div className="flex items-end gap-2">
                    <dt className="text-gray-900">Скидка</dt>
                    <span className="mb-1.5 flex-1 border-b border-dotted border-gray-300" />
                    <dd className="text-green-600">−{formatPrice(discount)}</dd>
                  </div>
                )}
                <div className="flex items-end gap-2">
                  <dt className="text-gray-900">Доставка</dt>
                  <span className="mb-1.5 flex-1 border-b border-dotted border-gray-300" />
                  <dd className="text-[#1B365D]">
                    {delivery === "pickup" ? formatPrice(0) : "по тарифу"}
                  </dd>
                </div>
                <div className="flex items-end gap-2 text-base">
                  <dt className="font-medium text-gray-900">Итого</dt>
                  <span className="mb-1.5 flex-1 border-b border-dotted border-gray-300" />
                  <dd className="font-medium text-[#1B365D]">{formatPrice(total)}</dd>
                </div>
              </dl>

              <label className="mb-5 flex cursor-pointer items-start gap-3 text-[11px] leading-relaxed text-gray-500">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-[#2563EB]"
                />
                Согласен с обработкой персональных данных в соответствии с политикой
                конфиденциальности
              </label>

              {error && (
                <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
                  {error}
                  {error.includes("войдите") && (
                    <>
                      {" "}
                      <Link href="/login" className="font-semibold underline">
                        Войти
                      </Link>
                    </>
                  )}
                </p>
              )}

              <button
                type="submit"
                disabled={!agreed || sending}
                className="h-12 w-full cursor-pointer rounded-md bg-[#2563EB] text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {sending ? "Оформление..." : "Оформить заказ"}
              </button>
            </aside>
          </form>
        )}
      </div>
    </div>
  );
}
