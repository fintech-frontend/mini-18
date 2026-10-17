"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import {
  AlertTriangle,
  ArrowLeftRight,
  Boxes,
  Download,
  FilePlus2,
  Plus,
  Search,
  Trash2,
  Truck,
  Wallet,
  CheckCheck,
} from "lucide-react";
import { actions, DAY, uid, useDB, type MovementType, type Purchase, type PurchaseStatus, useNow } from "@/lib/admin/db";
import { downloadCSV, fmt, fmtDate, fmtDateTime, fmtShort } from "@/lib/admin/format";
import { Badge, Btn, Card, Empty, Field, inputCls, Modal, PageHeader, Pagination, Progress, StatCard, Tabs, usePageSlice, type Tone } from "@/components/admin/ui";

const PAGE = 7;
type Tab = "journal" | "purchases" | "warehouses" | "writeoff";

const TYPE_LABEL: Record<MovementType, string> = {
  kirim: "Kirim (Ta'minotchi)",
  chiqim: "Chiqim (Sotuv)",
  transfer: "Omborlararo ko'chirish",
  hisobdan: "Hisobdan chiqarish (Brak)",
};
const TYPE_TONE: Record<MovementType, Tone> = { kirim: "green", chiqim: "blue", transfer: "amber", hisobdan: "red" };

export default function WarehousePage() {
  return (
    <Suspense fallback={null}>
      <Warehouse />
    </Suspense>
  );
}

function Warehouse() {
  const db = useDB();
  const sp = useSearchParams();
  const router = useRouter();
  const now = useNow();
  const [tab, setTab] = useState<Tab>("journal");
  const [q, setQ] = useState("");
  const [type, setType] = useState("all");
  const [wh, setWh] = useState("all");
  const [page, setPage] = useState(1);
  const [move, setMove] = useState<MovementType | null>(null);
  const [po, setPo] = useState<{ productId?: string } | null>(null);

  const spn = sp.get("new");
  useEffect(() => {
    if (spn) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTab("purchases");
      setPo({});
      router.replace("/admin/warehouse");
    }
  }, [spn, router]);

  const stockValue = db.products.reduce((s, p) => s + p.cost * p.stock, 0);
  const pending = db.purchases.filter((p) => p.status === "kutilmoqda" || p.status === "yolda");
  const pendingValue = pending.reduce((s, p) => s + p.items.reduce((a, i) => a + i.qty * i.cost, 0), 0);
  const month = db.movements.filter((m) => m.at >= now - 30 * DAY && m.type === "chiqim");
  const monthValue = month.reduce((s, m) => s + Math.abs(m.qty) * (db.products.find((p) => p.id === m.productId)?.cost ?? 0), 0);
  const low = db.products.filter((p) => p.stock <= p.minStock);

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    return db.movements.filter(
      (m) =>
        (type === "all" || m.type === type) &&
        (wh === "all" || m.warehouse === wh) &&
        (!s || (m.number + m.productName + m.sku + m.party + m.doc).toLowerCase().includes(s))
    );
  }, [db.movements, q, type, wh]);
  const { slice, pages, page: cur } = usePageSlice(rows, page, PAGE);
  const writeoffs = db.movements.filter((m) => m.type === "hisobdan");

  return (
    <>
      <PageHeader
        crumbs={["Ombor va Logistika", "Xaridlar va Ombor Boshqaruvi"]}
        title="Kirim-Chiqim va Zaxira Jurnali"
        badge={
          <span className="flex items-center gap-2 rounded-full bg-[#e3effc] px-3 py-1.5 text-[12px] text-[#186FD4]">
            <span className="h-2 w-2 rounded-full bg-[#1bb55c]" /> 1C: Enterprise 8.3 Ombor
          </span>
        }
        actions={
          <>
            <Btn
              variant="ghost"
              onClick={() =>
                downloadCSV("ombor-jurnali.csv", [
                  ["Harakat ID", "Sana", "Tur", "Mahsulot", "SKU", "Miqdor", "Ombor", "Hujjat", "Kontragent"],
                  ...rows.map((m) => [m.number, fmtDateTime(m.at), TYPE_LABEL[m.type], m.productName, m.sku, m.qty, m.warehouse, m.doc, m.party]),
                ])
              }
            >
              <Download size={15} /> Excelga eksport (.xlsx)
            </Btn>
            <Btn variant="ghost" onClick={() => setMove("kirim")}>
              <FilePlus2 size={15} /> Yangi kirim hujjati (TTN)
            </Btn>
            <Btn variant="dark" onClick={() => { setTab("purchases"); setPo({}); }}>
              <Plus size={16} /> Yangi xarid buyurtmasi
            </Btn>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Jami ombor qoldig'i qiymati" icon={<Wallet size={18} />} value={fmtShort(stockValue)} unit="UZS" foot={`${db.products.length} ta SKU, ${db.warehouses.length} ta hub`} />
        <StatCard label="Kutilayotgan kirimlar" icon={<Truck size={18} />} value={fmtShort(pendingValue)} unit="UZS" foot={`${pending.length} ta ta'minotchi buyurtmasi`} />
        <StatCard label="Oylik chiqim (sotuv)" icon={<ArrowLeftRight size={18} />} value={fmtShort(monthValue)} unit="UZS" foot={`${month.length} ta harakat • tannarxda`} />
        <div className="rounded-xl bg-[#fff5f5] p-4 shadow-[0_1px_3px_rgba(16,34,74,0.06)]">
          <div className="flex items-start justify-between">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#c0262d]">
              <AlertTriangle size={13} /> Tanqis / kritik zaxiralar
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#fdecec] font-bold text-[#c0262d]">!</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-[30px] font-bold text-[#c0262d]">{low.length}</span>
            <span className="text-[12px] text-[#6b7a90]">ta mahsulot zaxirasi kritik</span>
          </div>
          <button onClick={() => { setTab("purchases"); setPo({ productId: low[0]?.id }); }} className="mt-2 text-[12px] font-semibold text-[#c0262d]">
            Xarid talab etiladi →
          </button>
        </div>
      </div>

      <Card className="mt-4">
        <Tabs
          value={tab}
          onChange={(v) => { setTab(v); setPage(1); }}
          tabs={[
            { id: "journal", label: "Kirim-Chiqim jurnali", count: db.movements.length },
            { id: "purchases", label: "Xarid buyurtmalari (Ta'minot)", count: db.purchases.length },
            { id: "warehouses", label: "Omborlar va sektorlar balansi", count: db.warehouses.length },
            { id: "writeoff", label: "Hisobdan chiqarish & Inventarizatsiya", count: writeoffs.length },
          ]}
        />

        {tab === "journal" && (
          <div className="mt-4">
            <div className="mb-3 grid gap-2.5 md:grid-cols-[1fr_210px_240px]">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8794aa]" />
                <input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Hujjat #, SKU, tovar yoki mas'ul shaxs..." className={`${inputCls} pl-9`} />
              </div>
              <select value={type} onChange={(e) => { setType(e.target.value); setPage(1); }} className={inputCls}>
                <option value="all">Barcha harakat turlari</option>
                {(Object.keys(TYPE_LABEL) as MovementType[]).map((t) => (
                  <option key={t} value={t}>{TYPE_LABEL[t]}</option>
                ))}
              </select>
              <select value={wh} onChange={(e) => { setWh(e.target.value); setPage(1); }} className={inputCls}>
                <option value="all">Barcha omborlar ({db.warehouses.length})</option>
                {db.warehouses.map((w) => (
                  <option key={w.id}>{w.name}</option>
                ))}
              </select>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-[13px]">
                <thead>
                  <tr className="bg-[#f6f8fc] text-[11px] uppercase tracking-wide text-[#6b7a90]">
                    {["Harakat ID & Hujjat #", "Sana & Vaqt", "Harakat turi", "Mahsulot & SKU", "Miqdor", "Joylashuv (Ombor)", "Kontragent"].map((h) => (
                      <th key={h} className="px-3 py-3 font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {slice.map((m) => (
                    <tr key={m.id} className="border-b border-[#eef1f6] last:border-0">
                      <td className="px-3 py-3.5">
                        <div className="font-semibold">#{m.number}</div>
                        <div className="text-[11px] text-[#186FD4]">{m.doc}</div>
                      </td>
                      <td className="px-3 py-3.5 text-[12px]">{fmtDateTime(m.at)}</td>
                      <td className="px-3 py-3.5"><Badge tone={TYPE_TONE[m.type]}>• {TYPE_LABEL[m.type]}</Badge></td>
                      <td className="px-3 py-3.5">
                        <div className="max-w-[260px] truncate font-semibold">{m.productName}</div>
                        <div className="text-[11px] text-[#8794aa]">SKU: {m.sku}</div>
                      </td>
                      <td className="px-3 py-3.5">
                        <Badge tone={m.qty >= 0 && m.type !== "transfer" ? "green" : m.type === "transfer" ? "amber" : "red"}>
                          {m.qty > 0 && m.type !== "transfer" ? "+" : ""}
                          {fmt(m.qty, 1)} {m.unit}
                        </Badge>
                      </td>
                      <td className="px-3 py-3.5 text-[12px] text-[#186FD4]">
                        {m.warehouse}
                        {m.to && <> → {m.to}</>}
                      </td>
                      <td className="max-w-[200px] truncate px-3 py-3.5 text-[12px] text-[#4a5a73]">{m.party}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {rows.length === 0 && <Empty />}
            </div>
            <Pagination page={cur} pages={pages} onChange={setPage} info={<>Ko&apos;rsatilmoqda: {rows.length ? (cur - 1) * PAGE + 1 : 0} - {Math.min(cur * PAGE, rows.length)} jami {fmt(rows.length)} ta harakatdan</>} />
          </div>
        )}

        {tab === "purchases" && (
          <div className="mt-4 space-y-3">
            {db.purchases.length === 0 && <Empty text="Xarid buyurtmalari yo'q" />}
            {db.purchases.map((p) => (
              <div key={p.id} className="rounded-xl border border-[#e8edf5] p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[16px] font-bold">#{p.number}</span>
                      <Badge tone={p.status === "qabul qilindi" ? "green" : p.status === "bekor" ? "gray" : p.status === "yolda" ? "blue" : "amber"}>{p.status}</Badge>
                    </div>
                    <div className="mt-1 text-[12px] text-[#6b7a90]">
                      {p.supplier} • Ombor: {p.warehouse} • Kutilayotgan sana: {fmtDate(p.expected)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[17px] font-bold">{fmt(p.items.reduce((s, i) => s + i.qty * i.cost, 0))} UZS</div>
                    <div className="text-[11px] text-[#8794aa]">{p.items.length} pozitsiya</div>
                  </div>
                </div>
                <ul className="mt-3 space-y-1 rounded-lg bg-[#f6f8fc] p-3 text-[12px]">
                  {p.items.map((i) => (
                    <li key={i.productId} className="flex justify-between gap-3">
                      <span className="truncate">{i.name}</span>
                      <b className="shrink-0">{fmt(i.qty, 1)} {i.unit} × {fmt(i.cost)}</b>
                    </li>
                  ))}
                </ul>
                {(p.status === "kutilmoqda" || p.status === "yolda") && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.status === "kutilmoqda" && (
                      <Btn size="sm" variant="soft" onClick={() => actions.setPurchaseStatus(p.id, "yolda")}>
                        <Truck size={14} /> Yo&apos;lga chiqdi
                      </Btn>
                    )}
                    <Btn
                      size="sm"
                      variant="primary"
                      onClick={() => {
                        actions.setPurchaseStatus(p.id, "qabul qilindi");
                        toast.success("Tovarlar omborga qabul qilindi, qoldiq yangilandi");
                      }}
                    >
                      <CheckCheck size={14} /> Omborga qabul qilish
                    </Btn>
                    <Btn size="sm" variant="danger" onClick={() => actions.setPurchaseStatus(p.id, "bekor" as PurchaseStatus)}>
                      Bekor qilish
                    </Btn>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {tab === "warehouses" && (
          <div className="mt-4 grid gap-3 lg:grid-cols-3">
            {db.warehouses.map((w) => {
              const pct = Math.round((w.used / w.capacity) * 100);
              return (
                <div key={w.id} className="rounded-xl bg-[#f6f8fc] p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-semibold">{w.name}</span>
                    <Badge tone={pct > 80 ? "red" : pct > 55 ? "amber" : "green"}>{pct}% band</Badge>
                  </div>
                  <div className="my-3">
                    <Progress value={pct} h={8} color={pct > 80 ? "#d32027" : "#186FD4"} />
                  </div>
                  <div className="text-[12px] text-[#6b7a90]">Bo&apos;sh joy: {fmt(w.capacity - w.used)} m³ / {fmt(w.capacity)} m³</div>
                </div>
              );
            })}
          </div>
        )}

        {tab === "writeoff" && (
          <div className="mt-4">
            <div className="mb-3 flex justify-end">
              <Btn variant="dark" onClick={() => setMove("hisobdan")}>
                <Trash2 size={15} /> Hisobdan chiqarish akti
              </Btn>
            </div>
            {writeoffs.length === 0 ? (
              <Empty text="Hisobdan chiqarishlar yo'q" />
            ) : (
              <ul className="divide-y divide-[#eef1f6] text-[13px]">
                {writeoffs.map((m) => (
                  <li key={m.id} className="flex flex-wrap justify-between gap-2 py-3">
                    <div>
                      <div className="font-semibold">{m.productName}</div>
                      <div className="text-[11px] text-[#8794aa]">{m.doc} • {m.party} • {fmtDateTime(m.at)}</div>
                    </div>
                    <Badge tone="red">{fmt(m.qty, 1)} {m.unit}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </Card>

      <Card
        className="mt-4"
        title={<span className="flex items-center gap-2"><Boxes size={19} className="text-[#d32027]" /> Kritik minimal qoldiqlar va tezkor xarid taklifi</span>}
        subtitle="Quyidagi mahsulotlar xavfsiz chegaradan tushib ketgan. Avtomatik buyurtma yaratish tavsiya etiladi."
      >
        <div className="grid gap-3 lg:grid-cols-2">
          {low.length === 0 && <Empty text="Kritik qoldiq yo'q" />}
          {low.slice(0, 6).map((p) => {
            const rec = Math.max(1, Math.ceil(p.minStock * 2 - p.stock));
            return (
              <div key={p.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#fff5f5] p-3.5">
                <div className="min-w-0">
                  <div className="truncate text-[14px] font-semibold">{p.name}</div>
                  <div className="text-[11px] text-[#6b7a90]">SKU: {p.sku}</div>
                  <div className="text-[12px]"><b className="text-[#c0262d]">Qoldiq: {fmt(p.stock, 1)} {p.unit}</b> / Min: {fmt(p.minStock)} {p.unit}</div>
                </div>
                <div className="text-right">
                  <div className="mb-1.5 text-[11px] text-[#6b7a90]">Tavsiya: <b>+{fmt(rec)} {p.unit}</b></div>
                  <Btn size="sm" variant="dark" onClick={() => { setTab("purchases"); setPo({ productId: p.id }); }}>
                    Xarid buyurtmasini yaratish
                  </Btn>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {move && <MovementModal type={move} onClose={() => setMove(null)} />}
      {po && <PurchaseModal productId={po.productId} onClose={() => setPo(null)} />}
    </>
  );
}

function MovementModal({ type: initial, onClose }: { type: MovementType; onClose: () => void }) {
  const db = useDB();
  const [type, setType] = useState<MovementType>(initial);
  const [productId, setProductId] = useState(db.products[0]?.id ?? "");
  const [qty, setQty] = useState(0);
  const [warehouse, setWarehouse] = useState(db.warehouses[0]?.name ?? "");
  const [to, setTo] = useState(db.warehouses[1]?.name ?? "");
  const [doc, setDoc] = useState("");
  const [party, setParty] = useState("");
  const p = db.products.find((x) => x.id === productId);

  const save = () => {
    if (!p) return;
    if (!(qty > 0)) return toast.error("Miqdorni kiriting");
    if (type !== "kirim" && qty > p.stock) return toast.error(`Omborda faqat ${p.stock} ${p.unit} bor`);
    if (type === "transfer" && warehouse === to) return toast.error("Ombor va manzil ombor bir xil");
    actions.addMovement({
      type,
      productId: p.id,
      productName: p.name,
      sku: p.sku,
      qty: type === "kirim" ? qty : type === "transfer" ? qty : -qty,
      unit: p.unit,
      warehouse,
      to: type === "transfer" ? to : undefined,
      doc: doc || (type === "kirim" ? "TTN" : type === "hisobdan" ? "Akt-Brak" : "TRN"),
      party: party || "—",
    });
    toast.success("Harakat saqlandi, qoldiq yangilandi");
    onClose();
  };

  return (
    <Modal open onClose={onClose} title="Yangi ombor harakati" footer={<><Btn variant="soft" onClick={onClose}>Bekor qilish</Btn><Btn variant="dark" onClick={save}>Saqlash</Btn></>}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Harakat turi">
          <select className={inputCls} value={type} onChange={(e) => setType(e.target.value as MovementType)}>
            {(Object.keys(TYPE_LABEL) as MovementType[]).filter((t) => t !== "chiqim").map((t) => (
              <option key={t} value={t}>{TYPE_LABEL[t]}</option>
            ))}
            <option value="chiqim">Chiqim (qo&apos;lda)</option>
          </select>
        </Field>
        <Field label="Mahsulot">
          <select className={inputCls} value={productId} onChange={(e) => setProductId(e.target.value)}>
            {db.products.map((x) => (
              <option key={x.id} value={x.id}>{x.name} (qoldiq {fmt(x.stock, 1)})</option>
            ))}
          </select>
        </Field>
        <Field label={`Miqdor ${p ? `(${p.unit})` : ""}`}>
          <input type="number" min={0} step="any" className={inputCls} value={qty || ""} onChange={(e) => setQty(+e.target.value)} />
        </Field>
        <Field label="Ombor">
          <select className={inputCls} value={warehouse} onChange={(e) => setWarehouse(e.target.value)}>
            {db.warehouses.map((w) => <option key={w.id}>{w.name}</option>)}
          </select>
        </Field>
        {type === "transfer" && (
          <Field label="Qabul qiluvchi ombor">
            <select className={inputCls} value={to} onChange={(e) => setTo(e.target.value)}>
              {db.warehouses.map((w) => <option key={w.id}>{w.name}</option>)}
            </select>
          </Field>
        )}
        <Field label="Hujjat raqami">
          <input className={inputCls} value={doc} onChange={(e) => setDoc(e.target.value)} placeholder="TTN-105" />
        </Field>
        <Field label="Kontragent / Mas'ul shaxs">
          <input className={inputCls} value={party} onChange={(e) => setParty(e.target.value)} placeholder='MCHJ "Bekobodsement Zavodi"' />
        </Field>
      </div>
    </Modal>
  );
}

function PurchaseModal({ productId, onClose }: { productId?: string; onClose: () => void }) {
  const db = useDB();
  const first = productId ?? db.products[0]?.id ?? "";
  const init = db.products.find((p) => p.id === first);
  const [supplier, setSupplier] = useState("");
  const [warehouse, setWarehouse] = useState(db.warehouses[0]?.name ?? "");
  const [days, setDays] = useState(5);
  const [lines, setLines] = useState([{ productId: first, qty: init ? Math.max(1, Math.ceil(init.minStock * 2 - init.stock)) : 1, cost: init?.cost ?? 0 }]);

  const total = lines.reduce((s, l) => s + l.qty * l.cost, 0);

  const save = () => {
    if (!supplier.trim()) return toast.error("Ta'minotchini kiriting");
    if (lines.some((l) => !(l.qty > 0))) return toast.error("Miqdorni kiriting");
    const p: Purchase = {
      id: uid("x"),
      number: `XB-${String(25 + db.purchases.length - 3).padStart(4, "0")}`,
      supplier: supplier.trim(),
      createdAt: Date.now(),
      expected: Date.now() + days * DAY,
      status: "kutilmoqda",
      warehouse,
      items: lines.map((l) => {
        const pr = db.products.find((x) => x.id === l.productId)!;
        return { productId: pr.id, name: pr.name, qty: l.qty, unit: pr.unit, cost: l.cost };
      }),
    };
    actions.savePurchase(p);
    toast.success(`Xarid buyurtmasi #${p.number} yaratildi`);
    onClose();
  };

  return (
    <Modal open wide onClose={onClose} title="Yangi xarid buyurtmasi" footer={<><span className="mr-auto text-[14px]">Jami: <b>{fmt(total)} UZS</b></span><Btn variant="soft" onClick={onClose}>Bekor qilish</Btn><Btn variant="dark" onClick={save}>Buyurtma berish</Btn></>}>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Ta'minotchi *">
          <input className={inputCls} value={supplier} onChange={(e) => setSupplier(e.target.value)} placeholder="Makita Corp UZ" />
        </Field>
        <Field label="Qabul qiluvchi ombor">
          <select className={inputCls} value={warehouse} onChange={(e) => setWarehouse(e.target.value)}>
            {db.warehouses.map((w) => <option key={w.id}>{w.name}</option>)}
          </select>
        </Field>
        <Field label="Yetkazish muddati (kun)">
          <input type="number" min={1} className={inputCls} value={days} onChange={(e) => setDays(+e.target.value || 1)} />
        </Field>
      </div>
      <div className="mt-5 space-y-2">
        {lines.map((l, i) => (
          <div key={i} className="grid grid-cols-[1fr_100px_130px_auto] items-center gap-2">
            <select
              className={inputCls}
              value={l.productId}
              onChange={(e) => {
                const pr = db.products.find((x) => x.id === e.target.value);
                setLines((a) => a.map((x, k) => (k === i ? { ...x, productId: e.target.value, cost: pr?.cost ?? 0 } : x)));
              }}
            >
              {db.products.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
            </select>
            <input type="number" min={0} step="any" placeholder="Miqdor" className={inputCls} value={l.qty || ""} onChange={(e) => setLines((a) => a.map((x, k) => (k === i ? { ...x, qty: +e.target.value } : x)))} />
            <input type="number" min={0} placeholder="Tannarx" className={inputCls} value={l.cost || ""} onChange={(e) => setLines((a) => a.map((x, k) => (k === i ? { ...x, cost: +e.target.value } : x)))} />
            <button disabled={lines.length === 1} onClick={() => setLines((a) => a.filter((_, k) => k !== i))} className="rounded-lg p-2 text-[#c0262d] hover:bg-[#fdecec] disabled:opacity-30" aria-label="Olib tashlash">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        <Btn variant="soft" size="sm" onClick={() => setLines((a) => [...a, { productId: db.products[0]?.id ?? "", qty: 1, cost: db.products[0]?.cost ?? 0 }])}>
          <Plus size={14} /> Pozitsiya qo&apos;shish
        </Btn>
      </div>
    </Modal>
  );
}
