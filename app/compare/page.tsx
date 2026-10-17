import type { Metadata } from "next";

import CompareView from "@/components/compare/CompareView";
import PageHeader from "@/components/ui/PageHeader";
import { styles } from "@/styles/index.styles";

export const metadata: Metadata = {
  title: "Сравнение товаров — Стройоптторг",
};

export default function ComparePage() {
  return (
    <div className={`${styles.container} pb-12 md:pb-16 lg:pb-20`}>
      <PageHeader title="Сравнение товаров" />

      <div className="mt-6 lg:mt-10">
        <CompareView />
      </div>
    </div>
  );
}
