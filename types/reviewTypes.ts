/** "Отзывы" sahifasidagi do'kon sharhi (UI uchun) */
export type StoreReview = {
  id: number;
  name: string;
  text: string;
  images: string[];
  /** ISO sana — <time dateTime> uchun */
  createdAt: string;
  /** Ko'rsatish uchun: "02.01.2022" */
  date: string;
};

/** "Сначала новые" / "Сначала старые" */
export type ReviewSortOrder = "new" | "old";

/** Forma maydonlari */
export type ReviewFormValues = {
  name: string;
  email: string;
  text: string;
};

export type ReviewFormField = keyof ReviewFormValues | "images";
