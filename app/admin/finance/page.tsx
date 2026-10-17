"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Banknote, Building2, ClipboardList, Download, Landmark, Percent, RefreshCw, Search, Truck, Wallet } from "lucide-react";
import { DAY, isSold, orderSubtotal, txOf, useDB, type TxStatus, useNow } from "@/lib/admin/db";
import { downloadCSV, fmt, fmtDate, fmtTime } from "@/lib/admin/format";
import { Donut } from "@/components/admin/charts";
import { Avatar, TxBadge } from "@/components/admin/shared";
import { Badge, Btn, Card, Empty, inputCls, PageHeader, Pagination, Progress, StatCard, Tabs, usePageSlice } from "@/components/admin/ui";

const PAGE = 6;
type Tab = "all" | TxStatus;

export default function FinancePage() {
  const db = useDB();
  const [tab, setTab] = useState<Tab>("all");
  const [q, setQ] = useState("");
  const [method, setMethod] = useState("all");
  const [amount, setAmount] = useState("all");
  const [page, setPage] = useState(1);
  const now = useNow();
  const [syncAt, setSyncAt] = useState(15);
  const [syncing, setSyncing] = useState(false);

  const f = useMemo(() => {
    const since = now - 30 * DAY;
    const sold = db.orders.filter((o) => isSold(o) && o.createdAt >= since);
    const gross = sold.reduce((s, o) => s + orderSubtotal(o), 0);
    const cogs = sold.reduce(
      (s, o) => s + o.items.reduce((a, i) => a + i.qty * (db.products.find((p) => p.id === i.productId)?.cost ?? i.price * 0.8), 0),
      0
    );
    const disc = sold.reduce((s, o) => s + o.discount, 0);
    const delivery = sold.reduce((s, o) => s + o.delivery, 0);
    const fee = sold.reduce((s, o) => s + txOf(o).fee, 0);
    const ebit = gross - disc - cogs - fee + delivery;

    const cats = Object.entries(
      sold.reduce<Record<string, { rev: number; cost: number; n: number }>>((acc, o) => {
        o.items.forEach((i) => {
          const p = db.products.find((x) => x.id === i.productId);
          const c = p?.category ?? "Boshqa";
          acc[c] ??= { rev: 0, cost: 0, n: 0 };
          acc[c].rev += i.qty * i.price;
          acc[c].cost += i.qty * (p?.cost ?? i.price * 0.8);
          acc[c].n += 1;
        });
        return acc;
      }, {})
    )
      .map(([name, v]) => ({ name, ...v, net: v.rev - v.cost, margin: v.rev ? ((v.rev - v.cost) / v.rev) * 100 : 0 }))
      .sort((a, b) => b.rev - a.rev)
      .slice(0, 4);
    return { gross, cogs, disc, delivery, fee, ebit, cats, count: sold.length };
  }, [db, now]);

  const txs = useMemo(() => db.orders.map(txOf), [db.orders]);
  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    return txs.filter((t) => {
      if (tab !== "all" && t.status !== tab) return false;
      if (s && !(t.id + t.order.number + t.order.customerName).toLowerCase().includes(s)) return false;
      if (method !== "all" && t.order.payMethod !== method) return false;
      if (amount === "s" && t.amount >= 5_000_000) return false;
      if (amount === "m" && (t.amount < 5_000_000 || t.amount >= 50_000_000)) return false;
      if (amount === "l" && t.amount < 50_000_000) return false;
      return true;
    });
  }, [txs, tab, q, method, amount]);
  const { slice, pages, page: cur } = usePageSlice(rows, page, PAGE);

  const cnt = (s: TxStatus) => txs.filter((t) => t.status === s).length;
  const share = (v: number) => (f.gross ? (v / f.gross) * 100 : 0);
  const max = Math.max(1, ...f.cats.map((c) => c.rev));

  const sync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setSyncAt(0);
      toast.success("1C Buxgalteriya bilan sinxronlandi");
    }, 900);
  };

  return (
    <>
      <PageHeader
        crumbs={["Moliya", "Tranzaksiyalar va Foyda Tahlili"]}
        title="To'lovlar, Tranzaksiyalar va Sof Foyda Tahlili"
        subtitle="B2B bank to'lovlari, onlayn ekvayring va ulgurji qurilish mollari bo'yicha sof rentabellik tahlili"
        actions={
          <>
            <span className="flex items-center gap-2 rounded-lg bg-white px-3 py-2.5 text-[12px] shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#186FD4]" />
              1C Buxgalteriya 8.3: <b>Sinxronlangan ({syncAt} daq oldin)</b>
            </span>
            <Btn variant="soft" onClick={sync}>
              <RefreshCw size={15} className={syncing ? "animate-spin" : ""} /> Sinxronlash
            </Btn>
            <Btn
              variant="dark"
              onClick={() =>
                downloadCSV("tranzaksiyalar.csv", [
                  ["Tranzaksiya ID", "Buyurtma", "Sana", "Mijoz", "Summa", "To'lov usuli", "Komissiya", "Holat"],
                  ...rows.map((t) => [t.id, t.order.number, fmtDate(t.order.createdAt), t.order.customerName, t.amount, t.order.payMethod, t.fee, t.status]),
                ])
              }
            >
              <Download size={15} /> Excelga yuklash (.xlsx)
            </Btn>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-6">
        <StatCard label="Jami tushum" icon={<Banknote size={18} />} value={fmt(f.gross)} unit="UZS" foot="Brutto oborot (30 kun)" />
        <StatCard label="Tannarx (COGS)" icon={<ClipboardList size={18} />} value={fmt(f.cogs)} unit="UZS" foot={`${share(f.cogs).toFixed(0)}% ulushi`} />
        <StatCard label="Yetkazib berish tushumi" icon={<Truck size={18} />} value={fmt(f.delivery)} unit="UZS" foot={`${f.count} ta sotuv bo'yicha`} />
        <StatCard label="Ekvayring xarajati" icon={<Percent size={18} />} value={fmt(f.fee)} unit="UZS" foot="Payme, Click, Uzum" />
        <StatCard label="Chegirmalar (B2B)" icon={<Building2 size={18} />} value={fmt(f.disc)} unit="UZS" foot="Shartnomaviy chegirma" />
        <StatCard
          dark
          label="Sof foyda (EBIT)"
          icon={<Landmark size={18} />}
          value={fmt(f.ebit)}
          unit="UZS"
          foot={<>Marja: {share(f.ebit).toFixed(1)}% sof ko&apos;rsatkich</>}
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_400px]">
        <Card
          title="Kategoriyalar bo'yicha sof marja va tushum"
          subtitle="Sement, armatura, og'ir texnika va santexnika segmentlarining daromad keltirish tahlili"
          action={<Badge tone="gray">Oxirgi 30 kun</Badge>}
        >
          <div className="space-y-3">
            {f.cats.length === 0 && <Empty />}
            {f.cats.map((c, i) => (
              <div key={c.name} className="rounded-lg bg-[#f6f8fc] p-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[14px] font-semibold">{c.name}</span>
                  <span className="flex items-center gap-3">
                    <b className="text-[14px]">{fmt(c.rev)} UZS</b>
                    <Badge tone={i === 1 ? "navy" : "blue"}>Marja: {c.margin.toFixed(1)}%</Badge>
                  </span>
                </div>
                <div className="my-2.5">
                  <Progress value={(c.rev / max) * 100} h={7} color={i === 1 ? "#06214a" : "#5ba0ee"} />
                </div>
                <div className="flex justify-between text-[11px] text-[#6b7a90]">
                  <span>Hajm: {c.n} ta pozitsiya sotuvi</span>
                  <span>Sof hissa: {fmt(c.net)} UZS</span>
                </div>
              </div>
            ))}
          </div>
          {f.cats[0] && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#eef1f6] pt-3 text-[12px]">
              <span>
                Eng yuqori rentabellik:{" "}
                <b>{[...f.cats].sort((a, b) => b.margin - a.margin)[0].name}</b>
              </span>
              <span>
                Jami ulush: 100% ({fmt(f.gross / 1e9, 2)} mlrd UZS)
              </span>
            </div>
          )}
        </Card>

        <Card title="Xarajatlar va Foyda Tarkibi" subtitle="Oborotdan sof qolgan mablag' taqsimoti">
          <Donut
            center={`${share(f.ebit).toFixed(1)}%`}
            sub="Sof marja"
            parts={[
              { value: f.cogs, color: "#6b7280" },
              { value: Math.max(0, f.ebit), color: "#06214a" },
              { value: f.disc, color: "#5ba0ee" },
              { value: f.fee, color: "#ff7a59" },
            ]}
          />
          <ul className="mt-5 space-y-2 text-[12px]">
            {[
              ["Tannarx (COGS)", f.cogs, "#6b7280"],
              ["Sof Foyda (EBIT)", Math.max(0, f.ebit), "#06214a"],
              ["Chegirmalar", f.disc, "#5ba0ee"],
              ["Ekvayring & Chegirma", f.fee, "#ff7a59"],
            ].map(([l, v, c]) => (
              <li key={l as string} className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <i className="h-2.5 w-2.5 rounded-full" style={{ background: c as string }} />
                  {l}
                </span>
                <b>{share(v as number).toFixed(1)}%</b>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="mt-4" title="Barcha Tranzaksiyalar va To'lovlar Oqimi" subtitle="B2B schyot-fakturalar, karta to'lovlari va terminallar reestri" action={<Wallet size={18} className="text-[#6b7a90]" />}>
        <Tabs
          value={tab}
          onChange={(v) => {
            setTab(v);
            setPage(1);
          }}
          tabs={[
            { id: "all", label: "Barchasi", count: txs.length },
            { id: "Muvaffaqiyatli", label: "Muvaffaqiyatli", count: cnt("Muvaffaqiyatli") },
            { id: "Kutilmoqda", label: "Kutilmoqda", count: cnt("Kutilmoqda") },
            { id: "Qaytarilgan", label: "Qaytarilgan", count: cnt("Qaytarilgan") },
            { id: "Bekor qilingan", label: "Xato / Bekor", count: cnt("Bekor qilingan"), tone: "red" },
          ]}
        />
        <div className="my-3 grid gap-2.5 md:grid-cols-[1fr_200px_200px]">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8794aa]" />
            <input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Tranzaksiya ID, buyurtma yoki mijoz..." className={`${inputCls} pl-9`} />
          </div>
          <select value={method} onChange={(e) => { setMethod(e.target.value); setPage(1); }} className={inputCls}>
            <option value="all">To&apos;lov tizimi (Barchasi)</option>
            {["Bank o'tkazmasi", "Payme", "Click", "Uzum", "Naqd"].map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
          <select value={amount} onChange={(e) => { setAmount(e.target.value); setPage(1); }} className={inputCls}>
            <option value="all">Summa diapazoni</option>
            <option value="s">5 mln dan kam</option>
            <option value="m">5 – 50 mln</option>
            <option value="l">50 mln dan ko&apos;p</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-[13px]">
            <thead>
              <tr className="bg-[#f6f8fc] text-[11px] uppercase tracking-wide text-[#6b7a90]">
                {["Tranzaksiya ID", "Buyurtma #", "Sana va vaqt", "Mijoz / Kompaniya", "Summa (UZS)", "To'lov usuli", "Komissiya", "Status"].map((h) => (
                  <th key={h} className="px-3 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {slice.map((t) => (
                <tr key={t.order.id} className="border-b border-[#eef1f6] last:border-0">
                  <td className="px-3 py-3.5 font-semibold">#{t.id}</td>
                  <td className="px-3 py-3.5"><span className="rounded bg-[#eef2fb] px-2 py-1 text-[11px]">#{t.order.number}</span></td>
                  <td className="px-3 py-3.5 text-[12px]">
                    {fmtDate(t.order.createdAt)}
                    <div className="text-[11px] text-[#8794aa]">{fmtTime(t.order.createdAt)}</div>
                  </td>
                  <td className="px-3 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={t.order.customerName} className="!h-8 !w-8 !text-[11px]" />
                      <div className="min-w-0">
                        <div className="max-w-[210px] truncate font-medium">{t.order.customerName}</div>
                        <div className="text-[11px] text-[#8794aa]">{t.order.inn !== "—" ? `STIR: ${t.order.inn}` : t.order.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3.5 font-semibold">{fmt(t.amount)}</td>
                  <td className="px-3 py-3.5"><Badge tone="blue">{t.order.payMethod}</Badge></td>
                  <td className="px-3 py-3.5">{fmt(t.fee)} UZS</td>
                  <td className="px-3 py-3.5"><TxBadge status={t.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && <Empty />}
        </div>
        <Pagination page={cur} pages={pages} onChange={setPage} info={<>Ko&apos;rsatilmoqda: {rows.length ? (cur - 1) * PAGE + 1 : 0}-{Math.min(cur * PAGE, rows.length)} / jami {fmt(rows.length)} tranzaksiya</>} />
      </Card>
    </>
  );
}

