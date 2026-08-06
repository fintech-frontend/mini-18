import { notFound } from "next/navigation";
import { mockProducts } from "@/data/products";
import ProductDetail from "@/components/ui/ProductDetail";
import ProductList from "@/components/ui/ProductList";
import Container from "@/components/ui/Container";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = mockProducts.find((p) => String(p.id) === id);

  if (!product) return notFound();

  const related = mockProducts.filter((p) => String(p.id) !== id);

  return (
    <>
      <Container className="py-4 sm:py-8">
        <ProductDetail product={product} />
      </Container>

      <ProductList products={related} title="Похожие товары" />
      <ProductList products={related} title="С этим товаром покупают" />
    </>
  );
}