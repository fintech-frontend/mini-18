"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { AlertTriangle, ArrowDownToLine, ArrowUpFromLine, Boxes, Download, Package, PackageX, RefreshCw, Search, Wallet } from "lucide-react";
import { fmt, fmtShort, downloadCSV } from "@/lib/admin/format";
import { Badge, Btn, Card, Empty, Field, inputCls, Modal, PageHeader, Pagination, Progress, StatCard, Tabs, usePageSlice } from "@/components/admin/ui";
import { ApiMissing } from "@/components/admin/shared";
import { useGetAdminCategoriesQuery, useGetAdminProductsQuery, useUpdateProductMutation } from "@/lib/api/adminApi";
import { productImage } from "@/lib/adapters/products";
import { CURRENCY, money } from "@/lib/admin/orders";
import { formatApiError } from "@/lib/apiError";
import { toastApiError } from "@/lib/admin/notify";
import type { ApiProduct } from "@/types/api";

const PAGE = 12;
const LOW = 5; // shu miqdor va undan kam — "kam qolgan"
type Flt = "all" | "out" | "low";

const stockOf = (p: ApiProduct) => p.stock_quantity ?? 0;

export default function WarehousePage() {
  const { data, isLoading, isFetching, error, refetch } = useGetAdminProductsQuery({ page_size: 1000 });
  const { data: categories = [] } = useGetAdminCategoriesQuery();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [flt, setFlt] = useState<Flt>("all");
  const [page, setPage] = useState(1);
  const [move, setMove] = useState<{ p: ApiProduct; type: "in" | "out" | "set" } | null>(null);

  const products = useMemo(() => data?.results ?? [], [data]);
  const out = products.filter((p) => stockOf(p) <= 0);
  const low = products.filter((p) => stockOf(p) > 0 && stockOf(p) <= LOW);

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    return products
      .filter(
        (p) =>
          (!s || (p.name + p.article).toLowerCase().includes(s)) &&
          (!cat || String(p.category?.id) === cat) &&
          (flt === "all" || (flt === "out" ? stockOf(p) <= 0 : stockOf(p) > 0 && stockOf(p) <= LOW))
      )
      .sort((a, b) => stockOf(a) - stockOf(b));
  }, [products, q, cat, flt]);

  const { slice, pages, page: cur } = usePageSlice(rows, page, PAGE);
  const units = products.reduce((s, p) => s + stockOf(p), 0);
  const value = products.reduce((s, p) => s + stockOf(p) * money(p.price), 0);
  const maxStock = Math.max(1, ...products.map(stockOf));

  return (
    <>
      <PageHeader
        crumbs={["Asosiy", "Ombor"]}
        title="Ombor qoldiqlari"
        subtitle="Qoldiq mahsulotning stock_quantity maydonida saqlanadi — o'zgarishi saytdagi «в наличии» holatiga ta'sir qiladi."
        actions={
          <>
            <Btn variant="ghost" onClick={() => refetch()} disabled={isFetching}>
              <RefreshCw size={15} className={isFetching ? "animate-spin" : ""} /> Yangilash
            </Btn>
            <Btn
              variant="dark"
              onClick={() =>
                downloadCSV("ombor-qoldiqlari.csv", [
                  ["Nomi", "Artikul", "Kategoriya", "Qoldiq", "Narx", "Qiymat"],
                  ...rows.map((p) => [p.name, p.article, p.category?.name ?? "", stockOf(p), money(p.price), stockOf(p) * money(p.price)]),
                ])
              }
            >
              <Download size={15} /> Eksport
            </Btn>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard label="Jami mahsulot" icon={<Boxes size={18} />} value={fmt(products.length)} unit="ta" foot={`${fmt(units)} dona omborda`} />
        <StatCard dark label="Ombor qiymati" icon={<Wallet size={18} />} value={fmtShort(value)} unit={CURRENCY} foot="Sotuv narxida" />
        <StatCard label="Kam qolgan" icon={<AlertTriangle size={18} />} value={fmt(low.length)} unit="ta" foot={`${LOW} dona va undan kam`} />
        <StatCard label="Sotuvda yo'q" icon={<PackageX size={18} />} value={fmt(out.length)} unit="ta" />
      </div>

      <Card className="mt-4">
        <div className="mb-4 grid gap-3 md:grid-cols-[1fr_240px]">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8794aa]" />
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              placeholder="Nomi yoki artikul..."
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
            <option value="">Barcha kategoriyalar</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <Tabs
          value={flt}
          onChange={(v) => {
            setFlt(v);
            setPage(1);
          }}
          tabs={[
            { id: "all", label: "Barchasi", count: products.length },
            { id: "low", label: "Kam qolgan", count: low.length },
            { id: "out", label: "Sotuvda yo'q", count: out.length, tone: "red" },
          ]}
        />

        {error && <p className="mt-3 rounded-lg bg-[#fdecec] px-4 py-3 text-[13px] text-[#c0262d]">Mahsulotlarni yuklab bo&apos;lmadi: {formatApiError(error)}</p>}

        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-[13px]">
            <thead>
              <tr className="bg-[#f6f8fc] text-[11px] uppercase tracking-wide text-[#6b7a90]">
                {["Mahsulot", "Kategoriya", "Qoldiq", "Holat", "Amallar"].map((h) => (
                  <th key={h} className="px-3 py-3 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {slice.map((p) => {
                const st = stockOf(p);
                const img = productImage(p);
                return (
                  <tr key={p.id} className="border-b border-[#eef1f6] last:border-0 hover:bg-[#fafbfe]">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#eef2fb] text-[#186FD4]">
                          {img.includes("placeholder") ? (
                            <Package size={18} />
                          ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={img} alt="" className="h-full w-full object-cover" />
                          )}
                        </span>
                        <div className="min-w-0">
                          <div className="max-w-[300px] truncate font-semibold">{p.name}</div>
                          <div className="text-[11px] text-[#8794aa]">Artikul: {p.article}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-[12px] text-[#4a5a73]">{p.category?.name ?? "—"}</td>
                    <td className="w-[180px] px-3 py-3">
                      <div className={`mb-1 text-[12px] font-semibold ${st <= 0 ? "text-[#c0262d]" : ""}`}>{fmt(st)} dona</div>
                      <Progress value={(st / maxStock) * 100} color={st <= LOW ? "#d32027" : "#186FD4"} />
                    </td>
                    <td className="px-3 py-3">
                      {st <= 0 ? <Badge tone="red">Sotuvda yo&apos;q</Badge> : st <= LOW ? <Badge tone="amber">Kam qolgan</Badge> : <Badge tone="green">Yetarli</Badge>}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        <Btn size="sm" variant="soft" onClick={() => setMove({ p, type: "in" })}>
                          <ArrowDownToLine size={13} /> Kirim
                        </Btn>
                        <Btn size="sm" variant="soft" onClick={() => setMove({ p, type: "out" })} disabled={st <= 0}>
                          <ArrowUpFromLine size={13} /> Chiqim
                        </Btn>
                        <Btn size="sm" variant="ghost" onClick={() => setMove({ p, type: "set" })}>
                          Inventarizatsiya
                        </Btn>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {isLoading && <p className="py-10 text-center text-[13px] text-[#6b7a90]">Yuklanmoqda...</p>}
          {!isLoading && !error && rows.length === 0 && <Empty />}
        </div>
        <Pagination page={cur} pages={pages} onChange={setPage} info={<>Jami {rows.length} ta</>} />
      </Card>

      <Card className="mt-4" title="Xaridlar va ombor harakatlari tarixi">
        <ApiMissing
          title="Backend'da bu ma'lumot uchun API yo'q"
          text="Yetkazib beruvchilardan xaridlar, omborlar ro'yxati va kirim/chiqim tarixi serverda saqlanmaydi. Hozir faqat joriy qoldiqni o'zgartirish mumkin."
          endpoint="/api/purchases/, /api/stock-movements/, /api/warehouses/"
        />
      </Card>

      {move && <MoveModal key={`${move.p.id}-${move.type}`} product={move.p} type={move.type} onClose={() => setMove(null)} />}
    </>
  );
}

function MoveModal({ product, type, onClose }: { product: ApiProduct; type: "in" | "out" | "set"; onClose: () => void }) {
  const [updateProduct, { isLoading }] = useUpdateProductMutation();
  const [qty, setQty] = useState("");
  const current = stockOf(product);
  const n = parseInt(qty) || 0;
  const next = type === "in" ? current + n : type === "out" ? current - n : n;

  const titles = { in: "Kirim (omborga qabul)", out: "Chiqim (hisobdan chiqarish)", set: "Inventarizatsiya (aniq qoldiq)" };

  const save = async () => {
    if (type !== "set" && n <= 0) return toast.error("Miqdorni kiriting");
    if (next < 0) return toast.error(`Omborda faqat ${current} dona bor`);
    try {
      await updateProduct({ id: product.id, body: { stock_quantity: next } }).unwrap();
      toast.success(`${product.name}: qoldiq ${fmt(next)} dona`);
      onClose();
    } catch (err) {
      toastApiError(err);
    }
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={titles[type]}
      subtitle={`${product.name} • Artikul: ${product.article}`}
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
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={type === "set" ? "Haqiqiy qoldiq (dona)" : "Miqdor (dona)"}>
          <input autoFocus className={inputCls} inputMode="numeric" value={qty} onChange={(e) => setQty(e.target.value.replace(/\D/g, ""))} placeholder="0" />
        </Field>
        <div className="rounded-lg bg-[#f6f8fc] p-3 text-[13px]">
          <div className="text-[#6b7a90]">Hozir: {fmt(current)} dona</div>
          <div className={`mt-1 text-[16px] font-bold ${next < 0 ? "text-[#c0262d]" : ""}`}>Keyin: {fmt(next)} dona</div>
        </div>
      </div>
    </Modal>
  );
}
