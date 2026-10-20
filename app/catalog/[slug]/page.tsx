import CatalogListing from "@/components/catalog/CatalogListing";

export default async function CatalogCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <CatalogListing key={slug} slug={slug} />;
}
