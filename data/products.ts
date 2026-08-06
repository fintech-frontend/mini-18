import { Product } from '@/types/product';

export const mockProducts: Product[] = [
  {
    id: 1,
    title: "Набор гравировальных насадок Nozzle-Tok",
    article: "XJ89YHGO",
    price: 12789,
    oldPrice: 15999,
    discountPercentage: 15,
    imageUrl: "/assets/images/makita.svg", // <-- Укажите путь от корня папки public
    isHit: false,
  },
  {
    id: 2,
    title: "Смеситель Faris G-120 для раковины",
    article: "XJ89YHGO",
    price: 12789,
    oldPrice: 15999,
     discountPercentage: 15,
    imageUrl: "/assets/images/drel.svg",
    isHit: true,
  }

];