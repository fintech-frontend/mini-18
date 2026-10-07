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
