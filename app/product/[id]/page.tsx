import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProductDetail from "@/components/productDetail/page";
import { fetchProduct, fetchSimilarProducts } from "@/lib/api/catalog";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

/** id yoki slug: /product/12 yoki /product/perforator-makita */
async function loadProduct(params: Props["params"]) {
  const { id } = await params;
  return fetchProduct(decodeURIComponent(id), { revalidate: 60 });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await loadProduct(params).catch(() => null);
  if (!product) return {};

  return {
    title: `${product.title} — купить в Стройоптторг`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await loadProduct(params);

  if (!product) {
    notFound();
  }

  // O'xshash mahsulotlar yuklanmasa ham sahifa ochilaveradi
  const similarProducts = await fetchSimilarProducts(product).catch(() => []);

  // key: boshqa mahsulotga o'tilganda galereya holati yangidan boshlanadi
  return (
    <ProductDetail
      key={product.id}
      product={product}
      similarProducts={similarProducts}
    />
  );
}
