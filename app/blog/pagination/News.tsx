import { newsData } from "@/data/news";
import { styles } from "@/styles/index.styles";

export default function NewsPage() {
  return (
    <section className={styles.container + " px-6 py-8"}>
      <nav className="mb-2 text-sm text-gray-400">
        <a href="/" className="hover:text-blue-600">
          Стройопттторг
        </a>{" "}
        / <span className="text-gray-800">Новости</span>
      </nav>

      <h1 className="mb-6 text-[48px] font-bold text-[#2C333D]">Новости</h1>

      <div className=" grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">
        {/* News grid */}
        <div className="w-[1269px] grid grid-cols-1 gap-7.5 sm:grid-cols-2 xl:grid-cols-3">
          {newsData.map((item) => (
            <div key={item.id} className="flex flex-col w-[403px] h-[360px] gap-4 mb-5">
              <img
                src={item.image}
                alt={item.title}
                className="w-full rounded-lg object-cover h-[209px]"
              />
              <h3 className=" text-[#2C333D] font-[550] text-[20px]">
                {item.title}
              </h3>
              <p className=" text-[13px] leading-relaxed text-[#393939]">
                {item.description}
              </p>
              <time className="text-xs text-[#000000]">{item.date}</time>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-5 w-[331px] h-[745px]">
          <div className="rounded-lg border border-gray-100 p-6.25">
            <h4 className="mb-3.5 text-base font-bold text-gray-900">
              Рубрики
            </h4>

            <ul className="w-[281]px">
              <li className="flex justify-between border-b border-gray-100 py-2.5 text-sm font-bold text-blue-600">
                Все публикации <span className="text-gray-300">123</span>
              </li>
              <li className="flex justify-between border-b border-gray-100 py-2.5 text-sm text-gray-500">
                Новости <span className="text-gray-300">34</span>
              </li>
              <li className="flex justify-between border-b border-gray-100 py-2.5 text-sm text-gray-500">
                Статьи <span className="text-gray-300">99</span>
              </li>
              <li className="flex justify-between border-b border-gray-100 py-2.5 text-sm text-gray-500">
                Советы <span className="text-gray-300">14</span>
              </li>
              <li className="flex justify-between py-2.5 text-sm text-gray-500">
                Обзоры <span className="text-gray-300">2</span>
              </li>
            </ul>
          </div>

          <div className="rounded-lg bg-[#F9FAFB] p-6.25 text-white">
            <h4 className="mb-3.25 text-medium font-bold text-[#1D1D27] text-center">
              Подпишитесь на рассылку
            </h4>
            <p className="mb-3.25 text-[14px] text-[#6A6F75] text-center">
              Регулярные скидки и спецпредложения, а так же новости компании.
            </p>
            <input
              type="email"
              placeholder="Email"
              className="mb-3.25 w-full rounded-md px-3.5 py-2.5 text-[13px] text-gray-900 outline-none"
            />
            <button
              type="button"
              className="w-full rounded-md bg-[#186FD4] py-3 text-[13px] font-bold hover:bg-blue-900"
            >
              ПОДПИСАТЬСЯ
            </button>
            <label className="mt-7.5 flex items-start gap-2 text-[10px]">
              <input type="checkbox" defaultChecked className="mt-0.5" />
              <span className="text-[#696D70] text-[13px] font-[400]">

              Согласен с обработкой персональных данных в соответствии с
              политикой конфиденциальности
              </span>
            </label>
          </div>
        </aside>
      </div>
    </section>
  );
}