"use client";

import { notFound } from "next/navigation";
import { styles } from "@/styles/index.styles";
import ProductDetail from "@/components/ui/ProductDetail";
import ProductList from "@/components/ui/ProductList";
import { useGetProductBySlugQuery, useGetProductsQuery } from "@/lib/api/apiSlice";
import { mapApiProductToProduct } from "@/lib/adapters/products";
import { mockProducts } from "@/data/products";

export default function ProductPageClient({ slug }: { slug: string }) {
  const {
    data: apiProduct,
    isLoading: productLoading,
    isError: productError,
  } = useGetProductBySlugQuery(slug);

  const { data: relatedData } = useGetProductsQuery(
    apiProduct ? { category: apiProduct.category?.slug } : undefined,
    { skip: !apiProduct }
  );

  if (productLoading) {
    return (
      <div className={`${styles.container} py-16 text-center text-gray-400`}>
        Загрузка...
      </div>
    );
  }

  let product;
  let related = mockProducts.slice(0, 6);

  if (!productError && apiProduct) {
    product = mapApiProductToProduct(apiProduct);
    if (relatedData) {
      related = relatedData.results
        .filter((p) => p.slug !== slug)
        .map(mapApiProductToProduct);
    }
  } else {
    product = mockProducts.find((p) => String(p.id) === slug);
  }

  if (!product) return notFound();

  const half = Math.ceil(related.length / 2);
  const similarProducts = related.slice(0, half);
  const boughtWithProducts = related.slice(half);

  return (
    <div className="mt-10">
      <div className={styles.container}>
        <ProductDetail product={product} />
      </div>

      <ProductList products={similarProducts} title="Похожие товары" />
      <ProductList products={boughtWithProducts} title="С этим товаром покупают" />
    </div>
  );
}