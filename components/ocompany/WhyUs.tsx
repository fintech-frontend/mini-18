import Image, { type StaticImageData } from "next/image";

import iconOplata from "../../assets/iconOplata.png";
import iconTovar from "../../assets/iconTovar.png";
import iconBox from "../../assets/iconBox.png";
import iconDelaem from "../../assets/iconDelaem.png";

type Advantage = { icon: StaticImageData; alt: string; title: string; text: string };

const ADVANTAGES: Advantage[] = [
  {
    icon: iconOplata,
    alt: "Оплата",
    title: "Оплата любым удобным способом",
    text: "Выбирайте любой способ оплаты для максимального комфорта при покупках у нас.",
  },
  {
    icon: iconTovar,
    alt: "Товары",
    title: "Большой выбор товаров в каталоге",
    text: "Наш каталог насыщен разнообразными товарами, чтобы удовлетворить ваши потребности.",
  },
  {
    icon: iconBox,
    alt: "Доставка",
    title: "Осуществляем быструю доставку",
    text: "Мы оперативно доставим ваш заказ, чтобы вы могли насладиться покупкой как можно скорее.",
  },
  {
    icon: iconDelaem,
    alt: "Скидки",
    title: "Делаем скидки на крупные покупки",
    text: "Наша система скидок работает для вашей выгоды, чем больше купили — тем больше сэкономили.",
  },
];

function AdvantageCard({ icon, alt, title, text }: Advantage) {
  return (
    <div className="flex items-start gap-5">
      <Image src={icon} alt={alt} width={40} height={40} className="mt-1 h-10 w-10 shrink-0 object-contain" />

      <div>
        <h3 className="text-lg font-semibold leading-7 text-[#2F3640] sm:text-xl lg:text-[22px]">{title}</h3>

        <p className="mt-3 text-sm leading-7 text-[#6B7280] sm:text-[15px]">{text}</p>
      </div>
    </div>
  );
}

/* «Почему именно мы» — 4 ta afzallik */
export default function WhyUs() {
  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <h2 className="mb-10 text-3xl font-bold text-[#2F3640] sm:text-4xl lg:mb-16 lg:text-[42px]">Почему именно мы</h2>

      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 xl:grid-cols-4 xl:gap-12">
        {ADVANTAGES.map((item) => (
          <AdvantageCard key={item.title} {...item} />
        ))}
      </div>
    </section>
  );
}
