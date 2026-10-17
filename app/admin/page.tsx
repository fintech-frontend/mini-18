"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  AlertTriangle,
  Banknote,
  Calendar,
  Download,
  Eye,
  Landmark,
  PieChart,
  RefreshCw,
  ShoppingCart,
  Users,
  ClipboardCheck,
  Receipt,
  Hammer,
  Wrench,
  Package,
  ListChecks,
} from "lucide-react";
import { useDB, DAY, isSold, orderTotal, orderProfit } from "@/lib/admin/db";
import { fmt, fmtShort, fmtDay, fmtTime, downloadCSV, monthName, isToday } from "@/lib/admin/format";
import { AreaChart, Donut, type Point } from "@/components/admin/charts";
import { Badge, Btn, Card, Delta, PageHeader, Progress, StatCard, Empty } from "@/components/admin/ui";
import { OrderStatusBadge } from "@/components/admin/shared";

const PERIODS = [
  { d: 7, label: "Oxirgi 7 kun" },
  { d: 30, label: "Joriy oy (30 kun)" },
  { d: 90, label: "Oxirgi 90 kun" },
  { d: 365, label: "Oxirgi yil" },
];

const pct = (a: number, b: number) => (b ? ((a - b) / b) * 100 : 0);

export default function Dashboard() {
  const db = useDB();
  const router = useRouter();
  const [period, setPeriod] = useState(30);
  const [range, setRange] = useState<"day" | "week" | "month" | "year">("month");
  const [spin, setSpin] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  const m = useMemo(() => {
    const cur = db.orders.filter((o) => o.createdAt >= now - period * DAY);
    const prev = db.orders.filter((o) => o.createdAt >= now - 2 * period * DAY && o.createdAt < now - period * DAY);
    const sum = (list: typeof cur) => {
      const sold = list.filter(isSold);
      const revenue = sold.reduce((s, o) => s + orderTotal(o), 0);
      const profit = sold.reduce((s, o) => s + orderProfit(o, db.products), 0);
      const items = sold.reduce((s, o) => s + o.items.length, 0);
      return { sold, revenue, profit, items, count: sold.length, avg: sold.length ? revenue / sold.length : 0 };
    };
    const a = sum(cur);
    const b = sum(prev);
    const b2b = a.sold.filter((o) => o.channel === "B2B Ulgurji");
    const newCustomers = db.customers.filter((c) => c.createdAt >= now - period * DAY);
    const retailNew = newCustomers.filter((c) => c.type === "retail").length;

    // kategoriyalar
    const cat: Record<string, number> = {};
    a.sold.forEach((o) =>
      o.items.forEach((i) => {
        const c = db.products.find((p) => p.id === i.productId)?.category ?? "Boshqa";
        cat[c] = (cat[c] ?? 0) + i.qty * i.price;
      })
    );
    const catTotal = Object.values(cat).reduce((s, v) => s + v, 0) || 1;
    const cats = Object.entries(cat)
      .sort((x, y) => y[1] - x[1])
      .slice(0, 5)
      .map(([name, v]) => ({ name, v, p: (v / catTotal) * 100 }));

    // to'lovlar
    const pay = { bank: 0, digital: 0, cash: 0 };
    a.sold.forEach((o) => {
      const t = orderTotal(o);
      if (o.payMethod === "Bank o'tkazmasi") pay.bank += t;
      else if (o.payMethod === "Naqd") pay.cash += t;
      else pay.digital += t;
    });

    return { a, b, b2b, newCustomers: newCustomers.length, retailNew, cats, pay, cur };
  }, [db, period, now]);

  // grafik nuqtalari
  const points: Point[] = useMemo(() => {
    const sold = db.orders.filter(isSold);
    const profitOf = (o: (typeof sold)[number]) => orderProfit(o, db.products);
    const out: Point[] = [];
    if (range === "year") {
      const d = new Date(now);
      for (let i = 11; i >= 0; i--) {
        const s = new Date(d.getFullYear(), d.getMonth() - i, 1).getTime();
        const e = new Date(d.getFullYear(), d.getMonth() - i + 1, 1).getTime();
        const list = sold.filter((o) => o.createdAt >= s && o.createdAt < e);
        out.push({
          label: monthName(new Date(s).getMonth()),
          a: list.reduce((x, o) => x + orderTotal(o), 0),
          b: list.reduce((x, o) => x + profitOf(o), 0),
          hint: `${monthName(new Date(s).getMonth())} ${new Date(s).getFullYear()}`,
        });
      }
    } else if (range === "day") {
      for (let i = 23; i >= 0; i--) {
        const e = now - i * 3_600_000;
        const s = e - 3_600_000;
        const list = sold.filter((o) => o.createdAt >= s && o.createdAt < e);
        out.push({
          label: fmtTime(e),
          a: list.reduce((x, o) => x + orderTotal(o), 0),
          b: list.reduce((x, o) => x + profitOf(o), 0),
          hint: `Soat ${fmtTime(s)} – ${fmtTime(e)}`,
        });
      }
    } else {
      const n = range === "week" ? 7 : 30;
      const start = new Date(now);
      start.setHours(0, 0, 0, 0);
      for (let i = n - 1; i >= 0; i--) {
        const s = start.getTime() - i * DAY;
        const list = sold.filter((o) => o.createdAt >= s && o.createdAt < s + DAY);
        out.push({
          label: fmtDay(s),
          a: list.reduce((x, o) => x + orderTotal(o), 0),
          b: list.reduce((x, o) => x + profitOf(o), 0),
          hint: `${fmtDay(s)} • ${list.length} ta buyurtma`,
        });
      }
    }
    return out;
  }, [db, range, now]);

  const lowStock = db.products
    .filter((p) => p.stock <= p.minStock)
    .sort((x, y) => x.stock / x.minStock - y.stock / y.minStock)
    .slice(0, 4);
  const recent = db.orders.slice(0, 5);
  const total = points.reduce((s, p) => s + p.a, 0);
  const totalProfit = points.reduce((s, p) => s + p.b, 0);
  const payTotal = m.pay.bank + m.pay.digital + m.pay.cash || 1;
  const catColors = ["#06214a", "#186FD4", "#5ba0ee", "#8bbcf3", "#9aa6b8"];

  const exportReport = () => {
    downloadCSV(`hisobot-${period}-kun.csv`, [
      ["Ko'rsatkich", "Qiymat"],
      ["Davr (kun)", period],
      ["Umumiy tushum (UZS)", Math.round(m.a.revenue)],
      ["Sof foyda (UZS)", Math.round(m.a.profit)],
      ["Buyurtmalar", m.a.count],
      ["O'rtacha chek (UZS)", Math.round(m.a.avg)],
      ["Yangi mijozlar", m.newCustomers],
      [],
      ["Buyurtma", "Mijoz", "Sana", "Summa", "Holat"],
      ...m.cur.map((o) => [o.number, o.customerName, new Date(o.createdAt).toLocaleDateString("ru-RU"), orderTotal(o), o.status]),
    ]);
    toast.success("Hisobot yuklab olindi");
  };

  const refresh = () => {
    setSpin(true);
    setNow(Date.now());
    setTimeout(() => {
      setSpin(false);
      toast.success("Ma'lumotlar yangilandi");
    }, 600);
  };

  return (
    <>
      <PageHeader
        crumbs={["Asosiy", "Tahlil va KPI"]}
        title="Boshqaruv Paneli"
        badge={
          <span className="flex items-center gap-2 rounded-full bg-[#e3effc] px-3 py-1 text-[12px] font-semibold text-[#186FD4]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#186FD4]" /> Jonli yangilanish: Har 30 sek
          </span>
        }
        actions={
          <>
            <label className="flex items-center gap-2 rounded-lg bg-white px-3 py-2.5 text-[13px] shadow-sm">
              <Calendar size={15} className="text-[#186FD4]" />
              <select value={period} onChange={(e) => setPeriod(+e.target.value)} className="bg-transparent font-medium outline-none">
                {PERIODS.map((p) => (
                  <option key={p.d} value={p.d}>
                    {p.label}
                  </option>
                ))}
              </select>
            </label>
            <Btn variant="ghost" onClick={exportReport}>
              <Download size={15} /> Hisobotni yuklab olish (CSV)
            </Btn>
            <Btn variant="dark" onClick={refresh}>
              <RefreshCw size={15} className={spin ? "animate-spin" : ""} /> Yangilash
            </Btn>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-6">
        <StatCard
          label="Umumiy tushum"
          icon={<Banknote size={18} />}
          value={fmt(m.a.revenue)}
          unit="UZS"
          foot={
            <>
              <Delta value={pct(m.a.revenue, m.b.revenue)} /> oldingi davrga nisbatan
            </>
          }
        />
        <StatCard
          label="Sof foyda"
          icon={<Landmark size={18} />}
          value={fmt(m.a.profit)}
          unit="UZS"
          foot={<Badge tone="blue">{m.a.revenue ? ((m.a.profit / m.a.revenue) * 100).toFixed(1) : 0}% marja</Badge>}
        />
        <StatCard
          label="Buyurtmalar"
          icon={<Receipt size={18} />}
          value={fmt(m.a.count)}
          unit="ta"
          foot={
            <div className="flex items-center justify-between gap-2">
              <span>
                <Delta value={pct(m.a.count, m.b.count)} /> oyga
              </span>
              <Badge tone="gray">{m.b2b.length} B2B ulgurji</Badge>
            </div>
          }
        />
        <StatCard
          label="O'rtacha chek"
          icon={<ClipboardCheck size={18} />}
          value={fmt(m.a.avg)}
          unit="UZS"
          foot={
            <>
              <Delta value={pct(m.a.avg, m.b.avg)} /> • B2B:{" "}
              {m.b2b.length ? fmtShort(m.b2b.reduce((s, o) => s + orderTotal(o), 0) / m.b2b.length) : 0} UZS
            </>
          }
        />
        <StatCard
          label="Yangi mijozlar"
          icon={<Users size={18} />}
          value={fmt(m.newCustomers)}
          unit="ta"
          foot={
            <div className="flex items-center justify-between">
              <Badge tone="blue">{m.newCustomers - m.retailNew} yirik B2B</Badge>
              <span>{m.retailNew} chakana</span>
            </div>
          }
        />
        <StatCard
          label="Sotilgan tovarlar"
          icon={<ListChecks size={18} />}
          value={fmt(m.a.items)}
          unit="birlik"
          foot={<span className="line-clamp-1">Sement, armatura, asboblar…</span>}
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_380px]">
        <Card
          title="Tushum va sof foyda dinamikasi"
          subtitle="Oylik tushum, xarajatlar marjasi va operatsion sof ko'rsatkichlar"
          action={
            <div className="flex rounded-lg bg-[#f1f4fa] p-1 text-[12px] font-semibold">
              {(
                [
                  ["day", "Kechagi"],
                  ["week", "Hafta"],
                  ["month", "Oy"],
                  ["year", "Yil"],
                ] as const
              ).map(([k, l]) => (
                <button
                  key={k}
                  onClick={() => setRange(k)}
                  className={`rounded-md px-3 py-1.5 ${range === k ? "bg-white text-[#0f1d3a] shadow-sm" : "text-[#6b7a90]"}`}
                >
                  {l}
                </button>
              ))}
            </div>
          }
        >
          <div className="mb-3 flex flex-wrap gap-5 text-[12px]">
            <span className="flex items-center gap-2">
              <i className="h-3 w-3 rounded-full bg-[#06214a]" /> Umumiy tushum <b className="text-[#0f1d3a]">{fmtShort(total)}</b>
            </span>
            <span className="flex items-center gap-2">
              <i className="h-3 w-3 rounded-full bg-[#186FD4]" /> Sof foyda (Marja){" "}
              <b className="text-[#186FD4]">{fmtShort(totalProfit)}</b>
            </span>
          </div>
          <AreaChart data={points} />
        </Card>

        <Card
          title="To'lov usullari ulushi"
          action={
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#eef2fb] text-[#16335f]">
              <PieChart size={17} />
            </span>
          }
        >
          <Donut
            center="100%"
            sub="Tranzaksiyalar"
            parts={[
              { value: m.pay.bank, color: "#06214a" },
              { value: m.pay.digital, color: "#186FD4" },
              { value: m.pay.cash, color: "#8bbcf3" },
            ]}
          />
          <ul className="mt-6 space-y-2.5 text-[12px]">
            {[
              ["B2B Bank o'tkazmasi", m.pay.bank, "#06214a"],
              ["Click / Payme / Uzum", m.pay.digital, "#186FD4"],
              ["Naqd / POS terminal", m.pay.cash, "#8bbcf3"],
            ].map(([l, v, c]) => (
              <li key={l as string} className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2">
                  <i className="h-2.5 w-2.5 rounded-full" style={{ background: c as string }} />
                  {l} ({Math.round(((v as number) / payTotal) * 100)}%)
                </span>
                <b>{fmtShort(v as number)} UZS</b>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card
        className="mt-4"
        title="Kategoriyalar bo'yicha sotuv ulushi"
        subtitle="Qurilish xomashyosi va uskunalarining ulgurji savdo taqsimoti"
        action={
          <Link href="/admin/reports" className="text-[13px] font-semibold text-[#186FD4] hover:underline">
            Barcha kategoriyalar hisoboti →
          </Link>
        }
      >
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {m.cats.length === 0 && <Empty text="Bu davrda sotuv yo'q" />}
          {m.cats.map((c, i) => (
            <div key={c.name} className="rounded-lg bg-[#f6f8fc] p-3.5">
              <div className="mb-2 flex items-center justify-between gap-2 text-[12px]">
                <span className="truncate font-medium">{c.name}</span>
                <b className="text-[#186FD4]">{c.p.toFixed(0)}%</b>
              </div>
              <Progress value={c.p} color={catColors[i]} h={7} />
              <div className="mt-2.5 flex justify-between text-[11px] text-[#6b7a90]">
                <span>Hajm: {fmtShort(c.v)}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_420px]">
        <Card
          title={
            <span className="flex items-center gap-2">
              <ShoppingCart size={20} className="text-[#186FD4]" /> Oxirgi buyurtmalar
            </span>
          }
          subtitle="B2B va chakana shartnomalar holati"
          action={
            <Link href="/admin/orders" className="text-[12px] font-semibold text-[#186FD4] hover:underline">
              Barchasi ({fmt(db.orders.length)}) →
            </Link>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-[13px]">
              <thead>
                <tr className="bg-[#f6f8fc] text-[11px] uppercase tracking-wide text-[#6b7a90]">
                  {["Buyurtma #", "Mijoz / Kompaniya", "Tovarlar", "Summa (UZS)", "To'lov", "Harakat"].map((h) => (
                    <th key={h} className="px-3 py-3 font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map((o) => (
                  <tr key={o.id} className="border-b border-[#eef1f6] last:border-0">
                    <td className="px-3 py-3.5 font-semibold">#{o.number}</td>
                    <td className="px-3 py-3.5">
                      <div className="font-medium">{o.customerName}</div>
                      <div className="text-[11px] text-[#8794aa]">
                        {o.channel} • {isToday(o.createdAt) ? "Bugun" : fmtDay(o.createdAt)}, {fmtTime(o.createdAt)}
                      </div>
                    </td>
                    <td className="px-3 py-3.5">{o.items.length} xil</td>
                    <td className="px-3 py-3.5 font-semibold">{fmt(orderTotal(o))}</td>
                    <td className="px-3 py-3.5">
                      <OrderStatusBadge status={o.status} />
                    </td>
                    <td className="px-3 py-3.5">
                      <button
                        onClick={() => router.push(`/admin/orders?q=${o.number}`)}
                        className="rounded-lg p-2 text-[#6b7a90] hover:bg-[#eef2fb]"
                        aria-label="Ko'rish"
                      >
                        <Eye size={17} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card
          className="flex flex-col"
          title={
            <span className="flex items-center gap-2">
              <AlertTriangle size={20} className="text-[#d32027]" /> Tanqis mahsulotlar
            </span>
          }
          subtitle="Omborda kritik chegaradan kam qolgan tovarlar"
          action={<Badge tone="red">{db.products.filter((p) => p.stock <= p.minStock).length} ta kritik</Badge>}
        >
          <div className="space-y-2.5">
            {lowStock.length === 0 && <Empty text="Kritik qoldiq yo'q" />}
            {lowStock.map((p, i) => {
              const Icon = [Hammer, Wrench, Package, Package][i % 4];
              const drop = Math.round((1 - p.stock / p.minStock) * 100);
              return (
                <div key={p.id} className="flex items-center gap-3 rounded-lg bg-[#eef2fb] p-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#d6e8fb] text-[#16335f]">
                    <Icon size={20} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] font-semibold">{p.name}</div>
                    <div className="text-[11px]">
                      <b className="text-[#c0262d]">
                        Qoldiq: {fmt(p.stock, 1)} {p.unit}
                      </b>{" "}
                      • Min: {fmt(p.minStock)} {p.unit}
                    </div>
                  </div>
                  <Badge tone="red">-{drop}%</Badge>
                </div>
              );
            })}
          </div>
          <div className="mt-auto pt-6">
            <Btn variant="primary" className="w-full !py-3" onClick={() => router.push("/admin/warehouse?new=1")}>
              <ShoppingCart size={16} /> Xarid buyurtmasi yaratish (Zaxira to&apos;ldirish)
            </Btn>
          </div>
        </Card>
      </div>
    </>
  );
}

