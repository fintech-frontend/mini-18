"use client";

import { useMemo } from "react";
import { Download, RefreshCw } from "lucide-react";
import { fmt, downloadCSV, monthName } from "@/lib/admin/format";
import { AreaChart, type Point } from "@/components/admin/charts";
import { Btn, Card, Empty, PageHeader, Progress } from "@/components/admin/ui";
import { useGetAdminOrdersQuery, useGetAdminProductsQuery } from "@/lib/api/adminApi";
import { CURRENCY, isSold, money, orderTime, ORDER_STATUSES, STATUS_LABEL, statusOf } from "@/lib/admin/orders";
import { formatApiError } from "@/lib/apiError";

const rub = (n: number) => `${fmt(n, 2)} ${CURRENCY}`;

export default function ReportsPage() {
  const orders = useGetAdminOrdersQuery();
  const products = useGetAdminProductsQuery({ page_size: 1000 });
  const fetching = orders.isFetching || products.isFetching;
  const error = orders.error ?? products.error;

  const allOrders = useMemo(() => orders.data ?? [], [orders.data]);
  const allProducts = useMemo(() => products.data?.results ?? [], [products.data]);

  // Oxirgi 12 oy
  const monthly = useMemo(() => {
    const now = new Date();
    const rows: { label: string; count: number; revenue: number; delivered: number; avg: number }[] = [];
    for (let i = 11; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1).getTime();
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1).getTime();
      const sold = allOrders.filter((o) => isSold(o) && orderTime(o) >= start && orderTime(o) < end);
      const revenue = sold.reduce((s, o) => s + money(o.total), 0);
      rows.push({
        label: `${monthName(new Date(start).getMonth())} ${new Date(start).getFullYear()}`,
        count: sold.length,
        revenue,
        delivered: sold.filter((o) => statusOf(o) === "delivered").reduce((s, o) => s + money(o.total), 0),
        avg: sold.length ? revenue / sold.length : 0,
      });
    }
    return rows;
  }, [allOrders]);

  const chart: Point[] = monthly.map((m) => ({ label: m.label.split(" ")[0], hint: m.label, a: m.revenue, b: m.delivered }));

  const byStatus = useMemo(
    () =>
      ORDER_STATUSES.map((s) => {
        const list = allOrders.filter((o) => statusOf(o) === s);
        return { s, count: list.length, sum: list.reduce((a, o) => a + money(o.total), 0) };
      }),
    [allOrders]
  );

  const byCategory = useMemo(() => {
    const map = new Map<string, { name: string; count: number; stock: number; value: number; out: number }>();
    allProducts.forEach((p) => {
      const name = p.category?.name ?? "Kategoriyasiz";
      const r = map.get(name) ?? { name, count: 0, stock: 0, value: 0, out: 0 };
      const st = p.stock_quantity ?? 0;
      r.count += 1;
      r.stock += st;
      r.value += st * money(p.price);
      if (st <= 0) r.out += 1;
      map.set(name, r);
    });
    return [...map.values()].sort((a, b) => b.count - a.count);
  }, [allProducts]);

  const totalOrders = allOrders.length || 1;
  const totalProducts = allProducts.length || 1;

  return (
    <>
      <PageHeader
        crumbs={["Asosiy", "Hisobotlar"]}
        title="Hisobotlar"
        subtitle="API'dagi buyurtmalar va mahsulotlar asosida."
        actions={
          <Btn
            variant="ghost"
            disabled={fetching}
            onClick={() => {
              orders.refetch();
              products.refetch();
            }}
          >
            <RefreshCw size={15} className={fetching ? "animate-spin" : ""} /> Yangilash
          </Btn>
        }
      />

      {error && <p className="mb-4 rounded-lg bg-[#fdecec] px-4 py-3 text-[13px] text-[#c0262d]">Ma&apos;lumotlarni yuklab bo&apos;lmadi: {formatApiError(error)}</p>}

      <Card
        title="Oylik savdo hisoboti"
        subtitle="Oxirgi 12 oy, bekor qilinganlarsiz"
        action={
          <Btn
            size="sm"
            variant="ghost"
            onClick={() =>
              downloadCSV("oylik-savdo.csv", [["Oy", "Buyurtmalar", "Savdo", "Yetkazilgan", "O'rtacha chek"], ...monthly.map((m) => [m.label, m.count, m.revenue, m.delivered, Math.round(m.avg)])])
            }
          >
            <Download size={14} /> CSV
          </Btn>
        }
      >
        <AreaChart data={chart} aLabel="Savdo" bLabel="Yetkazilgan" formatA={rub} formatB={rub} height={240} />
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[620px] text-left text-[13px]">
            <thead>
              <tr className="bg-[#f6f8fc] text-[11px] uppercase tracking-wide text-[#6b7a90]">
                {["Oy", "Buyurtmalar", "Savdo", "Yetkazilgan", "O'rtacha chek"].map((h) => (
                  <th key={h} className="px-3 py-2.5 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...monthly].reverse().map((m) => (
                <tr key={m.label} className="border-b border-[#eef1f6] last:border-0">
                  <td className="px-3 py-2.5 font-semibold">{m.label}</td>
                  <td className="px-3 py-2.5">{m.count}</td>
                  <td className="px-3 py-2.5 font-semibold">{rub(m.revenue)}</td>
                  <td className="px-3 py-2.5 text-[#12713c]">{rub(m.delivered)}</td>
                  <td className="px-3 py-2.5 text-[#4a5a73]">{rub(m.avg)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <Card
          title="Buyurtmalar statuslar bo'yicha"
          subtitle={`Jami ${allOrders.length} ta`}
          action={
            <Btn size="sm" variant="ghost" onClick={() => downloadCSV("statuslar.csv", [["Status", "Soni", "Summa"], ...byStatus.map((r) => [STATUS_LABEL[r.s], r.count, r.sum])])}>
              <Download size={14} /> CSV
            </Btn>
          }
        >
          <div className="space-y-3">
            {byStatus.map((r) => (
              <div key={r.s}>
                <div className="mb-1 flex justify-between text-[13px]">
                  <span className="text-[#4a5a73]">{STATUS_LABEL[r.s]}</span>
                  <span>
                    <b>{r.count}</b> <span className="text-[#8794aa]">• {rub(r.sum)}</span>
                  </span>
                </div>
                <Progress value={(r.count / totalOrders) * 100} />
              </div>
            ))}
          </div>
        </Card>

        <Card
          title="Katalog kategoriyalar bo'yicha"
          subtitle={`Jami ${allProducts.length} ta mahsulot`}
          action={
            <Btn
              size="sm"
              variant="ghost"
              onClick={() =>
                downloadCSV("katalog-kategoriyalar.csv", [["Kategoriya", "Mahsulotlar", "Qoldiq (dona)", "Qiymat", "Sotuvda yo'q"], ...byCategory.map((r) => [r.name, r.count, r.stock, r.value, r.out])])
              }
            >
              <Download size={14} /> CSV
            </Btn>
          }
        >
          {byCategory.length === 0 ? (
            <Empty text="Mahsulotlar yo'q" />
          ) : (
            <div className="space-y-3">
              {byCategory.map((r) => (
                <div key={r.name}>
                  <div className="mb-1 flex justify-between text-[13px]">
                    <span className="truncate text-[#4a5a73]">{r.name}</span>
                    <span>
                      <b>{r.count}</b> <span className="text-[#8794aa]">• {fmt(r.stock)} dona • {rub(r.value)}</span>
                    </span>
                  </div>
                  <Progress value={(r.count / totalProducts) * 100} />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <p className="mt-4 text-[12px] text-[#8794aa]">
        Mahsulot/kategoriya bo&apos;yicha sotuvlar va foyda hisoboti uchun backend buyurtma tarkibini (order items) va tannarxni saqlashi kerak.
      </p>
    </>
  );
}
