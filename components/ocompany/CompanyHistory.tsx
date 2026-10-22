/* «История ООО “Стройоптторг”» — yillar bo'yicha kartalar va «Сегодня» kartasi */

type Fact = { text: string; value: string; end?: string };
type Period = { year: string; title: string; facts: Fact[] };

const PERIODS: Period[] = [
  {
    year: "2003",
    title: "Компания ООО «Стройоптторг» была зарегистрирована в реестре и получила свидетельство о регистрации 1 октября 2003 года.",
    facts: [
      { text: "Общая площадь земельного участка составляла ", value: "10 000 м²", end: "." },
      { text: "Площадь складских помещений ", value: "850 м²", end: "." },
      { text: "Численность сотрудников ", value: "10 человек", end: "." },
    ],
  },
  {
    year: "2008",
    title: "С годами компания динамично росла и развивалась, и уже к 2008 г. мы достигли более высоких результатов:",
    facts: [
      { text: "Общая площадь базы составила ", value: "58 000 м²", end: "." },
      { text: "Площадь складских помещений ", value: "5 200 м²", end: "." },
      { text: "Численность коллектива возросла до ", value: "300 человек", end: "." },
    ],
  },
  {
    year: "2018",
    title: "К своему 15-летнему юбилею компания расширила торговые площади до 17 805,3 м²",
    facts: [
      { text: "Торговый центр №1 — ", value: "5 545 м²" },
      { text: "Торговый центр №2 — ", value: "3 951,2 м²" },
      { text: "Складские помещения — ", value: "8 308,6 м²" },
    ],
  },
];

const TODAY = [
  { value: "17 805,3 м²", label: "торговых и складских помещений" },
  { value: "50 000+", label: "наименований товаров" },
  { value: "2 500+", label: "постоянных клиентов" },
  { value: "440", label: "опытных сотрудников" },
];

function PeriodCard({ year, title, facts }: Period) {
  return (
    <div className="rounded-lg border border-[#D7E3F7] p-6 sm:p-8">
      <h3 className="mb-5 text-3xl font-bold text-[#1D73E8]">{year}</h3>

      <h4 className="mb-6 text-lg font-semibold leading-7 text-[#2F3640] sm:text-[22px] sm:leading-8">{title}</h4>

      <ul className="space-y-4 text-sm text-[#4B5563] sm:text-[15px]">
        {facts.map((fact) => (
          <li key={fact.text} className="flex items-start gap-3">
            <span className="mt-2 text-red-500">•</span>
            <span>
              {fact.text}
              <b>{fact.value}</b>
              {fact.end}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TodayCard() {
  return (
    <div className="relative overflow-hidden rounded-lg border-2 border-[#1D73E8] bg-white p-6 sm:p-8">
      <div className="absolute -bottom-12 -right-12 h-44 w-44 rounded-full bg-[#F3F7FD]" />

      <h3 className="relative mb-10 text-center text-3xl font-bold text-[#1D73E8]">Сегодня</h3>

      <div className="relative grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-y-10">
        {TODAY.map((stat) => (
          <div key={stat.label}>
            <h4 className="text-2xl font-bold text-[#1D73E8] sm:text-[32px]">{stat.value}</h4>

            <p className="mt-2 text-sm text-[#6B7280]">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CompanyHistory() {
  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <h2 className="mb-10 text-3xl font-bold text-[#2F3640] sm:text-4xl lg:text-[42px]">История ООО “Стройоптторг”</h2>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {PERIODS.map((period) => (
          <PeriodCard key={period.year} {...period} />
        ))}

        <TodayCard />
      </div>
    </section>
  );
}
