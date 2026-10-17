"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import {
  Building2,
  CheckCircle2,
  Clock,
  Download,
  ListChecks,
  MessageSquare,
  Plus,
  Printer,
  Search,
  Send,
  Trash2,
  Truck,
  XCircle,
  ShieldCheck,
} from "lucide-react";
import {
  actions,
  DAY,
  orderSubtotal,
  orderTotal,
  useDB,
  type Channel,
  type Order,
  type OrderItem,
  type OrderStatus,
  type PayMethod,
  useNow,
} from "@/lib/admin/db";
import { dayLabel, downloadCSV, fmt, fmtDateTime, fmtTime } from "@/lib/admin/format";
import { Badge, Btn, Card, Empty, Field, inputCls, Modal, PageHeader, Pagination, Tabs, usePageSlice } from "@/components/admin/ui";
import { OrderStatusBadge, STATUS_LABEL } from "@/components/admin/shared";
import { printDoc } from "@/lib/admin/print";

const PAGE = 6;
type Tab = "all" | OrderStatus;

export default function OrdersPage() {
  return (
    <Suspense fallback={null}>
      <Orders />
    </Suspense>
  );
}

function Orders() {
  const db = useDB();
  const sp = useSearchParams();
  const router = useRouter();
  const now = useNow();
  const [tab, setTab] = useState<Tab>("all");
  const [q, setQ] = useState(sp.get("q") ?? "");
  const [when, setWhen] = useState("all");
  const [pay, setPay] = useState("all");
  const [channel, setChannel] = useState("all");
  const [page, setPage] = useState(1);
  const [sel, setSel] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const spq = sp.get("q");
  const spn = sp.get("new");
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQ(spq ?? "");
    setPage(1);
    setTab("all");
  }, [spq]);
  useEffect(() => {
    if (spn) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCreating(true);
      router.replace("/admin/orders");
    }
  }, [spn, router]);

  const count = (s: OrderStatus) => db.orders.filter((o) => o.status === s).length;

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    return db.orders.filter((o) => {
      if (tab !== "all" && o.status !== tab) return false;
      if (s && !(o.number + o.customerName + o.phone + o.inn).toLowerCase().includes(s)) return false;
      if (when === "today" && o.createdAt < start.getTime()) return false;
      if (when === "7" && o.createdAt < now - 7 * DAY) return false;
      if (when === "30" && o.createdAt < now - 30 * DAY) return false;
      if (pay === "paid" && !o.paid) return false;
      if (pay === "unpaid" && o.paid) return false;
      if (channel !== "all" && o.channel !== channel) return false;
      return true;
    });
  }, [db.orders, tab, q, when, pay, channel, now]);

  const { slice, pages, page: cur } = usePageSlice(rows, page, PAGE);
  const selected = db.orders.find((o) => o.id === sel) ?? slice[0] ?? null;

  const reset = () => {
    setQ("");
    setWhen("all");
    setPay("all");
    setChannel("all");
    setTab("all");
    setPage(1);
  };

  return (
    <>
      <PageHeader
        crumbs={["Sotuvlar", "Buyurtmalar ro'yxati"]}
        title="Buyurtmalar boshqaruvi (Sotuvlar)"
        badge={
          <span className="rounded-md bg-[#eef2fb] px-3 py-1.5 text-[12px] text-[#4a5a73]">Real-vaqt sinxronizatsiya: Faol</span>
        }
        actions={
          <>
            <Btn
              variant="ghost"
              onClick={() =>
                downloadCSV("buyurtmalar.csv", [
                  ["Buyurtma", "Mijoz", "INN", "Kanal", "Sana", "Summa", "Holat", "To'lov"],
                  ...rows.map((o) => [o.number, o.customerName, o.inn, o.channel, fmtDateTime(o.createdAt), orderTotal(o), STATUS_LABEL[o.status], o.paid ? "To'langan" : "Kutilmoqda"]),
                ])
              }
            >
              <Download size={15} /> Eksport (.XLSX)
            </Btn>
            <Btn variant="ghost" onClick={() => window.print()}>
              <Printer size={15} /> Hisobot chop etish
            </Btn>
            <Btn variant="dark" onClick={() => setCreating(true)}>
              <Plus size={16} /> Yangi buyurtma yaratish
            </Btn>
          </>
        }
      />

      <Card className="!p-3">
        <Tabs
          value={tab}
          onChange={(v) => {
            setTab(v);
            setPage(1);
          }}
          tabs={[
            { id: "all", label: "Barchasi", count: db.orders.length },
            { id: "new", label: "Yangi", count: count("new"), tone: "red" },
            { id: "processing", label: "Jarayonda", count: count("processing") },
            { id: "shipping", label: "Yo'lda / Yuklangan", count: count("shipping") },
            { id: "delivered", label: "Yetkazilgan", count: count("delivered") },
            { id: "cancelled", label: "Bekor qilingan", count: count("cancelled") },
            { id: "returned", label: "Qaytarilgan", count: count("returned") },
          ]}
        />
      </Card>

      <Card className="mt-3 !p-3">
        <div className="grid gap-2.5 md:grid-cols-[1fr_170px_170px_190px_auto]">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8794aa]" />
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              placeholder="Buyurtma #, Mijoz ismi, telefon, INN bo'yicha..."
              className={`${inputCls} pl-9`}
            />
          </div>
          <select value={when} onChange={(e) => { setWhen(e.target.value); setPage(1); }} className={inputCls}>
            <option value="all">Barcha sanalar</option>
            <option value="today">Bugun</option>
            <option value="7">Oxirgi 7 kun</option>
            <option value="30">Oxirgi 30 kun</option>
          </select>
          <select value={pay} onChange={(e) => { setPay(e.target.value); setPage(1); }} className={inputCls}>
            <option value="all">To&apos;lov: Barchasi</option>
            <option value="paid">To&apos;langan</option>
            <option value="unpaid">Kutilmoqda</option>
          </select>
          <select value={channel} onChange={(e) => { setChannel(e.target.value); setPage(1); }} className={inputCls}>
            <option value="all">Barcha kanallar</option>
            <option>B2B Ulgurji</option>
            <option>Chakana savdo</option>
            <option>Telegram Bot</option>
          </select>
          <Btn variant="soft" onClick={reset} title="Filtrlarni tozalash">
            <XCircle size={16} /> Tozalash
          </Btn>
        </div>
      </Card>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_480px]">
        <div>
          <div className="space-y-2.5">
            {slice.length === 0 && (
              <Card>
                <Empty text="Buyurtmalar topilmadi" />
              </Card>
            )}
            {slice.map((o) => {
              const on = selected?.id === o.id;
              return (
                <button
                  key={o.id}
                  onClick={() => setSel(o.id)}
                  className={`block w-full rounded-xl bg-white p-4 text-left shadow-[0_1px_3px_rgba(16,34,74,0.06)] transition hover:shadow-md ${
                    on ? "border-l-4 border-[#186FD4]" : "border-l-4 border-transparent"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[17px] font-bold">#{o.number}</span>
                        <Badge tone={o.channel === "B2B Ulgurji" ? "blue" : "gray"}>{o.channel}</Badge>
                        <span className="flex items-center gap-1 text-[11px] text-[#8794aa]">
                          <Clock size={12} /> {fmtTime(o.createdAt)}, {dayLabel(o.createdAt).split(",")[0]}
                        </span>
                      </div>
                      <div className="mt-1.5 truncate text-[14px] font-semibold">
                        {o.customerName}{" "}
                        <span className="font-normal text-[#8794aa]">
                          • {o.inn !== "—" ? `INN: ${o.inn}` : o.phone}
                        </span>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="text-[18px] font-bold">{fmt(orderTotal(o))} UZS</div>
                      <div className="text-[10px] uppercase tracking-wide text-[#8794aa]">Umumiy qiymat</div>
                    </div>
                  </div>
                  <div className="mt-3 rounded-lg bg-[#f6f8fc] px-3 py-2 text-[12px] text-[#4a5a73]">
                    <div className="flex items-center justify-between gap-3">
                      <span className="truncate">
                        {o.items.map((i) => `${i.name.split(" ").slice(0, 2).join(" ")} (${fmt(i.qty, 1)} ${i.unit})`).join(", ")}
                      </span>
                      <span className="shrink-0 font-semibold">{o.items.length} pozitsiya</span>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <OrderStatusBadge status={o.status} />
                      {o.paid ? <Badge tone="green">To&apos;langan ({o.payMethod})</Badge> : o.status !== "cancelled" && <Badge tone="amber">To&apos;lov kutilmoqda</Badge>}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          <Pagination
            page={cur}
            pages={pages}
            onChange={setPage}
            info={<>{fmt(db.orders.length)} ta buyurtmadan {rows.length ? (cur - 1) * PAGE + 1 : 0}-{Math.min(cur * PAGE, rows.length)} ko&apos;rsatilmoqda</>}
          />
        </div>

        {selected ? <Detail key={selected.id} order={selected} /> : <Card><Empty text="Buyurtma tanlang" /></Card>}
      </div>

      {creating && <NewOrder onClose={() => setCreating(false)} onCreated={(id) => { setSel(id); setTab("all"); setQ(""); setPage(1); }} />}
    </>
  );
}

const NEXT: Partial<Record<OrderStatus, { to: OrderStatus; label: string }>> = {
  new: { to: "processing", label: "Jarayonga olish" },
  processing: { to: "shipping", label: "Yuklab jo'natish" },
  shipping: { to: "delivered", label: "Yetkazildi deb belgilash" },
};

function Detail({ order: o }: { order: Order }) {
  const [note, setNote] = useState("");
  const [cancel, setCancel] = useState(false);
  const done = o.status === "delivered" || o.status === "cancelled" || o.status === "returned";
  const next = NEXT[o.status];
  const sub = orderSubtotal(o);

  const invoice = () =>
    printDoc(
      `Hisob-faktura #${o.number}`,
      `<h2>Hisob-faktura #${o.number}</h2><p>Sana: ${fmtDateTime(o.createdAt)}</p><p><b>Mijoz:</b> ${o.customerName} (INN: ${o.inn})<br/><b>Manzil:</b> ${o.address}</p>
      <table><tr><th>Tovar</th><th>Miqdor</th><th>Narx</th><th>Summa</th></tr>${o.items
        .map((i) => `<tr><td>${i.name}</td><td>${fmt(i.qty, 1)} ${i.unit}</td><td>${fmt(i.price)}</td><td>${fmt(i.qty * i.price)}</td></tr>`)
        .join("")}</table>
      <p>Oraliq summa: ${fmt(sub)} UZS<br/>Chegirma: -${fmt(o.discount)} UZS<br/>Yetkazib berish: ${fmt(o.delivery)} UZS<br/><b>JAMI: ${fmt(orderTotal(o))} UZS</b> (QQS 12% ichida)</p>`
    );
  const ttn = () =>
    printDoc(
      `TTN #${o.number}`,
      `<h2>Yuk xati (TTN) #${o.number}-A</h2><p>Sana: ${fmtDateTime(Date.now())}</p><p><b>Qabul qiluvchi:</b> ${o.customerName}<br/><b>Manzil:</b> ${o.address}<br/><b>Telefon:</b> ${o.phone}</p>
      <table><tr><th>Tovar</th><th>Miqdor</th></tr>${o.items.map((i) => `<tr><td>${i.name}</td><td>${fmt(i.qty, 1)} ${i.unit}</td></tr>`).join("")}</table>
      <p>Haydovchi imzosi: ____________ &nbsp;&nbsp; Qabul qildi: ____________</p>`
    );

  return (
    <Card className="h-fit xl:sticky xl:top-[84px]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-[21px] font-bold">#{o.number}</h2>
            <OrderStatusBadge status={o.status} />
          </div>
          <div className="mt-1 text-[12px] text-[#6b7a90]">Yaratilgan vaqti: {fmtDateTime(o.createdAt)} • Operator: Dilshod Ergashev</div>
        </div>
        <Btn variant="soft" size="sm" onClick={invoice} aria-label="Chop etish">
          <Printer size={15} />
        </Btn>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {next ? (
          <button
            onClick={() => {
              actions.setOrderStatus(o.id, next.to);
              toast.success(`${next.label}: bajarildi`);
            }}
            className="flex flex-col items-center gap-1.5 rounded-lg bg-[#186FD4] p-2.5 text-center text-[11px] font-semibold text-white hover:bg-[#135bb0]"
          >
            <CheckCircle2 size={20} /> {next.label}
          </button>
        ) : (
          <div className="flex flex-col items-center gap-1.5 rounded-lg bg-[#eef2fb] p-2.5 text-center text-[11px] font-semibold text-[#6b7a90]">
            <CheckCircle2 size={20} /> Yakunlangan
          </div>
        )}
        <button onClick={invoice} className="flex flex-col items-center gap-1.5 rounded-lg bg-[#eef2fb] p-2.5 text-center text-[11px] font-semibold text-[#16335f] hover:bg-[#e1e8f7]">
          <ListChecks size={20} /> Hisob-faktura chop etish
        </button>
        <button onClick={ttn} className="flex flex-col items-center gap-1.5 rounded-lg bg-[#eef2fb] p-2.5 text-center text-[11px] font-semibold text-[#16335f] hover:bg-[#e1e8f7]">
          <Truck size={20} /> Yuk xati (TTN) generatsiya
        </button>
        <button
          disabled={done}
          onClick={() => setCancel(true)}
          className="flex flex-col items-center gap-1.5 rounded-lg bg-[#fdecec] p-2.5 text-center text-[11px] font-semibold text-[#c0262d] hover:bg-[#fbdada] disabled:opacity-40"
        >
          <XCircle size={20} /> Bekor qilish
        </button>
      </div>
      {o.status === "delivered" && (
        <Btn variant="ghost" size="sm" className="mt-2 w-full" onClick={() => actions.setOrderStatus(o.id, "returned")}>
          Mijoz qaytardi — qaytarilgan deb belgilash
        </Btn>
      )}
      {!o.paid && o.status !== "cancelled" && (
        <Btn
          variant="soft"
          size="sm"
          className="mt-2 w-full"
          onClick={() => {
            actions.markOrderPaid(o.id);
            toast.success("To'lov tasdiqlandi");
          }}
        >
          <ShieldCheck size={15} /> To&apos;lovni tasdiqlash ({o.payMethod})
        </Btn>
      )}

      <Section title="Yetkazib berish holati va xronologiya" right={<span className="text-[11px] font-semibold text-[#186FD4]">Bosqich: {Math.min(o.timeline.length, 5)}/5</span>}>
        <ol className="space-y-3">
          {o.timeline.map((t, i) => (
            <li key={i} className="flex gap-3">
              <span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-[#186FD4]" />
              <div className="text-[12px]">
                <b>{fmtTime(t.at)}</b> — {t.text}
                <div className="text-[11px] text-[#8794aa]">{fmtDateTime(t.at)}</div>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Mijoz va obyekt ma'lumotlari" icon={<Building2 size={15} className="text-[#186FD4]" />}>
        <div className="grid grid-cols-2 gap-3 rounded-lg bg-[#f6f8fc] p-3 text-[12px]">
          <Info l="Kompaniya nomi" v={o.customerName} />
          <Info l="Soliq to'lovchi INN" v={o.inn} />
          <Info l="Telefon raqam" v={o.phone} accent />
          <Info l="Yetkazib berish manzili" v={o.address} />
        </div>
      </Section>

      <Section title="Mahsulotlar tarkibi" right={<span className="text-[11px] text-[#6b7a90]">{o.items.length} ta pozitsiya</span>}>
        <div className="space-y-2 rounded-lg bg-[#f6f8fc] p-3">
          {o.items.map((i) => (
            <div key={i.productId} className="flex items-center justify-between gap-3 text-[12px]">
              <div className="min-w-0">
                <div className="truncate font-semibold">{i.name}</div>
                <div className="text-[#8794aa]">
                  {fmt(i.qty, 1)} {i.unit} • {fmt(i.price)} UZS / {i.unit}
                </div>
              </div>
              <b className="shrink-0 text-[13px]">{fmt(i.qty * i.price)} UZS</b>
            </div>
          ))}
          {o.delivery > 0 && (
            <div className="flex justify-between border-t border-[#e4e9f3] pt-2 text-[12px]">
              <span className="font-semibold">Yetkazib berish xizmati</span>
              <b>{fmt(o.delivery)} UZS</b>
            </div>
          )}
        </div>
        <dl className="mt-3 space-y-1.5 px-1 text-[12px] text-[#4a5a73]">
          <Row l="Oraliq summa:" v={`${fmt(sub)} UZS`} />
          {o.discount > 0 && <Row l="Shartnomaviy chegirma:" v={`-${fmt(o.discount)} UZS`} green />}
          <Row l="Yetkazib berish:" v={`+${fmt(o.delivery)} UZS`} />
          <Row l="QQS (12%):" v="Narx ichida kiritilgan" />
        </dl>
        <div className="mt-3 flex items-center justify-between rounded-lg bg-[#eef2fb] px-4 py-3">
          <span className="text-[13px] font-bold">JAMI TO&apos;LOV:</span>
          <span className="text-[22px] font-bold">{fmt(orderTotal(o))} UZS</span>
        </div>
      </Section>

      <Section title="To'lov tranzaksiyasi">
        <div className="flex items-center justify-between rounded-lg bg-[#f6f8fc] p-3 text-[12px]">
          <div>
            <div className="font-semibold">{o.payMethod}</div>
            <div className="text-[#8794aa]">Tranzaksiya ID: #TRX-{o.number.split("-")[2]}</div>
          </div>
          {o.paid ? <Badge tone="green">TO&apos;LIQ TO&apos;LANGAN</Badge> : <Badge tone="amber">KUTILMOQDA</Badge>}
        </div>
      </Section>

      <Section title="Ichki operatsion izohlar" icon={<MessageSquare size={15} className="text-[#186FD4]" />}>
        {o.notes.map((n, i) => (
          <div key={i} className="mb-2 rounded-lg bg-[#f6f8fc] p-3 text-[12px]">
            <div className="mb-1 flex justify-between text-[11px] text-[#6b7a90]">
              <b className="text-[#0f1d3a]">{n.who}</b>
              {fmtTime(n.at)}
            </div>
            {n.text}
          </div>
        ))}
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (!note.trim()) return;
            actions.addOrderNote(o.id, note.trim());
            setNote("");
          }}
        >
          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Yangi ichki izoh qoldirish..." className={inputCls} />
          <Btn variant="primary" type="submit">
            <Send size={14} /> Qo&apos;shish
          </Btn>
        </form>
      </Section>

      <Modal
        open={cancel}
        onClose={() => setCancel(false)}
        title="Buyurtmani bekor qilish"
        footer={
          <>
            <Btn variant="ghost" onClick={() => setCancel(false)}>Yo&apos;q</Btn>
            <Btn
              variant="dark"
              className="!bg-[#c0262d]"
              onClick={() => {
                actions.setOrderStatus(o.id, "cancelled");
                setCancel(false);
                toast.success("Buyurtma bekor qilindi, tovar omborga qaytdi");
              }}
            >
              Ha, bekor qilish
            </Btn>
          </>
        }
      >
        <p className="text-[14px] text-[#4a5a73]">#{o.number} buyurtmasi bekor qilinadi va tovarlar ombor qoldig&apos;iga qaytariladi.</p>
      </Modal>
    </Card>
  );
}

function Section({ title, right, icon, children }: { title: string; right?: React.ReactNode; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <div className="mb-2.5 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-[13px] font-bold">
          {icon}
          {title}
        </h3>
        {right}
      </div>
      {children}
    </div>
  );
}
const Info = ({ l, v, accent }: { l: string; v: string; accent?: boolean }) => (
  <div>
    <div className="text-[10px] uppercase tracking-wide text-[#8794aa]">{l}</div>
    <div className={`font-semibold ${accent ? "text-[#186FD4]" : ""}`}>{v}</div>
  </div>
);
const Row = ({ l, v, green }: { l: string; v: string; green?: boolean }) => (
  <div className="flex justify-between">
    <dt>{l}</dt>
    <dd className={green ? "font-semibold text-[#12713c]" : ""}>{v}</dd>
  </div>
);

/* ---------- Yangi buyurtma ---------- */

function NewOrder({ onClose, onCreated }: { onClose: () => void; onCreated: (id: string) => void }) {
  const db = useDB();
  const [customerId, setCustomerId] = useState(db.customers[0]?.id ?? "");
  const [channelSel, setChannelSel] = useState<Channel | "auto">("auto");
  const [payMethod, setPayMethod] = useState<PayMethod>("Bank o'tkazmasi");
  const [paid, setPaid] = useState(false);
  const [delivery, setDelivery] = useState(0);
  const [lines, setLines] = useState<{ productId: string; qty: number }[]>([{ productId: db.products[0]?.id ?? "", qty: 1 }]);

  const c = db.customers.find((x) => x.id === customerId);
  const b2b = c?.type === "b2b";
  const channel: Channel = channelSel === "auto" ? (b2b ? "B2B Ulgurji" : "Chakana savdo") : channelSel;

  const items: OrderItem[] = lines
    .map((l) => {
      const p = db.products.find((x) => x.id === l.productId);
      return p ? { productId: p.id, name: p.name, qty: l.qty, unit: p.unit, price: channel === "B2B Ulgurji" ? p.b2bPrice : p.price } : null;
    })
    .filter((x): x is OrderItem => !!x);
  const sub = items.reduce((s, i) => s + i.qty * i.price, 0);
  const disc = c ? Math.round((sub * c.discount) / 100) : 0;
  const total = sub - disc + delivery;

  const submit = () => {
    if (!c) return toast.error("Mijozni tanlang");
    if (items.length === 0 || items.some((i) => !(i.qty > 0))) return toast.error("Mahsulot va miqdorni kiriting");
    for (const i of items) {
      const p = db.products.find((x) => x.id === i.productId)!;
      if (i.qty > p.stock) return toast.error(`"${p.name}" omborda yetarli emas (qoldiq: ${p.stock} ${p.unit})`);
    }
    const o = actions.createOrder({ customerId, channel, items, delivery, payMethod, paid });
    toast.success(`Buyurtma #${o.number} yaratildi`);
    onCreated(o.id);
    onClose();
  };

  return (
    <Modal
      open
      wide
      onClose={onClose}
      title="Yangi buyurtma yaratish"
      footer={
        <>
          <span className="mr-auto text-[14px]">
            Jami: <b className="text-[18px]">{fmt(total)} UZS</b>
          </span>
          <Btn variant="soft" onClick={onClose}>Bekor qilish</Btn>
          <Btn variant="dark" onClick={submit}>Buyurtmani saqlash</Btn>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Mijoz *">
          <select className={inputCls} value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
            {db.customers.map((x) => (
              <option key={x.id} value={x.id}>
                {x.company} {x.discount ? `(-${x.discount}%)` : ""}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Savdo kanali">
          <select className={inputCls} value={channelSel} onChange={(e) => setChannelSel(e.target.value as Channel | "auto")}>
            <option value="auto">Avtomatik ({channel})</option>
            <option>B2B Ulgurji</option>
            <option>Chakana savdo</option>
            <option>Telegram Bot</option>
          </select>
        </Field>
      </div>

      <div className="mt-5">
        <div className="mb-2 text-[13px] font-bold">Mahsulotlar</div>
        <div className="space-y-2">
          {lines.map((l, i) => {
            const p = db.products.find((x) => x.id === l.productId);
            return (
              <div key={i} className="grid grid-cols-[1fr_110px_auto] items-center gap-2">
                <select
                  className={inputCls}
                  value={l.productId}
                  onChange={(e) => setLines((a) => a.map((x, k) => (k === i ? { ...x, productId: e.target.value } : x)))}
                >
                  {db.products.map((x) => (
                    <option key={x.id} value={x.id}>
                      {x.name} — {fmt(channel === "B2B Ulgurji" ? x.b2bPrice : x.price)} UZS (qoldiq {fmt(x.stock, 1)})
                    </option>
                  ))}
                </select>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    step="any"
                    value={l.qty || ""}
                    onChange={(e) => setLines((a) => a.map((x, k) => (k === i ? { ...x, qty: +e.target.value } : x)))}
                    className={`${inputCls} pr-10`}
                  />
                  <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-[#8794aa]">{p?.unit}</span>
                </div>
                <button
                  disabled={lines.length === 1}
                  onClick={() => setLines((a) => a.filter((_, k) => k !== i))}
                  className="rounded-lg p-2 text-[#c0262d] hover:bg-[#fdecec] disabled:opacity-30"
                  aria-label="Olib tashlash"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}
        </div>
        <Btn variant="soft" size="sm" className="mt-2" onClick={() => setLines((a) => [...a, { productId: db.products[0]?.id ?? "", qty: 1 }])}>
          <Plus size={14} /> Mahsulot qo&apos;shish
        </Btn>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <Field label="Yetkazib berish narxi (UZS)">
          <input type="number" min={0} className={inputCls} value={delivery || ""} onChange={(e) => setDelivery(+e.target.value || 0)} placeholder="0" />
        </Field>
        <Field label="To'lov usuli">
          <select className={inputCls} value={payMethod} onChange={(e) => setPayMethod(e.target.value as PayMethod)}>
            {["Bank o'tkazmasi", "Payme", "Click", "Uzum", "Naqd"].map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </Field>
        <Field label="To'lov holati">
          <select className={inputCls} value={paid ? "1" : "0"} onChange={(e) => setPaid(e.target.value === "1")}>
            <option value="0">Kutilmoqda</option>
            <option value="1">To&apos;langan</option>
          </select>
        </Field>
      </div>

      <div className="mt-4 rounded-lg bg-[#f6f8fc] p-3 text-[12px] text-[#4a5a73]">
        <Row l="Oraliq summa:" v={`${fmt(sub)} UZS`} />
        <Row l={`Mijoz chegirmasi (${c?.discount ?? 0}%):`} v={`-${fmt(disc)} UZS`} green />
        <Row l="Yetkazib berish:" v={`+${fmt(delivery)} UZS`} />
      </div>
    </Modal>
  );
}
