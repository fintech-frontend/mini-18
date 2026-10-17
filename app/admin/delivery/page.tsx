"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { CheckCircle2, MapPin, PackageCheck, Truck } from "lucide-react";
import { actions, orderTotal, useDB } from "@/lib/admin/db";
import { fmt, fmtDateTime } from "@/lib/admin/format";
import { OrderStatusBadge } from "@/components/admin/shared";
import { Btn, Card, Empty, PageHeader, StatCard, Tabs } from "@/components/admin/ui";

type Tab = "new" | "processing" | "shipping";
const NEXT = { new: "processing", processing: "shipping", shipping: "delivered" } as const;
const LABEL = { new: "Jarayonga olish", processing: "Yuklab jo'natish", shipping: "Yetkazildi" } as const;

export default function DeliveryPage() {
  const db = useDB();
  const [tab, setTab] = useState<Tab>("shipping");
  const by = (s: Tab) => db.orders.filter((o) => o.status === s);
  const list = by(tab);
  const delivered = db.orders.filter((o) => o.status === "delivered");

  return (
    <>
      <PageHeader crumbs={["Logistika", "Yetkazib berish"]} title="Yetkazib berish boshqaruvi" subtitle="Faol yetkazmalar va yuk mashinalari holati" />
      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Yo'lda" icon={<Truck size={18} />} value={String(by("shipping").length)} unit="ta" />
        <StatCard label="Tayyorlanmoqda" icon={<PackageCheck size={18} />} value={String(by("processing").length + by("new").length)} unit="ta" />
        <StatCard label="Yetkazilgan" icon={<CheckCircle2 size={18} />} value={fmt(delivered.length)} unit="ta" />
      </div>
      <Card className="mt-4">
        <Tabs
          value={tab}
          onChange={setTab}
          tabs={[
            { id: "shipping", label: "Yo'lda", count: by("shipping").length },
            { id: "processing", label: "Jarayonda", count: by("processing").length },
            { id: "new", label: "Yangi", count: by("new").length, tone: "red" },
          ]}
        />
        <div className="mt-4 space-y-2.5">
          {list.length === 0 && <Empty text="Bu bo'limda yetkazmalar yo'q" />}
          {list.map((o) => (
            <div key={o.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#e8edf5] p-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <b className="text-[15px]">#{o.number}</b>
                  <OrderStatusBadge status={o.status} />
                </div>
                <div className="mt-1 text-[13px] font-medium">{o.customerName}</div>
                <div className="mt-0.5 flex items-center gap-1.5 text-[12px] text-[#6b7a90]">
                  <MapPin size={12} /> {o.address} • {o.phone} • {fmtDateTime(o.createdAt)}
                </div>
              </div>
              <div className="text-right">
                <div className="mb-2 text-[16px] font-bold">{fmt(orderTotal(o))} UZS</div>
                <Btn
                  size="sm"
                  variant="primary"
                  onClick={() => {
                    actions.setOrderStatus(o.id, NEXT[o.status as Tab]);
                    toast.success(`#${o.number}: ${LABEL[o.status as Tab]}`);
                  }}
                >
                  {LABEL[o.status as Tab]}
                </Btn>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
