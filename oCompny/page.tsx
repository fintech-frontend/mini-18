import Image from "next/image";
import OCompnyImg from "../assets/oCompnyImg.png";

export default function OCompny() {
  return (
    <section className="w-full bg-white py-10">
      <div className="mx-auto max-w-[1600px] px-[80px]">
        <div className="grid grid-cols-1 lg:grid-cols-[43%_57%] gap-8 items-center">

          {/* Left */}
          <div>
            <h1 className="text-[52px] font-bold text-[#2F3640] mb-6 leading-none">
              О компании
            </h1>

            <h3 className="text-[22px] font-semibold text-[#2F3640] leading-8 mb-6">
              «Стройоптторг» - крупнейшая оптово-розничная компания по продаже
              строительных и отделочных материалов.
            </h3>

            <div className="space-y-5 text-[15px] leading-8 text-[#2C333D]">
              <p>
                Уже второе десятилетие мы готовы воплотить в реальность Вашу
                мечту о красивом, комфортабельном доме, благоустроенном
                современном офисе, уютной теплой даче, помочь реализовать любые
                строительные и дизайнерские фантазии и с минимальными затратами
                времени и денежных средств.
              </p>

              <p>
                Вы всегда можете прийти к нам, пройтись по нашим складским и
                торговым площадям, оценить, как мы храним, принимаем и продаем
                товары. Пообщаться с продавцами-консультантами, получить
                консультацию по товарам у менеджеров.
              </p>

              <p>
                Вы также можете всегда пожаловаться нам, спросить совета или
                вернуть не понравившийся товар. Если Вам что-то не понравилось —
                сообщите нам об этом. Только так мы сможем стать лучше.
              </p>

              <p>
                Все товары, представленные на сайте, гарантированно есть в
                наличии.
              </p>

              <p>
                Помимо материалов мы предлагаем большой набор услуг, которые
                значительно упрощают процесс строительства и ремонта и делают
                его легким и комфортным.
              </p>
            </div>
          </div>

          {/* Right */}
          <div className="flex justify-end">
            <Image
              src={OCompnyImg}
              alt="О компании"
              priority
              className="w-full max-w-[980px] h-[620px] object-cover rounded-xl"
            />
          </div>
          <section className="py-16 bg-white">
  <!-- Asosiy konteyner -->
  <div className="max-w-[1620px] mx-auto px-6">
    <!-- Sarlavha -->
    <h2 className="text-3xl font-extrabold text-gray-900 mb-12">
      Почему именно мы
    </h2>

    <!-- Afzalliklar panjarasi (Grid) -->
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      <!-- 1-Afzallik -->
      <div className="flex items-start gap-4">
        <!-- Ikonka -->
        <div className="flex-shrink-0 size-12 flex items-center justify-center rounded-lg border border-gray-200 text-blue-600">
          <!-- Bu erga to'lov ikonkasi SVG kodini qo'ying -->
          <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
          </svg>
        </div>
        <!-- Matn -->
        <div className="space-y-1.5">
          <h3 className="text-base font-semibold text-gray-900 leading-tight">
            Оплата любым удобным способом
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Выбирайте любой способ оплаты для максимального комфорта при покупках у нас.
          </p>
        </div>
      </div>

    
      <div className="flex items-start gap-4">
        
        <div className="flex-shrink-0 size-12 flex items-center justify-center rounded-lg border border-gray-200 text-blue-600">
          
          <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 17.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
        </div>
       
        <div className="space-y-1.5">
<h3 className="text-base font-semibold text-gray-900 leading-tight">
            Большой выбор товаров в каталоге
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Наш каталог насыщен разнообразными товарами, чтобы удовлетворить ваши потребности.
          </p>
        </div>
      </div>

      
      <div className="flex items-start gap-4">
     
        <div className="flex-shrink-0 size-12 flex items-center justify-center rounded-lg border border-gray-200 text-blue-600">
       
        <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
          </svg>
        </div>
        
        <div className="space-y-1.5">
          <h3 className="text-base font-semibold text-gray-900 leading-tight">
            Осуществляем быструю доставку
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Мы оперативно доставим ваш заказ, чтобы вы могли насладиться покупкой как можно скорее.
          </p>
        </div>
      </div>

      
      <div className="flex items-start gap-4">
      
        <div className="flex-shrink-0 size-12 flex items-center justify-center rounded-lg border border-gray-200 text-blue-600">
        
          <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="m9 14.25 6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185ZM9.75 9h.008v.008H9.75V9Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm4.125 4.5h.008v.008h-.008V13.5Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
        </div>

        <div className="space-y-1.5">
          <h3 className="text-base font-semibold text-gray-900 leading-tight">
            Делаем скидки на крупные покупки
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Наша система скидок работает для вашей выгоды, чем больше купили - больше сэкономили.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

        </div>
      </div>
    </section>
    
  );
}