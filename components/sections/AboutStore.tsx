import Link from "next/link";
import { styles } from "@/styles/index.styles";

const stats = [
  { value: "17 805,3 м²", label: "торговых и складских помещений" },
  { value: "50 000+", label: "наименований товара" },
  { value: "2 500+", label: "постоянных клиентов" },
  { value: "440", label: "опытных сотрудников" },
];

export const AboutStore = () => {
  return (
    <section className="relative my-6 overflow-hidden bg-[#F9FAFB] sm:my-8">
      <div className={styles.container}>
          <div className="flex flex-col justify-center py-10 lg:w-1/2 lg:py-14 lg:pr-12">
            <h2 className="mb-3 text-xl font-semibold text-[#2C333D] sm:text-2xl">
              О нашем магазине
            </h2>
            <p className="mb-6 text-sm leading-relaxed text-[#2C333D]">
              Цель и главная задача компании — создать сервис, который не
              ограничивает продажей строительных и отделочных материалов, а
              будет решать задачи и трудности, с которыми сталкиваются люди во
              время ремонта.
            </p>
            <div className="mb-6 grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-4 sm:gap-6">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="mb-1 text-lg font-bold text-[#117FE3] sm:text-xl">{s.value}</p>
                  <p className="text-xs text-[#44474F]">{s.label}</p>
                </div>
              ))}
            </div>
            <p className="mb-6 text-sm leading-relaxed text-[#2C333D]">
              Уже второе десятилетие мы воплощаем в реальность вашу мечту о
              красивом, комфортабельном доме, богатстворном современном офисе,
              жилтой теплой даче, помогая реализовать любые строительные и
              дизайнерские фантазии с минимальными затратами времени и денежных
              средств.
            </p>
            <Link
              href="/about"
              className="w-fit rounded-lg bg-[#011120] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Подробнее о компании →
            </Link>
          </div>
      </div>

      {/* Rasm: mobil'da matn ostida, katta ekranda o'ng yarmini ekran chetigacha to'ldiradi */}
      <div className="relative h-[260px] w-full sm:h-[360px] lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-1/2">
        <img
          src="/assets/images/about-tools.svg"
          alt="Инструменты"
          className="h-full w-full object-cover"
        />
      </div>
    </section>
  );
};