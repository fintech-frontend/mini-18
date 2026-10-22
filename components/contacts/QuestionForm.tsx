"use client";

import { useState } from "react";

const EMPTY_FORM = { name: "", phone: "", message: "", agree: false };

const inputClass =
  "h-14 w-full rounded-xl border border-[#E5E7EB] px-4 text-[16px] outline-none transition focus:border-blue-500 md:h-17 md:px-6 md:text-[18px]";
const labelClass = "mb-3 block text-[16px] font-medium text-[#2F3640] md:text-[18px]";

/* «У вас есть вопросы?» formasi */
export default function QuestionForm() {
  const [form, setForm] = useState(EMPTY_FORM);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, agree: e.target.checked }));
  };

  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(form);
    alert("Форма отправлена!");
    setForm(EMPTY_FORM);
  };

  return (
    <section className="py-14 md:py-24">
      <h2 className="mx-auto max-w-250 text-center text-[28px] font-bold leading-tight text-[#2F3640] sm:text-[36px] md:text-[44px] lg:text-[56px]">
        У вас есть вопросы? С радостью ответим на них!
      </h2>
      <form onSubmit={handleSubmit} className="mx-auto mt-10 max-w-300 md:mt-16">
        {/* NAME + PHONE */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-10">
          <div>
            <label className={labelClass}>
              Ваше имя <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="Введите ваше имя"
              value={form.name}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>
              Номер телефона <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="+7 (___) ___-__-__"
              value={form.phone}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>
        </div>
        {/* MESSAGE */}
        <div className="mt-6 md:mt-10">
          <label className={labelClass}>
            Текст сообщения <span className="text-red-500">*</span>
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
              Согласен с обработкой персональных данных в соответствии с Политикой конфиденциальности
            </span>
          </label>
        </div>
      </form>
    </section>
  );
}
