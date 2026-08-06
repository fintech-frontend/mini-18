import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Container from "@/components/ui/Container";

const categories = [
  { name: "Сантехника", image: "/assets/icons/santexnika.svg", href: "/catalog/santehnika" },
  { name: "Отделочные материалы", image: "/assets/icons/otdelka.svg", href: "/catalog/otdelka" },
  { name: "Электротовары", image: "/assets/icons/electro.svg", href: "/catalog/electro" },
  { name: "Инструменты", image: "/assets/icons/instrumenty.svg", href: "/catalog/instrumenty" },
  { name: "Столярные изделия", image: "/assets/icons/stolyarnye.svg", href: "/catalog/stolyarnye" },
  { name: "Общестроительные материалы", image: "/assets/icons/obshestroy.svg", href: "/catalog/obshestroy" },
  { name: "Все для сауны и бани", image: "/assets/icons/sauna.svg", href: "/catalog/sauna" },
];

export const CategoryGrid = () => {
  return (
    <section className="py-6 sm:py-8">
      <Container>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="flex flex-col items-center gap-2 rounded-xl border border-gray-100 bg-white p-4 text-center transition hover:border-blue-200 hover:shadow-sm"
            >
              <div className="flex h-14 w-14 items-center justify-center">
                <img src={cat.image} alt={cat.name} className="h-full w-full object-contain" />
              </div>
              <span className="text-xs text-gray-600 sm:text-sm">{cat.name}</span>
            </Link>
          ))}

          {/* "Перейти в каталог" tugmasi */}
          <Link
            href="/catalog"
            className="flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-100 bg-white p-4 text-center transition hover:border-blue-200 hover:shadow-sm"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-gray-200 text-gray-500">
              <ChevronRight size={20} />
            </div>
            <span className="text-xs text-gray-600 sm:text-sm">Перейти в каталог</span>
          </Link>
        </div>
      </Container>
    </section>
  );
};