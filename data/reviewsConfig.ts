/**
 * "Отзывы" sahifasi sozlamalari. Sharhlar — API'dan (/store-reviews/).
 * Cheklovlar backend bilan bir xil: apps/store_reviews/limits.py
 */

/** Bir sahifadagi sharhlar soni (maketda 8 ta) */
export const REVIEWS_PER_PAGE = 8;

/** Ism va matn uzunligi */
export const REVIEW_NAME_MAX_LENGTH = 100;
export const REVIEW_TEXT_MIN_LENGTH = 10;
export const REVIEW_TEXT_MAX_LENGTH = 3000;

/** "Прикрепить фото" cheklovlari */
export const REVIEW_PHOTO_LIMITS = {
  maxFiles: 5,
  maxSizeMb: 5,
  accept: ["image/jpeg", "image/png", "image/webp"],
} as const;
