"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Plus, Minus } from "lucide-react";
import { styles } from "@/styles/index.styles";

const faqSections = [
  {
    title: "Заказ и оплата",
    items: [
      {
        question: "Как оформить заказ?",
        answer: "Выберите нужные товары в каталоге, добавьте их в корзину и перейдите к оформлению. Укажите адрес доставки и способ оплаты, после чего подтвердите заказ.",
      },
      {
        question: "Какие способы оплаты доступны?",
        answer: "Мы принимаем оплату банковскими картами Visa, MasterCard и МИР, а также наличными при получении заказа.",
      },
      {
        question: "Можно ли изменить или отменить заказ после оформления?",
        answer: "Да, свяжитесь с нашей службой поддержки по телефону 8 800 444 00 65 в течение часа после оформления, и мы поможем внести изменения.",
      },
    ],
  },
  {
    title: "Доставка",
    items: [
      {
        question: "Сколько стоит доставка?",
        answer: "Стоимость доставки зависит от веса заказа и региона. Точная сумма рассчитывается автоматически при оформлении заказа.",
      },
      {
        question: "В какие сроки доставляется заказ?",
        answer: "Доставка по городу занимает от 1 до 3 дней, доставка по региону — от 3 до 7 дней в зависимости от удалённости.",
      },
      {
        question: "Можно ли забрать заказ самостоятельно?",
        answer: "Да, вы можете забрать заказ самовывозом из любого нашего склада или ТЦ в часы работы.",
      },
    ],
  },
  {
    title: "Гарантия и возврат",
    items: [
      {
        question: "Как оформить возврат товара?",
        answer: "Подробные условия возврата описаны на странице «Возврат». Возврат возможен в течение 14 дней с момента покупки при сохранении товарного вида.",
      },
      {
        question: "Куда обращаться в случае поломки в течение гарантийного срока?",
        answer: "Проводится платная диагностика и ремонт товара в нашем сервисном центре. Обратитесь в ближайший склад или по телефону поддержки.",
      },
      {
        question: "Есть ли гарантийный ремонт?",
        answer: "Да, гарантийный ремонт осуществляется в течение всего гарантийного срока при наличии документов, подтверждающих покупку.",
      },
    ],
  },
];

const promoBanners = [
  { title: "Все для отопления", discount: "до -30%", image: "/assets/images/promo-otoplenie.jpg", href: "/catalog/otoplenie" },
  { title: "Лакокрасочные материалы", discount: "до -30%", image: "/assets/images/promo-lak.jpg", href: "/catalog/lak" },
];

export default function FaqPage() {
const [openKey, setOpenKey] = useState<string | null>("0-0");

  const toggle = (key: string) => {
    setOpenKey((prev) => (prev === key ? null : key));
  };

  return (
    <div className="bg-white">
      <div className={`${styles.container} py-6 sm:py-8`}>
        <div className="mb-4 flex items-center gap-1 text-xs text-gray-400">
          <Link href="/" className="hover:text-gray-600">
            Стройопттрог
          </Link>
          <ChevronRight size={12} />
          <span className="text-gray-600">Вопросы и ответы</span>
        </div>

        <h1 className="mb-6 text-2xl font-bold text-gray-900 sm:text-3xl">
          Вопросы и ответы
        </h1>

        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="min-w-0 flex-1">
            {faqSections.map((section, sIdx) => (
              <div key={section.title} className="mb-8 last:mb-0">
                <h2 className="mb-3 text-base font-semibold text-gray-900">
                  {section.title}
                </h2>

                <div className="divide-y divide-gray-100 border-t border-gray-100">
                  {section.items.map((item, iIdx) => {
                    const key = sIdx + "-" + iIdx;
                    const isOpen = openKey === key;
                    return (
                      <div key={key}>
                        <button
                          onClick={() => toggle(key)}
                          className="flex w-full items-center justify-between gap-4 py-4 text-left"
                        >
                          <span className="text-sm font-medium text-gray-800">
                            {item.question}
                          </span>
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gray-200 text-gray-400">
                            {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                          </span>
                        </button>
                        {isOpen && (
                          <p className="pb-4 pl-1 text-sm leading-relaxed text-gray-500">
                            {item.answer}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50/60 p-5">
              <p className="mb-1 text-sm font-semibold text-gray-900">
                Не нашли ответ на свой вопрос?
              </p>
              <p className="mb-3 text-sm text-gray-500">
                Свяжитесь с нашей службой поддержки, и мы поможем разобраться.
              </p>
              <a href="tel:88004440065" className="text-sm font-medium text-blue-600 hover:underline">
                8 800 444 00 65
              </a>
            </div>
          </div>

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