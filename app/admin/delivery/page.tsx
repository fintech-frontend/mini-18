"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { CheckCircle2, PackageOpen, RefreshCw, Truck } from "lucide-react";
import { fmt, fmtDateTime } from "@/lib/admin/format";
import { Btn, Card, Empty, PageHeader, StatCard, Tabs } from "@/components/admin/ui";
import { OrderStatusBadge } from "@/components/admin/shared";
import { useGetAdminOrdersQuery, useUpdateOrderMutation, type ApiOrder } from "@/lib/api/adminApi";
import { CURRENCY, money, NEXT_ACTION, NEXT_STATUS, orderTime, STATUS_LABEL, statusOf, type OrderStatus } from "@/lib/admin/orders";
import { formatApiError } from "@/lib/apiError";
import { toastApiError } from "@/lib/admin/notify";

type Lane = "shipping" | "processing" | "pending";

export default function DeliveryPage() {
  const { data: orders = [], isLoading, isFetching, error, refetch } = useGetAdminOrdersQuery();
  const [updateOrder] = useUpdateOrderMutation();
  const [tabSel, setTab] = useState<Lane | null>(null);
  const [busy, setBusy] = useState<number | null>(null);

  const by = (s: OrderStatus) => orders.filter((o) => statusOf(o) === s);
  const lanes: Record<Lane, ApiOrder[]> = { shipping: by("shipping"), processing: by("processing"), pending: by("pending") };
  const delivered = by("delivered");
  // Tanlanmagan bo'lsa — buyurtmasi bor birinchi bosqich ochiladi
  const tab: Lane = tabSel ?? (lanes.shipping.length ? "shipping" : lanes.processing.length ? "processing" : "pending");

  const advance = async (o: ApiOrder) => {
    const next = NEXT_STATUS[statusOf(o)];
    if (!next) return;
    setBusy(o.id);
    try {
      await updateOrder({ id: o.id, body: { status: next } }).unwrap();
      toast.success(`#${o.number}: ${STATUS_LABEL[next]}`);
    } catch (err) {
      toastApiError(err);
    } finally {
      setBusy(null);
    }
  };

  const list = lanes[tab];

  return (
    <>
      <PageHeader
        crumbs={["Logistika", "Yetkazib berish"]}
        title="Yetkazib berish boshqaruvi"
        subtitle="Buyurtmalar statusi bo'yicha: Yangi → Jarayonda → Yo'lda → Yetkazilgan"
        actions={
          <Btn variant="ghost" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw size={15} className={isFetching ? "animate-spin" : ""} /> Yangilash
          </Btn>
        }
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard label="Yo'lda" icon={<Truck size={18} />} value={fmt(lanes.shipping.length)} unit="ta" />
        <StatCard label="Tayyorlanmoqda" icon={<PackageOpen size={18} />} value={fmt(lanes.processing.length + lanes.pending.length)} unit="ta" foot={`Yangi: ${lanes.pending.length} • Jarayonda: ${lanes.processing.length}`} />
        <StatCard label="Yetkazilgan" icon={<CheckCircle2 size={18} />} value={fmt(delivered.length)} unit="ta" />
      </div>

      <Card className="mt-4">
        <Tabs
          value={tab}
          onChange={setTab}
          tabs={[
            { id: "shipping", label: "Yo'lda", count: lanes.shipping.length },
            { id: "processing", label: "Jarayonda", count: lanes.processing.length },
            { id: "pending", label: "Yangi", count: lanes.pending.length, tone: "red" },
          ]}
        />

        {error && <p className="mt-3 rounded-lg bg-[#fdecec] px-4 py-3 text-[13px] text-[#c0262d]">Buyurtmalarni yuklab bo&apos;lmadi: {formatApiError(error)}</p>}

        <div className="mt-4 space-y-3">
          {list.map((o) => {
            const st = statusOf(o);
            return (
              <div key={o.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#eef1f6] p-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link href={`/admin/orders?q=${encodeURIComponent(o.number)}`} className="text-[16px] font-bold hover:text-[#186FD4]">
                      #{o.number}
                    </Link>
                    <OrderStatusBadge status={o.status} />
                  </div>
                  <div className="mt-1 text-[12px] text-[#6b7a90]">
                    {o.user ? `Foydalanuvchi #${o.user}` : "Mehmon"} • {fmtDateTime(orderTime(o))}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[16px] font-bold">
                    {fmt(money(o.total), 2)} {CURRENCY}
                  </span>
                  <Btn variant="primary" onClick={() => advance(o)} disabled={busy === o.id}>
                    {busy === o.id ? "..." : NEXT_ACTION[st]}
                  </Btn>
                </div>
              </div>
            );
          })}
          {isLoading && <p className="py-10 text-center text-[13px] text-[#6b7a90]">Yuklanmoqda...</p>}
          {!isLoading && !error && list.length === 0 && <Empty text="Bu bosqichda buyurtma yo'q" />}
        </div>
        <p className="mt-4 text-[12px] text-[#8794aa]">
          Manzil, telefon va kuryer ma&apos;lumotlari backend&apos;da saqlanmaydi — /api/orders/ faqat raqam, status va summani qaytaradi.
        </p>
      </Card>
    </>
  );
}
