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
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleCheckbox = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setForm((prev) => ({
            ...prev,
            agree: e.target.checked,
        }));
    }
    const handleSubmit = (
        e: React.ChangeEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        console.log(form);
        alert("Форма отправлена!");
        setForm({
            name: "",
            phone: "",
            message: "",
            agree: false,
        });
    };
    return (
        <div >
            {/* BOSH CONTAINER */}
            <div className="w-full">
                {/* CONTACTS + MAP */}
                <section className="py-10 sm:py-12 md:py-16">

                    <h1 className="mb-6 text-[32px] font-bold text-[#2F3640] sm:text-[40px] md:mb-10 md:text-[52px]"> Контакты</h1>
                    <div className="relative">

                        {/* MAP */}

                        <iframe
                            src="https://www.google.com/maps?q=Карачаево-Черкесская%20Республика,%20Черкесск,%20Октябрьская%20улица,%20301&output=embed"
                            className="h-75 w-full rounded-xl sm:h-100 md:h-125 lg:h-152.5"
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                        />

                        {/* CONTACT CARD */}

                        <div className="static mt-5 w-full rounded-2xl bg-white p-5 shadow-xl sm:p-6 md:absolute md:right-8 md:top-8 md:mt-0 md:w-85 md:p-8">
                            {/* ADDRESS */}
                            <div className="mb-6 md:mb-7">
                                <h3 className="mb-3 text-[16px] font-semibold text-[#2F3640] md:text-[18px]">
                                    📍 Адрес:
                                </h3>

                                <p className="text-[14px] leading-6 text-gray-500 md:text-[15px] md:leading-7">
                                    369012, Карачаево-Черкесская Республика,
                                    <br />
                                    г. Черкесск,
                                    <br />
                                    ул Октябрьская, дом 301
                                </p>
                            </div>
                            {/* PHONE */}
                            <div className="mb-6 md:mb-7">
                                <h3 className="mb-3 text-[16px] font-semibold text-[#2F3640] md:text-[18px]">
                                    📞 Телефон:
                                </h3>
                                <p className="text-base font-medium md:text-lg">
                                    8 (8782) 28-42-72
                                </p>
                            </div>
                            {/* EMAIL */}
                            <div className="mb-6 md:mb-7">
                                <h3 className="mb-3 text-[16px] font-semibold text-[#2F3640] md:text-[18px]">
                                    ✉ Email:
                                </h3>
                                <a
                                    href="mailto:info@stroiopttorg.ru"
                                    className="break-all text-blue-600 hover:underline"
                                >
                                    info@stroiopttorg.ru
                                </a>
                            </div>
                            {/* WORK TIME */}
                            <div className="mb-7 md:mb-8">
                                <h3 className="mb-3 text-[16px] font-semibold text-[#2F3640] md:text-[18px]">
                                    ⏰ Время работы:
                                </h3>
                                <p className="leading-6 text-gray-500 md:leading-7">
                                    Ежедневно, с 8:00 до 18:00
                                    <br />
                                    Без перерыва и выходных
                                </p>
                            </div>
                            {/* BUTTON */}
                            <button
                                type="button"
                                className="h-12 w-full rounded-xl cursor-pointer bg-blue-600 font-semibold text-white transition hover:bg-blue-700 md:h-14"
                            >
                                ЗАКАЗАТЬ ЗВОНОК
                            </button>
                        </div>
                    </div>
                </section>
                {/* TELEFONLAR VA REKVIZITLAR */}
                <section className="py-10 md:py-16">
                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
                        {/* CONTACT CARDS */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 lg:col-span-4">
                            {contacts.map((item, index) => (
                                <div
                                    key={index}
                                    className="rounded-xl border border-gray-200 bg-white px-5 py-4 transition hover:shadow-md"
                                >
                                    <p className="mb-2 text-[13px] text-gray-500">
                                        {item.title}
                                    </p>
                                    <h3 className="text-[18px] font-semibold leading-6 text-[#2F3640] md:text-[20px]">
                                        {item.value}
                                    </h3>
                                </div>
                            ))}
                        </div>
                        {/* REKVIZITLAR */}
                        <div className="rounded-xl bg-[#F5F8FC] p-5 sm:p-6">
                            <h3 className="mb-4 text-xl font-semibold text-[#2F3640]">
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
                    {/* ================================================= */}
                    {/* REGIONS */}
                    {/* ================================================= */}
                    <div className="mt-12 md:mt-16">
                        <h2 className="mb-6 text-2xl font-bold text-[#2F3640] md:mb-10 md:text-3xl">
                            Работаем по регионам:
                        </h2>
                        <div className="grid grid-cols-1 border-t border-gray-200 pt-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                            {regions.map((city, index) => (
                                <div
                                    key={index}
                                    className="border-b border-gray-200 px-4 py-5 lg:border-b-0 lg:border-r"
                                >
                                    <h3 className="mb-3 font-medium text-[#2F3640]">
                                        {city}
                                    </h3>
                                    <p className="mb-2 text-base font-semibold text-[#2F3640] md:text-lg">
                                        +7 (800) 444-00-65
                                    </p>
                                    <a
                                        href="mailto:info@stroiopttorg.ru"
                                        className="break-all text-sm text-blue-600 hover:underline"
                                    >
                                        info@stroiopttorg.ru
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                {/* ================================================= */}
                {/* QUESTION FORM */}
                {/* ================================================= */}
                <section className="py-14 md:py-24">
                    <h2 className="mx-auto max-w-250 text-center text-[28px] font-bold leading-tight text-[#2F3640] sm:text-[36px] md:text-[44px] lg:text-[56px]">
                        У вас есть вопросы? С радостью ответим на них!
                    </h2>
                    <form
                        onSubmit={handleSubmit}
                        className="mx-auto mt-10 max-w-300 md:mt-16"
                    >
                        {/* NAME + PHONE */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-10">
                            {/* NAME */}
                            <div>
                                <label className="mb-3 block text-[16px] font-medium text-[#2F3640] md:text-[18px]">
                                    Ваше имя{" "}
                                    <span className="text-red-500">
                                        *
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Введите ваше имя"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    className="h-14 w-full rounded-xl border border-[#E5E7EB] px-4 text-[16px] outline-none transition focus:border-blue-500 md:h-17 md:px-6 md:text-[18px]"
                                />
                            </div>
                            {/* PHONE */}
                            <div>
                                <label className="mb-3 block text-[16px] font-medium text-[#2F3640] md:text-[18px]">
                                    Номер телефона{" "}
                                    <span className="text-red-500">
                                        *
                                    </span>
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="+7 (___) ___-__-__"
                                    value={form.phone}
                                    onChange={handleChange}
                                    required
                                    className="h-14 w-full rounded-xl border border-[#E5E7EB] px-4 text-[16px] outline-none transition focus:border-blue-500 md:h-17 md:px-6 md:text-[18px]"
                                />

                            </div>
                        </div>
                        {/* MESSAGE */}
                        <div className="mt-6 md:mt-10">
                            <label className="mb-3 block text-[16px] font-medium text-[#2F3640] md:text-[18px]">
                                Текст сообщения{" "}
                                <span className="text-red-500">
                                    *
                                </span>
                            </label>

                            <textarea
                                name="message"
                                rows={6}
                                placeholder="Введите ваш вопрос"
                                value={form.message}
                                onChange={handleChange}
                                required
                                className="w-full resize-none rounded-xl border border-[#E5E7EB] p-4 text-[16px] outline-none transition focus:border-blue-500 md:p-6 md:text-[18px]"
                            />

                        </div>


                        {/* BUTTON + CHECKBOX */}

                        <div className="mt-8 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-10 md:mt-12">

                            <button
                                type="submit"
                                className="h-14 w-full rounded-xl cursor-pointer bg-[#1E73E8] px-8 text-[16px] font-semibold text-white transition hover:bg-[#1667D6] sm:w-60 md:h-17 md:text-[18px]"
                            >
                                ОТПРАВИТЬ
                            </button>


                            <label className="flex cursor-pointer items-start gap-4">

                                <input
                                    type="checkbox"
                                    checked={form.agree}
                                    onChange={handleCheckbox}
                                    required
                                    className="mt-1 h-6 w-6 shrink-0 accent-[#1E73E8] md:h-7 md:w-7"
                                />

                                <span className="text-[14px] leading-6 text-[#7B8794] md:text-[16px] md:leading-7">
                                    Согласен с обработкой персональных
                                    данных в соответствии с Политикой
                                    конфиденциальности
                                </span>

                            </label>

                        </div>

                    </form>

                </section>

            </div>
        </div>
    );
}

export default Kontakt;