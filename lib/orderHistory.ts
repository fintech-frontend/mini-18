/* Buyurtma tarkibi (mahsulotlar, yetkazish, kontaktlar) backend'da saqlanmaydi:
   POST /api/orders/ faqat number, status, subtotal, total qabul qiladi.
   Shuning uchun tafsilotlar buyurtma raqami bo'yicha localStorage'da saqlanadi. */

const STORAGE_KEY = "orderDetails";

export interface OrderItem {
  id: string | number;
  slug?: string;
  title: string;
  article: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface OrderDetails {
  number: string;
  createdAt: string;
  items: OrderItem[];
  delivery: string;
  deliveryAddress?: string;
  payment: string;
  region: string;
  city: string;
  customer: {
    firstName: string;
    lastName: string;
    company: string;
    email: string;
    phone: string;
  };
  comment: string;
  promoCode?: string;
  subtotal: number;
  discount: number;
  total: number;
}

function readAll(): Record<string, OrderDetails> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveOrderDetails(details: OrderDetails) {
  try {
    const all = readAll();
    all[details.number] = details;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch (e) {
    console.error("Failed to save order details", e);
  }
}

export function getOrderDetails(number: string): OrderDetails | null {
  return readAll()[number] ?? null;
}
