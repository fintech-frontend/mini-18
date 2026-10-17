import type { Metadata } from "next";

import CartView from "@/components/cart/CartView";
import PageHeader from "@/components/ui/PageHeader";
import { styles } from "@/styles/index.styles";

export const metadata: Metadata = {
  title: "Корзина — Стройоптторг",
};

export default function CartPage() {
  return (
    <div className={`${styles.container} pb-12 md:pb-16 lg:pb-20`}>
      <PageHeader title="Корзина" />

      <div className="mt-6 lg:mt-10">
        <CartView />
      </div>
    </div>
  );
}
