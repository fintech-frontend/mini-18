import Link from "next/link";
import Container from "@/components/ui/Container";

const news = [
  { id: 1, title: "Масштабное обновление каталога инструментов", excerpt: "С радостью сообщаем вам о крупном пополнении нашего каталога инструментов.", date: "6 Августа 2025", image: "/assets/images/news-1.svg" },
  { id: 2, title: "Масштабное обновление каталога инструментов", excerpt: "С радостью сообщаем вам о крупном пополнении нашего каталога инструментов.", date: "6 Августа 2025", image: "/assets/images/news-2.svg" },
  { id: 3, title: "Масштабное обновление каталога инструментов", excerpt: "С радостью сообщаем вам о крупном пополнении нашего каталога инструментов.", date: "6 Августа 2025", image: "/assets/images/news-3.svg" },
  { id: 4, title: "Масштабное обновление каталога инструментов", excerpt: "С радостью сообщаем вам о крупном пополнении нашего каталога инструментов.", date: "3 Августа 2025", image: "/assets/images/news-4.svg" },
];

export const LatestNews = () => {
  return (
    <section className="py-6 sm:py-8">
      <Container>
        <div className="mb-4 flex items-center justify-between sm:mb-6">
          <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">Последние новости</h2>
          <Link href="/news" className="text-sm font-medium text-blue-600 hover:underline">
            Больше новостей
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {news.map((item) => (
            <Link key={item.id} href={`/news/${item.id}`} className="group flex flex-col overflow-hidden rounded-xl border border-gray-100">
              <div className="relative h-36 overflow-hidden bg-gray-100 sm:h-40">
                <img src={item.image} alt={item.title} className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105" />
              </div>
              <div className="flex flex-1 flex-col p-3">
                <h3 className="mb-2 line-clamp-2 text-sm font-medium text-gray-900">{item.title}</h3>
                <p className="mb-3 line-clamp-2 flex-1 text-xs text-gray-500">{item.excerpt}</p>
                <span className="text-xs text-gray-400">{item.date}</span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
};