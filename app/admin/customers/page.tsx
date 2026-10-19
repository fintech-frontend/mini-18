"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Download, RefreshCw, Search, ShoppingBag, UserCheck, UserX, Users } from "lucide-react";
import { fmt, fmtShort, fmtDateTime, downloadCSV } from "@/lib/admin/format";
import { Btn, Card, Empty, inputCls, PageHeader, StatCard } from "@/components/admin/ui";
import { ApiMissing, Avatar } from "@/components/admin/shared";
import { useGetAdminOrdersQuery, useGetAdminReviewsQuery } from "@/lib/api/adminApi";
import { CURRENCY, isSold, money, orderTime } from "@/lib/admin/orders";
import { formatApiError } from "@/lib/apiError";

type Buyer = {
  key: string;
  userId: number | null;
  name: string;
  orders: number;
  turnover: number;
  lastAt: number;
  lastNumber: string;
};

export default function CustomersPage() {
  const { data: orders = [], isLoading, isFetching, error, refetch } = useGetAdminOrdersQuery();
  const { data: reviews = [] } = useGetAdminReviewsQuery();
  const [q, setQ] = useState("");

  const buyers = useMemo(() => {
    // Sharhlardan foydalanuvchi ismlari (API'da foydalanuvchilar ro'yxati yo'q)
    const names = new Map<number, string>();
    reviews.forEach((r) => {
      if (r.user && (r.user_name || r.user_email)) names.set(r.user, r.user_name || r.user_email || "");
    });

    const map = new Map<string, Buyer>();
    orders.forEach((o) => {
      const key = o.user ? `u${o.user}` : "guest";
      const b =
        map.get(key) ??
        ({
          key,
          userId: o.user,
          name: o.user ? names.get(o.user) || `Foydalanuvchi #${o.user}` : "Mehmonlar (ro'yxatdan o'tmagan)",
          orders: 0,
          turnover: 0,
          lastAt: 0,
          lastNumber: "",
        } as Buyer);
      b.orders += 1;
      if (isSold(o)) b.turnover += money(o.total);
      if (orderTime(o) > b.lastAt) {
        b.lastAt = orderTime(o);
        b.lastNumber = o.number;
      }
      map.set(key, b);
    });
    return [...map.values()].sort((a, b) => b.turnover - a.turnover);
  }, [orders, reviews]);

  const registered = buyers.filter((b) => b.userId);
  const guest = buyers.find((b) => !b.userId);
  const rows = buyers.filter((b) => !q.trim() || b.name.toLowerCase().includes(q.trim().toLowerCase()));

  return (
    <>
      <PageHeader
        crumbs={["Asosiy", "Mijozlar"]}
        title="Mijozlar"
        subtitle="Xaridorlar buyurtmalardan aniqlanadi (buyurtmadagi foydalanuvchi ID bo'yicha)."
        actions={
          <>
            <Btn variant="ghost" onClick={() => refetch()} disabled={isFetching}>
              <RefreshCw size={15} className={isFetching ? "animate-spin" : ""} /> Yangilash
            </Btn>
            <Btn
              variant="dark"
              onClick={() =>
                downloadCSV("xaridorlar.csv", [
                  ["Xaridor", "Foydalanuvchi ID", "Buyurtmalar", "Aylanma", "Oxirgi buyurtma"],
                  ...rows.map((b) => [b.name, b.userId ?? "", b.orders, b.turnover, b.lastAt ? fmtDateTime(b.lastAt) : ""]),
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
        <StatCard label="Ro'yxatdan o'tgan xaridorlar" icon={<UserCheck size={18} />} value={fmt(registered.length)} unit="ta" />
        <StatCard label="Mehmon buyurtmalari" icon={<UserX size={18} />} value={fmt(guest?.orders ?? 0)} unit="ta" foot="Akkauntsiz berilgan" />
        <StatCard label="Jami buyurtmalar" icon={<ShoppingBag size={18} />} value={fmt(orders.length)} unit="ta" />
        <StatCard dark label="Eng katta aylanma" icon={<Users size={18} />} value={fmtShort(buyers[0]?.turnover ?? 0)} unit={CURRENCY} foot={buyers[0]?.name} />
      </div>

      <Card className="mt-4" title="Xaridorlar">
        <div className="relative mb-4 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8794aa]" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ism yoki ID bo'yicha qidirish..." className={`${inputCls} pl-9`} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-[13px]">
            <thead>
              <tr className="bg-[#f6f8fc] text-[11px] uppercase tracking-wide text-[#6b7a90]">
                {["Xaridor", "Buyurtmalar", "Aylanma", "Oxirgi buyurtma"].map((h) => (
                  <th key={h} className="px-3 py-3 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((b) => (
                <tr key={b.key} className="border-b border-[#eef1f6] last:border-0 hover:bg-[#fafbfe]">
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={b.name} className={b.userId ? "" : "!bg-[#aab3c2]"} />
                      <div>
                        <div className="font-semibold">{b.name}</div>
                        {b.userId && <div className="text-[11px] text-[#8794aa]">ID: {b.userId}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3">{b.orders}</td>
                  <td className="px-3 py-3 font-semibold">
                    {fmt(b.turnover, 2)} {CURRENCY}
                  </td>
                  <td className="px-3 py-3 text-[#4a5a73]">
                    {b.lastNumber && (
                      <Link href={`/admin/orders?q=${encodeURIComponent(b.lastNumber)}`} className="hover:text-[#186FD4]">
                        #{b.lastNumber}
                      </Link>
                    )}{" "}
                    <span className="text-[11px] text-[#8794aa]">{b.lastAt ? fmtDateTime(b.lastAt) : ""}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {isLoading && <p className="py-10 text-center text-[13px] text-[#6b7a90]">Yuklanmoqda...</p>}
          {!isLoading && !error && rows.length === 0 && <Empty text="Xaridorlar yo'q" />}
        </div>
      </Card>

      <Card className="mt-4" title="Barcha ro'yxatdan o'tgan foydalanuvchilar">
        <ApiMissing
          title="Foydalanuvchilar ro'yxati uchun API yo'q"
          text="Backend faqat joriy foydalanuvchining profilini beradi (/api/auth/profile/). Barcha mijozlarni ism, telefon va email bilan ko'rish uchun admin endpoint kerak."
          endpoint="GET /api/users/  (faqat admin uchun)"
        />
      </Card>
    </>
  );
}
