"use client";

import { useState } from "react";

function Kontakt() {
    const contacts = [
        {
            title: "Генеральный директор:",
            value: "8 (8782) 28-42-67 (приемная)",
        },
        {
            title: "Отдел снабжения:",
            value: "8 (8782) 28-42-67",
        },
        {
            title: "Отдел сбыта:",
            value: "8 (8782) 28-45-81",
        },
        {
            title: "Юридический отдел:",
            value: "8 (8782) 28-42-69",
        },
        {
            title: "Бухгалтерия:",
            value: "8 (8782) 28-42-71",
        },
        {
            title: "Отдел доставки:",
            value: "8 (8782) 28-45-83",
        },
        {
            title: "Кредитный отдел:",
            value: "8 (8782) 28-45-82",
        },
        {
            title: "Отдел кадров:",
            value: "8 (8782) 28-42-73",
        },
    ];

    const regions = [
        "Москва",
        "Ставрополь",
        "Краснодар",
        "Грозный",
        "Ростов-на-Дону",
        "Самара",
    ];
    const [form, setForm] = useState({
        name: "",
        phone: "",
        message: "",
        agree: false,
    });

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value } = e.target;

        setForm((dr) => ({
            ...dr,
            [name]: value,
        }));
    };

    const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((dtv) => ({
            ...dtv,
            agree: e.target.checked,
        }));
    };

    const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log(form);

        alert("Форма отправлена!");
    };

    return (
        <>

            <section className="py-10 sm:py-12 md:py-16 bg-white">
                <div className="mx-auto max-w-360 px-4 sm:px-8 md:px-12 lg:px-20">
                    <h1 className="text-[32px] sm:text-[40px] md:text-[52px] font-bold text-[#2F3640] mb-6 md:mb-10">
                        Контакты
                    </h1>

                    <div className="relative">
                        <iframe
                            src="https://yandex.ru/map-widget/v1/?um=constructor%3Axxxxxxxxxxxxxxxxxxxxxxxx&source=constructor"
                            className="w-full h-72 sm:h-96 md:h-125 lg:h-152.5 rounded-xl"
                            loading="lazy"
                            allowFullScreen
                        />

                        <div className="static md:absolute md:top-8 md:right-8 mt-6 md:mt-0 w-full md:w-85 rounded-2xl bg-white p-6 md:p-8 shadow-xl">
                            <div className="mb-7">
                                <h3 className="mb-3 text-[16px] md:text-[18px] font-semibold">
                                    📍 Адрес:
                                </h3>

                                <p className="text-[14px] md:text-[15px] leading-6 md:leading-7 text-gray-500">
                                    369012, Карачаево-Черкесская Республика,
                                    <br />
                                    г. Черкесск,
                                    <br />
                                    ул Октябрьская, дом 301
                                </p>
                            </div>

                            <div className="mb-7">
                                <h3 className="mb-3 text-[16px] md:text-[18px] font-semibold">
                                    📞 Телефон:
                                </h3>

                                <p className="text-base md:text-lg font-medium">
                                    8 (8782) 28-42-72
                                </p>
                            </div>

                            <div className="mb-7">
                                <h3 className="mb-3 text-[16px] md:text-[18px] font-semibold">
                                    ✉ Email:
                                </h3>

                                <a
                                    href="mailto:info@stroiopttorg.ru"
                                    className="text-blue-600 hover:underline break-all"
                                >
                                    info@stroiopttorg.ru
                                </a>
                            </div>

                            <div className="mb-8">
                                <h3 className="mb-3 text-[16px] md:text-[18px] font-semibold">
                                    ⏰ Время работы:
                                </h3>

                                <p className="leading-6 md:leading-7 text-gray-500">
                                    Ежедневно, с 8:00 до 18:00
                                    <br />
                                    Без перерыва и выходных
                                </p>
                            </div>

                            <button className="h-12 md:h-14 w-full rounded-xl bg-blue-600 font-semibold text-white transition hover:bg-blue-700">
                                ЗАКАЗАТЬ ЗВОНОК
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-12 md:py-20 bg-white">
                <div className="mx-auto max-w-360 px-4 sm:px-8 md:px-12 lg:px-20">

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6">

                        <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
                            {contacts.map((item, index) => (
                                <div
                                    key={index}
                                    className="rounded-xl border border-gray-200 bg-white px-5 py-4"
                                >
                                    <p className="mb-2 text-[13px] text-gray-500">
                                        {item.title}
                                    </p>

                                    <h3 className="text-[18px] md:text-[20px] font-semibold text-[#2F3640] leading-6">
                                        {item.value}
                                    </h3>
                                </div>
                            ))}
                        </div>


                        <div className="rounded-xl bg-[#F5F8FC] p-6">
                            <h3 className="mb-4 text-xl font-semibold">
                                Реквизиты:
                            </h3>

                            <p className="text-sm leading-7 text-gray-600">
                                ОБЩЕСТВО С ОГРАНИЧЕННОЙ
                                ОТВЕТСТВЕННОСТЬЮ «СТРОЙОПТТОРГ»
                                <br />
                                ИНН 0901051787
                                <br />
                                КПП 091001001
                                <br />
                                Карачаево-Черкесская республика
                                <br />
                                г. Черкесск
                                <br />
                                ул. Октябрьская, 301Г
                                <br />
                                р/с 40702810630000102415
                                <br />
                                Ставропольское отделение №5230
                                <br />
                                ПАО Сбербанк
                                <br />
                                БИК 040702615
                            </p>
                        </div>

                    </div>


                    <div className="mt-10 md:mt-16">
                        <h2 className="mb-6 md:mb-10 text-2xl md:text-3xl font-bold">
                            Работаем по регионам:
                        </h2>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-y-6 border-t border-gray-400 pt-8">
                            {regions.map((city, index) => (
                                <div
                                    key={index}
                                    className="border-r border-gray-200 px-4 last:border-r-0 sm:[&:nth-child(3n)]:border-r-0 lg:[&:nth-child(3n)]:border-r lg:last:border-r-0"
                                >
                                    <h3 className="mb-3 font-medium">
                                        {city}
                                    </h3>

                                    <p className="mb-2 text-base md:text-lg font-semibold">
                                        +7 (800) 444-00-65
                                    </p>

                                    <a
                                        href="mailto:info@stroiopttorg.ru"
                                        className="text-sm text-blue-600 hover:underline break-all"
                                    >
                                        info@stroiopttorg.ru
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </section>
            <section className="py-14 md:py-24 bg-white">
                <div className="mx-auto max-w-360 px-4 sm:px-8 md:px-12 lg:px-20">

                    <h2 className="text-center text-[28px] sm:text-[36px] md:text-[44px] lg:text-[56px] font-bold text-[#2F3640]">
                        У вас есть вопросы? С радостью ответим на них!
                    </h2>

                    <form
                        onSubmit={handleSubmit}
                        className="mt-10 md:mt-16"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                            <div>
                                <label className="mb-3 block text-[16px] md:text-[18px] font-medium text-[#2F3640]">
                                    Ваше имя <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Введите ваше имя"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    className="h-14 md:h-17 w-full rounded-xl border border-[#E5E7EB] px-4 md:px-6 text-[16px] md:text-[18px] outline-none transition focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="mb-3 block text-[16px] md:text-[18px] font-medium text-[#2F3640]">
                                    Номер телефона{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="+7 (___) ___-__-__"
                                    value={form.phone}
                                    onChange={handleChange}
                                    required
                                    className="h-14 md:h-17 w-full rounded-xl border border-[#E5E7EB] px-4 md:px-6 text-[16px] md:text-[18px] outline-none transition focus:border-blue-500"
                                />
                            </div>
                        </div>
                        <div className="mt-6 md:mt-10">
                            <label className="mb-3 block text-[16px] md:text-[18px] font-medium text-[#2F3640]">
                                Текст сообщения{" "}
                                <span className="text-red-500">*</span>
                            </label>

                            <textarea
                                name="message"
                                rows={6}
                                placeholder="Введите ваш вопрос"
                                value={form.message}
                                onChange={handleChange}
                                required
                                className="w-full resize-none rounded-xl border border-[#E5E7EB] p-4 md:p-6 text-[16px] md:text-[18px] outline-none transition focus:border-blue-500"
                            />
                        </div>
                        <div className="mt-8 md:mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-10">

                            <button
                                type="submit"
                                className="h-14 md:h-17 w-full sm:w-60 rounded-xl bg-[#1E73E8] text-[16px] md:text-[18px] font-semibold text-white transition hover:bg-[#1667d6]"
                            >
                                ОТПРАВИТЬ
                            </button>
                            <label className="flex cursor-pointer items-start gap-4">
                                <input
                                    type="checkbox"
                                    checked={form.agree}
                                    onChange={handleCheckbox}
                                    required
                                    className="mt-1 h-6 w-6 md:h-7 md:w-7 shrink-0 rounded border-gray-300 accent-[#1E73E8]"
                                />
                                <span className="max-w-130 text-[14px] md:text-[16px] leading-6 md:leading-7 text-[#7B8794]">
                                    Согласен с обработкой персональных данных
                                    в соответствии с Политикой конфиденциальности
                                </span>
                            </label>
                        </div>
                    </form>
                </div>
            </section>
        </>
    );
}

export default Kontakt;
