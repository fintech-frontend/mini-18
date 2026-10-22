"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AlertTriangle, Banknote, Boxes, Download, Layers, PackageX, Receipt, RefreshCw, ShoppingCart } from "lucide-react";
import { fmt, fmtShort, fmtDay, fmtDateTime, downloadCSV, monthName } from "@/lib/admin/format";
import { AreaChart, Donut, type Point } from "@/components/admin/charts";
import { Btn, Card, Delta, Empty, PageHeader, Progress, StatCard } from "@/components/admin/ui";
import { OrderStatusBadge } from "@/components/admin/shared";
import { useGetAdminCategoriesQuery, useGetAdminOrdersQuery, useGetAdminProductsQuery } from "@/lib/api/adminApi";
import { CURRENCY, DAY, isSold, money, orderTime, ORDER_STATUSES, STATUS_LABEL, statusOf } from "@/lib/admin/orders";
import { formatApiError } from "@/lib/apiError";

const PERIODS = [
  { d: 7, label: "Oxirgi 7 kun" },
  { d: 30, label: "Oxirgi 30 kun" },
  { d: 90, label: "Oxirgi 90 kun" },
  { d: 365, label: "Oxirgi yil" },
];

const STATUS_COLOR: Record<string, string> = {
  pending: "#d32027",
  processing: "#f0a500",
  shipping: "#186FD4",
  delivered: "#1bb55c",
  cancelled: "#aab3c2",
  returned: "#7a3cff",
};

const pct = (a: number, b: number) => (b ? ((a - b) / b) * 100 : 0);
const rub = (n: number) => `${fmt(n)} ${CURRENCY}`;

export default function Dashboard() {
  const [period, setPeriod] = useState(30);
  const [now, setNow] = useState(() => Date.now());

  const orders = useGetAdminOrdersQuery();
  const products = useGetAdminProductsQuery({ page_size: 1000 });
  const categories = useGetAdminCategoriesQuery();
  const fetching = orders.isFetching || products.isFetching || categories.isFetching;
  const error = orders.error ?? products.error ?? categories.error;

  const allOrders = useMemo(() => orders.data ?? [], [orders.data]);
  const allProducts = useMemo(() => products.data?.results ?? [], [products.data]);

  const m = useMemo(() => {
    const from = now - period * DAY;
    const cur = allOrders.filter((o) => orderTime(o) >= from);
    const prev = allOrders.filter((o) => orderTime(o) >= now - 2 * period * DAY && orderTime(o) < from);
    const sum = (list: typeof cur) => {
      const sold = list.filter(isSold);
      const revenue = sold.reduce((s, o) => s + money(o.total), 0);
      return { sold, revenue, count: sold.length, avg: sold.length ? revenue / sold.length : 0 };
    };
    const a = sum(cur);
    const b = sum(prev);

    // Grafik: 7/30 kun — kunlik, 90 — haftalik, 365 — oylik
    const points: Point[] = [];
    if (period === 365) {
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(1);
        d.setMonth(d.getMonth() - i);
        const start = new Date(d.getFullYear(), d.getMonth(), 1).getTime();
        const end = new Date(d.getFullYear(), d.getMonth() + 1, 1).getTime();
        const inRange = a.sold.filter((o) => orderTime(o) >= start && orderTime(o) < end);
        points.push({
          label: monthName(d.getMonth()),
          a: inRange.reduce((s, o) => s + money(o.total), 0),
          b: inRange.filter((o) => statusOf(o) === "delivered").reduce((s, o) => s + money(o.total), 0),
        });
      }
    } else {
      const step = period === 90 ? 7 * DAY : DAY;
      const n = Math.ceil((period * DAY) / step);
      const end0 = new Date(now);
      end0.setHours(23, 59, 59, 999);
      for (let i = n - 1; i >= 0; i--) {
        const end = end0.getTime() - i * step;
        const start = end - step;
        const inRange = a.sold.filter((o) => orderTime(o) > start && orderTime(o) <= end);
        points.push({
          label: fmtDay(end),
          hint: step === DAY ? fmtDay(end) : `${fmtDay(start + 1)} – ${fmtDay(end)}`,
          a: inRange.reduce((s, o) => s + money(o.total), 0),
          b: inRange.filter((o) => statusOf(o) === "delivered").reduce((s, o) => s + money(o.total), 0),
        });
      }
    }

    const byStatus = ORDER_STATUSES.map((st) => ({ st, n: cur.filter((o) => statusOf(o) === st).length }));
    return { cur, a, b, points, byStatus };
  }, [allOrders, period, now]);

  const outOfStock = allProducts.filter((p) => (p.stock_quantity ?? 0) <= 0);
  const pending = allOrders.filter((o) => statusOf(o) === "pending");

  const catCounts = useMemo(() => {
    const map = new Map<string, number>();
    allProducts.forEach((p) => {
      const k = p.category?.name ?? "Kategoriyasiz";
      map.set(k, (map.get(k) ?? 0) + 1);
    });
    const total = allProducts.length || 1;
    return [...map.entries()]
      .sort((x, y) => y[1] - x[1])
      .slice(0, 6)
      .map(([name, n]) => ({ name, n, p: (n / total) * 100 }));
  }, [allProducts]);

  const refresh = () => {
    setNow(Date.now());
    orders.refetch();
    products.refetch();
    categories.refetch();
  };

  return (
    <>
      <PageHeader
        crumbs={["Asosiy", "Boshqaruv paneli"]}
        title="Boshqaruv paneli"
        subtitle="Barcha ko'rsatkichlar API'dagi buyurtmalar va mahsulotlardan hisoblanadi."
        actions={
          <>
            <select value={period} onChange={(e) => setPeriod(+e.target.value)} className="rounded-lg bg-white px-3 py-2.5 text-[13px] font-medium shadow-[0_1px_3px_rgba(16,34,74,0.06)] outline-none">
              {PERIODS.map((p) => (
                <option key={p.d} value={p.d}>
                  {p.label}
                </option>
              ))}
            </select>
            <Btn variant="ghost" onClick={refresh} disabled={fetching}>
              <RefreshCw size={15} className={fetching ? "animate-spin" : ""} /> Yangilash
            </Btn>
            <Btn
              variant="dark"
              onClick={() =>
                downloadCSV(`buyurtmalar-${period}kun.csv`, [
                  ["Raqam", "Sana", "Status", "Summa", "Jami"],
                  ...m.cur.map((o) => [o.number, fmtDateTime(orderTime(o)), STATUS_LABEL[statusOf(o)], money(o.subtotal), money(o.total)]),
                ])
              }
            >
              <Download size={15} /> Eksport
            </Btn>
          </>
        }
      />

      {error && (
        <p className="mb-4 rounded-lg bg-[#fdecec] px-4 py-3 text-[13px] text-[#c0262d]">Ma&apos;lumotlarni yuklab bo&apos;lmadi: {formatApiError(error)}</p>
      )}

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard
          dark
          label="Tushum"
          icon={<Banknote size={18} />}
          value={fmtShort(m.a.revenue)}
          unit={CURRENCY}
          foot={
            <span className="flex items-center gap-1.5">
              <Delta value={pct(m.a.revenue, m.b.revenue)} /> oldingi davrga nisbatan
            </span>
          }
        />
        <StatCard
          label="Buyurtmalar"
          icon={<ShoppingCart size={18} />}
          value={fmt(m.a.count)}
          unit="ta"
          foot={
            <span className="flex items-center gap-1.5">
              <Delta value={pct(m.a.count, m.b.count)} /> bekor qilinganlarsiz
            </span>
          }
        />
        <StatCard label="O'rtacha chek" icon={<Receipt size={18} />} value={fmtShort(m.a.avg)} unit={CURRENCY} foot="Bitta buyurtma o'rtacha summasi" />
        <StatCard
          label="Yangi (ko'rilmagan)"
          icon={<AlertTriangle size={18} />}
          value={fmt(pending.length)}
          unit="ta"
          foot={
            <Link href="/admin/orders?status=pending" className="text-[#186FD4] hover:underline">
              Buyurtmalarga o&apos;tish →
            </Link>
          }
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_340px]">
        <Card title="Tushum dinamikasi" subtitle="Ko'k — barcha sotuvlar, yashil nuqtali — yetkazib berilganlar">
          {orders.isLoading ? (
            <p className="py-20 text-center text-[13px] text-[#6b7a90]">Yuklanmoqda...</p>
          ) : (
            <AreaChart data={m.points} aLabel="Sotuv" bLabel="Yetkazilgan" formatA={rub} formatB={rub} />
          )}
        </Card>

        <Card title="Buyurtmalar holati" subtitle={PERIODS.find((p) => p.d === period)?.label}>
          <Donut
            parts={m.byStatus.map((x) => ({ value: x.n, color: STATUS_COLOR[x.st] }))}
            center={fmt(m.cur.length)}
            sub="buyurtma"
          />
          <ul className="mt-5 space-y-2 text-[13px]">
            {m.byStatus.map((x) => (
              <li key={x.st} className="flex items-center gap-2">
                <i className="h-2.5 w-2.5 rounded-full" style={{ background: STATUS_COLOR[x.st] }} />
                <span className="flex-1 text-[#4a5a73]">{STATUS_LABEL[x.st]}</span>
                <b>{x.n}</b>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_380px]">
        <Card
          title="So'nggi buyurtmalar"
          action={
            <Link href="/admin/orders" className="text-[13px] font-semibold text-[#186FD4] hover:underline">
              Barchasi ({fmt(allOrders.length)}) →
            </Link>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-[13px]">
              <thead>
                <tr className="bg-[#f6f8fc] text-[11px] uppercase tracking-wide text-[#6b7a90]">
                  {["Raqam", "Sana", "Status", "Jami"].map((h) => (
                    <th key={h} className={`px-3 py-2.5 font-semibold ${h === "Jami" ? "text-right" : ""}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allOrders.slice(0, 8).map((o) => (
                  <tr key={o.id} className="border-b border-[#eef1f6] last:border-0">
                    <td className="px-3 py-2.5 font-semibold">
                      <Link href={`/admin/orders?q=${encodeURIComponent(o.number)}`} className="hover:text-[#186FD4]">
                        #{o.number}
                      </Link>
                    </td>
                    <td className="px-3 py-2.5 text-[#4a5a73]">{fmtDateTime(orderTime(o))}</td>
                    <td className="px-3 py-2.5">
                      <OrderStatusBadge status={o.status} />
                    </td>
                    <td className="px-3 py-2.5 text-right font-semibold">{rub(money(o.total))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!orders.isLoading && allOrders.length === 0 && <Empty text="Buyurtmalar yo'q" />}
          </div>
        </Card>

        <div className="space-y-4">
          <Card
            title="Katalog"
            action={
              <Link href="/admin/products" className="text-[13px] font-semibold text-[#186FD4] hover:underline">
                Mahsulotlar →
              </Link>
            }
          >
            <div className="mb-4 grid grid-cols-3 gap-2 text-center">
              {[
                { icon: Boxes, v: allProducts.length, l: "mahsulot" },
                { icon: Layers, v: categories.data?.length ?? 0, l: "kategoriya" },
                { icon: PackageX, v: outOfStock.length, l: "sotuvda yo'q" },
              ].map(({ icon: Icon, v, l }) => (
                <div key={l} className="rounded-lg bg-[#f6f8fc] p-2.5">
                  <Icon size={16} className="mx-auto mb-1 text-[#186FD4]" />
                  <div className="text-[18px] font-bold">{fmt(v)}</div>
                  <div className="text-[10px] uppercase tracking-wide text-[#8794aa]">{l}</div>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              {catCounts.map((c) => (
                <div key={c.name}>
                  <div className="mb-1 flex justify-between text-[12px]">
                    <span className="truncate text-[#4a5a73]">{c.name}</span>
                    <b>{c.n}</b>
                  </div>
                  <Progress value={c.p} />
                </div>
              ))}
              {!products.isLoading && catCounts.length === 0 && <Empty text="Mahsulotlar yo'q" />}
            </div>
          </Card>

          <Card
            title="Sotuvda yo'q mahsulotlar"
            action={
              <Link href="/admin/warehouse" className="text-[13px] font-semibold text-[#186FD4] hover:underline">
                Ombor →
              </Link>
            }
          >
            {outOfStock.length === 0 ? (
              <p className="text-[13px] text-[#6b7a90]">Hammasi omborda bor.</p>
            ) : (
              <ul className="space-y-2">
                {outOfStock.slice(0, 6).map((p) => (
                  <li key={p.id} className="flex items-center gap-2 text-[13px]">
                    <AlertTriangle size={14} className="shrink-0 text-[#c0262d]" />
                    <Link href={`/admin/products?q=${encodeURIComponent(p.article)}`} className="min-w-0 flex-1 truncate hover:text-[#186FD4]">
                      {p.name}
                    </Link>
                    <span className="text-[11px] text-[#8794aa]">{p.article}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
