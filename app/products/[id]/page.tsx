import { notFound } from "next/navigation";
import { mockProducts } from "@/data/products";
import ProductDetail from "@/components/ui/ProductDetail";
import ProductList from "@/components/ui/ProductList";
import Container from "@/components/ui/Container";
import { styles } from "@/styles/index.styles";

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
      <div className={`${styles.container} mt-10`}>

        <ProductDetail product={product} />


        <ProductList products={related} title="Похожие товары" />
        <ProductList products={related} title="С этим товаром покупают" />
      </div>
    </>
  );
}