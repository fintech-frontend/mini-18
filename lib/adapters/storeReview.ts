import type { ApiStoreReview } from "@/types/apiTypes";
import type { StoreReview } from "@/types/reviewTypes";

const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export function mapApiStoreReview(api: ApiStoreReview): StoreReview {
  const created = new Date(api.created_at);

  return {
    id: api.id,
    name: api.name,
    text: api.text,
    images: api.images ?? [],
    createdAt: api.created_at,
    date: Number.isNaN(created.getTime()) ? "" : dateFormatter.format(created),
  };
}
