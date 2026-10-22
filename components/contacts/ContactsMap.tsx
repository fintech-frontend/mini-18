import { CONTACT_EMAIL } from "./data";

/* Sarlavha, xarita va ustidagi kontakt kartasi */
export default function ContactsMap() {
  return (
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

        <ContactCard />
      </div>
    </section>
  );
}

function ContactCard() {
  return (
    <div className="static mt-5 w-full rounded-2xl bg-white p-5 shadow-xl sm:p-6 md:absolute md:right-8 md:top-8 md:mt-0 md:w-85 md:p-8">
      {/* ADDRESS */}
      <div className="mb-6 md:mb-7">
        <h3 className="mb-3 text-[16px] font-semibold text-[#2F3640] md:text-[18px]">📍 Адрес:</h3>

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
        <h3 className="mb-3 text-[16px] font-semibold text-[#2F3640] md:text-[18px]">📞 Телефон:</h3>
        <p className="text-base font-medium md:text-lg">8 (8782) 28-42-72</p>
      </div>
      {/* EMAIL */}
      <div className="mb-6 md:mb-7">
        <h3 className="mb-3 text-[16px] font-semibold text-[#2F3640] md:text-[18px]">✉ Email:</h3>
        <a href={`mailto:${CONTACT_EMAIL}`} className="break-all text-blue-600 hover:underline">
          {CONTACT_EMAIL}
        </a>
      </div>
      {/* WORK TIME */}
      <div className="mb-7 md:mb-8">
        <h3 className="mb-3 text-[16px] font-semibold text-[#2F3640] md:text-[18px]">⏰ Время работы:</h3>
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
  );
}
