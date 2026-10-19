import CatalogView from "@/components/catalog/CatalogView";

export default async function CatalogCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <CatalogView key={slug} slug={slug} />;
}
