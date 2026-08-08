import Image from "next/image";

export default function DeliverySidebar() {
  return (
    <aside className="flex flex-col gap-5 md:gap-6 w-full lg:sticky lg:top-6">
      
      {/* BANNERLAR BLOKI */}
      {/* 
        - Mobilda: grid-cols-1 (ustma-ust)
        - Planshetda (768px): sm:grid-cols-2 (yonma-yon)
        - Desktopda (lg): lg:grid-cols-1 (yana ustma-ust sidebarda)
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 md:gap-5 w-full">
        
        {/* 1-Banner: Все для отопления */}
        <div className="relative w-full aspect-[331/273] overflow-hidden rounded-lg shadow-sm group cursor-pointer">
          <Image
            src="/images/delivery/banner-heating.png" // <-- O'zingizning rasmingiz URL/path'ini qo'yasiz
            alt="Все для отопления"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 331px"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* 2-Banner: Лакокрасочные материалы */}
        <div className="relative w-full aspect-[331/273] overflow-hidden rounded-lg shadow-sm group cursor-pointer">
          <Image
            src="/images/delivery/banner-paint.png" // <-- O'zingizning rasmingiz URL/path'ini qo'yasiz
            alt="Лакokрасочные материалы"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 331px"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

      </div>

      {/* OBUNA BO'LISH FORMASI */}
      <div className="rounded-lg bg-[#F9FAFB] p-5 md:p-[25px] border border-gray-100 shadow-sm w-full">
        <h4 className="mb-2 text-base font-bold text-[#1D1D27] text-center">
          Подпишитесь на рассылку
        </h4>
        <p className="mb-5 text-[13px] text-[#6A6F75] text-center leading-relaxed">
          Регулярные скидки и спецпредложения, а так же новости компании.
        </p>
        
        <form className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            required
            className="w-full rounded-md border border-gray-200 bg-white px-3.5 py-2.5 text-[13px] text-gray-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
          />
          <button
            type="button"
            className="w-full rounded-md bg-[#186FD4] py-3 text-[13px] font-bold text-white hover:bg-blue-800 transition-colors"
          >
            ПОДПИСАТЬСЯ
          </button>

          <label className="mt-3 flex items-start gap-2 cursor-pointer">
            <input type="checkbox" defaultChecked className="mt-1 min-w-[14px] min-h-[14px] cursor-pointer" />
            <span className="text-[#696D70] text-[11px] md:text-[12px] leading-snug">
              Согласен с обработкой персональных данных в соответствии с{" "}
              <a href="#" className="underline hover:text-blue-600">политикой конфиденциальности</a>
            </span>
          </label>
        </form>
      </div>

    </aside>
  );
}