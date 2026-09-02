import Image from "next/image";

import OCompnyImg from "../../assets/oCompnyImg.png";
import iconOplata from "../../assets/iconOplata.png";
import iconTovar from "../../assets/iconTovar.png";
import iconBox from "../../assets/iconBox.png";
import iconDelaem from "../../assets/iconDelaem.png";
import { news } from "@/components/constans/news";
import { styles } from "@/styles/index.styles";

export default function OCompny() {
    return (

    <main className="w-full">
      {/* ================= UMUMIY CONTAINER ================= */}
      <div className={styles.container}>

        {/* ================= HERO / О КОМПАНИИ ================= */}
        <section className="w-full p-0">
          <div className="grid w-full grid-cols-1 items-center lg:grid-cols-[43%_57%]">

            {/* ================= TEXT ================= */}
            <div className="relative z-10 w-full p-0">
              <h1 className="mb-6 text-4xl font-bold leading-tight text-[#2F3640] sm:text-5xl lg:text-[52px]">
                О компании
              </h1>

              <h3 className="mb-6 text-lg font-semibold leading-7 text-[#2F3640] sm:text-xl lg:text-[22px] lg:leading-8">
                «Стройоптторг» - крупнейшая оптово-розничная
                компания по продаже строительных и отделочных
                материалов.
              </h3>

              <p className="text-sm leading-7 text-[#2C333D] z-50 sm:text-[15px] sm:leading-8">
                Уже второе десятилетие мы готовы воплотить в
                реальность Вашу мечту о красивом,
                комфортабельном доме, благоустроенном современном
                офисе, уютной теплой даче, помочь реализовать
                любые строительные и дизайнерские фантазии и с
                минимальными затратами времени и денежных средств.

                <br />
                <br />

                Вы всегда можете прийти к нам, пройтись по нашим
                складским и торговским площадям, оценить, как мы
                храним, принимаем и продаем товары. Пообщаться с
                продавцами-консультантами, получить консультацию
                по товарам у менеджеров.

                <br />
                <br />

                Вы также можете всегда пожаловаться нам, спросить
                совета или вернуть не понравившийся товар. Если
                Вам что-то не понравилось — сообщите нам об этом.
                Только так мы сможем стать лучше.

                <br />
                <br />

                Все товары, представленные на сайте,
                гарантированно есть в наличии.

                <br />
                <br />

                Помимо материалов мы предлагаем большой набор
                услуг, которые значительно упрощают процесс
                строительства и ремонта и делают его легким и
                комфортным.
              </p>
            </div>

            {/* ================= IMAGE ================= */}
            <div className="relative h-100 w-full sm:h-125 lg:h-162.5">
              <Image
                src={OCompnyImg}
                alt="О компании"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 57vw"
                className="object-cover object-center"
              />
            </div>

          </div>
        </section>



                {/* ================= ПОЧЕМУ ИМЕННО МЫ ================= */}
                <section className="py-12 sm:py-16 lg:py-20">

                    <h2 className="mb-10 text-3xl font-bold text-[#2F3640] sm:text-4xl lg:mb-16 lg:text-[42px]">
                        Почему именно мы
                    </h2>

                    <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 xl:grid-cols-4 xl:gap-12">

                        {/* CARD 1 */}
                        <div className="flex items-start gap-5">
                            <Image
                                src={iconOplata}
                                alt="Оплата"
                                width={40}
                                height={40}
                                className="mt-1 h-10 w-10 shrink-0 object-contain"
                            />

                            <div>
                                <h3 className="text-lg font-semibold leading-7 text-[#2F3640] sm:text-xl lg:text-[22px]">
                                    Оплата любым удобным способом
                                </h3>

                                <p className="mt-3 text-sm leading-7 text-[#6B7280] sm:text-[15px]">
                                    Выбирайте любой способ оплаты для
                                    максимального комфорта при покупках у нас.
                                </p>
                            </div>
                        </div>


                        {/* CARD 2 */}
                        <div className="flex items-start gap-5">
                            <Image
                                src={iconTovar}
                                alt="Товары"
                                width={40}
                                height={40}
                                className="mt-1 h-10 w-10 shrink-0 object-contain"
                            />

                            <div>
                                <h3 className="text-lg font-semibold leading-7 text-[#2F3640] sm:text-xl lg:text-[22px]">
                                    Большой выбор товаров в каталоге
                                </h3>

                                <p className="mt-3 text-sm leading-7 text-[#6B7280] sm:text-[15px]">
                                    Наш каталог насыщен разнообразными товарами,
                                    чтобы удовлетворить ваши потребности.
                                </p>
                            </div>
                        </div>


                        {/* CARD 3 */}
                        <div className="flex items-start gap-5">
                            <Image
                                src={iconBox}
                                alt="Доставка"
                                width={40}
                                height={40}
                                className="mt-1 h-10 w-10 shrink-0 object-contain"
                            />

                            <div>
                                <h3 className="text-lg font-semibold leading-7 text-[#2F3640] sm:text-xl lg:text-[22px]">
                                    Осуществляем быструю доставку
                                </h3>

                                <p className="mt-3 text-sm leading-7 text-[#6B7280] sm:text-[15px]">
                                    Мы оперативно доставим ваш заказ, чтобы вы
                                    могли насладиться покупкой как можно скорее.
                                </p>
                            </div>
                        </div>


                        {/* CARD 4 */}
                        <div className="flex items-start gap-5">
                            <Image
                                src={iconDelaem}
                                alt="Скидки"
                                width={40}
                                height={40}
                                className="mt-1 h-10 w-10 shrink-0 object-contain"
                            />

                            <div>
                                <h3 className="text-lg font-semibold leading-7 text-[#2F3640] sm:text-xl lg:text-[22px]">
                                    Делаем скидки на крупные покупки
                                </h3>

                                <p className="mt-3 text-sm leading-7 text-[#6B7280] sm:text-[15px]">
                                    Наша система скидок работает для вашей
                                    выгоды, чем больше купили — тем больше
                                    сэкономили.
                                </p>
                            </div>
                        </div>

                    </div>
                </section>


                {/* ================= ИСТОРИЯ ================= */}
                <section className="py-12 sm:py-16 lg:py-20">

                    <h2 className="mb-10 text-3xl font-bold text-[#2F3640] sm:text-4xl lg:text-[42px]">
                        История ООО “Стройоптторг”
                    </h2>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                        {/* 2003 */}
                        <div className="rounded-lg border border-[#D7E3F7] p-6 sm:p-8">

                            <h3 className="mb-5 text-3xl font-bold text-[#1D73E8]">
                                2003
                            </h3>

                            <h4 className="mb-6 text-lg font-semibold leading-7 text-[#2F3640] sm:text-[22px] sm:leading-8">
                                Компания ООО «Стройоптторг» была зарегистрирована
                                в реестре и получила свидетельство о регистрации
                                1 октября 2003 года.
                            </h4>

                            <ul className="space-y-4 text-sm text-[#4B5563] sm:text-[15px]">

                                <li className="flex items-start gap-3">
                                    <span className="mt-2 text-red-500">
                                        •
                                    </span>
                                    <span>
                                        Общая площадь земельного участка
                                        составляла <b>10 000 м²</b>.
                                    </span>
                                </li>

                                <li className="flex items-start gap-3">
                                    <span className="mt-2 text-red-500">
                                        •
                                    </span>
                                    <span>
                                        Площадь складских помещений{" "}
                                        <b>850 м²</b>.
                                    </span>
                                </li>

                                <li className="flex items-start gap-3">
                                    <span className="mt-2 text-red-500">
                                        •
                                    </span>
                                    <span>
                                        Численность сотрудников{" "}
                                        <b>10 человек</b>.
                                    </span>
                                </li>

                            </ul>
                        </div>


                        {/* 2008 */}
                        <div className="rounded-lg border border-[#D7E3F7] p-6 sm:p-8">

                            <h3 className="mb-5 text-3xl font-bold text-[#1D73E8]">
                                2008
                            </h3>

                            <h4 className="mb-6 text-lg font-semibold leading-7 text-[#2F3640] sm:text-[22px] sm:leading-8">
                                С годами компания динамично росла и развивалась,
                                и уже к 2008 г. мы достигли более высоких
                                результатов:
                            </h4>

                            <ul className="space-y-4 text-sm text-[#4B5563] sm:text-[15px]">

                                <li className="flex items-start gap-3">
                                    <span className="mt-2 text-red-500">
                                        •
                                    </span>
                                    <span>
                                        Общая площадь базы составила{" "}
                                        <b>58 000 м²</b>.
                                    </span>
                                </li>

                                <li className="flex items-start gap-3">
                                    <span className="mt-2 text-red-500">
                                        •
                                    </span>
                                    <span>
                                        Площадь складских помещений{" "}
                                        <b>5 200 м²</b>.
                                    </span>
                                </li>

                                <li className="flex items-start gap-3">
                                    <span className="mt-2 text-red-500">
                                        •
                                    </span>
                                    <span>
                                        Численность коллектива возросла до{" "}
                                        <b>300 человек</b>.
                                    </span>
                                </li>

                            </ul>
                        </div>


                        {/* 2018 */}
                        <div className="rounded-lg border border-[#D7E3F7] p-6 sm:p-8">

                            <h3 className="mb-5 text-3xl font-bold text-[#1D73E8]">
                                2018
                            </h3>

                            <h4 className="mb-6 text-lg font-semibold leading-7 text-[#2F3640] sm:text-[22px] sm:leading-8">
                                К своему 15-летнему юбилею компания расширила
                                торговые площади до 17 805,3 м²
                            </h4>

                            <ul className="space-y-4 text-sm text-[#4B5563] sm:text-[15px]">

                                <li className="flex items-start gap-3">
                                    <span className="mt-2 text-red-500">
                                        •
                                    </span>
                                    <span>
                                        Торговый центр №1 —{" "}
                                        <b>5 545 м²</b>
                                    </span>
                                </li>

                                <li className="flex items-start gap-3">
                                    <span className="mt-2 text-red-500">
                                        •
                                    </span>
                                    <span>
                                        Торговый центр №2 —{" "}
                                        <b>3 951,2 м²</b>
                                    </span>
                                </li>

                                <li className="flex items-start gap-3">
                                    <span className="mt-2 text-red-500">
                                        •
                                    </span>
                                    <span>
                                        Складские помещения —{" "}
                                        <b>8 308,6 м²</b>
                                    </span>
                                </li>

                            </ul>
                        </div>


                        {/* TODAY */}
                        <div className="relative overflow-hidden rounded-lg border-2 border-[#1D73E8] bg-white p-6 sm:p-8">

                            <div className="absolute -bottom-12 -right-12 h-44 w-44 rounded-full bg-[#F3F7FD]" />

                            <h3 className="relative mb-10 text-center text-3xl font-bold text-[#1D73E8]">
                                Сегодня
                            </h3>

                            <div className="relative grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-y-10">

                                <div>
                                    <h4 className="text-2xl font-bold text-[#1D73E8] sm:text-[32px]">
                                        17 805,3 м²
                                    </h4>

                                    <p className="mt-2 text-sm text-[#6B7280]">
                                        торговых и складских помещений
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-2xl font-bold text-[#1D73E8] sm:text-[32px]">
                                        50 000+
                                    </h4>

                                    <p className="mt-2 text-sm text-[#6B7280]">
                                        наименований товаров
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-2xl font-bold text-[#1D73E8] sm:text-[32px]">
                                        2 500+
                                    </h4>

                                    <p className="mt-2 text-sm text-[#6B7280]">
                                        постоянных клиентов
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-2xl font-bold text-[#1D73E8] sm:text-[32px]">
                                        440
                                    </h4>

                                    <p className="mt-2 text-sm text-[#6B7280]">
                                        опытных сотрудников
                                    </p>
                                </div>

                            </div>
                        </div>

                    </div>
                </section>


                {/* ================= NEWS ================= */}
                <section className="py-12 sm:py-16 lg:py-20">

                    <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                        <h2 className="text-3xl font-bold text-[#2F3640] sm:text-4xl lg:text-[42px]">
                            Последние новости
                        </h2>

                        <button className="w-fit rounded-md bg-[#F5F8FD] px-6 py-3 text-sm font-medium text-[#1D73E8] transition hover:bg-[#EAF2FF]">
                            Больше новостей
                        </button>

                    </div>


                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4">

                        {news.map((item) => (
                            <div
                                key={item.id}
                                className="group cursor-pointer"
                            >

                                <div className="overflow-hidden rounded-xl">

                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        width={400}
                                        height={220}
                                        className="h-55 w-full rounded-xl object-cover transition duration-500 group-hover:scale-105"
                                    />

                                </div>

                                <h3 className="mt-5 text-lg font-semibold leading-7 text-[#2F3640] transition group-hover:text-[#1D73E8] sm:text-[22px]">
                                    {item.title}
                                </h3>

                                <p className="mt-4 text-sm leading-7 text-[#7B8794] sm:text-[15px]">
                                    {item.text}
                                </p>

                                <p className="mt-4 text-sm text-[#9CA3AF]">
                                    {item.date}
                                </p>

                            </div>
                        ))}

                    </div>

                </section>

            </div>
        </main>
    );
}