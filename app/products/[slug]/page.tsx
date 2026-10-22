import ProductPageClient from "@/components/ProductPageClient";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <ProductPageClient slug={slug} />;
}