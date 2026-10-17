import { notFound } from "next/navigation";

import { PRODUCTS, getProductById } from "@/data/catalogData";
import ProductDetail from "@/components/productDetail/page";


type Props = {
  params: Promise<{
    id: string;
  }>;
};

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({
    id: String(product.id),
  }));
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;

  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} />;
}
