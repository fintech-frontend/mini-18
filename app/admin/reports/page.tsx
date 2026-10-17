"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Download } from "lucide-react";
import { DAY, isSold, orderProfit, orderTotal, useDB, useNow } from "@/lib/admin/db";
import { downloadCSV, fmt } from "@/lib/admin/format";
import { Btn, Card, Empty, PageHeader, Progress } from "@/components/admin/ui";

export default function ReportsPage() {
  const db = useDB();
  const [days, setDays] = useState(30);
  const now = useNow();

  const r = useMemo(() => {
    const sold = db.orders.filter((o) => isSold(o) && o.createdAt >= now - days * DAY);
    const byProduct: Record<string, { name: string; qty: number; unit: string; rev: number }> = {};
    const byCustomer: Record<string, { name: string; n: number; rev: number }> = {};
    sold.forEach((o) => {
      byCustomer[o.customerId] ??= { name: o.customerName, n: 0, rev: 0 };
      byCustomer[o.customerId].n++;
      byCustomer[o.customerId].rev += orderTotal(o);
      o.items.forEach((i) => {
        byProduct[i.productId] ??= { name: i.name, qty: 0, unit: i.unit, rev: 0 };
        byProduct[i.productId].qty += i.qty;
        byProduct[i.productId].rev += i.qty * i.price;
      });
    });
    const top = Object.values(byProduct).sort((a, b) => b.rev - a.rev).slice(0, 8);
    const customers = Object.values(byCustomer).sort((a, b) => b.rev - a.rev).slice(0, 6);
    const revenue = sold.reduce((s, o) => s + orderTotal(o), 0);
    const profit = sold.reduce((s, o) => s + orderProfit(o, db.products), 0);
    return { sold, top, customers, revenue, profit };
  }, [db, days, now]);

  const maxP = Math.max(1, ...r.top.map((x) => x.rev));
  const maxC = Math.max(1, ...r.customers.map((x) => x.rev));

  return (
    <>
      <PageHeader
        crumbs={["Tahlil", "Hisobotlar"]}
        title="Hisobotlar"
        subtitle="Eng ko'p sotilgan mahsulotlar va eng yirik mijozlar"
        actions={
          <>
            <select value={days} onChange={(e) => setDays(+e.target.value)} className="rounded-lg bg-white px-3 py-2.5 text-[13px] shadow-sm outline-none">
              <option value={7}>Oxirgi 7 kun</option>
              <option value={30}>Oxirgi 30 kun</option>
              <option value={90}>Oxirgi 90 kun</option>
              <option value={365}>Oxirgi yil</option>
            </select>
            <Btn
              variant="dark"
              onClick={() => {
                downloadCSV(`hisobot-${days}-kun.csv`, [
                  ["Mahsulot", "Miqdor", "Birlik", "Tushum"],
                  ...r.top.map((p) => [p.name, p.qty, p.unit, p.rev]),
                  [],
                  ["Mijoz", "Buyurtmalar", "Tushum"],
                  ...r.customers.map((c) => [c.name, c.n, c.rev]),
                ]);
                toast.success("Hisobot yuklandi");
              }}
            >
              <Download size={15} /> CSV yuklab olish
            </Btn>
          </>
        }
      />
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          ["Sotuvlar soni", fmt(r.sold.length)],
          ["Tushum (UZS)", fmt(r.revenue)],
          ["Sof foyda (UZS)", fmt(r.profit)],
        ].map(([l, v]) => (
          <Card key={l}>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-[#6b7a90]">{l}</div>
            <div className="mt-2 text-[26px] font-bold">{v}</div>
          </Card>
        ))}
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <Card title="Top mahsulotlar (tushum bo'yicha)">
          {r.top.length === 0 && <Empty />}
          <div className="space-y-3.5">
            {r.top.map((p) => (
              <div key={p.name}>
                <div className="mb-1 flex justify-between gap-3 text-[12px]">
                  <span className="truncate font-medium">{p.name}</span>
                  <b className="shrink-0">{fmt(p.rev)} UZS</b>
                </div>
                <Progress value={(p.rev / maxP) * 100} h={7} />
                <div className="mt-0.5 text-[11px] text-[#8794aa]">{fmt(p.qty, 1)} {p.unit} sotilgan</div>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Top mijozlar">
          {r.customers.length === 0 && <Empty />}
          <div className="space-y-3.5">
            {r.customers.map((c) => (
              <div key={c.name}>
                <div className="mb-1 flex justify-between gap-3 text-[12px]">
                  <span className="truncate font-medium">{c.name}</span>
                  <b className="shrink-0">{fmt(c.rev)} UZS</b>
                </div>
                <Progress value={(c.rev / maxC) * 100} h={7} color="#06214a" />
                <div className="mt-0.5 text-[11px] text-[#8794aa]">{c.n} ta buyurtma</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
