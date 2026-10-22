import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const priceFormatter = new Intl.NumberFormat("ru-RU")

/** 12789 -> "12 789" */
export function formatPrice(price: number) {
  return priceFormatter.format(price)
}

/** 1 -> "товар", 3 -> "товара", 5 -> "товаров" */
export function pluralizeProducts(count: number) {
  const mod10 = count % 10
  const mod100 = count % 100
  if (mod10 === 1 && mod100 !== 11) return "товар"
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "товара"
  return "товаров"
}
