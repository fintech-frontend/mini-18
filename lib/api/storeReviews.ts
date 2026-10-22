import { mapApiStoreReview } from "@/lib/adapters/storeReview";
import { ApiError, apiGet, apiPostForm } from "@/lib/api/client";
import { REVIEWS_PER_PAGE } from "@/data/reviewsConfig";
import type { ApiPaginated, ApiStoreReview } from "@/types/apiTypes";
import type {
  ReviewFormField,
  ReviewFormValues,
  ReviewSortOrder,
  StoreReview,
} from "@/types/reviewTypes";

export type StoreReviewPage = {
  items: StoreReview[];
  count: number;
  pages: number;
};

export async function fetchStoreReviews(
  { page, sort }: { page: number; sort: ReviewSortOrder },
  init?: { signal?: AbortSignal },
): Promise<StoreReviewPage> {
  const data = await apiGet<ApiPaginated<ApiStoreReview>>(
    "store-reviews/",
    {
      page,
      page_size: REVIEWS_PER_PAGE,
      ordering: sort === "old" ? "created_at" : "-created_at",
    },
    { ...init, revalidate: 0 },
  );

  return {
    items: data.results.map(mapApiStoreReview),
    count: data.count,
    pages: data.pages,
  };
}

/** Yuborishdagi xato: maydon xatolari (400) yoki umumiy xabar */
export class ReviewSubmitError extends Error {
  constructor(
    message: string,
    public fieldErrors: Partial<Record<ReviewFormField, string>> = {},
  ) {
    super(message);
    this.name = "ReviewSubmitError";
  }
}

const FIELDS: ReviewFormField[] = ["name", "email", "text", "images"];

function firstMessage(value: unknown): string | undefined {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return firstMessage(value[0]);
  if (value && typeof value === "object") return firstMessage(Object.values(value)[0]);
  return undefined;
}

/**
 * Yangi sharh yuboradi (multipart/form-data). Sharh admin tasdiqlaguncha saytda ko'rinmaydi.
 * Xato bo'lsa ReviewSubmitError tashlaydi.
 */
export async function createStoreReview(values: ReviewFormValues, images: File[]) {
  const body = new FormData();
  body.append("name", values.name.trim());
  body.append("email", values.email.trim());
  body.append("text", values.text.trim());
  images.forEach((file) => body.append("images", file));

  try {
    return mapApiStoreReview(await apiPostForm<ApiStoreReview>("store-reviews/", body));
  } catch (error) {
    if (!(error instanceof ApiError)) {
      throw new ReviewSubmitError(
        "Не удалось отправить отзыв. Проверьте подключение к интернету и попробуйте ещё раз.",
      );
    }

    if (error.status === 429) {
      throw new ReviewSubmitError(
        "Вы отправили слишком много отзывов. Попробуйте позже.",
      );
    }

    if (error.status === 400 && error.data && typeof error.data === "object") {
      const data = error.data as Record<string, unknown>;
      const fieldErrors: Partial<Record<ReviewFormField, string>> = {};
      for (const field of FIELDS) {
        const message = firstMessage(data[field]);
        if (message) fieldErrors[field] = message;
      }
      throw new ReviewSubmitError("Проверьте правильность заполнения формы.", fieldErrors);
    }

    throw new ReviewSubmitError("Сервер временно недоступен. Попробуйте позже.");
  }
}
