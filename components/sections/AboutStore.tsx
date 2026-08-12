import Link from "next/link";
import Container from "@/components/ui/Container";
import { styles } from "@/styles/index.styles";

const stats = [
  { value: "17 805,3 м²", label: "торговых и складских помещений" },
  { value: "50 000+", label: "наименований товара" },
  { value: "2 500+", label: "постоянных клиентов" },
  { value: "440", label: "опытных сотрудников" },
];

export const AboutStore = () => {
  return (
    <section className={`${styles.container} py-6 sm:py-8`}>
     
        <div className="grid grid-cols-1 overflow-hidden rounded-2xl bg-[#F9FAFB] lg:grid-cols-2">
          <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
            <h2 className="mb-3 text-xl font-semibold text-[#2C333D] sm:text-2xl">
              О нашем магазине
            </h2>
            <p className="mb-6 text-sm leading-relaxed text-[#2C333D]">
              Цель и главная задача компании — создать сервис, который не
              ограничивает продажей строительных и отделочных материалов, а
              будет решать задачи и трудности, с которыми сталкиваются люди во
              время ремонта.
            </p>
            <div className="mb-6 grid grid-cols-4 gap-2 sm:gap-6">
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

          {/* Image: Figma'da qattiq to'rtburchakka kesilmagan, erkin "suzib" turadi */}
          <div className="relative flex min-h-[220px] items-center justify-center overflow-hidden sm:min-h-[280px] lg:min-h-full">
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.04)_0%,rgba(0,0,0,0)_65%)]" />
            <img
              src="/assets/images/about-tools.svg"
              alt="Инструменты"
              className="relative w-[115%] max-w-none scale-105 object-contain"
            />
          </div>
        </div>
    
    </section>
  );
};