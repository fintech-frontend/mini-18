import Image from "next/image";
import OCompnyImg from "../assets/oComp.png";
import iconOplata from "../assets/iconOplata.png";
import iconTovar from "../assets/iconTovar.png";
import iconBox from "../assets/iconBox.png";
import iconDelaem from "../assets/iconDelaem.png";
import { news } from "@/components/news";
export default function OCompny() {
    return (
        <div className="mx-auto max-w-[1600px] px-20">
            <div className="grid lg:grid-cols-[43%_57%] gap-10 items-center">
                <div>
                    <h1 className="text-[52px] font-bold text-[#2F3640] mb-6 leading-none"> О компании </h1>
                    <h3 className="text-[22px] font-semibold text-[#2F3640] leading-8 mb-6"> «Стройоптторг» - крупнейшая оптово-розничная компания по продаже строительных и отделочных материалов. </h3>
                    <div className="space-y-5 text-[15px] leading-8 text-[#2C333D]">
                        <p> Уже второе десятилетие мы готовы воплотить в реальность Вашу мечту о красивом, комфортабельном доме, благоустроенном современном офисе, уютной теплой даче, помочь реализовать любые строительные и дизайнерские фантазии и с минимальными затратами времени и денежных средств. </p>
                        <p> Вы всегда можете прийти к нам, пройтись по нашим складским и торговым площадям, оценить, как мы храним, принимаем и продаем товары. Пообщаться с продавцами-консультантами, получить консультацию по товарам у менеджеров. </p>
                        <p> Вы также можете всегда пожаловаться нам, спросить совета или вернуть не понравившийся товар. Если Вам что-то не понравилось — сообщите нам об этом. Только так мы сможем стать лучше. </p>
                        <p> Все товары, представленные на сайте, гарантированно есть в наличии. </p>
                        <p> Помимо материалов мы предлагаем большой набор услуг, которые значительно упрощают процесс строительства и ремонта и делают его легким и комфортным. </p>
                    </div>
                </div>
                <div className="flex justify-end -mr-20">
                    <Image
                        src={OCompnyImg}
                        alt="О компании"
                        priority
                        className="w-full max-w-237.5 h-155 object-cover rounded-xl"
                    />
                </div>
            </div>
            <section className="mt-28">
                <h2 className="text-[42px] font-bold text-[#2F3640] mb-16">
                    Почему именно мы
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-12">
                    <div className="flex items-start gap-5">
                        <Image
                            src={iconOplata}
                            alt=""
                            className="w-10 h-10 mt-1"
                        />
                        <div>
                            <h3 className="text-[22px] font-semibold leading-7 text-[#2F3640]">
                                Оплата любым удобным способом
                            </h3>
                            <p className="mt-3 text-[15px] leading-7 text-[#6B7280]">
                                Выбирайте любой способ оплаты для максимального комфорта при покупках у нас.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-5">
                        <Image
                            src={iconTovar}
                            alt=""
                            className="w-10 h-10 mt-1"
                        />
                        <div>
                            <h3 className="text-[22px] font-semibold leading-7 text-[#2F3640]">
                                Большой выбор товаров в каталоге
                            </h3>
                            <p className="mt-3 text-[15px] leading-7 text-[#6B7280]">
                                Наш каталог насыщен разнообразными товарами, чтобы удовлетворить ваши потребности.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-5">
                        <Image
                            src={iconBox}
                            alt=""
                            className="w-10 h-10 mt-1"
                        />
                        <div>
                            <h3 className="text-[22px] font-semibold leading-7 text-[#2F3640]">
                                Осуществляем быструю доставку
                            </h3>
                            <p className="mt-3 text-[15px] leading-7 text-[#6B7280]">
                                Мы оперативно доставим ваш заказ, чтобы вы могли насладиться покупкой как можно скорее.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-5">
                        <Image
                            src={iconDelaem}
                            alt=""
                            className="w-10 h-10 mt-1"
                        />
                        <div>
                            <h3 className="text-[22px] font-semibold leading-7 text-[#2F3640]">
                                Делаем скидки на крупные покупки
                            </h3>

                            <p className="mt-3 text-[15px] leading-7 text-[#6B7280]">
                                Наша система скидок работает для вашей выгоды, чем больше купили — тем больше сэкономили.
                            </p>

                        </div>

                    </div>

                </div>

            </section>
            <section className="mt-24">
                <h2 className="text-[42px] font-bold text-[#2F3640] mb-10">
                    История ООО “Стройоптторг”
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="border border-[#D7E3F7] rounded-lg p-8">
                        <h3 className="text-[34px] font-bold text-[#1D73E8] mb-5">
                            2003
                        </h3>
                        <h4 className="text-[22px] font-semibold text-[#2F3640] leading-8 mb-6">
                            Компания ООО «Стройоптторг» была зарегистрирована в реестре и получила
                            свидетельство о регистрации 1 октября 2003 года.
                        </h4>
                        <ul className="space-y-4 text-[#4B5563] text-[15px]">
                            <li className="flex items-start gap-3">
                                <span className="text-red-500 mt-2">•</span>
                                <span>Общая площадь земельного участка составляла <b>10 000 м²</b>.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-red-500 mt-2">•</span>
                                <span>Площадь складских помещений <b>850 м²</b>.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-red-500 mt-2">•</span>
                                <span>Численность сотрудников <b>10 человек</b>.</span>
                            </li>
                        </ul>
                    </div>
                    <div className="border border-[#D7E3F7] rounded-lg p-8">
                        <h3 className="text-[34px] font-bold text-[#1D73E8] mb-5">
                            2008
                        </h3>
                        <h4 className="text-[22px] font-semibold text-[#2F3640] leading-8 mb-6">
                            С годами компания динамично росла и развивалась, и уже к 2008 г. мы
                            достигли более высоких результатов:
                        </h4>
                        <ul className="space-y-4 text-[#4B5563] text-[15px]">
                            <li className="flex items-start gap-3">
                                <span className="text-red-500 mt-2">•</span>
                                <span>Общая площадь базы составила <b>58 000 м²</b>.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-red-500 mt-2">•</span>
                                <span>Площадь складских помещений <b>5 200 м²</b>.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-red-500 mt-2">•</span>
                                <span>Численность коллектива возросла до <b>300 человек</b>.</span>
                            </li>
                        </ul>
                    </div>
                    <div className="border border-[#D7E3F7] rounded-lg p-8">
                        <h3 className="text-[34px] font-bold text-[#1D73E8] mb-5">
                            2018
                        </h3>
                        <h4 className="text-[22px] font-semibold text-[#2F3640] leading-8 mb-6">
                            К своему 15-летнему юбилею компания расширила торговые площади до
                            17 805,3 м²
                        </h4>
                        <ul className="space-y-4 text-[#4B5563] text-[15px]">
                            <li className="flex items-start gap-3">
                                <span className="text-red-500 mt-2">•</span>
                                <span>Торговый центр №1 — <b>5 545 м²</b></span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-red-500 mt-2">•</span>
                                <span>Торговый центр №2 — <b>3 951,2 м²</b></span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-red-500 mt-2">•</span>
                                <span>Складские помещения — <b>8 308,6 м²</b></span>
                            </li>
                        </ul>
                    </div>
                    <div className="border-2 border-[#1D73E8] rounded-lg p-8 bg-white relative overflow-hidden">
                        <div className="absolute right-0 bottom-0 w-44 h-44 rounded-full bg-[#F3F7FD] -mr-12 -mb-12"></div>
                        <h3 className="text-center text-[34px] font-bold text-[#1D73E8] mb-10">
                            Сегодня
                        </h3>
                        <div className="grid grid-cols-2 gap-y-10">
                            <div>
                                <h4 className="text-[32px] font-bold text-[#1D73E8]">
                                    17 805,3 м²
                                </h4>
                                <p className="text-[15px] text-[#6B7280] mt-2">
                                    торговых и складских помещений
                                </p>
                            </div>
                            <div>
                                <h4 className="text-[32px] font-bold text-[#1D73E8]">
                                    50 000+
                                </h4>
                                <p className="text-[15px] text-[#6B7280] mt-2">
                                    наименований товаров
                                </p>
                            </div>
                            <div>
                                <h4 className="text-[32px] font-bold text-[#1D73E8]">
                                    2 500+
                                </h4>
                                <p className="text-[15px] text-[#6B7280] mt-2">
                                    постоянных клиентов
                                </p>
                            </div>
                            <div>
                                <h4 className="text-[32px] font-bold text-[#1D73E8]">
                                    440
                                </h4>
                                <p className="text-[15px] text-[#6B7280] mt-2">
                                    опытных сотрудников
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="mt-24 mb-24">
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-[42px] font-bold text-[#2F3640]">
                        Последние новости
                    </h2>
                    <button className="px-6 py-3 bg-[#F5F8FD] text-[#1D73E8] rounded-md text-[14px] font-medium hover:bg-[#EAF2FF] transition">
                        Больше новостей
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
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
                                    className="w-full h-47.5 rounded-xl object-cover transition duration-500 group-hover:scale-105"
                                />
                            </div>
                            <h3 className="mt-5 text-[22px] font-semibold leading-7 text-[#2F3640] group-hover:text-[#1D73E8] transition">
                                {item.title}
                            </h3>
                            <p className="mt-4 text-[15px] leading-7 text-[#7B8794]">
                                {item.text}
                            </p>
                            <p className="mt-4 text-[14px] text-[#9CA3AF]">
                                {item.date}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
