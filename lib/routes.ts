/** Sahifa manzillari bitta joyda — yo'l o'zgarsa faqat shu fayl tuzatiladi */
export const routes = {
  catalog: "/catalog",
  category: (slug: string) => `/catalog/${slug}`,
  product: (id: number) => `/product/${id}`,
  search: (query: string) => `/catalog?search=${encodeURIComponent(query)}`,
  cart: "/cart",
  compare: "/compare",
  favorites: "/favorites",
};
