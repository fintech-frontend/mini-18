"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { AlertTriangle, BadgeCheck, Building2, Clock, Download, FileText, Pencil, Phone, Search, ShoppingCart, Trash2, TrendingUp, UserPlus, Users, Banknote } from "lucide-react";
import { actions, customerStats, DAY, uid, useDB, type Customer, type Tier, useNow } from "@/lib/admin/db";
import { downloadCSV, fmt, fmtDate, fmtShort } from "@/lib/admin/format";
import { printDoc } from "@/lib/admin/print";
import { Avatar, TierBadge } from "@/components/admin/shared";
import { Badge, Btn, Card, Confirm, Empty, Field, inputCls, Modal, PageHeader, Pagination, Progress, StatCard, Tabs, usePageSlice } from "@/components/admin/ui";

const PAGE = 6;
type Tab = "all" | "b2b" | "debt" | "verify" | "vip";
const TIERS: Tier[] = ["Platina", "Oltin", "Kumush", "Standart"];
const TIER_DISC: Record<Tier, number> = { Platina: 12, Oltin: 8, Kumush: 5, Standart: 3 };

export default function CustomersPage() {
  return (
    <Suspense fallback={null}>
      <Customers />
    </Suspense>
  );
}

function Customers() {
  const db = useDB();
  const sp = useSearchParams();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("all");
  const [q, setQ] = useState(sp.get("q") ?? "");
  const [tier, setTier] = useState("all");
  const [region, setRegion] = useState("all");
  const [sort, setSort] = useState("turnover");
  const [page, setPage] = useState(1);
  const [sel, setSel] = useState<string | null>(null);
  const [edit, setEdit] = useState<Customer | null>(null);
  const [del, setDel] = useState<Customer | null>(null);
  const [limit, setLimit] = useState<Customer | null>(null);

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
      setEdit(blank());
      router.replace("/admin/customers");
    }
  }, [spn, router]);

  const stats = useMemo(() => new Map(db.customers.map((c) => [c.id, customerStats(c, db.orders)])), [db]);
  const b2b = db.customers.filter((c) => c.type === "b2b");
  const now = useNow();
  const month = db.orders.filter((o) => o.createdAt >= now - 30 * DAY && o.status !== "cancelled" && o.status !== "returned" && o.channel === "B2B Ulgurji");
  const monthSum = month.reduce((s, o) => s + o.items.reduce((a, i) => a + i.qty * i.price, 0), 0);
  const totalDebt = [...stats.values()].reduce((s, v) => s + v.debt, 0);
  const debtors = db.customers.filter((c) => (stats.get(c.id)?.debt ?? 0) > 0);
  const ltv = b2b.length ? b2b.reduce((s, c) => s + (stats.get(c.id)?.turnover ?? 0), 0) / b2b.length : 0;
  const regions = [...new Set(db.customers.map((c) => c.region.split(",")[0].replace(/ (sh\.|shahri|viloyati)/, "")))];

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    let r = db.customers.filter((c) => {
      if (tab === "b2b" && c.type !== "b2b") return false;
      if (tab === "debt" && !(stats.get(c.id)!.debt > 0)) return false;
      if (tab === "verify" && c.verified) return false;
      if (tab === "vip" && c.tier !== "Platina" && c.tier !== "Oltin") return false;
      if (tier !== "all" && c.tier !== tier) return false;
      if (region !== "all" && !c.region.includes(region)) return false;
      return !s || (c.company + c.inn + c.phone + c.contact).toLowerCase().includes(s);
    });
    r = [...r].sort((a, b) =>
      sort === "name" ? a.company.localeCompare(b.company) : sort === "debt" ? stats.get(b.id)!.debt - stats.get(a.id)!.debt : stats.get(b.id)!.turnover - stats.get(a.id)!.turnover
    );
    return r;
  }, [db.customers, stats, tab, q, tier, region, sort]);

  const { slice, pages, page: cur } = usePageSlice(rows, page, PAGE);
  const selected = db.customers.find((c) => c.id === sel) ?? slice[0] ?? null;

  return (
    <>
      <PageHeader
        crumbs={["Boshqaruv", "Mijozlar bazasi", "B2B Hamkorlar va Dilerlar"]}
        title="Mijozlar va B2B Kontragentlar Boshqaruvi"
        actions={
          <>
            <Btn
              variant="ghost"
              onClick={() =>
                downloadCSV("mijozlar.csv", [
                  ["Kompaniya", "INN", "Hudud", "Mas'ul", "Telefon", "Daraja", "Chegirma %", "Aylanma", "Qarz"],
                  ...rows.map((c) => [c.company, c.inn, c.region, c.contact, c.phone, c.tier, c.discount, stats.get(c.id)!.turnover, stats.get(c.id)!.debt]),
                ])
              }
            >
              <Download size={15} /> Excel eksport (.xlsx)
            </Btn>
            <Btn variant="dark" onClick={() => setEdit(blank())}>
              <UserPlus size={16} /> Yangi B2B mijoz qo&apos;shish
            </Btn>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Jami mijozlar bazasi" icon={<Users size={18} />} value={fmt(db.customers.length)} unit="ta" foot={`${b2b.length} ta faol B2B diler, ${db.customers.length - b2b.length} ta chakana`} />
        <StatCard label="B2B oylik aylanmasi" icon={<Banknote size={18} />} value={fmt(monthSum)} unit="UZS" foot={`${month.length} ta ulgurji buyurtma (30 kun)`} />
        <div className="rounded-xl bg-white p-4 shadow-[0_1px_3px_rgba(16,34,74,0.06)]">
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-[#6b7a90]">Debitorlik qarzdorligi (Nasiya)</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#fdecec] text-[#c0262d]"><Clock size={18} /></span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-[24px] font-bold text-[#c0262d]">{fmt(totalDebt)}</span>
            <span className="text-[12px] text-[#6b7a90]">UZS</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[12px] font-semibold text-[#c0262d]"><AlertTriangle size={13} /> {debtors.length} ta mijoz — monitoring talab etiladi</div>
        </div>
        <StatCard label="O'rtacha diler buyurtmasi / LTV" icon={<TrendingUp size={18} />} value={fmt(ltv)} unit="UZS" foot="Yillik doimiy dilerlik shartnomalari" />
      </div>

      <Card className="mt-4 !p-3">
        <Tabs
          value={tab}
          onChange={(v) => { setTab(v); setPage(1); }}
          tabs={[
            { id: "all", label: "Barcha mijozlar", count: db.customers.length },
            { id: "b2b", label: "B2B Dilerlar va Pudratchilar", count: b2b.length },
            { id: "debt", label: "Nasiya / Qarzdorlar", count: debtors.length, tone: "red" },
            { id: "verify", label: "Yangi so'rovlar / Verifikatsiya", count: db.customers.filter((c) => !c.verified).length },
            { id: "vip", label: "VIP & Yirik obektlar", count: db.customers.filter((c) => c.tier === "Platina" || c.tier === "Oltin").length },
          ]}
        />
      </Card>

      <Card className="mt-3 !p-3">
        <div className="grid gap-2.5 md:grid-cols-[1fr_190px_190px_200px]">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8794aa]" />
            <input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Kompaniya, INN, telefon yoki mas'ul..." className={`${inputCls} pl-9`} />
          </div>
          <select value={tier} onChange={(e) => { setTier(e.target.value); setPage(1); }} className={inputCls}>
            <option value="all">Barcha darajalar</option>
            {TIERS.map((t) => <option key={t}>{t}</option>)}
          </select>
          <select value={region} onChange={(e) => { setRegion(e.target.value); setPage(1); }} className={inputCls}>
            <option value="all">Barcha hududlar</option>
            {regions.map((r) => <option key={r}>{r}</option>)}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className={inputCls}>
            <option value="turnover">Saralash: Aylanma</option>
            <option value="debt">Saralash: Qarz</option>
            <option value="name">Saralash: Nomi</option>
          </select>
        </div>
      </Card>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_440px]">
        <Card title={<span className="flex items-center gap-2">Faol mijozlar ro&apos;yxati <Badge tone="blue">{rows.length}</Badge></span>}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-[13px]">
              <thead>
                <tr className="bg-[#f6f8fc] text-[11px] uppercase tracking-wide text-[#6b7a90]">
                  {["Kompaniya & rekvizitlar", "Mas'ul shaxs", "Daraja / Chegirma", "Savdo hajmi", "Balans"].map((h) => <th key={h} className="px-3 py-3 font-semibold">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {slice.map((c) => {
                  const st = stats.get(c.id)!;
                  const on = selected?.id === c.id;
                  return (
                    <tr key={c.id} onClick={() => setSel(c.id)} className={`cursor-pointer border-b border-[#eef1f6] last:border-0 hover:bg-[#fafbfe] ${on ? "bg-[#f1f5ff]" : ""}`}>
                      <td className="px-3 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar name={c.company} />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 font-semibold">
                              <span className="max-w-[210px] truncate">{c.company}</span>
                              {!c.verified && <Badge tone="amber">Tekshiruvda</Badge>}
                            </div>
                            <div className="text-[11px] text-[#8794aa]">{c.inn !== "—" ? `STIR: ${c.inn} • ` : ""}{c.region}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3.5 text-[12px]">
                        <div className="font-medium">{c.contact}</div>
                        <div className="text-[#8794aa]">{c.phone}</div>
                      </td>
                      <td className="px-3 py-3.5"><TierBadge tier={c.tier} discount={c.discount} /></td>
                      <td className="px-3 py-3.5">
                        <div className="font-semibold">{fmt(st.turnover)} <span className="text-[11px] font-normal text-[#8794aa]">UZS</span></div>
                        <div className="text-[11px] text-[#8794aa]">{st.count} ta buyurtma</div>
                      </td>
                      <td className="px-3 py-3.5">
                        {st.debt > 0 ? <span className="font-semibold text-[#c0262d]">-{fmt(st.debt)}</span> : <span className="text-[#12713c]">0</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {rows.length === 0 && <Empty />}
          </div>
          <Pagination page={cur} pages={pages} onChange={setPage} info={<>Ko&apos;rsatilmoqda: {rows.length ? (cur - 1) * PAGE + 1 : 0} - {Math.min(cur * PAGE, rows.length)} dan jami {rows.length} ta mijoz</>} />
        </Card>

        {selected ? (
          <CustomerPanel
            key={selected.id}
            c={selected}
            onEdit={() => setEdit(selected)}
            onDelete={() => setDel(selected)}
            onLimit={() => setLimit(selected)}
          />
        ) : (
          <Card><Empty text="Mijoz tanlang" /></Card>
        )}
      </div>

      {edit && <CustomerModal key={edit.id} customer={edit} onClose={() => setEdit(null)} />}
      {limit && <LimitModal c={limit} onClose={() => setLimit(null)} />}
      <Confirm open={!!del} title="Mijozni o'chirish" text={`"${del?.company}" mijozi bazadan o'chiriladi (buyurtmalar tarixi saqlanadi).`} onClose={() => setDel(null)} onYes={() => { if (del) { actions.deleteCustomer(del.id); setSel(null); toast.success("Mijoz o'chirildi"); } }} />
    </>
  );
}

function CustomerPanel({ c, onEdit, onDelete, onLimit }: { c: Customer; onEdit: () => void; onDelete: () => void; onLimit: () => void }) {
  const db = useDB();
  const router = useRouter();
  const [sub, setSub] = useState<"info" | "limit" | "history" | "recon">("info");
  const now = useNow();
  const st = customerStats(c, db.orders);
  const orders = db.orders.filter((o) => o.customerId === c.id);
  const used = c.creditLimit ? (st.debt / c.creditLimit) * 100 : 0;

  const recon = () =>
    printDoc(
      `Sverka akti — ${c.company}`,
      `<h2>Hisob-kitoblarni solishtirish dalolatnomasi (Sverka akti)</h2><p><b>Mijoz:</b> ${c.company} (INN: ${c.inn})<br/>Sana: ${fmtDate(now)}</p>
      <table><tr><th>Buyurtma</th><th>Sana</th><th>Summa</th><th>To'lov</th></tr>${orders
        .filter((o) => o.status !== "cancelled")
        .map((o) => `<tr><td>${o.number}</td><td>${fmtDate(o.createdAt)}</td><td>${fmt(o.items.reduce((s, i) => s + i.qty * i.price, 0) - o.discount + o.delivery)}</td><td>${o.paid ? "To'langan" : "Qarz"}</td></tr>`)
        .join("")}</table><p><b>Jami aylanma:</b> ${fmt(st.turnover)} UZS<br/><b>Qarzdorlik:</b> ${fmt(st.debt)} UZS</p>`
    );

  return (
    <Card className="h-fit xl:sticky xl:top-[84px]">
      <div className="flex items-start gap-3">
        <Avatar name={c.company} className="!h-14 !w-14 !text-[16px]" />
        <div className="min-w-0 flex-1">
          <h2 className="text-[18px] font-bold leading-tight">{c.company}</h2>
          <div className="mt-1 text-[12px] text-[#6b7a90]">{c.inn !== "—" && <>STIR: {c.inn} • </>}<span className="text-[#186FD4]">{c.region}</span></div>
        </div>
        <Badge tone={c.tier === "Platina" ? "navy" : "blue"}>{c.verified ? <BadgeCheck size={12} /> : null} {c.tier}</Badge>
      </div>
      <div className="mt-3 flex gap-2">
        <Btn size="sm" variant="soft" onClick={onEdit}><Pencil size={13} /> Tahrirlash</Btn>
        {!c.verified && (
          <Btn size="sm" variant="primary" onClick={() => { actions.saveCustomer({ ...c, verified: true }); toast.success("Mijoz tasdiqlandi"); }}>
            <BadgeCheck size={13} /> Tasdiqlash
          </Btn>
        )}
        <Btn size="sm" variant="danger" onClick={onDelete}><Trash2 size={13} /> O&apos;chirish</Btn>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-1 rounded-lg bg-[#f1f4fa] p-1 text-[12px] font-semibold">
        {([["info", "Umumiy"], ["limit", "Limit & Shartnoma"], ["history", "Tarix"], ["recon", "Sverka"]] as const).map(([k, l]) => (
          <button key={k} onClick={() => setSub(k)} className={`rounded-md px-1 py-2 ${sub === k ? "bg-white shadow-sm" : "text-[#6b7a90]"}`}>{l}</button>
        ))}
      </div>

      {sub === "info" && (
        <div className="mt-4 space-y-3 text-[13px]">
          <div className="grid grid-cols-2 gap-2.5">
            <div className="rounded-lg bg-[#f6f8fc] p-3"><div className="text-[10px] uppercase text-[#8794aa]">Kontragent vakili</div><div className="font-semibold">{c.contact}</div><a className="text-[12px] text-[#186FD4]" href={`tel:${c.phone}`}><Phone size={11} className="mr-1 inline" />{c.phone}</a></div>
            <div className="rounded-lg bg-[#f6f8fc] p-3"><div className="text-[10px] uppercase text-[#8794aa]">Bizning menejer</div><div className="font-semibold">Alisher Qodirov</div><div className="text-[12px] text-[#6b7a90]">Bosh Ta&apos;minot Admini</div></div>
          </div>
          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="rounded-lg bg-[#eef2fb] p-3"><div className="text-[18px] font-bold">{st.count}</div><div className="text-[10px] uppercase text-[#6b7a90]">Buyurtma</div></div>
            <div className="rounded-lg bg-[#eef2fb] p-3"><div className="text-[18px] font-bold">{fmtShort(st.turnover)}</div><div className="text-[10px] uppercase text-[#6b7a90]">Aylanma</div></div>
            <div className="rounded-lg bg-[#eef2fb] p-3"><div className={`text-[18px] font-bold ${st.debt ? "text-[#c0262d]" : ""}`}>{fmtShort(st.debt)}</div><div className="text-[10px] uppercase text-[#6b7a90]">Qarz</div></div>
          </div>
        </div>
      )}

      {sub === "limit" && (
        <div className="mt-4 rounded-xl bg-[#f6f8fc] p-4 text-[13px]">
          <div className="mb-2 flex items-center justify-between"><b>Kredit limiti monitoringi</b><b className="text-[#186FD4]">{used.toFixed(1)}% ishlatilgan</b></div>
          <Progress value={used} h={9} color={used > 85 ? "#d32027" : "#186FD4"} />
          <div className="mt-3 flex justify-between text-[12px]">
            <span>Nasiya: <b className="text-[#c0262d]">{fmt(st.debt)} UZS</b></span>
            <span>Jami limit: <b>{fmt(c.creditLimit)} UZS</b></span>
          </div>
          <div className="mt-2 text-[12px] text-[#6b7a90]">Chegirma darajasi: <b>{c.discount}%</b></div>
        </div>
      )}

      {sub === "history" && (
        <div className="mt-4 max-h-72 space-y-2 overflow-y-auto">
          {orders.length === 0 && <Empty text="Buyurtmalar yo'q" />}
          {orders.slice(0, 12).map((o) => (
            <button key={o.id} onClick={() => router.push(`/admin/orders?q=${o.number}`)} className="flex w-full items-center justify-between rounded-lg bg-[#f6f8fc] p-3 text-left text-[12px] hover:bg-[#eef2fb]">
              <span><b>#{o.number}</b><br /><span className="text-[#8794aa]">{fmtDate(o.createdAt)}</span></span>
              <b>{fmt(o.items.reduce((s, i) => s + i.qty * i.price, 0) - o.discount + o.delivery)} UZS</b>
            </button>
          ))}
        </div>
      )}

      {sub === "recon" && (
        <div className="mt-4 rounded-lg bg-[#f6f8fc] p-4 text-[13px]">
          <p className="text-[#4a5a73]">Mijoz bilan hisob-kitoblarni solishtirish dalolatnomasini (sverka akti) chop eting yoki PDF sifatida saqlang.</p>
          <Btn variant="primary" className="mt-3 w-full" onClick={recon}><FileText size={15} /> Sverka aktini yaratish (PDF)</Btn>
        </div>
      )}

      <div className="mt-4 space-y-2">
        <Btn variant="dark" className="w-full !py-3" onClick={() => router.push("/admin/orders?new=1")}><ShoppingCart size={16} /> Yangi buyurtma rasmiylashtirish</Btn>
        <div className="grid grid-cols-2 gap-2">
          <Btn variant="soft" onClick={recon}><FileText size={15} /> Sverka akti (PDF)</Btn>
          <Btn variant="soft" onClick={onLimit}><Building2 size={15} /> Limitni oshirish</Btn>
        </div>
      </div>
    </Card>
  );
}

function blank(): Customer {
  return { id: uid("c"), company: "", inn: "", region: "", contact: "", phone: "+998 ", tier: "Standart", discount: 3, type: "b2b", creditLimit: 0, verified: false, createdAt: Date.now() };
}

function CustomerModal({ customer, onClose }: { customer: Customer; onClose: () => void }) {
  const db = useDB();
  const isNew = !db.customers.some((c) => c.id === customer.id);
  const [f, setF] = useState(customer);
  const set = <K extends keyof Customer>(k: K, v: Customer[K]) => setF((p) => ({ ...p, [k]: v }));

  const save = () => {
    if (!f.company.trim()) return toast.error("Kompaniya yoki mijoz nomini kiriting");
    if (f.phone.replace(/\D/g, "").length < 12) return toast.error("Telefon raqamni to'liq kiriting");
    if (f.type === "b2b" && !/^\d{9}$/.test(f.inn)) return toast.error("INN 9 ta raqamdan iborat bo'lishi kerak");
    actions.saveCustomer({ ...f, company: f.company.trim(), inn: f.type === "retail" && !f.inn ? "—" : f.inn });
    toast.success(isNew ? "Mijoz qo'shildi" : "Mijoz saqlandi");
    onClose();
  };

  return (
    <Modal open wide onClose={onClose} title={isNew ? "Yangi mijoz qo'shish" : "Mijozni tahrirlash"} footer={<><Btn variant="soft" onClick={onClose}>Bekor qilish</Btn><Btn variant="dark" onClick={save}>Saqlash</Btn></>}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Mijoz turi">
          <select className={inputCls} value={f.type} onChange={(e) => set("type", e.target.value as Customer["type"])}>
            <option value="b2b">B2B (Yuridik shaxs)</option>
            <option value="retail">Chakana (Jismoniy shaxs)</option>
          </select>
        </Field>
        <Field label="Kompaniya / Ism *">
          <input className={inputCls} value={f.company} onChange={(e) => set("company", e.target.value)} placeholder='MCHJ "Toshkent City Qurilish"' />
        </Field>
        <Field label="INN (STIR)" hint="B2B uchun 9 ta raqam">
          <input className={inputCls} value={f.inn} onChange={(e) => set("inn", e.target.value.replace(/\D/g, "").slice(0, 9))} />
        </Field>
        <Field label="Hudud / Manzil">
          <input className={inputCls} value={f.region} onChange={(e) => set("region", e.target.value)} placeholder="Toshkent sh., Chilonzor" />
        </Field>
        <Field label="Mas'ul shaxs">
          <input className={inputCls} value={f.contact} onChange={(e) => set("contact", e.target.value)} />
        </Field>
        <Field label="Telefon *">
          <input className={inputCls} value={f.phone} onChange={(e) => set("phone", e.target.value)} />
        </Field>
        <Field label="Diler darajasi">
          <select className={inputCls} value={f.tier} onChange={(e) => { const t = e.target.value as Tier; setF((p) => ({ ...p, tier: t, discount: TIER_DISC[t] })); }}>
            {TIERS.map((t) => <option key={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Chegirma (%)">
          <input type="number" min={0} max={50} className={inputCls} value={f.discount} onChange={(e) => set("discount", +e.target.value || 0)} />
        </Field>
        <Field label="Kredit limiti (UZS)">
          <input type="number" min={0} className={inputCls} value={f.creditLimit || ""} onChange={(e) => set("creditLimit", +e.target.value || 0)} />
        </Field>
        <Field label="Holat">
          <select className={inputCls} value={f.verified ? "1" : "0"} onChange={(e) => set("verified", e.target.value === "1")}>
            <option value="1">Tasdiqlangan</option>
            <option value="0">Verifikatsiyada</option>
          </select>
        </Field>
      </div>
    </Modal>
  );
}

function LimitModal({ c, onClose }: { c: Customer; onClose: () => void }) {
  const [v, setV] = useState(c.creditLimit);
  return (
    <Modal open onClose={onClose} title="Kredit limitini oshirish" subtitle={c.company} footer={<><Btn variant="soft" onClick={onClose}>Bekor qilish</Btn><Btn variant="dark" onClick={() => { actions.saveCustomer({ ...c, creditLimit: v }); toast.success("Limit yangilandi"); onClose(); }}>Saqlash</Btn></>}>
      <Field label="Yangi kredit limiti (UZS)" hint={`Joriy limit: ${fmt(c.creditLimit)} UZS`}>
        <input type="number" min={0} className={inputCls} value={v || ""} onChange={(e) => setV(+e.target.value || 0)} />
      </Field>
      <div className="mt-3 flex gap-2">
        {[10, 25, 50].map((p) => (
          <Btn key={p} size="sm" variant="soft" onClick={() => setV(Math.round(c.creditLimit * (1 + p / 100)))}>+{p}%</Btn>
        ))}
      </div>
    </Modal>
  );
}
