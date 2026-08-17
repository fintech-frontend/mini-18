"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Plus, Minus } from "lucide-react";
import Container from "@/components/ui/Container";

const faqItems = [
    {
        question: "Куда обращаться в случае поломки в течении гарантийного срока?",
        answer: null,
    },
    {
        question: "Куда обращаться в случае поломки в течении гарантийного срока?",
        answer: "Проводится платная диагностика и ремонт товара",
    },
    {
        question: "Есть ли гарантийный ремонт?",
        answer: "Да, гарантийный ремонт осуществляется в течение всего гарантийного срока при наличии документов, подтверждающих покупку.",
    },
    {
        question: "Какой срок действия гарантии?",
        answer: "Срок гарантии устанавливается производителем и указывается в гарантийном талоне, обычно составляет от 1 до 3 лет.",
    },
];

const promoBanners = [
    { title: "Все для отопления", discount: "до -30%", image: "/assets/images/promo-otoplenie.svg", href: "/catalog/otoplenie" },
    { title: "Лакокрасочные материалы", discount: "до -30%", image: "/assets/images/promo-lak.svg", href: "/catalog/lak" },
];

export default function ReturnsPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(1);
    const [agreed, setAgreed] = useState(false);

    const toggle = (i: number) => setOpenIndex((prev) => (prev === i ? null : i));

    return (
        <div className="bg-white">
            <Container className="py-6 sm:py-8">
                {/* Breadcrumb */}
                <div className="mb-6 flex items-center gap-1 text-xs text-gray-400">
                    <Link href="/" className="hover:text-gray-600">
                        Стройопттрог
                    </Link>
                    <ChevronRight size={12} />
                    <span className="text-gray-600">Возврат</span>
                </div>

                <h1 className="mb-6 text-2xl font-bold text-gray-900 sm:text-3xl">
                    Возврат
                </h1>

                <div className="flex flex-col gap-8 lg:flex-row">
                    {/* Left: content */}
                    <div className="min-w-0 flex-1 text-sm leading-relaxed text-gray-700">
                        <p className="mb-4">
                            Возврат или обмен товара надлежащего качества, возможен в течение 14 дней с
                            момента покупки в соответствии со ст.26.1 Закона «О защите прав потребителей»,
                            сохранивший товарный вид и потребительские свойства при наличии документов:
                        </p>
                        <ul className="mb-4 list-disc space-y-1 pl-5">
                            <li>подтверждающих покупку и оплату товара;</li>
                            <li>документа подтверждающего личность.</li>
                        </ul>
                        <p className="mb-4">
                            Для этого достаточно приехать в часы работы наших складов и ТЦ и оформить возврат.
                        </p>
                        <p className="mb-4">
                            Возврат товара возможен без упаковки, но при условии сохранения всей комплектации
                            и потребительских свойств товара.
                        </p>
                        <p className="mb-4">
                            Возврат денежных средств за товар оплаченных банковской картой, осуществляется на
                            ту же карту.
                        </p>
                        <p className="mb-4">
                            При заказе товара с доставкой вы можете отказаться от заказа до его передачи. Если
                            же машина с вашим заказом уже выехала на адрес, мы вернем вам стоимость товара за
                            исключением расходов на доставку.
                        </p>

                        <h2 className="mb-2 mt-6 text-base font-semibold text-gray-900">
                            Ограничения по возврату товара
                        </h2>
                        <p className="mb-4">
                            Мы не принимаем на возврат товары, имеющие индивидуально-определенные свойства,
                            если указанный товар может быть использован исключительно потребителем, который
                            купил его.
                        </p>
                        <p className="mb-6">
                            Например, товары под заказ, колерованная краска, строительные и отделочные
                            материала отпускаемые на метраж, уценённый товар, а так же все виды заказного
                            материала.
                        </p>

                        <h2 className="mb-3 text-base font-semibold text-gray-900">
                            Обращение по гарантии
                        </h2>

                        {/* FAQ Accordion */}
                        <div className="divide-y divide-gray-100 border-t border-gray-100">
                            {faqItems.map((item, i) => {
                                const isOpen = openIndex === i;
                                return (
                                    <div key={i}>
                                        <button
                                            onClick={() => toggle(i)}
                                            className="flex w-full items-center justify-between gap-4 py-4 text-left"
                                        >
                                            <span className="text-sm font-medium text-gray-800">
                                                {item.question}
                                            </span>
                                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gray-200 text-gray-400">
                                                {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                                            </span>
                                        </button>
                                        {isOpen && item.answer && (
                                            <p className="pb-4 pl-1 text-sm text-gray-500">{item.answer}</p>
                                        )}
                                    </div>
                                );
                            })}
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

                        {/* Newsletter */}
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
                            <button className="mb-3 w-full rounded-lg bg-blue-600 py-2.5 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-blue-700">
                                Подписаться
                            </button>
                            <label className="flex cursor-pointer items-start gap-2 text-xs text-gray-400">
                                <input
                                    type="checkbox"
                                    checked={agreed}
                                    onChange={(e) => setAgreed(e.target.checked)}
                                    className="mt-0.5 h-3.5 w-3.5 accent-blue-600"
                                />
                                Согласен с обработкой персональных данных в соответствии с политикой
                                конфиденциальности
                            </label>
                        </div>
                    </div>  
                </div>
            </Container>
        </div>
    );
}