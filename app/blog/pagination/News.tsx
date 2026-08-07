import { newsData } from "@/data/news";
import { styles } from "@/styles/index.styles";

export default function NewsPage() {
  return (
    <section
      className={`${styles.container} px-4 md:px-6 py-6 md:py-8 mx-auto max-w-[1600px]`}
    >
      {/* Navigatsiya (Breadcrumb) */}
      <nav className="mb-3 md:mb-4 text-xs md:text-sm text-gray-400">
        <a href="/" className="hover:text-blue-600 transition-colors">
          Стройоптторг
        </a>{" "}
        / <span className="text-gray-800">Новости</span>
      </nav>

      {/* Sarlavha */}
      <h1 className="mb-5 md:mb-6 text-[32px] md:text-[40px] lg:text-[48px] font-bold text-[#2C333D] leading-tight">
        Новости
      </h1>

      {/* MOBIL VA PLANSHET UCHUN: Tepada chiqadigan Select Dropdown */}
      <div className="block lg:hidden mb-6">
        <select
          defaultValue=""
          className="w-full rounded-lg border border-gray-200 bg-white p-4 text-[15px] text-[#8C939B] outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm appearance-none cursor-pointer"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%238C939B' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: `right 1rem center`,
            backgroundRepeat: `no-repeat`,
            backgroundSize: `1.5em 1.5em`,
          }}
        >
          <option value="" disabled hidden>
            Выбрать рубрику
          </option>
          <option value="all" className="text-gray-900">
            Все публикации
          </option>
          <option value="news" className="text-gray-900">
            Новости
          </option>
          <option value="articles" className="text-gray-900">
            Статьи
          </option>
          <option value="tips" className="text-gray-900">
            Советы
          </option>
          <option value="reviews" className="text-gray-900">
            Обзоры
          </option>
        </select>
      </div>

      {/* Asosiy Layout: Yangiliklar + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_330px] gap-8 items-start">
        {/* Chap taraf: Yangiliklar Grid */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-[30px]">
          {newsData.map((item) => (
            <div
              key={item.id}
              className="flex flex-col w-full h-full gap-3 sm:gap-4 group cursor-pointer"
            >
              <div className="w-full overflow-hidden rounded-lg">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-[200px] md:h-[209px] object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-[#2C333D] font-semibold text-[18px] md:text-[20px] leading-snug group-hover:text-blue-600 transition-colors">
                {item.title}
              </h3>
              <p className="text-[13px] leading-relaxed text-[#393939] flex-grow">
                {item.description}
              </p>
              <time className="text-xs text-gray-500 mt-1">{item.date}</time>
            </div>
          ))}
        </div>

        {/* O'ng taraf: Sidebar */}
        <aside className="flex flex-col gap-6 w-full lg:sticky lg:top-6">
          {/* Rubrikalar - FAQAT DESKTOPDA (lg:block) KO'RINADI */}
          <div className="hidden lg:block rounded-lg border border-gray-100 p-5 md:p-[25px] bg-white">
            <h4 className="mb-4 text-base font-bold text-gray-900">Рубрики</h4>

            <ul className="w-full">
              <li className="flex justify-between items-center border-b border-gray-100 py-3 text-sm font-bold text-blue-600 cursor-pointer">
                Все публикации{" "}
                <span className="text-gray-400 font-normal">123</span>
              </li>
              <li className="flex justify-between items-center border-b border-gray-100 py-3 text-sm text-gray-600 hover:text-blue-600 cursor-pointer transition-colors">
                Новости <span className="text-gray-400">34</span>
              </li>
              <li className="flex justify-between items-center border-b border-gray-100 py-3 text-sm text-gray-600 hover:text-blue-600 cursor-pointer transition-colors">
                Статьи <span className="text-gray-400">99</span>
              </li>
              <li className="flex justify-between items-center border-b border-gray-100 py-3 text-sm text-gray-600 hover:text-blue-600 cursor-pointer transition-colors">
                Советы <span className="text-gray-400">14</span>
              </li>
              <li className="flex justify-between items-center py-3 text-sm text-gray-600 hover:text-blue-600 cursor-pointer transition-colors">
                Обзоры <span className="text-gray-400">2</span>
              </li>
            </ul>
          </div>

          {/* Obuna bo'lish formasi */}
          <div className="rounded-lg bg-[#F9FAFB] p-5 md:p-[25px] border border-gray-100">
            <h4 className="mb-2 text-base font-bold text-[#1D1D27] text-center">
              Подпишитесь на рассылку
            </h4>
            <p className="mb-5 text-[13px] text-[#6A6F75] text-center leading-relaxed">
              Регулярные скидки и спецпредложения, а так же новости компании.
            </p>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col gap-3"
            >
              <input
                type="email"
                placeholder="Email"
                required
                className="w-full rounded-md border border-gray-200 bg-white px-3.5 py-2.5 text-[13px] text-gray-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
              />
              <button
                type="submit"
                className="w-full rounded-md bg-[#186FD4] py-3 text-[13px] font-bold text-white hover:bg-blue-800 transition-colors"
              >
                ПОДПИСАТЬСЯ
              </button>

              <label className="mt-3 flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="mt-1 min-w-[14px] min-h-[14px] cursor-pointer"
                />
                <span className="text-[#696D70] text-[11px] md:text-[12px] leading-snug">
                  Согласен с обработкой персональных данных в соответствии с{" "}
                  <a href="#" className="underline hover:text-blue-600">
                    политикой конфиденциальности
                  </a>
                </span>
              </label>
            </form>
          </div>
        </aside>
      </div>
    </section>
  );
}
