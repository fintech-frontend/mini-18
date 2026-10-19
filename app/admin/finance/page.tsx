"use client";

import { useMemo, useState } from "react";
import { Banknote, Clock, Download, RefreshCw, Undo2, Wallet } from "lucide-react";
import { fmt, fmtShort, fmtDateTime, downloadCSV, monthName } from "@/lib/admin/format";
import { Btn, Card, Empty, PageHeader, Pagination, StatCard, Tabs, usePageSlice } from "@/components/admin/ui";
import { OrderStatusBadge } from "@/components/admin/shared";
import { useGetAdminOrdersQuery } from "@/lib/api/adminApi";
import { CURRENCY, money, orderTime, STATUS_LABEL, statusOf } from "@/lib/admin/orders";
import { formatApiError } from "@/lib/apiError";

const PAGE = 12;
type Flt = "all" | "received" | "expected" | "lost";
const rub = (n: number) => `${fmt(n, 2)} ${CURRENCY}`;

// Moliyaviy holat buyurtma statusidan: yetkazilgan — pul tushgan, bekor/qaytarilgan — yo'qotilgan
const finOf = (status: string): Exclude<Flt, "all"> => {
  const s = statusOf({ status });
  if (s === "delivered") return "received";
  if (s === "cancelled" || s === "returned") return "lost";
  return "expected";
};

export default function FinancePage() {
  const { data: orders = [], isLoading, isFetching, error, refetch } = useGetAdminOrdersQuery();
  const [flt, setFlt] = useState<Flt>("all");
  const [page, setPage] = useState(1);

  const sums = useMemo(() => {
    const s = { received: 0, expected: 0, lost: 0, discount: 0 };
    orders.forEach((o) => {
      s[finOf(o.status)] += money(o.total);
      if (finOf(o.status) !== "lost") s.discount += Math.max(0, money(o.subtotal) - money(o.total));
    });
    return s;
  }, [orders]);

  // Oylar kesimida (oxirgi 6 oy)
  const months = useMemo(() => {
    const out: { label: string; received: number; expected: number; lost: number; count: number }[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const list = orders.filter((o) => orderTime(o) >= start.getTime() && orderTime(o) < end.getTime());
      const row = { label: `${monthName(start.getMonth())} ${start.getFullYear()}`, received: 0, expected: 0, lost: 0, count: list.length };
      list.forEach((o) => (row[finOf(o.status)] += money(o.total)));
      out.push(row);
    }
    return out.reverse();
  }, [orders]);

  const rows = useMemo(() => orders.filter((o) => flt === "all" || finOf(o.status) === flt), [orders, flt]);
  const { slice, pages, page: cur } = usePageSlice(rows, page, PAGE);

  return (
    <>
      <PageHeader
        crumbs={["Asosiy", "Moliya"]}
        title="To'lovlar va Moliya"
        subtitle="Buyurtmalar summasi va statusidan hisoblanadi: «Yetkazilgan» — tushgan, «Yangi / Jarayonda / Yo'lda» — kutilayotgan."
        actions={
          <>
            <Btn variant="ghost" onClick={() => refetch()} disabled={isFetching}>
              <RefreshCw size={15} className={isFetching ? "animate-spin" : ""} /> Yangilash
            </Btn>
            <Btn
              variant="dark"
              onClick={() =>
                downloadCSV("moliya.csv", [
                  ["Raqam", "Sana", "Status", "Summa", "Chegirma", "Jami"],
                  ...rows.map((o) => [o.number, fmtDateTime(orderTime(o)), STATUS_LABEL[statusOf(o)], money(o.subtotal), Math.max(0, money(o.subtotal) - money(o.total)), money(o.total)]),
                ])
              }
            >
              <Download size={15} /> Eksport
            </Btn>
          </>
        }
      />

      {error && <p className="mb-4 rounded-lg bg-[#fdecec] px-4 py-3 text-[13px] text-[#c0262d]">Buyurtmalarni yuklab bo&apos;lmadi: {formatApiError(error)}</p>}

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard dark label="Tushgan (yetkazilgan)" icon={<Banknote size={18} />} value={fmtShort(sums.received)} unit={CURRENCY} />
        <StatCard label="Kutilayotgan" icon={<Clock size={18} />} value={fmtShort(sums.expected)} unit={CURRENCY} foot="Hali yetkazilmagan buyurtmalar" />
        <StatCard label="Bekor / qaytarilgan" icon={<Undo2 size={18} />} value={fmtShort(sums.lost)} unit={CURRENCY} />
        <StatCard label="Berilgan chegirmalar" icon={<Wallet size={18} />} value={fmtShort(sums.discount)} unit={CURRENCY} foot="Summa − Jami (promokodlar)" />
      </div>

      <Card className="mt-4" title="Oylar kesimida" subtitle="Oxirgi 6 oy">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-left text-[13px]">
            <thead>
              <tr className="bg-[#f6f8fc] text-[11px] uppercase tracking-wide text-[#6b7a90]">
                {["Oy", "Buyurtmalar", "Tushgan", "Kutilayotgan", "Bekor"].map((h) => (
                  <th key={h} className="px-3 py-2.5 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {months.map((m) => (
                <tr key={m.label} className="border-b border-[#eef1f6] last:border-0">
                  <td className="px-3 py-2.5 font-semibold">{m.label}</td>
                  <td className="px-3 py-2.5">{m.count}</td>
                  <td className="px-3 py-2.5 font-semibold text-[#12713c]">{rub(m.received)}</td>
                  <td className="px-3 py-2.5 text-[#9a6200]">{rub(m.expected)}</td>
                  <td className="px-3 py-2.5 text-[#8794aa]">{rub(m.lost)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="mt-4" title="Operatsiyalar">
        <Tabs
          value={flt}
          onChange={(v) => {
            setFlt(v);
            setPage(1);
          }}
          tabs={[
            { id: "all", label: "Barchasi", count: orders.length },
            { id: "received", label: "Tushgan", count: orders.filter((o) => finOf(o.status) === "received").length },
            { id: "expected", label: "Kutilayotgan", count: orders.filter((o) => finOf(o.status) === "expected").length },
            { id: "lost", label: "Bekor", count: orders.filter((o) => finOf(o.status) === "lost").length, tone: "red" },
          ]}
        />
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-[13px]">
            <thead>
              <tr className="bg-[#f6f8fc] text-[11px] uppercase tracking-wide text-[#6b7a90]">
                {["Buyurtma", "Sana", "Status", "Summa", "Jami"].map((h) => (
                  <th key={h} className="px-3 py-3 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {slice.map((o) => (
                <tr key={o.id} className="border-b border-[#eef1f6] last:border-0">
                  <td className="px-3 py-3 font-semibold">#{o.number}</td>
                  <td className="px-3 py-3 text-[#4a5a73]">{fmtDateTime(orderTime(o))}</td>
                  <td className="px-3 py-3">
                    <OrderStatusBadge status={o.status} />
                  </td>
                  <td className="px-3 py-3 text-[#4a5a73]">{rub(money(o.subtotal))}</td>
                  <td className="px-3 py-3 font-semibold">{rub(money(o.total))}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {isLoading && <p className="py-10 text-center text-[13px] text-[#6b7a90]">Yuklanmoqda...</p>}
          {!isLoading && !error && rows.length === 0 && <Empty />}
        </div>
        <Pagination page={cur} pages={pages} onChange={setPage} info={<>Jami {rows.length} ta</>} />
        <p className="mt-3 text-[12px] text-[#8794aa]">
          To&apos;lov usuli va to&apos;lov holati backend&apos;da saqlanmaydi (/api/payments/ faqat to&apos;lov qilish uchun, ro&apos;yxat bermaydi).
        </p>
      </Card>
    </>
  );
}
