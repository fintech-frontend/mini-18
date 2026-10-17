"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { AlertTriangle, Archive, Boxes, Download, FileUp, ImagePlus, Package, Pencil, Plus, Search, Trash2, Wallet, X } from "lucide-react";
import { actions, CATEGORIES, uid, useDB, type Product } from "@/lib/admin/db";
import { fmt, fmtShort, downloadCSV } from "@/lib/admin/format";
import { Badge, Btn, Card, Confirm, Empty, Field, inputCls, Modal, PageHeader, Pagination, Progress, StatCard, Tabs, usePageSlice } from "@/components/admin/ui";

const PAGE = 8;
const UNITS = ["dona", "qop", "tonna", "list", "mashina", "chelak", "buxta", "metr", "kg"];

export default function ProductsPage() {
  return (
    <Suspense fallback={null}>
      <Products />
    </Suspense>
  );
}

function Products() {
  const db = useDB();
  const sp = useSearchParams();
  const router = useRouter();
  const [q, setQ] = useState(sp.get("q") ?? "");
  const [cat, setCat] = useState("all");
  const [flt, setFlt] = useState<"all" | "low" | "active" | "draft">(sp.get("filter") === "low" ? "low" : "all");
  const [sort, setSort] = useState("new");
  const [page, setPage] = useState(1);
  const [edit, setEdit] = useState<Product | null>(null);
  const [del, setDel] = useState<Product | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // URL o'zgarsa filtrlar yangilanadi
  const spq = sp.get("q");
  const spf = sp.get("filter");
  const spn = sp.get("new");
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQ(spq ?? "");
    setFlt(spf === "low" ? "low" : "all");
    setPage(1);
  }, [spq, spf]);
  useEffect(() => {
    if (spn) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEdit(blank());
      router.replace("/admin/products");
    }
  }, [spn, router]);

  const low = db.products.filter((p) => p.stock <= p.minStock);

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    let r = db.products.filter(
      (p) =>
        (!s || (p.name + p.sku + p.brand).toLowerCase().includes(s)) &&
        (cat === "all" || p.category === cat) &&
        (flt === "all" || (flt === "low" ? p.stock <= p.minStock : p.status === flt))
    );
    if (sort === "price") r = [...r].sort((a, b) => b.price - a.price);
    if (sort === "stock") r = [...r].sort((a, b) => a.stock / a.minStock - b.stock / b.minStock);
    if (sort === "name") r = [...r].sort((a, b) => a.name.localeCompare(b.name));
    return r;
  }, [db.products, q, cat, flt, sort]);

  const { slice, pages, page: cur } = usePageSlice(rows, page, PAGE);

  const importCSV = async (f: File) => {
    const text = await f.text();
    const lines = text.replace(/^﻿/, "").split(/\r?\n/).filter(Boolean);
    const sep = lines[0].includes(";") ? ";" : ",";
    let n = 0;
    lines.slice(1).forEach((l) => {
      const c = l.split(sep).map((x) => x.replace(/^"|"$/g, "").trim());
      if (!c[0]) return;
      actions.saveProduct({
        ...blank(),
        id: uid("p"),
        name: c[0],
        sku: c[1] || `SKU-${Math.floor(Math.random() * 99999)}`,
        category: CATEGORIES.includes(c[2]) ? c[2] : CATEGORIES[0],
        price: +c[3] || 0,
        b2bPrice: +c[4] || +c[3] || 0,
        cost: +c[5] || 0,
        stock: +c[6] || 0,
        unit: c[7] || "dona",
        minStock: +c[8] || 0,
      });
      n++;
    });
    toast.success(`${n} ta mahsulot import qilindi`);
  };

  return (
    <>
      <PageHeader
        crumbs={["Asosiy", "Ombor", "Mahsulotlar katalogi"]}
        title="Mahsulotlar katalogi va Ombor qoldiqlari"
        actions={
          <>
            <input
              ref={fileRef}
              type="file"
              accept=".csv"
              hidden
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) importCSV(f);
                e.target.value = "";
              }}
            />
            <Btn variant="ghost" onClick={() => fileRef.current?.click()}>
              <FileUp size={15} /> CSV / Excel import
            </Btn>
            <Btn
              variant="ghost"
              onClick={() =>
                downloadCSV("mahsulotlar.csv", [
                  ["Nomi", "SKU", "Kategoriya", "Chakana narx", "B2B narx", "Tannarx", "Qoldiq", "Birlik", "Min qoldiq"],
                  ...rows.map((p) => [p.name, p.sku, p.category, p.price, p.b2bPrice, p.cost, p.stock, p.unit, p.minStock]),
                ])
              }
            >
              <Download size={15} /> Eksport
            </Btn>
            <Btn variant="dark" onClick={() => setEdit(blank())}>
              <Plus size={16} /> Yangi mahsulot yaratish
            </Btn>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard label="Jami SKU" icon={<Boxes size={18} />} value={fmt(db.products.length)} unit="ta" />
        <StatCard
          label="Ombor qiymati (tannarx)"
          icon={<Wallet size={18} />}
          value={fmtShort(db.products.reduce((s, p) => s + p.cost * p.stock, 0))}
          unit="UZS"
        />
        <StatCard label="Kam qolgan" icon={<AlertTriangle size={18} />} value={fmt(low.length)} unit="ta" foot="Min chegaradan past" />
        <StatCard label="Qoralama" icon={<Archive size={18} />} value={fmt(db.products.filter((p) => p.status === "draft").length)} unit="ta" />
      </div>

      <Card className="mt-4">
        <div className="mb-4 grid gap-3 md:grid-cols-[1fr_220px_160px]">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8794aa]" />
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              placeholder="Nomi, SKU yoki brend bo'yicha qidirish..."
              className={`${inputCls} pl-9`}
            />
          </div>
          <select
            value={cat}
            onChange={(e) => {
              setCat(e.target.value);
              setPage(1);
            }}
            className={inputCls}
          >
            <option value="all">Barcha kategoriyalar</option>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className={inputCls}>
            <option value="new">Saralash: Yangilari</option>
            <option value="name">Nomi (A-Z)</option>
            <option value="price">Narx (yuqori)</option>
            <option value="stock">Qoldiq (kam)</option>
          </select>
        </div>
        <Tabs
          value={flt}
          onChange={(v) => {
            setFlt(v);
            setPage(1);
          }}
          tabs={[
            { id: "all", label: "Barchasi", count: db.products.length },
            { id: "low", label: "Kam qolgan", count: low.length, tone: "red" },
            { id: "active", label: "Faol", count: db.products.filter((p) => p.status === "active").length },
            { id: "draft", label: "Qoralama", count: db.products.filter((p) => p.status === "draft").length },
          ]}
        />

        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-[13px]">
            <thead>
              <tr className="bg-[#f6f8fc] text-[11px] uppercase tracking-wide text-[#6b7a90]">
                {["Mahsulot", "Kategoriya", "Chakana narx", "B2B ulgurji", "Ombor qoldig'i", "Holat", ""].map((h) => (
                  <th key={h} className="px-3 py-3 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {slice.map((p) => {
                const isLow = p.stock <= p.minStock;
                return (
                  <tr key={p.id} className="border-b border-[#eef1f6] last:border-0 hover:bg-[#fafbfe]">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#eef2fb] text-[#186FD4]">
                          {p.images[0] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={p.images[0]} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <Package size={20} />
                          )}
                        </span>
                        <div className="min-w-0">
                          <div className="max-w-[300px] truncate font-semibold">{p.name}</div>
                          <div className="text-[11px] text-[#8794aa]">
                            SKU: {p.sku} • {p.brand}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-[12px] text-[#4a5a73]">{p.category}</td>
                    <td className="px-3 py-3 font-medium">{fmt(p.price)}</td>
                    <td className="px-3 py-3 font-semibold text-[#186FD4]">{fmt(p.b2bPrice)}</td>
                    <td className="w-[170px] px-3 py-3">
                      <div className={`mb-1 text-[12px] font-semibold ${isLow ? "text-[#c0262d]" : ""}`}>
                        {fmt(p.stock, 1)} {p.unit}
                      </div>
                      <Progress value={(p.stock / (p.minStock * 3 || 1)) * 100} color={isLow ? "#d32027" : "#186FD4"} />
                    </td>
                    <td className="px-3 py-3">
                      {p.status === "draft" ? <Badge>Qoralama</Badge> : isLow ? <Badge tone="red">Kam qolgan</Badge> : <Badge tone="green">Faol</Badge>}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => setEdit(p)} className="rounded-lg p-2 text-[#16335f] hover:bg-[#eef2fb]" aria-label="Tahrirlash">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => setDel(p)} className="rounded-lg p-2 text-[#c0262d] hover:bg-[#fdecec]" aria-label="O'chirish">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {rows.length === 0 && <Empty />}
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

      {edit && <ProductModal key={edit.id} product={edit} onClose={() => setEdit(null)} />}
      <Confirm
        open={!!del}
        title="Mahsulotni o'chirish"
        text={`"${del?.name}" mahsuloti katalogdan o'chiriladi. Davom etasizmi?`}
        onClose={() => setDel(null)}
        onYes={() => {
          if (del) {
            actions.deleteProduct(del.id);
            toast.success("Mahsulot o'chirildi");
          }
        }}
      />
    </>
  );
}

function blank(): Product {
  return {
    id: uid("p"),
    name: "",
    sku: "",
    brand: "",
    category: CATEGORIES[0],
    price: 0,
    b2bPrice: 0,
    cost: 0,
    stock: 0,
    unit: "dona",
    minStock: 0,
    warranty: "",
    power: "",
    status: "active",
    images: [],
    description: "",
  };
}

type Tab = "main" | "price" | "stock" | "media" | "tech";

function ProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const db = useDB();
  const isNew = !db.products.some((p) => p.id === product.id);
  const [f, setF] = useState(product);
  const [tab, setTab] = useState<Tab>("main");
  const set = <K extends keyof Product>(k: K, v: Product[K]) => setF((p) => ({ ...p, [k]: v }));
  const num = (k: "price" | "b2bPrice" | "cost" | "stock" | "minStock") => ({
    type: "number" as const,
    min: 0,
    value: f[k] === 0 ? "" : f[k],
    placeholder: "0",
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => set(k, +e.target.value || 0),
  });

  const margin = f.price ? ((f.price - f.cost) / f.price) * 100 : 0;
  const lowNow = f.stock <= f.minStock;

  const addImages = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      if (file.size > 400_000) return toast.error(`${file.name}: 400 KB dan katta`);
      const r = new FileReader();
      r.onload = () => setF((p) => ({ ...p, images: [...p.images, String(r.result)] }));
      r.readAsDataURL(file);
    });
  };

  const save = () => {
    if (!f.name.trim()) return toast.error("Mahsulot nomini kiriting"), setTab("main");
    if (!f.sku.trim()) return toast.error("SKU kodini kiriting"), setTab("main");
    if (db.products.some((p) => p.sku.toLowerCase() === f.sku.trim().toLowerCase() && p.id !== f.id))
      return toast.error("Bu SKU allaqachon mavjud"), setTab("main");
    if (f.price <= 0) return toast.error("Chakana narxni kiriting"), setTab("price");
    actions.saveProduct({ ...f, name: f.name.trim(), sku: f.sku.trim(), b2bPrice: f.b2bPrice || f.price });
    toast.success(isNew ? "Mahsulot qo'shildi" : "Mahsulot saqlandi");
    onClose();
  };

  return (
    <Modal
      open
      wide
      onClose={onClose}
      title={isNew ? "Yangi mahsulot yaratish" : `Mahsulot tahrirlash: ${product.name}`}
      subtitle={f.sku && <>SKU: {f.sku} • {f.category}</>}
      footer={
        <>
          <span className="mr-auto flex items-center gap-2 text-[12px] text-[#4a5a73]">
            <i className={`h-2.5 w-2.5 rounded-full ${lowNow ? "bg-[#d32027]" : "bg-[#1bb55c]"}`} />
            Holat:{" "}
            <b>
              {lowNow ? `Kam qolgan (${fmt(f.stock, 1)} ${f.unit})` : `Yetarli (${fmt(f.stock, 1)} ${f.unit})`}
            </b>
            {lowNow && <span className="hidden sm:inline">— Yangi partiya buyurtma qiling</span>}
          </span>
          <Btn variant="soft" onClick={onClose}>
            Bekor qilish
          </Btn>
          <Btn variant="dark" onClick={save}>
            Saqlash va chop etish
          </Btn>
        </>
      }
    >
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "main", label: "Umumiy ma'lumot" },
          { id: "price", label: "Narxlar va Ulgurji B2B" },
          { id: "stock", label: "Ombor va SKU zaxira" },
          { id: "media", label: "Media (Rasmlar)", count: f.images.length },
          { id: "tech", label: "Texnik xususiyatlar" },
        ]}
      />
      <div className="mt-5 space-y-4">
        {tab === "main" && (
          <>
            <div className="grid gap-4 sm:grid-cols-[1fr_240px]">
              <Field label="Mahsulot to'liq nomi *">
                <input className={inputCls} value={f.name} onChange={(e) => set("name", e.target.value)} placeholder="Perforator Makita HR2470 780W SDS-Plus" />
              </Field>
              <Field label="Brend / Ishlab chiqaruvchi">
                <input className={inputCls} value={f.brand} onChange={(e) => set("brand", e.target.value)} placeholder="Makita (Yaponiya)" />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="SKU kodi *">
                <input className={inputCls} value={f.sku} onChange={(e) => set("sku", e.target.value)} placeholder="MKT-HR2470" />
              </Field>
              <Field label="Kategoriya">
                <select className={inputCls} value={f.category} onChange={(e) => set("category", e.target.value)}>
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
              <Field label="Holat">
                <select className={inputCls} value={f.status} onChange={(e) => set("status", e.target.value as Product["status"])}>
                  <option value="active">Faol (sotuvda)</option>
                  <option value="draft">Qoralama</option>
                </select>
              </Field>
            </div>
            <Field label="Tavsif">
              <textarea rows={4} className={inputCls} value={f.description} onChange={(e) => set("description", e.target.value)} />
            </Field>
          </>
        )}

        {tab === "price" && (
          <>
            <div className="rounded-xl bg-[#f6f8fc] p-4">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-[16px] font-semibold">Narx shakllanishi &amp; B2B ulgurji shartlar</h4>
                <span className="text-[11px] font-semibold uppercase tracking-wide text-[#186FD4]">QQS (12%) hisobga olingan</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Asosiy chakana narx (UZS)">
                  <input className={inputCls} {...num("price")} />
                </Field>
                <Field label="B2B ulgurji narx (10+ dona)">
                  <input className={`${inputCls} !text-[#186FD4]`} {...num("b2bPrice")} />
                </Field>
                <Field label="Tannarx / Kirim narxi">
                  <input className={inputCls} {...num("cost")} />
                </Field>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-[13px]">
              <div className="rounded-lg bg-[#eef2fb] p-3">
                Chakana marja: <b className={margin < 0 ? "text-[#c0262d]" : "text-[#12713c]"}>{margin.toFixed(1)}%</b>
              </div>
              <div className="rounded-lg bg-[#eef2fb] p-3">
                B2B marja: <b>{f.b2bPrice ? (((f.b2bPrice - f.cost) / f.b2bPrice) * 100).toFixed(1) : 0}%</b>
              </div>
            </div>
          </>
        )}

        {tab === "stock" && (
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Joriy qoldiq">
              <input className={inputCls} {...num("stock")} step="any" />
            </Field>
            <Field label="O'lchov birligi">
              <select className={inputCls} value={f.unit} onChange={(e) => set("unit", e.target.value)}>
                {UNITS.map((u) => (
                  <option key={u}>{u}</option>
                ))}
              </select>
            </Field>
            <Field label="Min. qoldiq ogohlantirishi">
              <input className={inputCls} {...num("minStock")} />
            </Field>
          </div>
        )}

        {tab === "media" && (
          <div>
            <div className="mb-2 text-[12px] font-medium text-[#4a5a73]">Biriktirilgan mahsulot rasmlari</div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {f.images.map((src, i) => (
                <div key={i} className="group relative aspect-square overflow-hidden rounded-xl bg-[#eef2fb]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="h-full w-full object-cover" />
                  {i === 0 && <span className="absolute left-2 top-2 rounded bg-[#06214a] px-1.5 py-0.5 text-[10px] font-bold text-white">ASOSIY</span>}
                  <button
                    onClick={() => set("images", f.images.filter((_, k) => k !== i))}
                    className="absolute right-2 top-2 hidden rounded-full bg-white p-1 text-[#c0262d] shadow group-hover:block"
                    aria-label="O'chirish"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-xl bg-[#eef2fb] text-[12px] text-[#4a5a73] hover:bg-[#e1e8f7]">
                <ImagePlus size={26} className="text-[#186FD4]" />+ Rasm yuklash
                <input type="file" accept="image/*" multiple hidden onChange={(e) => addImages(e.target.files)} />
              </label>
            </div>
          </div>
        )}

        {tab === "tech" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Kafolat muddati">
              <input className={inputCls} value={f.warranty} onChange={(e) => set("warranty", e.target.value)} placeholder="12 oy" />
            </Field>
            <Field label="Quvvat / Asosiy ko'rsatkich">
              <input className={inputCls} value={f.power} onChange={(e) => set("power", e.target.value)} placeholder="780 W" />
            </Field>
          </div>
        )}
      </div>
    </Modal>
  );
}
