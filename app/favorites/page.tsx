import type { Metadata } from "next";

import FavoritesView from "@/components/favorites/FavoritesView";
import PageHeader from "@/components/ui/PageHeader";
import { styles } from "@/styles/index.styles";

export const metadata: Metadata = {
  title: "Избранное — Стройоптторг",
};

export default function FavoritesPage() {
  return (
    <div className={`${styles.container} pb-12 md:pb-16 lg:pb-20`}>
      <PageHeader title="Избранное" />

      <div className="mt-6 lg:mt-10">
        <FavoritesView />
      </div>
    </div>
  );
}
