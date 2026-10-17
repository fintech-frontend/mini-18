"use client";

import { useState, useSyncExternalStore } from "react";

/* =========================
   TYPES
========================= */

export type Product = {
  id: string;
  name: string;
  sku: string;
  brand: string;
  category: string;
  price: number; // chakana
  b2bPrice: number;
  cost: number; // tannarx
  stock: number;
  unit: string;
  minStock: number;
  warranty: string;
  power: string;
  status: "active" | "draft";
  images: string[];
  description: string;
};

export type OrderItem = {
  productId: string;
  name: string;
  qty: number;
  unit: string;
  price: number;
};

export type OrderStatus =
  | "new"
  | "processing"
  | "shipping"
  | "delivered"
  | "cancelled"
  | "returned";

export type PayMethod = "Bank o'tkazmasi" | "Payme" | "Click" | "Uzum" | "Naqd";
export type Channel = "B2B Ulgurji" | "Chakana savdo" | "Telegram Bot";

export type Order = {
  id: string;
  number: string;
  channel: Channel;
  customerId: string;
  customerName: string;
  inn: string;
  phone: string;
  address: string;
  createdAt: number;
  items: OrderItem[];
  delivery: number;
  discount: number;
  status: OrderStatus;
  paid: boolean;
  payMethod: PayMethod;
  notes: { who: string; at: number; text: string }[];
  timeline: { at: number; text: string }[];
};

export type Tier = "Platina" | "Oltin" | "Kumush" | "Standart";

export type Customer = {
  id: string;
  company: string;
  inn: string;
  region: string;
  contact: string;
  phone: string;
  tier: Tier;
  discount: number;
  type: "b2b" | "retail";
  creditLimit: number;
  verified: boolean;
  createdAt: number;
};

export type MovementType = "kirim" | "chiqim" | "transfer" | "hisobdan";

export type Movement = {
  id: string;
  number: string;
  at: number;
  type: MovementType;
  productId: string;
  productName: string;
  sku: string;
  qty: number; // belgili: kirim +, chiqim -
  unit: string;
  warehouse: string;
  to?: string;
  doc: string;
  party: string;
};

export type Warehouse = { id: string; name: string; capacity: number; used: number };

export type PurchaseStatus = "kutilmoqda" | "yolda" | "qabul qilindi" | "bekor";

export type Purchase = {
  id: string;
  number: string;
  supplier: string;
  createdAt: number;
  expected: number;
  status: PurchaseStatus;
  warehouse: string;
  items: { productId: string; name: string; qty: number; unit: string; cost: number }[];
};

export type Promo = {
  id: string;
  title: string;
  code: string;
  discount: number;
  endDate: string;
  active: boolean;
};

export type Staff = {
  id: string;
  name: string;
  email: string;
  role: "Bosh Admin" | "Menejer" | "Omborchi" | "Logist";
  active: boolean;
};

export type DB = {
  products: Product[];
  orders: Order[];
  customers: Customer[];
  movements: Movement[];
  warehouses: Warehouse[];
  purchases: Purchase[];
  promos: Promo[];
  staff: Staff[];
};

/* =========================
   HELPERS
========================= */

export const DAY = 86_400_000;
export const CATEGORIES = [
  "Quruq qorishmalar & Suvoq",
  "Metalloprokat & Armatura",
  "Elektr & Akkumulyator",
  "Santexnika & Quvurlar",
  "Bo'yoqlar & Izolyatsiya",
];

export const orderTotal = (o: Pick<Order, "items" | "delivery" | "discount">) =>
  o.items.reduce((s, i) => s + i.qty * i.price, 0) - o.discount + o.delivery;

export const orderSubtotal = (o: Pick<Order, "items">) =>
  o.items.reduce((s, i) => s + i.qty * i.price, 0);

export const uid = (p = "id") =>
  `${p}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* =========================
   SEED
========================= */

function makeSeed(): DB {
  const rand = rng(2025);
  const pick = <T,>(a: T[]) => a[Math.floor(rand() * a.length)];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const base = today.getTime() + 18 * 3_600_000; // bugun 18:00

  const P = (
    n: number,
    name: string,
    sku: string,
    brand: string,
    category: string,
    price: number,
    b2b: number,
    cost: number,
    stock: number,
    unit: string,
    min: number,
    warranty = "",
    power = ""
  ): Product => ({
    id: `p${n}`,
    name,
    sku,
    brand,
    category,
    price,
    b2bPrice: b2b,
    cost,
    stock,
    unit,
    minStock: min,
    warranty,
    power,
    status: "active",
    images: [],
    description: "",
  });

  const products: Product[] = [
    P(1, "Bekobod sement M500 (50 kg qop)", "CMT-BK-500", "Bekobodsement", CATEGORIES[0], 56000, 52000, 44000, 1850, "qop", 100),
    P(2, "Armatura 12mm A500C (11.7m)", "ARM-12-ST", "O'zmetkombinat", CATEGORIES[1], 10_400_000, 9_900_000, 8_600_000, 42.5, "tonna", 5),
    P(3, "Perforator Makita HR2470 780W SDS-Plus", "MKT-HR2470", "Makita (Yaponiya)", CATEGORIES[2], 1_850_000, 1_620_000, 1_410_000, 4, "dona", 10, "12 oy", "780 W"),
    P(4, "Perforator Bosch GBH 2-26 DRE", "BSH-GBH226", "Bosch (Germaniya)", CATEGORIES[2], 2_350_000, 2_100_000, 1_800_000, 3, "dona", 10, "12 oy", "800 W"),
    P(5, "Gipsokarton Knauf 9.5mm (1.2x2.5m)", "KNF-GP-09", "Knauf", CATEGORIES[0], 62000, 58000, 47000, 3200, "list", 500),
    P(6, "Knauf Rotband suvoq qorishmasi 30kg", "KNF-ROT-30", "Knauf", CATEGORIES[0], 78000, 72000, 60000, 940, "qop", 200),
    P(7, "Gisht pishgan M150", "GSH-M150", "Samarqand g'isht", CATEGORIES[0], 1200, 1100, 900, 48000, "dona", 5000),
    P(8, "Qum daryo yuvilgan (Kamaz)", "QUM-DRY", "Chirchiq karyeri", CATEGORIES[0], 1_300_000, 1_200_000, 950_000, 24, "mashina", 5),
    P(9, "Emulsiya Dufa Superweiss 10kg", "DUF-SW-10", "Dufa", CATEGORIES[4], 380_000, 350_000, 290_000, 310, "chelak", 60),
    P(10, "Profil CD-60 (3m)", "PRF-CD60", "Knauf", CATEGORIES[1], 28000, 25500, 20000, 5200, "dona", 800),
    P(11, "Polipropilen quvur PPR 25mm (4m)", "PPR-25-4", "Valtec", CATEGORIES[3], 18000, 16000, 12500, 6400, "dona", 1000),
    P(12, "Elektr kabel VVG 3x2.5 (100m)", "KBL-VVG-325", "Tashkent Kabel", CATEGORIES[2], 1_250_000, 1_150_000, 960_000, 120, "buxta", 25),
    P(13, "Akkumulyatorli drel Makita DF333", "MKT-DF333", "Makita (Yaponiya)", CATEGORIES[2], 1_450_000, 1_300_000, 1_100_000, 22, "dona", 8, "12 oy", "12 V"),
    P(14, "Penoplex izolyatsiya 50mm", "PNP-50", "Penoplex", CATEGORIES[4], 85000, 78000, 63000, 1500, "dona", 300),
    P(15, "Unitaz kompakt Cersanit", "CRS-UNT-01", "Cersanit", CATEGORIES[3], 1_250_000, 1_120_000, 930_000, 35, "dona", 10, "24 oy"),
    P(16, "Aralashtirgich Grohe Eurosmart", "GRH-EUS", "Grohe", CATEGORIES[3], 980_000, 890_000, 740_000, 6, "dona", 10, "36 oy"),
  ];

  const C = (
    n: number,
    company: string,
    inn: string,
    region: string,
    contact: string,
    phone: string,
    tier: Tier,
    discount: number,
    type: "b2b" | "retail",
    credit: number,
    verified = true
  ): Customer => ({
    id: `c${n}`,
    company,
    inn,
    region,
    contact,
    phone,
    tier,
    discount,
    type,
    creditLimit: credit,
    verified,
    createdAt: base - Math.floor(rand() * 150) * DAY,
  });

  const customers: Customer[] = [
    C(1, 'MCHJ "Toshkent City Qurilish"', "305891244", "Toshkent sh., Chilonzor 19", "Jasur Rahimov", "+998 90 123-45-67", "Platina", 12, "b2b", 50_000_000),
    C(2, '"Grand Modern Stroy" XK', "301294811", "Samarqand viloyati", "Alisher Zokirov", "+998 93 450-88-11", "Oltin", 8, "b2b", 30_000_000),
    C(3, '"Modern House Invest" MCHJ', "308441902", "Toshkent sh., Yunusobod", "Jamshid Ergashev", "+998 97 701-22-33", "Kumush", 5, "b2b", 15_000_000),
    C(4, '"Buxoro Sanoat Qurilish" AJ', "200492811", "Buxoro shahri", "Otabek Nazarov", "+998 91 300-44-55", "Platina", 15, "b2b", 80_000_000),
    C(5, '"Ideal Santex Montaj" MCHJ', "309118472", "Farg'ona shahri", "Farrux Saidov", "+998 90 999-12-34", "Standart", 3, "b2b", 8_000_000),
    C(6, "Sherzod Umarov", "—", "Toshkent sh.", "Sherzod Umarov", "+998 94 990-11-22", "Standart", 0, "retail", 0),
    C(7, "Dilshod Beknazarov", "—", "Toshkent sh.", "Dilshod Beknazarov", "+998 90 124-33-90", "Standart", 0, "retail", 0),
    C(8, "Anvar Karimov", "—", "Namangan", "Anvar Karimov", "+998 93 551-20-70", "Standart", 0, "retail", 0),
    C(9, "Bekzod Xalilov", "—", "Toshkent sh.", "Bekzod Xalilov", "+998 90 312-88-00", "Standart", 0, "retail", 0),
    C(10, "Rustam Norov", "—", "Andijon", "Rustam Norov", "+998 99 810-55-12", "Standart", 0, "retail", 0),
    C(11, '"Silk Road Builders" MCHJ', "307120955", "Toshkent viloyati", "Nodir Aliyev", "+998 71 200-11-45", "Oltin", 8, "b2b", 25_000_000, false),
    C(12, '"Fargona Beton Servis" XK', "304556781", "Farg'ona viloyati", "Sardor Yusupov", "+998 95 777-31-90", "Kumush", 5, "b2b", 12_000_000),
  ];

  const methods: PayMethod[] = ["Bank o'tkazmasi", "Payme", "Click", "Uzum", "Naqd"];
  const b2bMethods: PayMethod[] = ["Bank o'tkazmasi", "Bank o'tkazmasi", "Bank o'tkazmasi", "Click", "Uzum"];
  const retailMethods: PayMethod[] = ["Payme", "Click", "Naqd", "Uzum"];
  void methods;

  const qtyFor = (p: Product, b2b: boolean) => {
    if (p.unit === "tonna") return b2b ? 1 + Math.floor(rand() * 5) + (rand() > 0.5 ? 0.5 : 0) : 0.5;
    if (p.unit === "mashina") return 1 + Math.floor(rand() * 3);
    if (p.price < 3000) return (b2b ? 2000 : 200) + Math.floor(rand() * 4000);
    if (p.price < 100_000) return b2b ? 40 + Math.floor(rand() * 260) : 1 + Math.floor(rand() * 12);
    return b2b ? 2 + Math.floor(rand() * 10) : 1 + Math.floor(rand() * 2);
  };

  const raw: Order[] = [];
  const N = 520;
  for (let i = 0; i < N; i++) {
    const daysAgo = Math.floor(Math.pow(rand(), 1.35) * 360);
    const createdAt = base - daysAgo * DAY - Math.floor(rand() * 9) * 3_600_000 - Math.floor(rand() * 59) * 60_000;
    const c = rand() < 0.62 ? pick(customers.filter((x) => x.type === "b2b")) : pick(customers.filter((x) => x.type === "retail"));
    const b2b = c.type === "b2b";
    const channel: Channel = b2b ? "B2B Ulgurji" : rand() < 0.35 ? "Telegram Bot" : "Chakana savdo";
    const n = 1 + Math.floor(rand() * (b2b ? 3 : 2));
    const chosen = new Set<Product>();
    while (chosen.size < n) chosen.add(pick(products));
    const items: OrderItem[] = [...chosen].map((p) => ({
      productId: p.id,
      name: p.name,
      qty: qtyFor(p, b2b),
      unit: p.unit,
      price: b2b ? p.b2bPrice : p.price,
    }));
    const sub = items.reduce((s, x) => s + x.qty * x.price, 0);
    const discount = Math.round((sub * c.discount) / 100);
    const delivery = b2b ? pick([0, 0, 600_000, 1_400_000]) : pick([0, 50_000, 120_000]);

    let status: OrderStatus;
    const r = rand();
    if (daysAgo < 1) status = r < 0.4 ? "new" : r < 0.7 ? "processing" : "shipping";
    else if (daysAgo < 5) status = r < 0.15 ? "new" : r < 0.3 ? "processing" : r < 0.5 ? "shipping" : r < 0.92 ? "delivered" : "cancelled";
    else status = r < 0.86 ? "delivered" : r < 0.93 ? "cancelled" : r < 0.97 ? "returned" : "delivered";

    const paid =
      status === "delivered" ? (daysAgo > 45 ? true : rand() < 0.8) : status === "shipping" ? rand() < 0.6 : status === "processing" ? rand() < 0.4 : status === "returned" ? true : false;

    raw.push({
      id: `o${i}`,
      number: "",
      channel,
      customerId: c.id,
      customerName: c.company,
      inn: c.inn,
      phone: c.phone,
      address: c.region,
      createdAt,
      items,
      delivery,
      discount,
      status,
      paid,
      payMethod: b2b ? pick(b2bMethods) : pick(retailMethods),
      notes: [],
      timeline: [{ at: createdAt, text: "Buyurtma qabul qilindi" }],
    });
  }
  raw.sort((a, b) => a.createdAt - b.createdAt);
  raw.forEach((o, i) => {
    o.number = `ORD-${new Date(o.createdAt).getFullYear()}-${7000 + i}`;
    o.id = `o${7000 + i}`;
    if (o.status !== "new") o.timeline.push({ at: o.createdAt + 2_400_000, text: "Buyurtma tasdiqlandi, omborga uzatildi" });
    if (o.paid) o.timeline.push({ at: o.createdAt + 4_000_000, text: `To'lov tasdiqlandi (${o.payMethod})` });
    if (["shipping", "delivered", "returned"].includes(o.status)) o.timeline.push({ at: o.createdAt + 9_000_000, text: "Yuk mashinasiga yuklandi, yo'lga chiqdi" });
    if (o.status === "delivered") o.timeline.push({ at: o.createdAt + 20_000_000, text: "Mijozga yetkazib berildi" });
    if (o.status === "cancelled") o.timeline.push({ at: o.createdAt + 6_000_000, text: "Buyurtma bekor qilindi" });
    if (o.status === "returned") o.timeline.push({ at: o.createdAt + 90_000_000, text: "Mijoz tovarni qaytardi" });
  });
  const orders = raw.sort((a, b) => b.createdAt - a.createdAt);

  /* ---- ombor harakatlari ---- */
  const whs: Warehouse[] = [
    { id: "w1", name: "Toshkent Bosh Hub (Sergeli)", capacity: 3000, used: 2580 },
    { id: "w2", name: "Bekobod Markaziy Bazasi", capacity: 5000, used: 1900 },
    { id: "w3", name: "Samarqand Logistika Xabi", capacity: 2000, used: 1100 },
  ];
  const movements: Movement[] = [];
  let mv = 4800;
  orders
    .filter((o) => ["delivered", "shipping"].includes(o.status))
    .slice(0, 36)
    .forEach((o) => {
      const it = o.items[0];
      const p = products.find((x) => x.id === it.productId)!;
      movements.push({
        id: uid("m"),
        number: `MOV-2025-${mv++}`,
        at: o.createdAt + 5_000_000,
        type: "chiqim",
        productId: p.id,
        productName: p.name,
        sku: p.sku,
        qty: -it.qty,
        unit: it.unit,
        warehouse: whs[0].name,
        doc: `Buyurtma #${o.number}`,
        party: o.customerName,
      });
    });
  for (let i = 0; i < 14; i++) {
    const p = pick(products);
    movements.push({
      id: uid("m"),
      number: `MOV-2025-${mv++}`,
      at: base - Math.floor(rand() * 40) * DAY - Math.floor(rand() * 6) * 3_600_000,
      type: "kirim",
      productId: p.id,
      productName: p.name,
      sku: p.sku,
      qty: p.unit === "tonna" ? 10 : p.price < 100_000 ? 500 : 10,
      unit: p.unit,
      warehouse: pick(whs).name,
      doc: `TTN-${100 + i}`,
      party: pick(['MCHJ "Bekobodsement Zavodi"', 'IP OOO "Knauf Gips Buxoro"', "Makita Corp UZ", "Bosch Central Asia"]),
    });
  }
  movements.push(
    { id: uid("m"), number: `MOV-2025-${mv++}`, at: base - 2 * DAY, type: "transfer", productId: "p5", productName: products[4].name, sku: "KNF-GP-09", qty: 600, unit: "list", warehouse: whs[0].name, to: whs[2].name, doc: "TRN-104", party: "Ichki logistika filiali" },
    { id: uid("m"), number: `MOV-2025-${mv++}`, at: base - 3 * DAY, type: "hisobdan", productId: "p3", productName: products[2].name, sku: "MKT-HR2470", qty: -1, unit: "dona", warehouse: whs[0].name, doc: "Akt-Brak #89-BR", party: "Ekspertiza komissiyasi" }
  );
  movements.sort((a, b) => b.at - a.at);

  const purchases: Purchase[] = [
    {
      id: "x1", number: "XB-0024", supplier: "Makita Corp UZ", createdAt: base - 2 * DAY, expected: base + 3 * DAY, status: "yolda", warehouse: whs[0].name,
      items: [{ productId: "p3", name: products[2].name, qty: 20, unit: "dona", cost: 1_410_000 }],
    },
    {
      id: "x2", number: "XB-0023", supplier: 'MCHJ "Bekobodsement Zavodi"', createdAt: base - 4 * DAY, expected: base + 1 * DAY, status: "kutilmoqda", warehouse: whs[1].name,
      items: [{ productId: "p1", name: products[0].name, qty: 1000, unit: "qop", cost: 44000 }],
    },
    {
      id: "x3", number: "XB-0022", supplier: "Bosch Central Asia", createdAt: base - 9 * DAY, expected: base - 1 * DAY, status: "qabul qilindi", warehouse: whs[0].name,
      items: [{ productId: "p4", name: products[3].name, qty: 10, unit: "dona", cost: 1_800_000 }],
    },
  ];

  const promos: Promo[] = [
    { id: "pr1", title: "Bahorgi qurilish mavsumi", code: "BAHOR25", discount: 10, endDate: "2025-06-30", active: true },
    { id: "pr2", title: "Yirik buyurtmalarga chegirma", code: "OPTOM5", discount: 5, endDate: "2025-12-31", active: true },
    { id: "pr3", title: "Santexnika haftaligi", code: "SANTEX15", discount: 15, endDate: "2025-05-20", active: false },
  ];

  const staff: Staff[] = [
    { id: "s1", name: "Alisher Qodirov", email: "admin@stroyopttorg.uz", role: "Bosh Admin", active: true },
    { id: "s2", name: "Dilshod Ergashev", email: "dilshod@stroyopttorg.uz", role: "Logist", active: true },
    { id: "s3", name: "Nasiba Karimova", email: "nasiba@stroyopttorg.uz", role: "Menejer", active: true },
    { id: "s4", name: "Sergey Petrov", email: "sergey@stroyopttorg.uz", role: "Omborchi", active: false },
  ];

  return { products, orders, customers, movements, warehouses: whs, purchases, promos, staff };
}

/* =========================
   STORE (localStorage'da saqlanadi)
========================= */

const KEY = "admin-db-v1";
const SEED: DB = makeSeed();
let state: DB = SEED;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = { ...SEED, ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
}

function commit(next: DB) {
  state = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* quota */
  }
  listeners.forEach((l) => l());
}

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};
const getSnapshot = () => {
  load();
  return state;
};
const getServerSnapshot = () => SEED;

export function useDB(): DB {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/* =========================
   ACTIONS
========================= */

const upd = (fn: (s: DB) => DB) => commit(fn(getSnapshot()));

export const actions = {
  resetDemo() {
    commit(makeSeed());
  },

  /* ---- mahsulotlar ---- */
  saveProduct(p: Product) {
    upd((s) => ({
      ...s,
      products: s.products.some((x) => x.id === p.id)
        ? s.products.map((x) => (x.id === p.id ? p : x))
        : [p, ...s.products],
    }));
  },
  deleteProduct(id: string) {
    upd((s) => ({ ...s, products: s.products.filter((x) => x.id !== id) }));
  },

  /* ---- mijozlar ---- */
  saveCustomer(c: Customer) {
    upd((s) => ({
      ...s,
      customers: s.customers.some((x) => x.id === c.id)
        ? s.customers.map((x) => (x.id === c.id ? c : x))
        : [c, ...s.customers],
    }));
  },
  deleteCustomer(id: string) {
    upd((s) => ({ ...s, customers: s.customers.filter((x) => x.id !== id) }));
  },

  /* ---- buyurtmalar ---- */
  createOrder(input: {
    customerId: string;
    channel: Channel;
    items: OrderItem[];
    delivery: number;
    payMethod: PayMethod;
    paid: boolean;
  }): Order {
    const s = getSnapshot();
    const c = s.customers.find((x) => x.id === input.customerId)!;
    const now = Date.now();
    const sub = input.items.reduce((a, i) => a + i.qty * i.price, 0);
    const order: Order = {
      id: uid("o"),
      number: `ORD-${new Date(now).getFullYear()}-${7000 + s.orders.length}`,
      channel: input.channel,
      customerId: c.id,
      customerName: c.company,
      inn: c.inn,
      phone: c.phone,
      address: c.region,
      createdAt: now,
      items: input.items,
      delivery: input.delivery,
      discount: Math.round((sub * c.discount) / 100),
      status: "new",
      paid: input.paid,
      payMethod: input.payMethod,
      notes: [],
      timeline: [
        { at: now, text: "Buyurtma qabul qilindi" },
        ...(input.paid ? [{ at: now, text: `To'lov tasdiqlandi (${input.payMethod})` }] : []),
      ],
    };
    // omborni kamaytirish + harakat
    let n = s.movements.length;
    const moves: Movement[] = input.items.map((it) => {
      const p = s.products.find((x) => x.id === it.productId)!;
      return {
        id: uid("m"),
        number: `MOV-${new Date(now).getFullYear()}-${5000 + n++}`,
        at: now,
        type: "chiqim",
        productId: p.id,
        productName: p.name,
        sku: p.sku,
        qty: -it.qty,
        unit: it.unit,
        warehouse: s.warehouses[0]?.name ?? "",
        doc: `Buyurtma #${order.number}`,
        party: c.company,
      };
    });
    commit({
      ...s,
      orders: [order, ...s.orders],
      movements: [...moves, ...s.movements],
      products: s.products.map((p) => {
        const it = input.items.find((i) => i.productId === p.id);
        return it ? { ...p, stock: Math.max(0, +(p.stock - it.qty).toFixed(2)) } : p;
      }),
    });
    return order;
  },

  setOrderStatus(id: string, status: OrderStatus) {
    const labels: Record<OrderStatus, string> = {
      new: "Buyurtma yangi holatga qaytarildi",
      processing: "Buyurtma jarayonga olindi",
      shipping: "Yuk mashinasiga yuklandi, yo'lga chiqdi",
      delivered: "Mijozga yetkazib berildi",
      cancelled: "Buyurtma bekor qilindi",
      returned: "Mijoz tovarni qaytardi",
    };
    const s = getSnapshot();
    const o = s.orders.find((x) => x.id === id);
    if (!o || o.status === status) return;
    const now = Date.now();
    let products = s.products;
    let movements = s.movements;
    // bekor / qaytarilganda tovar omborga qaytadi
    if ((status === "cancelled" || status === "returned") && o.status !== "cancelled" && o.status !== "returned") {
      products = products.map((p) => {
        const it = o.items.find((i) => i.productId === p.id);
        return it ? { ...p, stock: +(p.stock + it.qty).toFixed(2) } : p;
      });
      let n = movements.length;
      movements = [
        ...o.items.map((it) => ({
          id: uid("m"),
          number: `MOV-${new Date(now).getFullYear()}-${5000 + n++}`,
          at: now,
          type: "kirim" as const,
          productId: it.productId,
          productName: it.name,
          sku: s.products.find((p) => p.id === it.productId)?.sku ?? "",
          qty: it.qty,
          unit: it.unit,
          warehouse: s.warehouses[0]?.name ?? "",
          doc: `Qaytarish #${o.number}`,
          party: o.customerName,
        })),
        ...movements,
      ];
    }
    commit({
      ...s,
      products,
      movements,
      orders: s.orders.map((x) =>
        x.id === id
          ? {
              ...x,
              status,
              paid: status === "cancelled" ? false : x.paid,
              timeline: [{ at: now, text: labels[status] }, ...x.timeline],
            }
          : x
      ),
    });
  },
  markOrderPaid(id: string) {
    upd((s) => ({
      ...s,
      orders: s.orders.map((o) =>
        o.id === id && !o.paid
          ? { ...o, paid: true, timeline: [{ at: Date.now(), text: `To'lov tasdiqlandi (${o.payMethod})` }, ...o.timeline] }
          : o
      ),
    }));
  },
  addOrderNote(id: string, text: string, who = "Alisher Qodirov") {
    upd((s) => ({
      ...s,
      orders: s.orders.map((o) => (o.id === id ? { ...o, notes: [...o.notes, { who, at: Date.now(), text }] } : o)),
    }));
  },

  /* ---- ombor ---- */
  addMovement(m: Omit<Movement, "id" | "number" | "at"> & { at?: number }) {
    const s = getSnapshot();
    const now = m.at ?? Date.now();
    const mov: Movement = {
      ...m,
      id: uid("m"),
      number: `MOV-${new Date(now).getFullYear()}-${5000 + s.movements.length}`,
      at: now,
    };
    commit({
      ...s,
      movements: [mov, ...s.movements],
      products: s.products.map((p) =>
        p.id === m.productId && m.type !== "transfer"
          ? { ...p, stock: Math.max(0, +(p.stock + m.qty).toFixed(2)) }
          : p
      ),
    });
  },
  savePurchase(p: Purchase) {
    upd((s) => ({
      ...s,
      purchases: s.purchases.some((x) => x.id === p.id)
        ? s.purchases.map((x) => (x.id === p.id ? p : x))
        : [p, ...s.purchases],
    }));
  },
  setPurchaseStatus(id: string, status: PurchaseStatus) {
    const s = getSnapshot();
    const p = s.purchases.find((x) => x.id === id);
    if (!p || p.status === status) return;
    let { products, movements } = s;
    if (status === "qabul qilindi") {
      const now = Date.now();
      let n = movements.length;
      products = products.map((pr) => {
        const it = p.items.find((i) => i.productId === pr.id);
        return it ? { ...pr, stock: +(pr.stock + it.qty).toFixed(2), cost: it.cost } : pr;
      });
      movements = [
        ...p.items.map((it) => ({
          id: uid("m"),
          number: `MOV-${new Date(now).getFullYear()}-${5000 + n++}`,
          at: now,
          type: "kirim" as const,
          productId: it.productId,
          productName: it.name,
          sku: s.products.find((x) => x.id === it.productId)?.sku ?? "",
          qty: it.qty,
          unit: it.unit,
          warehouse: p.warehouse,
          doc: `Xarid ${p.number}`,
          party: p.supplier,
        })),
        ...movements,
      ];
    }
    commit({ ...s, products, movements, purchases: s.purchases.map((x) => (x.id === id ? { ...x, status } : x)) });
  },

  /* ---- marketing / xodimlar ---- */
  savePromo(p: Promo) {
    upd((s) => ({
      ...s,
      promos: s.promos.some((x) => x.id === p.id) ? s.promos.map((x) => (x.id === p.id ? p : x)) : [p, ...s.promos],
    }));
  },
  deletePromo(id: string) {
    upd((s) => ({ ...s, promos: s.promos.filter((x) => x.id !== id) }));
  },
  saveStaff(p: Staff) {
    upd((s) => ({
      ...s,
      staff: s.staff.some((x) => x.id === p.id) ? s.staff.map((x) => (x.id === p.id ? p : x)) : [p, ...s.staff],
    }));
  },
  deleteStaff(id: string) {
    upd((s) => ({ ...s, staff: s.staff.filter((x) => x.id !== id) }));
  },
};

/* =========================
   DERIVED
========================= */

export const isSold = (o: Order) => o.status !== "cancelled" && o.status !== "returned";

export const orderProfit = (o: Order, products: Product[]) => {
  const cost = o.items.reduce((s, i) => s + i.qty * (products.find((p) => p.id === i.productId)?.cost ?? i.price * 0.8), 0);
  return orderSubtotal(o) - o.discount - cost;
};

export function customerStats(c: Customer, orders: Order[]) {
  const mine = orders.filter((o) => o.customerId === c.id);
  const sold = mine.filter(isSold);
  return {
    count: sold.length,
    turnover: sold.reduce((s, o) => s + orderTotal(o), 0),
    debt: sold.filter((o) => !o.paid && o.status === "delivered").reduce((s, o) => s + orderTotal(o), 0),
    lastAt: mine[0]?.createdAt,
  };
}

export type TxStatus = "Muvaffaqiyatli" | "Kutilmoqda" | "Qaytarilgan" | "Bekor qilingan";

export function txOf(o: Order) {
  const rate = ["Payme", "Click", "Uzum"].includes(o.payMethod) ? 0.01 : 0;
  const amount = orderTotal(o);
  const status: TxStatus =
    o.status === "cancelled" ? "Bekor qilingan" : o.status === "returned" ? "Qaytarilgan" : o.paid ? "Muvaffaqiyatli" : "Kutilmoqda";
  return {
    id: `TRX-${new Date(o.createdAt).getFullYear()}-${o.number.split("-")[2]}`,
    order: o,
    amount,
    fee: Math.round(amount * rate),
    status,
  };
}

/** Render davomida o'zgarmas "hozir" vaqti (sahifa ochilgan payt) */
export function useNow() {
  const [n] = useState(() => Date.now());
  return n;
}
