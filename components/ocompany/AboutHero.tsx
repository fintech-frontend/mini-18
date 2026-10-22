import Image from "next/image";
import Link from "next/link";

import OCompnyImg from "../../assets/oCompnyImg.png";
import { styles } from "@/styles/index.styles";

/* «О компании» — rasm va kompaniya haqida matn */
export default function AboutHero() {
  return (
        <section className="relative ml-[calc(50%-50vw)] w-screen overflow-hidden bg-[#F6F7F9]">
          {/* IMAGE (o'ng tomonga yopishgan) */}
          <div className="relative h-72 w-full sm:h-96 lg:absolute lg:inset-y-0 lg:right-0 lg:h-full lg:w-[55%]">
            <Image
              src={OCompnyImg}
              alt="О компании"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover object-left"
            />
          </div>

          {/* TEXT */}
          <div className={`${styles.container} relative py-3 lg:min-h-110 lg:py-4`}>
            <nav className="mb-6 text-[12px] text-[#555] lg:mb-8">
              <Link href="/" className="hover:text-[#1D73E8]">Стройоптторг</Link>
              <span className="mx-3 text-[#999]">/</span>
              <span className="text-[#777]">О компании</span>
            </nav>

            <div className="lg:max-w-[48%]">
              <h1 className="mb-4 text-[32px] font-bold leading-tight text-[#2F3640] lg:text-[38px]">
                О компании
              </h1>

              <h3 className="mb-4 text-[14px] font-semibold leading-6 text-[#2F3640] lg:max-w-[470px]">
                «Стройоптторг» - крупнейшая оптово-розничная компания по продаже
                строительных и отделочных материалов.
              </h3>

              <div className="space-y-4 text-[12.5px] leading-5 text-[#2C333D]">
                <p>
                  Уже второе десятилетие мы готовы воплотить в реальность Вашу мечту о красивом,
                  комфортабельном доме, благоустроенном современном офисе, уютной теплой даче,
                  помочь реализовать любые строительные и дизайнерские фантазии и с минимальными
                  затратами времени и денежных средств.
                </p>
                <p>
                  Вы всегда можете прийти к нам, пройтись по нашим складским и торговым площадям,
                  оценить, как мы храним, принимаем и продаем товары. Пообщаться с
                  продавцами-консультантами, получить консультацию по товарам у менеджеров.
                </p>
                <p>
                  Вы также можете всегда пожаловаться нам, спросить совета или вернуть не
                  понравившийся товар. Если же Вам что-то не понравилось, и Вы остались недовольны
                  нашим сервисом - не стесняйтесь сообщать нам об этом. Только так мы сможем понять,
                  что делаем что-то не так. И только так мы сможем стать еще лучше!
                </p>
                <p>Все товары, представленные на сайте, гарантированно есть в наличии.</p>
                <p>
                  Помимо материалов, мы предлагаем своим клиентам самый большой набор услуг,
                  которые позволяют значительно упростить процесс строительства и ремонта и
                  сделать его легким и комфортным.
                </p>
              </div>
            </div>
          </div>
        </section>
  );
}
