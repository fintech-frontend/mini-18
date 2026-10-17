import type { Metadata } from "next";
import { Suspense } from "react";

import CatalogView from "@/components/catalog/CatalogView";

export const metadata: Metadata = {
  title: "Каталог товаров — Стройоптторг",
  description:
    "Строительные и отделочные материалы, инструмент и сантехника в интернет-магазине «Стройоптторг».",
};

export default function CatalogPage() {
  // useSearchParams (URL filtrlari) Suspense ichida bo'lishi shart
  return (
    <Suspense>
      <CatalogView />
    </Suspense>
  );
}
