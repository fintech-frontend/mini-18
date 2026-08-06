import { CreditCard, LayoutGrid, Package, Percent } from "lucide-react";
import Container from "@/components/ui/Container";

const features = [
  { icon: CreditCard, text: "Оплата любым удобным способом" },
  { icon: LayoutGrid, text: "Большой выбор товаров в каталоге" },
  { icon: Package, text: "Осуществляем быструю доставку" },
  { icon: Percent, text: "Делаем скидки на крупные покупки" },
];

export const FeaturesBar = () => {
  return (
    <section className="border-y border-gray-100 py-4">
      <Container>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {features.map(({ icon: Icon, text }, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Icon size={18} />
              </span>
              <span className="text-sm text-gray-600">{text}</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};