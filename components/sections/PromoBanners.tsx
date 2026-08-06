import Link from "next/link";
import Container from "@/components/ui/Container";

const banners = [
  { title: "Метизные изделия", discount: "до -15%", image: "/assets/images/promo-metiz.svg", href: "/catalog/metiz" },
  { title: "Лакокрасочные материалы", discount: "до -30%", image: "/assets/images/promo-lak.svg", href: "/catalog/lak" },
  { title: "Напольные покрытия", discount: "до -25%", image: "/assets/images/promo-pol.svg", href: "/catalog/pol" },
  { title: "Все для отопления", discount: "до -30%", image: "/assets/images/promo-otoplenie.svg", href: "/catalog/otoplenie" },
];

export const PromoBanners = () => {
  return (
    <section className="pb-6 sm:pb-8">
      <Container>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {banners.map((b) => (
            <Link
              key={b.title}
              href={b.href}
              className="group relative flex h-32 items-end overflow-hidden rounded-xl p-4 sm:h-36"
            >
              <img
                src={b.image}
                alt={b.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/30" />
              <div className="relative">
                <p className="mb-2 text-sm font-semibold leading-tight text-white sm:text-base">
                  {b.title}
                </p>
                <span className="inline-block rounded-md bg-gray-900/80 px-2 py-1 text-[11px] font-medium text-white">
                  {b.discount}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
};