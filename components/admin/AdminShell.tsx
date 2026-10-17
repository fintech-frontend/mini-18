"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Toaster } from "react-hot-toast";
import {
  BarChart3,
  Bell,
  Building2,
  Calendar,
  ChevronDown,
  Home,
  Archive,
  Megaphone,
  Menu,
  Plus,
  Search,
  ShoppingCart,
  Truck,
  UserCog,
  Wallet,
  Warehouse,
  X,
  LogOut,
  AlertTriangle,
} from "lucide-react";
import { useAdminSession, adminLogout } from "@/lib/admin/auth";
import { useDB, DAY, useNow } from "@/lib/admin/db";
import { fmtDay } from "@/lib/admin/format";

const NAV = [
  { href: "/admin", label: "Boshqaruv paneli", icon: Home, exact: true },
  {
    href: "/admin/products",
    label: "Mahsulotlar",
    icon: Archive,
    children: [
      { href: "/admin/products", label: "Katalog" },
      { href: "/admin/products?filter=low", label: "Kam qolganlar" },
    ],
  },
  { href: "/admin/orders", label: "Buyurtmalar", icon: ShoppingCart, badge: true },
  { href: "/admin/finance", label: "To'lovlar va Moliya", icon: Wallet },
  { href: "/admin/warehouse", label: "Xaridlar va Ombor", icon: Warehouse },
  { href: "/admin/customers", label: "Mijozlar", icon: Building2 },
  { href: "/admin/marketing", label: "Marketing & Kontent", icon: Megaphone },
  { href: "/admin/delivery", label: "Yetkazib berish", icon: Truck },
  { href: "/admin/reports", label: "Hisobotlar", icon: BarChart3 },
  { href: "/admin/settings", label: "Sozlamalar va Xodimlar", icon: UserCog },
];

function useOutside(ref: React.RefObject<HTMLElement | null>, cb: () => void) {
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) cb();
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [ref, cb]);
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const session = useAdminSession();
  const db = useDB();
  const [open, setOpen] = useState(false);
  const [sub, setSub] = useState(true);

  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (session === undefined) return;
    if (!session && !isLogin) router.replace("/admin/login");
    if (session && isLogin) router.replace("/admin");
  }, [session, isLogin, router]);


  const newOrders = db.orders.filter((o) => o.status === "new").length;

  if (isLogin) {
    return (
      <>
        <Toaster position="top-right" />
        {children}
      </>
    );
  }
  if (!session) {
    return <div className="flex min-h-screen items-center justify-center bg-[#f4f6fb] text-[13px] text-[#6b7a90]">Yuklanmoqda…</div>;
  }

  const sidebar = (
    <aside className="flex h-full w-[260px] shrink-0 flex-col bg-[#186FD4] text-white">
      <Link href="/admin" className="m-4 mb-3 flex items-center justify-center rounded-xl bg-white px-3 py-3">
        <Image src="/logo.png" alt="Стройоптторг" width={215} height={54} priority className="h-auto w-full max-w-[200px]" />
      </Link>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
        {NAV.map((n) => {
          const active = n.exact ? pathname === n.href : pathname.startsWith(n.href);
          const Icon = n.icon;
          return (
            <div key={n.href}>
              <Link
                href={n.href}
                onClick={(e) => {
                  if (n.children && active) {
                    e.preventDefault();
                    setSub((v) => !v);
                  }
                }}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] font-medium transition ${
                  active ? "bg-white text-[#186FD4]" : "text-white/85 hover:bg-white/10"
                }`}
              >
                <Icon size={19} />
                <span className="flex-1">{n.label}</span>
                {n.badge && newOrders > 0 && (
                  <span className="rounded-full bg-[#0f5bb8] px-2 py-0.5 text-[11px] font-bold text-white">{newOrders}</span>
                )}
                {n.children && <ChevronDown size={16} className={`transition ${active && sub ? "rotate-180" : ""}`} />}
              </Link>
              {n.children && active && sub && (
                <div className="ml-9 mt-1 space-y-0.5 border-l border-white/15 pl-3">
                  {n.children.map((c) => (
                    <Link key={c.label} href={c.href} className="block rounded-md px-2 py-1.5 text-[13px] text-white/75 hover:bg-white/10 hover:text-white">
                      {c.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="flex items-center justify-between border-t border-white/10 px-5 py-3 text-[11px] text-white/60">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#9cc6ff]" /> Server: Cloud Tashkent
        </span>
        <span>v2.4.1</span>
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-screen bg-[#f4f6fb] text-[#0f1d3a]">
      <Toaster position="top-right" />
      <div className="sticky top-0 hidden h-screen lg:block">{sidebar}</div>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={(e) => (e.target as HTMLElement).closest("a") && setOpen(false)}>
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative h-full w-[260px]">
            {sidebar}
            <button onClick={() => setOpen(false)} className="absolute right-[-44px] top-3 rounded-lg bg-white p-2 text-[#186FD4]" aria-label="Yopish">
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar onMenu={() => setOpen(true)} />
        <main className="min-w-0 flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}

function TopBar({ onMenu }: { onMenu: () => void }) {
  const router = useRouter();
  const db = useDB();
  const session = useAdminSession();
  const [q, setQ] = useState("");
  const [sr, setSr] = useState(false);
  const [plus, setPlus] = useState(false);
  const [bell, setBell] = useState(false);
  const [prof, setProf] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const srRef = useRef<HTMLDivElement>(null);
  const plusRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLDivElement>(null);
  const profRef = useRef<HTMLDivElement>(null);
  useOutside(srRef, () => setSr(false));
  useOutside(plusRef, () => setPlus(false));
  useOutside(bellRef, () => setBell(false));
  useOutside(profRef, () => setProf(false));

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, []);

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (s.length < 2) return [];
    const out: { label: string; sub: string; href: string }[] = [];
    db.products
      .filter((p) => (p.name + p.sku).toLowerCase().includes(s))
      .slice(0, 4)
      .forEach((p) => out.push({ label: p.name, sub: `Mahsulot • ${p.sku}`, href: `/admin/products?q=${encodeURIComponent(p.sku)}` }));
    db.orders
      .filter((o) => (o.number + o.customerName).toLowerCase().includes(s))
      .slice(0, 4)
      .forEach((o) => out.push({ label: `#${o.number}`, sub: `Buyurtma • ${o.customerName}`, href: `/admin/orders?q=${encodeURIComponent(o.number)}` }));
    db.customers
      .filter((c) => (c.company + c.inn + c.phone).toLowerCase().includes(s))
      .slice(0, 4)
      .forEach((c) => out.push({ label: c.company, sub: `Mijoz • ${c.phone}`, href: `/admin/customers?q=${encodeURIComponent(c.company.replace(/"/g, ""))}` }));
    return out;
  }, [q, db]);

  const low = db.products.filter((p) => p.stock <= p.minStock);
  const fresh = db.orders.filter((o) => o.status === "new");
  const now = useNow();
  const alerts = low.length + fresh.length;

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 bg-white/95 px-4 py-3 shadow-[0_1px_0_#e8edf5] backdrop-blur sm:px-6">
      <button onClick={onMenu} className="rounded-lg p-2 text-[#16335f] hover:bg-[#eef2fb] lg:hidden" aria-label="Menyu">
        <Menu size={20} />
      </button>

      <div ref={srRef} className="relative min-w-0 flex-1 sm:max-w-[480px]">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8794aa]" />
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setSr(true);
          }}
          onFocus={() => setSr(true)}
          placeholder="Mahsulot, buyurtma #, mijoz yoki SKU qidirish..."
          className="w-full rounded-lg border border-transparent bg-[#f4f6fb] py-2.5 pl-9 pr-14 text-[13px] outline-none focus:border-[#186FD4] focus:bg-white"
        />
        <kbd className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded bg-[#e6ebf4] px-1.5 py-0.5 text-[10px] text-[#6b7a90] sm:block">⌘K</kbd>
        {sr && q.trim().length >= 2 && (
          <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-80 overflow-y-auto rounded-xl bg-white p-2 shadow-2xl ring-1 ring-black/5">
            {results.length === 0 ? (
              <div className="p-4 text-center text-[13px] text-[#8794aa]">Hech narsa topilmadi</div>
            ) : (
              results.map((r, i) => (
                <button
                  key={i}
                  onClick={() => {
                    router.push(r.href);
                    setSr(false);
                    setQ("");
                  }}
                  className="block w-full rounded-lg px-3 py-2 text-left hover:bg-[#f1f4fa]"
                >
                  <div className="truncate text-[13px] font-medium">{r.label}</div>
                  <div className="text-[11px] text-[#8794aa]">{r.sub}</div>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      <div className="hidden items-center gap-2 rounded-lg bg-[#f4f6fb] px-3 py-2 text-[13px] text-[#16335f] xl:flex">
        <Calendar size={16} className="text-[#186FD4]" />
        Oxirgi 30 kun: {fmtDay(now - 30 * DAY)} - {fmtDay(now)} {new Date(now).getFullYear()}
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <div ref={plusRef} className="relative">
          <button
            onClick={() => setPlus((v) => !v)}
            className="flex items-center gap-2 rounded-lg bg-[#186FD4] px-3 py-2.5 text-[13px] font-semibold text-white hover:bg-[#135bb0] sm:px-4"
          >
            <Plus size={16} /> <span className="hidden sm:inline">Yangi qo&apos;shish</span>
          </button>
          {plus && (
            <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl bg-white p-2 shadow-2xl ring-1 ring-black/5">
              {[
                ["Yangi mahsulot", "/admin/products?new=1"],
                ["Yangi buyurtma", "/admin/orders?new=1"],
                ["Yangi mijoz", "/admin/customers?new=1"],
                ["Xarid buyurtmasi", "/admin/warehouse?new=1"],
              ].map(([l, h]) => (
                <button
                  key={l}
                  onClick={() => {
                    router.push(h);
                    setPlus(false);
                  }}
                  className="block w-full rounded-lg px-3 py-2 text-left text-[13px] hover:bg-[#f1f4fa]"
                >
                  {l}
                </button>
              ))}
            </div>
          )}
        </div>

        <div ref={bellRef} className="relative">
          <button onClick={() => setBell((v) => !v)} className="relative rounded-lg p-2 text-[#16335f] hover:bg-[#eef2fb]" aria-label="Bildirishnomalar">
            <Bell size={20} />
            {alerts > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#d32027] px-1 text-[10px] font-bold text-white">
                {alerts > 99 ? "99+" : alerts}
              </span>
            )}
          </button>
          {bell && (
            <div className="absolute right-0 top-full z-50 mt-2 w-80 max-w-[88vw] rounded-xl bg-white p-2 shadow-2xl ring-1 ring-black/5">
              <div className="px-3 py-2 text-[12px] font-semibold uppercase tracking-wide text-[#6b7a90]">Bildirishnomalar</div>
              {alerts === 0 && <div className="p-4 text-center text-[13px] text-[#8794aa]">Yangi bildirishnoma yo&apos;q</div>}
              {fresh.slice(0, 4).map((o) => (
                <Link key={o.id} href={`/admin/orders?q=${o.number}`} onClick={() => setBell(false)} className="flex gap-3 rounded-lg px-3 py-2 hover:bg-[#f1f4fa]">
                  <ShoppingCart size={16} className="mt-0.5 text-[#186FD4]" />
                  <div>
                    <div className="text-[13px] font-medium">Yangi buyurtma #{o.number}</div>
                    <div className="text-[11px] text-[#8794aa]">{o.customerName}</div>
                  </div>
                </Link>
              ))}
              {low.slice(0, 5).map((p) => (
                <Link key={p.id} href={`/admin/products?q=${p.sku}`} onClick={() => setBell(false)} className="flex gap-3 rounded-lg px-3 py-2 hover:bg-[#f1f4fa]">
                  <AlertTriangle size={16} className="mt-0.5 text-[#c0262d]" />
                  <div>
                    <div className="text-[13px] font-medium">Zaxira kam: {p.name}</div>
                    <div className="text-[11px] text-[#8794aa]">
                      Qoldiq: {p.stock} {p.unit} • Min: {p.minStock}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div ref={profRef} className="relative">
          <button onClick={() => setProf((v) => !v)} className="flex items-center gap-2.5 rounded-lg p-1 hover:bg-[#f4f6fb]">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#06214a] text-[13px] font-bold text-white">
              {session?.name.split(" ").map((w) => w[0]).join("")}
            </span>
            <span className="hidden text-left leading-tight md:block">
              <span className="block text-[13px] font-semibold">{session?.name}</span>
              <span className="block text-[11px] text-[#186FD4]">{session?.role}</span>
            </span>
          </button>
          {prof && (
            <div className="absolute right-0 top-full z-50 mt-2 w-52 rounded-xl bg-white p-2 shadow-2xl ring-1 ring-black/5">
              <div className="px-3 py-2 text-[12px] text-[#6b7a90]">{session?.email}</div>
              <Link href="/admin/settings" onClick={() => setProf(false)} className="block rounded-lg px-3 py-2 text-[13px] hover:bg-[#f1f4fa]">
                Sozlamalar
              </Link>
              <Link href="/" className="block rounded-lg px-3 py-2 text-[13px] hover:bg-[#f1f4fa]">
                Saytga o&apos;tish
              </Link>
              <button
                onClick={() => {
                  adminLogout();
                  router.replace("/admin/login");
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[13px] text-[#c0262d] hover:bg-[#fdecec]"
              >
                <LogOut size={15} /> Chiqish
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
