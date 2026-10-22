import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import CatalogView from "@/components/catalog/CatalogView";
import { getCategoryBySlug } from "@/data/catalogData";
import { fetchCategories } from "@/lib/api/catalog";
import type { CatalogCategory } from "@/types/productsTypes";

type Props = {
  params: Promise<{ slug: string }>;
};

/**
 * Kategoriya nomi API'dan olinadi. API'da hali yo'q, lekin navbar menyusida bor
 * kategoriyalar (CATEGORIES) bo'sh sahifa sifatida ochiladi, 404 emas.
 */
async function resolveCategory(slug: string): Promise<CatalogCategory | null> {
  const local = getCategoryBySlug(slug);

  try {
    const remote = (await fetchCategories()).find((c) => c.slug === slug);
    if (remote) return { slug: remote.slug, title: remote.name, seo: local?.seo };
  } catch {
    // API ishlamasa — lokal ro'yxat bilan davom etamiz
  }

  return local ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await resolveCategory((await params).slug);
  if (!category) return {};

  return {
    title: `${category.title} — купить в Стройоптторг`,
    description: category.seo?.paragraphs[0],
  };
}

export default async function CategoryPage({ params }: Props) {
  const category = await resolveCategory((await params).slug);
  if (!category) notFound();

  return (
    <Suspense>
      <CatalogView category={category} />
    </Suspense>
  );
}
