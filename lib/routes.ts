/** Sahifa manzillari bitta joyda — yo'l o'zgarsa faqat shu fayl tuzatiladi */
export const routes = {
  catalog: "/catalog",
  category: (slug: string) => `/catalog/${slug}`,
  /** Mahsulot sahifasi — app/products/[slug] */
  product: (slug: string) => `/products/${slug}`,
};
