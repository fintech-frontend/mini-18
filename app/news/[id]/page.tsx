import NewsArticle from "@/components/news/NewsArticle";

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <NewsArticle id={Number(id)} />;
}
