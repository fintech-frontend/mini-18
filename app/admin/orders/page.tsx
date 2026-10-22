"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { Download, Eye, Plus, RefreshCw, Search, Trash2 } from "lucide-react";
import { fmt, fmtDateTime, downloadCSV } from "@/lib/admin/format";
import { Btn, Card, Confirm, Empty, Field, inputCls, Modal, PageHeader, Pagination, Tabs, usePageSlice } from "@/components/admin/ui";
import { OrderStatusBadge } from "@/components/admin/shared";
import {
  useCreateOrderMutation,
  useDeleteOrderMutation,
  useGetAdminOrdersQuery,
  useUpdateOrderMutation,
  type ApiOrder,
} from "@/lib/api/adminApi";
import { CURRENCY, money, NEXT_ACTION, NEXT_STATUS, ORDER_STATUSES, orderTime, STATUS_LABEL, statusOf, type OrderStatus } from "@/lib/admin/orders";
import { getOrderDetails } from "@/lib/orderHistory";
import { formatApiError } from "@/lib/apiError";
import { toastApiError } from "@/lib/admin/notify";

const PAGE = 12;
type Filter = "all" | OrderStatus;
const rub = (n: number) => `${fmt(n, 2)} ${CURRENCY}`;

export default function OrdersPage() {
  return (
    <Suspense fallback={null}>
      <Orders />
    </Suspense>
  );
}

function Orders() {
  const sp = useSearchParams();
  const router = useRouter();
  const { data: orders = [], isLoading, isFetching, error, refetch } = useGetAdminOrdersQuery();
  const [updateOrder] = useUpdateOrderMutation();
  const [deleteOrder] = useDeleteOrderMutation();

  const [q, setQ] = useState(sp.get("q") ?? "");
  const [flt, setFlt] = useState<Filter>(((sp.get("status") as OrderStatus) || "all") as Filter);
  const [sort, setSort] = useState<"new" | "old" | "sum">("new");
  const [page, setPage] = useState(1);
  const [view, setView] = useState<ApiOrder | null>(null);
  const [del, setDel] = useState<ApiOrder | null>(null);
  const [creating, setCreating] = useState(false);

  // URL o'zgarsa (qidiruv / bildirishnoma) filtrlar yangilanadi
  const spq = sp.get("q");
  const sps = sp.get("status");
  const spn = sp.get("new");
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQ(spq ?? "");
    setFlt(sps && (ORDER_STATUSES as readonly string[]).includes(sps) ? (sps as OrderStatus) : "all");
    setPage(1);
  }, [spq, sps]);
  useEffect(() => {
    if (spn) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCreating(true);
      router.replace("/admin/orders");
    }
  }, [spn, router]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: orders.length };
    ORDER_STATUSES.forEach((s) => (c[s] = orders.filter((o) => statusOf(o) === s).length));
    return c;
  }, [orders]);

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase().replace(/^#/, "");
    let r = orders.filter((o) => (flt === "all" || statusOf(o) === flt) && (!s || o.number.toLowerCase().includes(s)));
    if (sort === "old") r = [...r].sort((a, b) => orderTime(a) - orderTime(b));
    else if (sort === "sum") r = [...r].sort((a, b) => money(b.total) - money(a.total));
    else r = [...r].sort((a, b) => orderTime(b) - orderTime(a));
    return r;
  }, [orders, q, flt, sort]);

  const { slice, pages, page: cur } = usePageSlice(rows, page, PAGE);

  const setStatus = async (o: ApiOrder, status: OrderStatus) => {
    try {
      await updateOrder({ id: o.id, body: { status } }).unwrap();
      toast.success(`#${o.number}: ${STATUS_LABEL[status]}`);
    } catch (err) {
      toastApiError(err);
    }
  };

  return (
    <>
      <PageHeader
        crumbs={["Asosiy", "Savdo", "Buyurtmalar"]}
        title="Buyurtmalar"
        subtitle="Saytdan tushgan barcha buyurtmalar (API: /api/orders/)."
        actions={
          <>
            <Btn variant="ghost" onClick={() => refetch()} disabled={isFetching}>
              <RefreshCw size={15} className={isFetching ? "animate-spin" : ""} /> Yangilash
            </Btn>
            <Btn
              variant="ghost"
              onClick={() =>
                downloadCSV("buyurtmalar.csv", [
                  ["Raqam", "Sana", "Status", "Mijoz ID", "Summa", "Jami"],
                  ...rows.map((o) => [o.number, fmtDateTime(orderTime(o)), STATUS_LABEL[statusOf(o)], o.user ?? "mehmon", money(o.subtotal), money(o.total)]),
                ])
              }
            >
              <Download size={15} /> Eksport
            </Btn>
            <Btn variant="dark" onClick={() => setCreating(true)}>
              <Plus size={16} /> Qo&apos;lda buyurtma
            </Btn>
          </>
        }
      />

      <Card>
        <div className="mb-4 grid gap-3 md:grid-cols-[1fr_200px]">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8794aa]" />
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              placeholder="Buyurtma raqami bo'yicha qidirish..."
              className={`${inputCls} pl-9`}
            />
          </div>
          <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className={inputCls}>
            <option value="new">Saralash: Yangilari</option>
            <option value="old">Eskilari</option>
            <option value="sum">Summa (katta)</option>
          </select>
        </div>

        <Tabs
          value={flt}
          onChange={(v) => {
            setFlt(v);
            setPage(1);
          }}
          tabs={[
            { id: "all" as Filter, label: "Barchasi", count: counts.all },
            ...ORDER_STATUSES.map((s) => ({ id: s as Filter, label: STATUS_LABEL[s], count: counts[s], tone: s === "pending" ? ("red" as const) : undefined })),
          ]}
        />

        {error && (
          <p className="mt-3 rounded-lg bg-[#fdecec] px-4 py-3 text-[13px] text-[#c0262d]">Buyurtmalarni yuklab bo&apos;lmadi: {formatApiError(error)}</p>
        )}

        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-[13px]">
            <thead>
              <tr className="bg-[#f6f8fc] text-[11px] uppercase tracking-wide text-[#6b7a90]">
                {["Raqam", "Sana", "Mijoz", "Summa", "Status", "Keyingi qadam", ""].map((h) => (
                  <th key={h} className="px-3 py-3 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {slice.map((o) => {
                const st = statusOf(o);
                const next = NEXT_STATUS[st];
                return (
                  <tr key={o.id} className="border-b border-[#eef1f6] last:border-0 hover:bg-[#fafbfe]">
                    <td className="px-3 py-3 font-semibold">#{o.number}</td>
                    <td className="px-3 py-3 text-[#4a5a73]">{fmtDateTime(orderTime(o))}</td>
                    <td className="px-3 py-3 text-[#4a5a73]">{o.user ? `Foydalanuvchi #${o.user}` : "Mehmon"}</td>
                    <td className="px-3 py-3 font-semibold">{rub(money(o.total))}</td>
                    <td className="px-3 py-3">
                      <OrderStatusBadge status={o.status} />
                    </td>
                    <td className="px-3 py-3">
                      {next ? (
                        <Btn size="sm" variant="primary" onClick={() => setStatus(o, next)}>
                          {NEXT_ACTION[st]}
                        </Btn>
                      ) : (
                        <span className="text-[12px] text-[#8794aa]">—</span>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => setView(o)} className="rounded-lg p-2 text-[#16335f] hover:bg-[#eef2fb]" aria-label="Ko'rish">
                          <Eye size={16} />
                        </button>
                        <button onClick={() => setDel(o)} className="rounded-lg p-2 text-[#c0262d] hover:bg-[#fdecec]" aria-label="O'chirish">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {isLoading && <p className="py-10 text-center text-[13px] text-[#6b7a90]">Yuklanmoqda...</p>}
          {!isLoading && !error && rows.length === 0 && <Empty text="Buyurtmalar topilmadi" />}
        </div>
        <Pagination
          page={cur}
          pages={pages}
          onChange={setPage}
          info={
            <>
              Ko&apos;rsatilmoqda: {rows.length ? (cur - 1) * PAGE + 1 : 0} - {Math.min(cur * PAGE, rows.length)} / jami {rows.length} ta
            </>
          }
        />
      </Card>

      {view && <OrderModal key={view.id} order={orders.find((o) => o.id === view.id) ?? view} onClose={() => setView(null)} onStatus={setStatus} />}
      {creating && <CreateOrderModal onClose={() => setCreating(false)} />}
      <Confirm
        open={!!del}
        title="Buyurtmani o'chirish"
        text={`#${del?.number} buyurtmasi butunlay o'chiriladi. Bu amalni qaytarib bo'lmaydi.`}
        onClose={() => setDel(null)}
        onYes={async () => {
          if (!del) return;
          try {
            await deleteOrder(del.id).unwrap();
            toast.success("Buyurtma o'chirildi");
          } catch (err) {
            toastApiError(err);
          }
        }}
      />
    </>
  );
}

function OrderModal({
  order,
  onClose,
  onStatus,
}: {
  order: ApiOrder;
  onClose: () => void;
  onStatus: (o: ApiOrder, s: OrderStatus) => void;
}) {
  const st = statusOf(order);
  // Buyurtma tarkibi API'da saqlanmaydi — faqat shu brauzerda berilgan bo'lsa ko'rinadi
  const [details] = useState(() => getOrderDetails(order.number));

  return (
    <Modal
      open
      wide
      onClose={onClose}
      title={`Buyurtma #${order.number}`}
      subtitle={fmtDateTime(orderTime(order))}
      footer={
        <Btn variant="soft" onClick={onClose}>
          Yopish
        </Btn>
      }
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <Info label="Status">
          <OrderStatusBadge status={order.status} />
        </Info>
        <Info label="Mijoz">{order.user ? `Foydalanuvchi #${order.user}` : "Mehmon (ro'yxatdan o'tmagan)"}</Info>
        <Info label="ID">{order.id}</Info>
        <Info label="Summa (chegirmasiz)">{rub(money(order.subtotal))}</Info>
        <Info label="Jami">
          <b>{rub(money(order.total))}</b>
        </Info>
        <Info label="Chegirma">{rub(Math.max(0, money(order.subtotal) - money(order.total)))}</Info>
      </div>

      <div className="mt-5">
        <div className="mb-2 text-[12px] font-medium text-[#4a5a73]">Statusni o&apos;zgartirish</div>
        <div className="flex flex-wrap gap-2">
          {ORDER_STATUSES.map((s) => (
            <button
              key={s}
              disabled={s === st}
              onClick={() => onStatus(order, s)}
              className={`rounded-lg px-3 py-2 text-[12px] font-semibold transition ${
                s === st ? "bg-[#06214a] text-white" : "bg-[#eef2fb] text-[#16335f] hover:bg-[#e1e8f7]"
              }`}
            >
              {STATUS_LABEL[s]}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 text-[12px] font-medium text-[#4a5a73]">Buyurtma tarkibi</div>
        {details ? (
          <>
            <ul className="divide-y divide-[#eef1f6] rounded-lg border border-[#eef1f6]">
              {details.items.map((i) => (
                <li key={i.id} className="flex items-center gap-3 px-3 py-2 text-[13px]">
                  <span className="min-w-0 flex-1 truncate">{i.title}</span>
                  <span className="text-[#8794aa]">
                    {i.quantity} × {fmt(i.price)}
                  </span>
                  <b>{rub(i.price * i.quantity)}</b>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-[12px] text-[#6b7a90]">
              {details.customer.firstName} {details.customer.lastName} • {details.customer.phone} • {details.customer.email} • {details.delivery}
            </p>
          </>
        ) : (
          <p className="rounded-lg bg-[#fff3d9] px-3 py-2.5 text-[12px] text-[#9a6200]">
            Backend buyurtma tarkibini (mahsulotlar, mijoz ismi, telefon, manzil) saqlamaydi — /api/orders/ faqat raqam, status va summani qaytaradi.
            To&apos;liq ma&apos;lumot uchun backend&apos;ga order items va kontakt maydonlarini qo&apos;shish kerak.
          </p>
        )}
      </div>
    </Modal>
  );
}

function Info({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-[#f6f8fc] px-3 py-2.5">
      <div className="text-[11px] uppercase tracking-wide text-[#8794aa]">{label}</div>
      <div className="mt-1 text-[13px]">{children}</div>
    </div>
  );
}

function CreateOrderModal({ onClose }: { onClose: () => void }) {
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const [number, setNumber] = useState(() => String(Date.now()).slice(-8));
  const [subtotal, setSubtotal] = useState("");
  const [total, setTotal] = useState("");
  const [status, setStatus] = useState<OrderStatus>("pending");

  const save = async () => {
    const sub = money(subtotal.replace(",", "."));
    const tot = total.trim() ? money(total.replace(",", ".")) : sub;
    if (!number.trim()) return toast.error("Buyurtma raqamini kiriting");
    if (sub <= 0) return toast.error("Summani kiriting");
    try {
      await createOrder({ number: number.trim(), status, subtotal: sub.toFixed(2), total: tot.toFixed(2) }).unwrap();
      toast.success("Buyurtma qo'shildi");
      onClose();
    } catch (err) {
      toastApiError(err);
    }
  };

  return (
    <Modal
      open
      onClose={onClose}
      title="Qo'lda buyurtma qo'shish"
      subtitle="Telefon yoki do'kondan kelgan buyurtmani ro'yxatga kiritish"
      footer={
        <>
          <Btn variant="soft" onClick={onClose}>
            Bekor qilish
          </Btn>
          <Btn variant="dark" onClick={save} disabled={isLoading}>
            {isLoading ? "Saqlanmoqda..." : "Saqlash"}
          </Btn>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Buyurtma raqami *">
            <input className={inputCls} value={number} onChange={(e) => setNumber(e.target.value)} />
          </Field>
          <Field label="Status">
            <select className={inputCls} value={status} onChange={(e) => setStatus(e.target.value as OrderStatus)}>
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABEL[s]}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={`Summa (${CURRENCY}) *`}>
            <input className={inputCls} inputMode="decimal" value={subtotal} onChange={(e) => setSubtotal(e.target.value)} placeholder="0" />
          </Field>
          <Field label={`Jami, chegirma bilan (${CURRENCY})`} hint="Bo'sh qolsa summaga teng">
            <input className={inputCls} inputMode="decimal" value={total} onChange={(e) => setTotal(e.target.value)} placeholder="—" />
          </Field>
        </div>
      </div>
    </Modal>
  );
}
