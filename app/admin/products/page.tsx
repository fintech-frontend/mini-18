"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Boxes, Download, ExternalLink, Flame, ImagePlus, Layers, Package, PackageX, Pencil, Plus, RefreshCw, Search, Tag, Trash2, X } from "lucide-react";
import { fmt, downloadCSV } from "@/lib/admin/format";
import { uniqueSlug } from "@/lib/admin/slug";
import { Badge, Btn, Card, Confirm, Empty, Field, inputCls, Modal, PageHeader, Pagination, StatCard, Tabs } from "@/components/admin/ui";
import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetAdminBrandsQuery,
  useGetAdminCategoriesQuery,
  useGetAdminProductsQuery,
  useUpdateProductMutation,
  useUploadProductImageMutation,
  type AdminProductsArgs,
  type ProductWrite,
} from "@/lib/api/adminApi";
import { productImage } from "@/lib/adapters/products";
import { formatApiError } from "@/lib/apiError";
import { toastApiError } from "@/lib/admin/notify";
import type { ApiProduct } from "@/types/api";

const PAGE = 10;
type Filter = "all" | "out" | "hit";

/** Kiritish uchun bir oz kechikish bilan yangilanadigan qiymat (har harfda so'rov ketmasin) */
function useDebounced<T>(value: T, ms = 400) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

export default function ProductsPage() {
  return (
    <Suspense fallback={null}>
      <Products />
    </Suspense>
  );
}

function Products() {
  const sp = useSearchParams();
  const router = useRouter();
  const [q, setQ] = useState(sp.get("q") ?? "");
  const [cat, setCat] = useState("");
  const [flt, setFlt] = useState<Filter>(sp.get("filter") === "out" ? "out" : "all");
  const [sort, setSort] = useState("-created_at");
  const [page, setPage] = useState(1);
  const [edit, setEdit] = useState<ApiProduct | "new" | null>(null);
  const [del, setDel] = useState<ApiProduct | null>(null);

  // URL o'zgarsa (yon menyu / qidiruv) filtrlar yangilanadi
  const spq = sp.get("q");
  const spf = sp.get("filter");
  const spn = sp.get("new");
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQ(spq ?? "");
    setFlt(spf === "out" ? "out" : "all");
    setPage(1);
  }, [spq, spf]);
  useEffect(() => {
    if (spn) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEdit("new");
      router.replace("/admin/products");
    }
  }, [spn, router]);

  const search = useDebounced(q.trim());
  const args: AdminProductsArgs = {
    page,
    page_size: PAGE,
    search: search || undefined,
    category: cat || undefined,
    ordering: sort,
    in_stock: flt === "out" ? false : undefined,
    is_hit: flt === "hit" ? true : undefined,
  };
  const { data, isLoading, isFetching, error, refetch } = useGetAdminProductsQuery(args);
  // Statistika uchun yengil so'rovlar (faqat count kerak)
  const { data: allStat } = useGetAdminProductsQuery({ page_size: 1 });
  const { data: outStat } = useGetAdminProductsQuery({ page_size: 1, in_stock: false });
  const { data: hitStat } = useGetAdminProductsQuery({ page_size: 1, is_hit: true });
  const { data: categories = [] } = useGetAdminCategoriesQuery();
  const { data: brands = [] } = useGetAdminBrandsQuery();
  const [deleteProduct] = useDeleteProductMutation();

  const rows = data?.results ?? [];
  const total = data?.count ?? 0;
  const pages = Math.max(1, Math.ceil(total / PAGE));

  const resetPage = () => setPage(1);

  return (
    <>
      <PageHeader
        crumbs={["Asosiy", "Katalog", "Mahsulotlar"]}
        title="Mahsulotlar katalogi"
        subtitle="Ma'lumotlar saytdagi katalog bilan bir xil — bu yerda qo'shilgan mahsulot saytda darhol ko'rinadi."
        actions={
          <>
            <Btn variant="ghost" onClick={() => refetch()} disabled={isFetching}>
              <RefreshCw size={15} className={isFetching ? "animate-spin" : ""} /> Yangilash
            </Btn>
            <Btn
              variant="ghost"
              onClick={() =>
                downloadCSV("mahsulotlar.csv", [
                  ["Nomi", "Artikul", "Kategoriya", "Brend", "Narx", "Eski narx", "Qoldiq", "Faol", "Xit"],
                  ...rows.map((p) => [
                    p.name,
                    p.article,
                    p.category?.name ?? "",
                    p.brand?.name ?? "",
                    p.price,
                    p.old_price ?? "",
                    p.stock_quantity ?? 0,
                    p.is_active ? "ha" : "yo'q",
                    p.is_hit ? "ha" : "yo'q",
                  ]),
                ])
              }
            >
              <Download size={15} /> Eksport
            </Btn>
            <Btn variant="dark" onClick={() => setEdit("new")}>
              <Plus size={16} /> Yangi mahsulot
            </Btn>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard label="Jami mahsulot" icon={<Boxes size={18} />} value={fmt(allStat?.count ?? 0)} unit="ta" />
        <StatCard label="Sotuvda yo'q" icon={<PackageX size={18} />} value={fmt(outStat?.count ?? 0)} unit="ta" foot="Qoldiq 0" />
        <StatCard label="Kategoriyalar" icon={<Layers size={18} />} value={fmt(categories.length)} unit="ta" foot={<Link href="/admin/categories" className="text-[#186FD4] hover:underline">Boshqarish →</Link>} />
        <StatCard label="Brendlar" icon={<Tag size={18} />} value={fmt(brands.length)} unit="ta" foot={<Link href="/admin/brands" className="text-[#186FD4] hover:underline">Boshqarish →</Link>} />
      </div>

      <Card className="mt-4">
        <div className="mb-4 grid gap-3 md:grid-cols-[1fr_220px_190px]">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8794aa]" />
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                resetPage();
              }}
              placeholder="Nomi yoki artikul bo'yicha qidirish..."
              className={`${inputCls} pl-9`}
            />
          </div>
          <select
            value={cat}
            onChange={(e) => {
              setCat(e.target.value);
              resetPage();
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
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              resetPage();
            }}
            className={inputCls}
          >
            <option value="-created_at">Saralash: Yangilari</option>
            <option value="name">Nomi (A-Z)</option>
            <option value="-price">Narx (yuqori)</option>
            <option value="price">Narx (past)</option>
            <option value="stock_quantity">Qoldiq (kam)</option>
          </select>
        </div>
        <Tabs
          value={flt}
          onChange={(v) => {
            setFlt(v);
            resetPage();
          }}
          tabs={[
            { id: "all", label: "Barchasi", count: allStat?.count },
            { id: "out", label: "Sotuvda yo'q", count: outStat?.count, tone: "red" },
            { id: "hit", label: "Xit", count: hitStat?.count },
          ]}
        />

        {error && (
          <p className="mt-3 rounded-lg bg-[#fdecec] px-4 py-3 text-[13px] text-[#c0262d]">
            Mahsulotlarni yuklab bo&apos;lmadi: {formatApiError(error)}
          </p>
        )}

        <div className={`mt-3 overflow-x-auto transition-opacity ${isFetching && !isLoading ? "opacity-60" : ""}`}>
          <table className="w-full min-w-[860px] text-left text-[13px]">
            <thead>
              <tr className="bg-[#f6f8fc] text-[11px] uppercase tracking-wide text-[#6b7a90]">
                {["Mahsulot", "Kategoriya", "Narx", "Qoldiq", "Holat", ""].map((h) => (
                  <th key={h} className="px-3 py-3 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => {
                const img = productImage(p);
                const hasImg = !img.includes("placeholder");
                const stock = p.stock_quantity ?? 0;
                return (
                  <tr key={p.id} className="border-b border-[#eef1f6] last:border-0 hover:bg-[#fafbfe]">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#eef2fb] text-[#186FD4]">
                          {hasImg ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={img} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <Package size={20} />
                          )}
                        </span>
                        <div className="min-w-0">
                          <div className="flex max-w-[320px] items-center gap-1.5 font-semibold">
                            <span className="truncate">{p.name}</span>
                            {p.is_hit && <Flame size={13} className="shrink-0 text-[#e8590c]" />}
                          </div>
                          <div className="text-[11px] text-[#8794aa]">
                            Artikul: {p.article}
                            {p.brand && <> • {p.brand.name}</>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-[12px] text-[#4a5a73]">{p.category?.name ?? "—"}</td>
                    <td className="px-3 py-3">
                      <div className="font-semibold">{fmt(parseFloat(p.price))} ₽</div>
                      {p.old_price && <div className="text-[11px] text-[#8794aa] line-through">{fmt(parseFloat(p.old_price))} ₽</div>}
                    </td>
                    <td className={`px-3 py-3 font-semibold ${stock <= 0 ? "text-[#c0262d]" : ""}`}>{fmt(stock)} dona</td>
                    <td className="px-3 py-3">
                      {!p.is_active ? <Badge>Yashirin</Badge> : stock <= 0 ? <Badge tone="red">Sotuvda yo&apos;q</Badge> : <Badge tone="green">Faol</Badge>}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex justify-end gap-1">
                        <a
                          href={`/products/${p.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-lg p-2 text-[#16335f] hover:bg-[#eef2fb]"
                          aria-label="Saytda ko'rish"
                        >
                          <ExternalLink size={16} />
                        </a>
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
          {isLoading && <p className="py-10 text-center text-[13px] text-[#6b7a90]">Yuklanmoqda...</p>}
          {!isLoading && !error && rows.length === 0 && <Empty />}
        </div>
        <Pagination
          page={Math.min(page, pages)}
          pages={pages}
          onChange={setPage}
          info={
            <>
              Ko&apos;rsatilmoqda: {total ? (page - 1) * PAGE + 1 : 0} - {Math.min(page * PAGE, total)} / jami {total} ta
            </>
          }
        />
      </Card>

      {edit && (
        <ProductModal
          key={edit === "new" ? "new" : edit.id}
          product={edit === "new" ? null : edit}
          onClose={() => setEdit(null)}
        />
      )}
      <Confirm
        open={!!del}
        title="Mahsulotni o'chirish"
        text={`"${del?.name}" mahsuloti katalogdan va saytdan o'chiriladi. Davom etasizmi?`}
        onClose={() => setDel(null)}
        onYes={async () => {
          if (!del) return;
          try {
            await deleteProduct(del.id).unwrap();
            toast.success("Mahsulot o'chirildi");
          } catch (err) {
            toastApiError(err);
          }
        }}
      />
    </>
  );
}

/* =========================
   MAHSULOT FORMASI
========================= */

type Tab = "main" | "price" | "media" | "tech";

type Form = {
  name: string;
  slug: string;
  article: string;
  category_id: string;
  brand_id: string;
  price: string;
  old_price: string;
  stock_quantity: string;
  description: string;
  is_active: boolean;
  is_hit: boolean;
  material: string;
  color: string;
  length_mm: string;
  width_mm: string;
  height_mm: string;
  weight_kg: string;
};

const s = (v: unknown) => (v === null || v === undefined ? "" : String(v));
const decimalOrNull = (v: string) => (v.trim() === "" ? null : v.trim().replace(",", "."));
// API o'lcham/narx maydonlari faqat son qabul qiladi ("156 mm" emas, "156")
const onlyNumber = (v: string) => v.replace(/[^0-9.,]/g, "");

function toForm(p: ApiProduct | null): Form {
  return {
    name: s(p?.name),
    slug: s(p?.slug),
    article: s(p?.article),
    category_id: s(p?.category?.id),
    brand_id: s(p?.brand?.id),
    price: p ? s(parseFloat(p.price)) : "",
    old_price: p?.old_price ? s(parseFloat(p.old_price)) : "",
    stock_quantity: s(p?.stock_quantity ?? ""),
    description: s(p?.description),
    is_active: p?.is_active ?? true,
    is_hit: p?.is_hit ?? false,
    material: s(p?.material),
    color: s(p?.color),
    length_mm: s(p?.length_mm),
    width_mm: s(p?.width_mm),
    height_mm: s(p?.height_mm),
    weight_kg: s(p?.weight_kg),
  };
}

function ProductModal({ product, onClose }: { product: ApiProduct | null; onClose: () => void }) {
  const isNew = !product;
  const [f, setF] = useState<Form>(() => toForm(product));
  const [tab, setTab] = useState<Tab>("main");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const existingImage = product ? productImage(product) : "";
  const [removeImage, setRemoveImage] = useState(false);

  const { data: categories = [] } = useGetAdminCategoriesQuery();
  const { data: brands = [] } = useGetAdminBrandsQuery();
  const [createProduct, { isLoading: creating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: updating }] = useUpdateProductMutation();
  const [uploadImage, { isLoading: uploading }] = useUploadProductImageMutation();
  const saving = creating || updating || uploading;

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((p) => ({ ...p, [k]: v }));

  // Yangi tanlangan rasm uchun ko'rinish
  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const price = parseFloat(f.price.replace(",", ".")) || 0;
  const oldPrice = parseFloat(f.old_price.replace(",", ".")) || 0;
  const discount = oldPrice > price && price > 0 ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;

  const shownImage = preview ?? (!removeImage && existingImage && !existingImage.includes("placeholder") ? existingImage : null);

  const save = async () => {
    if (!f.name.trim()) return toast.error("Mahsulot nomini kiriting"), setTab("main");
    if (!f.article.trim()) return toast.error("Artikulni kiriting"), setTab("main");
    if (!f.category_id) return toast.error("Kategoriyani tanlang"), setTab("main");
    if (price <= 0) return toast.error("Narxni kiriting"), setTab("price");
    if (f.slug && !/^[-a-zA-Z0-9_]+$/.test(f.slug)) return toast.error("Slug faqat lotin harflari, raqam, - va _ dan iborat bo'lishi kerak"), setTab("main");

    const body: ProductWrite = {
      name: f.name.trim(),
      slug: f.slug.trim() || uniqueSlug(f.name),
      article: f.article.trim(),
      category_id: Number(f.category_id),
      brand_id: f.brand_id ? Number(f.brand_id) : null,
      price: String(price),
      old_price: oldPrice > 0 ? String(oldPrice) : null,
      stock_quantity: Math.max(0, parseInt(f.stock_quantity) || 0),
      description: f.description.trim(),
      is_active: f.is_active,
      is_hit: f.is_hit,
      material: f.material.trim(),
      color: f.color.trim(),
      length_mm: decimalOrNull(f.length_mm),
      width_mm: decimalOrNull(f.width_mm),
      height_mm: decimalOrNull(f.height_mm),
      weight_kg: decimalOrNull(f.weight_kg),
    };

    try {
      let id = product?.id;
      if (isNew) {
        const created = await createProduct(body).unwrap();
        id = created.id;
      } else {
        await updateProduct({ id: product.id, body: removeImage && !file ? { ...body, image: null } : body }).unwrap();
      }
      if (file && id) {
        try {
          await uploadImage({ id, file }).unwrap();
        } catch (err) {
          toastApiError(err, "Mahsulot saqlandi, lekin rasm yuklanmadi: ");
          return onClose();
        }
      }
      toast.success(isNew ? "Mahsulot qo'shildi — saytda ko'rinadi" : "Mahsulot saqlandi");
      onClose();
    } catch (err) {
      toastApiError(err);
    }
  };

  return (
    <Modal
      open
      wide
      onClose={onClose}
      title={isNew ? "Yangi mahsulot" : `Tahrirlash: ${product.name}`}
      subtitle={f.article && <>Artikul: {f.article}</>}
      footer={
        <>
          <label className="mr-auto flex cursor-pointer items-center gap-2 text-[13px] text-[#4a5a73]">
            <input type="checkbox" checked={f.is_active} onChange={(e) => set("is_active", e.target.checked)} className="h-4 w-4 accent-[#186FD4]" />
            Saytda ko&apos;rsatish
          </label>
          <Btn variant="soft" onClick={onClose}>
            Bekor qilish
          </Btn>
          <Btn variant="dark" onClick={save} disabled={saving}>
            {saving ? "Saqlanmoqda..." : "Saqlash"}
          </Btn>
        </>
      }
    >
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "main", label: "Umumiy ma'lumot" },
          { id: "price", label: "Narx va qoldiq" },
          { id: "media", label: "Rasm", count: shownImage ? 1 : 0 },
          { id: "tech", label: "Texnik xususiyatlar" },
        ]}
      />
      <div className="mt-5 space-y-4">
        {tab === "main" && (
          <>
            <Field label="Mahsulot nomi *">
              <input className={inputCls} value={f.name} onChange={(e) => set("name", e.target.value)} placeholder="Перфоратор Makita HR2470 780W" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Artikul *">
                <input className={inputCls} value={f.article} onChange={(e) => set("article", e.target.value)} placeholder="MKT-HR2470" />
              </Field>
              <Field label="Slug (URL)" hint={isNew ? "Bo'sh qolsa nomdan avtomatik yaratiladi" : "Saytdagi manzil: /products/slug"}>
                <input className={inputCls} value={f.slug} onChange={(e) => set("slug", e.target.value)} placeholder="perforator-makita-1234" />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Kategoriya *">
                <select className={inputCls} value={f.category_id} onChange={(e) => set("category_id", e.target.value)}>
                  <option value="">— Tanlang —</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                      {!c.is_active ? " (yashirin)" : ""}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Brend">
                <select className={inputCls} value={f.brand_id} onChange={(e) => set("brand_id", e.target.value)}>
                  <option value="">— Brendsiz —</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            {categories.length === 0 && (
              <p className="rounded-lg bg-[#fff3d9] px-3 py-2 text-[12px] text-[#9a6200]">
                Kategoriyalar yo&apos;q. Avval{" "}
                <Link href="/admin/categories" className="font-semibold underline">
                  kategoriya qo&apos;shing
                </Link>
                .
              </p>
            )}
            <Field label="Tavsif">
              <textarea rows={4} className={inputCls} value={f.description} onChange={(e) => set("description", e.target.value)} />
            </Field>
            <label className="flex cursor-pointer items-center gap-2 text-[13px] text-[#4a5a73]">
              <input type="checkbox" checked={f.is_hit} onChange={(e) => set("is_hit", e.target.checked)} className="h-4 w-4 accent-[#186FD4]" />
              <Flame size={14} className="text-[#e8590c]" /> «ХИТ» belgisi (saytda «Хиты продаж» bo&apos;limida chiqadi)
            </label>
          </>
        )}

        {tab === "price" && (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Narx (₽) *">
                <input className={inputCls} inputMode="decimal" value={f.price} onChange={(e) => set("price", onlyNumber(e.target.value))} placeholder="0" />
              </Field>
              <Field label="Eski narx (₽)" hint="Chegirma ko'rsatish uchun">
                <input className={inputCls} inputMode="decimal" value={f.old_price} onChange={(e) => set("old_price", onlyNumber(e.target.value))} placeholder="—" />
              </Field>
              <Field label="Ombordagi qoldiq (dona)">
                <input className={inputCls} inputMode="numeric" value={f.stock_quantity} onChange={(e) => set("stock_quantity", e.target.value.replace(/\D/g, ""))} placeholder="0" />
              </Field>
            </div>
            {discount > 0 && (
              <div className="rounded-lg bg-[#e2f6ea] p-3 text-[13px] text-[#12713c]">
                Saytda chegirma ko&apos;rsatiladi: <b>-{discount}%</b>
              </div>
            )}
            {oldPrice > 0 && oldPrice <= price && (
              <div className="rounded-lg bg-[#fff3d9] p-3 text-[13px] text-[#9a6200]">Eski narx joriy narxdan katta bo&apos;lishi kerak, aks holda chegirma ko&apos;rinmaydi.</div>
            )}
          </>
        )}

        {tab === "media" && (
          <div>
            <div className="mb-2 text-[12px] font-medium text-[#4a5a73]">Asosiy rasm (saytdagi kartochkada ko&apos;rinadi)</div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {shownImage && (
                <div className="group relative aspect-square overflow-hidden rounded-xl bg-[#eef2fb]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={shownImage} alt="" className="h-full w-full object-contain" />
                  <button
                    onClick={() => {
                      setFile(null);
                      setPreview(null);
                      setRemoveImage(true);
                    }}
                    className="absolute right-2 top-2 rounded-full bg-white p-1 text-[#c0262d] shadow"
                    aria-label="Rasmni olib tashlash"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-xl bg-[#eef2fb] text-[12px] text-[#4a5a73] hover:bg-[#e1e8f7]">
                <ImagePlus size={26} className="text-[#186FD4]" />
                {shownImage ? "Rasmni almashtirish" : "+ Rasm yuklash"}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const picked = e.target.files?.[0];
                    if (!picked) return;
                    if (picked.size > 5_000_000) return toast.error("Rasm 5 MB dan katta");
                    setFile(picked);
                    setRemoveImage(false);
                    e.target.value = "";
                  }}
                />
              </label>
            </div>
          </div>
        )}

        {tab === "tech" && (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Material">
                <input className={inputCls} value={f.material} onChange={(e) => set("material", e.target.value)} placeholder="Металл" />
              </Field>
              <Field label="Rang">
                <input className={inputCls} value={f.color} onChange={(e) => set("color", e.target.value)} placeholder="Синий" />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-4">
              <Field label="Uzunlik, mm">
                <input className={inputCls} inputMode="decimal" value={f.length_mm} onChange={(e) => set("length_mm", onlyNumber(e.target.value))} />
              </Field>
              <Field label="Kenglik, mm">
                <input className={inputCls} inputMode="decimal" value={f.width_mm} onChange={(e) => set("width_mm", onlyNumber(e.target.value))} />
              </Field>
              <Field label="Balandlik, mm">
                <input className={inputCls} inputMode="decimal" value={f.height_mm} onChange={(e) => set("height_mm", onlyNumber(e.target.value))} />
              </Field>
              <Field label="Og'irlik, kg" hint="Masalan: 180 g = 0.18">
                <input className={inputCls} inputMode="decimal" value={f.weight_kg} onChange={(e) => set("weight_kg", onlyNumber(e.target.value))} />
              </Field>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
