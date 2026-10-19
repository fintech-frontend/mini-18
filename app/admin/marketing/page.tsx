"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { ImagePlus, Megaphone, MessageSquare, Newspaper, Pencil, Plus, RefreshCw, Star, Trash2, X } from "lucide-react";
import { fmt, fmtDate, fmtDateTime } from "@/lib/admin/format";
import { Badge, Btn, Card, Confirm, Empty, Field, inputCls, Modal, PageHeader, StatCard, Tabs } from "@/components/admin/ui";
import {
  useCreateNewsMutation,
  useCreatePromotionMutation,
  useDeleteNewsMutation,
  useDeletePromotionMutation,
  useDeleteReviewMutation,
  useGetAdminNewsQuery,
  useGetAdminProductsQuery,
  useGetAdminPromotionsQuery,
  useGetAdminReviewsQuery,
  useUpdateNewsMutation,
  useUpdatePromotionMutation,
  useUploadNewsImageMutation,
  type ApiAdminReview,
  type ApiNews,
  type ApiPromotion,
  type NewsRubric,
} from "@/lib/api/adminApi";
import { slugify } from "@/lib/admin/slug";
import { formatApiError } from "@/lib/apiError";
import { toastApiError } from "@/lib/admin/notify";

type Tab = "promo" | "news" | "reviews";

const RUBRICS: Record<NewsRubric, string> = { news: "Новости", articles: "Статьи", tips: "Советы", reviews: "Обзоры" };

// ISO → <input type="datetime-local"> qiymati (mahalliy vaqt)
const toLocalInput = (iso?: string) => {
  const d = iso ? new Date(iso) : new Date();
  if (Number.isNaN(d.getTime())) return "";
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
};
const fromLocalInput = (v: string) => new Date(v).toISOString();
const ts = (iso?: string) => (iso ? new Date(iso).getTime() : 0);

export default function MarketingPage() {
  const [tab, setTab] = useState<Tab>("promo");
  const promos = useGetAdminPromotionsQuery();
  const news = useGetAdminNewsQuery();
  const reviews = useGetAdminReviewsQuery();
  const fetching = promos.isFetching || news.isFetching || reviews.isFetching;

  const [now] = useState(() => Date.now());
  const activePromos = (promos.data ?? []).filter((p) => p.is_active && ts(p.start_date) <= now && ts(p.end_date) >= now);

  return (
    <>
      <PageHeader
        crumbs={["Asosiy", "Marketing & Kontent"]}
        title="Marketing & Kontent"
        subtitle="Aksiyalar, yangiliklar va sharhlar — saytdagi «Акции», «Новости» va «Отзывы» bo'limlari."
        actions={
          <Btn
            variant="ghost"
            disabled={fetching}
            onClick={() => {
              promos.refetch();
              news.refetch();
              reviews.refetch();
            }}
          >
            <RefreshCw size={15} className={fetching ? "animate-spin" : ""} /> Yangilash
          </Btn>
        }
      />

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard dark label="Faol aksiyalar" icon={<Megaphone size={18} />} value={fmt(activePromos.length)} unit="ta" foot={`Jami: ${promos.data?.length ?? 0}`} />
        <StatCard label="Yangiliklar" icon={<Newspaper size={18} />} value={fmt(news.data?.length ?? 0)} unit="ta" foot={`Chop etilgan: ${(news.data ?? []).filter((n) => n.is_published).length}`} />
        <StatCard label="Mahsulot sharhlari" icon={<MessageSquare size={18} />} value={fmt(reviews.data?.length ?? 0)} unit="ta" />
        <StatCard
          label="O'rtacha baho"
          icon={<Star size={18} />}
          value={reviews.data?.length ? (reviews.data.reduce((s, r) => s + r.rating, 0) / reviews.data.length).toFixed(1) : "—"}
          unit="/ 5"
        />
      </div>

      <Card className="mt-4">
        <Tabs
          value={tab}
          onChange={setTab}
          tabs={[
            { id: "promo", label: "Aksiyalar", count: promos.data?.length },
            { id: "news", label: "Yangiliklar", count: news.data?.length },
            { id: "reviews", label: "Sharhlar", count: reviews.data?.length },
          ]}
        />
        <div className="mt-4">
          {tab === "promo" && <PromotionsTab list={promos.data ?? []} loading={promos.isLoading} error={promos.error} />}
          {tab === "news" && <NewsTab list={news.data ?? []} loading={news.isLoading} error={news.error} />}
          {tab === "reviews" && <ReviewsTab list={reviews.data ?? []} loading={reviews.isLoading} error={reviews.error} />}
        </div>
      </Card>
    </>
  );
}

function ErrorLine({ error }: { error: unknown }) {
  if (!error) return null;
  return <p className="mb-3 rounded-lg bg-[#fdecec] px-4 py-3 text-[13px] text-[#c0262d]">Yuklab bo&apos;lmadi: {formatApiError(error)}</p>;
}

/* =========================
   AKSIYALAR
========================= */

function PromotionsTab({ list, loading, error }: { list: ApiPromotion[]; loading: boolean; error: unknown }) {
  const [edit, setEdit] = useState<ApiPromotion | "new" | null>(null);
  const [del, setDel] = useState<ApiPromotion | null>(null);
  const [deletePromotion] = useDeletePromotionMutation();
  const [updatePromotion] = useUpdatePromotionMutation();
  const [now] = useState(() => Date.now());

  const state = (p: ApiPromotion) => {
    if (!p.is_active) return <Badge>O&apos;chirilgan</Badge>;
    if (ts(p.end_date) < now) return <Badge tone="gray">Tugagan</Badge>;
    if (ts(p.start_date) > now) return <Badge tone="amber">Rejalashtirilgan</Badge>;
    return <Badge tone="green">Faol</Badge>;
  };

  return (
    <>
      <div className="mb-3 flex justify-end">
        <Btn variant="dark" onClick={() => setEdit("new")}>
          <Plus size={16} /> Yangi aksiya
        </Btn>
      </div>
      <ErrorLine error={error} />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-[13px]">
          <thead>
            <tr className="bg-[#f6f8fc] text-[11px] uppercase tracking-wide text-[#6b7a90]">
              {["Aksiya", "Chegirma", "Muddat", "Holat", ""].map((h) => (
                <th key={h} className="px-3 py-3 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.id} className="border-b border-[#eef1f6] last:border-0 hover:bg-[#fafbfe]">
                <td className="px-3 py-3">
                  <div className="font-semibold">{p.title}</div>
                  {p.description && <div className="max-w-[360px] truncate text-[11px] text-[#8794aa]">{p.description}</div>}
                </td>
                <td className="px-3 py-3 font-bold text-[#c0262d]">-{parseFloat(p.discount_value) || 0}%</td>
                <td className="px-3 py-3 text-[12px] text-[#4a5a73]">
                  {fmtDate(ts(p.start_date))} — {fmtDate(ts(p.end_date))}
                </td>
                <td className="px-3 py-3">
                  <button
                    title="Yoqish / o'chirish"
                    onClick={async () => {
                      try {
                        await updatePromotion({ id: p.id, body: { is_active: !p.is_active } }).unwrap();
                      } catch (err) {
                        toastApiError(err);
                      }
                    }}
                  >
                    {state(p)}
                  </button>
                </td>
                <td className="px-3 py-3">
                  <RowActions onEdit={() => setEdit(p)} onDelete={() => setDel(p)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <p className="py-10 text-center text-[13px] text-[#6b7a90]">Yuklanmoqda...</p>}
        {!loading && !error && list.length === 0 && <Empty text="Aksiyalar yo'q" />}
      </div>

      {edit && <PromotionModal key={edit === "new" ? "new" : edit.id} promo={edit === "new" ? null : edit} onClose={() => setEdit(null)} />}
      <Confirm
        open={!!del}
        title="Aksiyani o'chirish"
        text={`"${del?.title}" aksiyasi saytdan o'chiriladi.`}
        onClose={() => setDel(null)}
        onYes={async () => {
          if (!del) return;
          try {
            await deletePromotion(del.id).unwrap();
            toast.success("Aksiya o'chirildi");
          } catch (err) {
            toastApiError(err);
          }
        }}
      />
    </>
  );
}

function PromotionModal({ promo, onClose }: { promo: ApiPromotion | null; onClose: () => void }) {
  const isNew = !promo;
  const [title, setTitle] = useState(promo?.title ?? "");
  const [description, setDescription] = useState(promo?.description ?? "");
  const [discount, setDiscount] = useState(promo ? String(parseFloat(promo.discount_value) || "") : "");
  const [start, setStart] = useState(toLocalInput(promo?.start_date));
  const [end, setEnd] = useState(() => toLocalInput(promo?.end_date ?? new Date(Date.now() + 30 * 86_400_000).toISOString()));
  const [active, setActive] = useState(promo?.is_active ?? true);
  const [create, { isLoading: c }] = useCreatePromotionMutation();
  const [update, { isLoading: u }] = useUpdatePromotionMutation();

  const save = async () => {
    const d = parseFloat(discount.replace(",", "."));
    if (!title.trim()) return toast.error("Aksiya nomini kiriting");
    if (!(d > 0 && d <= 100)) return toast.error("Chegirma 1–100% oralig'ida bo'lishi kerak");
    if (!start || !end || new Date(end) <= new Date(start)) return toast.error("Tugash sanasi boshlanishidan keyin bo'lishi kerak");
    const body = {
      title: title.trim(),
      description: description.trim(),
      discount_value: String(d),
      start_date: fromLocalInput(start),
      end_date: fromLocalInput(end),
      is_active: active,
    };
    try {
      if (isNew) await create(body).unwrap();
      else await update({ id: promo.id, body }).unwrap();
      toast.success(isNew ? "Aksiya qo'shildi — saytda ko'rinadi" : "Aksiya saqlandi");
      onClose();
    } catch (err) {
      toastApiError(err);
    }
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={isNew ? "Yangi aksiya" : `Tahrirlash: ${promo.title}`}
      footer={
        <>
          <ActiveToggle checked={active} onChange={setActive} label="Faol" />
          <Btn variant="soft" onClick={onClose}>
            Bekor qilish
          </Btn>
          <Btn variant="dark" onClick={save} disabled={c || u}>
            {c || u ? "Saqlanmoqda..." : "Saqlash"}
          </Btn>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Nomi *">
          <input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Всё для отопления" />
        </Field>
        <Field label="Tavsif">
          <textarea rows={3} className={inputCls} value={description} onChange={(e) => setDescription(e.target.value)} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Chegirma, % *">
            <input className={inputCls} inputMode="decimal" value={discount} onChange={(e) => setDiscount(e.target.value)} placeholder="30" />
          </Field>
          <Field label="Boshlanishi *">
            <input type="datetime-local" className={inputCls} value={start} onChange={(e) => setStart(e.target.value)} />
          </Field>
          <Field label="Tugashi *">
            <input type="datetime-local" className={inputCls} value={end} onChange={(e) => setEnd(e.target.value)} />
          </Field>
        </div>
      </div>
    </Modal>
  );
}

/* =========================
   YANGILIKLAR
========================= */

function NewsTab({ list, loading, error }: { list: ApiNews[]; loading: boolean; error: unknown }) {
  const [edit, setEdit] = useState<ApiNews | "new" | null>(null);
  const [del, setDel] = useState<ApiNews | null>(null);
  const [deleteNews] = useDeleteNewsMutation();

  return (
    <>
      <div className="mb-3 flex justify-end">
        <Btn variant="dark" onClick={() => setEdit("new")}>
          <Plus size={16} /> Yangi maqola
        </Btn>
      </div>
      <ErrorLine error={error} />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-[13px]">
          <thead>
            <tr className="bg-[#f6f8fc] text-[11px] uppercase tracking-wide text-[#6b7a90]">
              {["Sarlavha", "Rubrika", "Sana", "Holat", ""].map((h) => (
                <th key={h} className="px-3 py-3 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.map((n) => (
              <tr key={n.id} className="border-b border-[#eef1f6] last:border-0 hover:bg-[#fafbfe]">
                <td className="px-3 py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md bg-[#eef2fb] text-[#186FD4]">
                      {n.image_url || n.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={(n.image_url || n.image) as string} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <Newspaper size={16} />
                      )}
                    </span>
                    <div className="min-w-0">
                      <div className="max-w-[340px] truncate font-semibold">{n.title}</div>
                      {n.excerpt && <div className="max-w-[340px] truncate text-[11px] text-[#8794aa]">{n.excerpt}</div>}
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3 text-[12px]">{n.rubric_label ?? RUBRICS[n.rubric] ?? n.rubric}</td>
                <td className="px-3 py-3 text-[12px] text-[#4a5a73]">{fmtDate(ts(n.published_at || n.created_at))}</td>
                <td className="px-3 py-3">{n.is_published ? <Badge tone="green">Chop etilgan</Badge> : <Badge>Qoralama</Badge>}</td>
                <td className="px-3 py-3">
                  <RowActions onEdit={() => setEdit(n)} onDelete={() => setDel(n)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <p className="py-10 text-center text-[13px] text-[#6b7a90]">Yuklanmoqda...</p>}
        {!loading && !error && list.length === 0 && <Empty text="Yangiliklar yo'q" />}
      </div>

      {edit && <NewsModal key={edit === "new" ? "new" : edit.id} item={edit === "new" ? null : edit} onClose={() => setEdit(null)} />}
      <Confirm
        open={!!del}
        title="Maqolani o'chirish"
        text={`"${del?.title}" o'chiriladi.`}
        onClose={() => setDel(null)}
        onYes={async () => {
          if (!del) return;
          try {
            await deleteNews(del.id).unwrap();
            toast.success("Maqola o'chirildi");
          } catch (err) {
            toastApiError(err);
          }
        }}
      />
    </>
  );
}

function NewsModal({ item, onClose }: { item: ApiNews | null; onClose: () => void }) {
  const isNew = !item;
  const [title, setTitle] = useState(item?.title ?? "");
  const [slug, setSlug] = useState(item?.slug ?? "");
  const [rubric, setRubric] = useState<NewsRubric>(item?.rubric ?? "news");
  const [excerpt, setExcerpt] = useState(item?.excerpt ?? "");
  const [content, setContent] = useState(item?.content ?? "");
  const [publishedAt, setPublishedAt] = useState(toLocalInput(item?.published_at));
  const [published, setPublished] = useState(item?.is_published ?? true);
  const [productId, setProductId] = useState(item?.product?.id ? String(item.product.id) : "");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);

  const { data: products } = useGetAdminProductsQuery({ page_size: 1000 });
  const [create, { isLoading: c }] = useCreateNewsMutation();
  const [update, { isLoading: u }] = useUpdateNewsMutation();
  const [upload, { isLoading: up }] = useUploadNewsImageMutation();
  const saving = c || u || up;

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const existing = item?.image_url || item?.image || null;
  const shown = preview ?? (!removeImage ? existing : null);

  const save = async () => {
    if (!title.trim()) return toast.error("Sarlavhani kiriting");
    if (slug.trim() && !/^[-\w]+$/.test(slug.trim())) return toast.error("Slug faqat lotin harflari, raqam, - va _ dan iborat bo'lishi kerak");
    const body = {
      title: title.trim(),
      slug: slug.trim(),
      rubric,
      excerpt: excerpt.trim(),
      content: content.trim(),
      is_published: published,
      published_at: publishedAt ? fromLocalInput(publishedAt) : new Date().toISOString(),
      product_id: productId ? Number(productId) : null,
    };
    try {
      let id = item?.id;
      if (isNew) id = (await create(body).unwrap()).id;
      else await update({ id: item.id, body: removeImage && !file ? { ...body, image: null } : body }).unwrap();
      if (file && id) {
        try {
          await upload({ id, file }).unwrap();
        } catch (err) {
          toastApiError(err, "Maqola saqlandi, lekin rasm yuklanmadi: ");
          return onClose();
        }
      }
      toast.success(isNew ? "Maqola qo'shildi" : "Maqola saqlandi");
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
      title={isNew ? "Yangi maqola" : `Tahrirlash: ${item.title}`}
      footer={
        <>
          <ActiveToggle checked={published} onChange={setPublished} label="Chop etish" />
          <Btn variant="soft" onClick={onClose}>
            Bekor qilish
          </Btn>
          <Btn variant="dark" onClick={save} disabled={saving}>
            {saving ? "Saqlanmoqda..." : "Saqlash"}
          </Btn>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Sarlavha *">
          <input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Slug" hint="Bo'sh qolsa avtomatik">
            <input className={inputCls} value={slug} onChange={(e) => setSlug(e.target.value)} placeholder={slugify(title) || "slug"} />
          </Field>
          <Field label="Rubrika">
            <select className={inputCls} value={rubric} onChange={(e) => setRubric(e.target.value as NewsRubric)}>
              {Object.entries(RUBRICS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Chop etish sanasi">
            <input type="datetime-local" className={inputCls} value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} />
          </Field>
        </div>
        <Field label="Qisqa matn (anons)">
          <textarea rows={2} className={inputCls} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
        </Field>
        <Field label="Matn">
          <textarea rows={7} className={inputCls} value={content} onChange={(e) => setContent(e.target.value)} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Bog'langan mahsulot (ixtiyoriy)">
            <select className={inputCls} value={productId} onChange={(e) => setProductId(e.target.value)}>
              <option value="">— Yo&apos;q —</option>
              {(products?.results ?? []).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </Field>
          <div>
            <div className="mb-1.5 text-[12px] font-medium text-[#4a5a73]">Rasm</div>
            <div className="flex items-center gap-3">
              {shown && (
                <div className="relative h-16 w-24 overflow-hidden rounded-lg bg-[#eef2fb]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={shown} alt="" className="h-full w-full object-cover" />
                  <button
                    onClick={() => {
                      setFile(null);
                      setPreview(null);
                      setRemoveImage(true);
                    }}
                    className="absolute right-1 top-1 rounded-full bg-white p-0.5 text-[#c0262d] shadow"
                    aria-label="Rasmni olib tashlash"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
              <label className="flex h-16 w-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg bg-[#eef2fb] text-[11px] text-[#4a5a73] hover:bg-[#e1e8f7]">
                <ImagePlus size={18} className="text-[#186FD4]" />
                Yuklash
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    if (f.size > 5_000_000) return toast.error("Rasm 5 MB dan katta");
                    setFile(f);
                    setRemoveImage(false);
                    e.target.value = "";
                  }}
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

/* =========================
   SHARHLAR
========================= */

function ReviewsTab({ list, loading, error }: { list: ApiAdminReview[]; loading: boolean; error: unknown }) {
  const [del, setDel] = useState<ApiAdminReview | null>(null);
  const [deleteReview] = useDeleteReviewMutation();
  const sorted = useMemo(() => [...list].sort((a, b) => ts(b.created_at) - ts(a.created_at)), [list]);

  return (
    <>
      <ErrorLine error={error} />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-[13px]">
          <thead>
            <tr className="bg-[#f6f8fc] text-[11px] uppercase tracking-wide text-[#6b7a90]">
              {["Mahsulot", "Muallif", "Baho", "Sharh", "Sana", "Holat", ""].map((h) => (
                <th key={h} className="px-3 py-3 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr key={r.id} className="border-b border-[#eef1f6] align-top last:border-0 hover:bg-[#fafbfe]">
                <td className="max-w-[180px] truncate px-3 py-3 font-semibold">{r.product_name ?? `#${r.product}`}</td>
                <td className="px-3 py-3 text-[#4a5a73]">{r.user_name || r.user_email || (r.user ? `#${r.user}` : "—")}</td>
                <td className="whitespace-nowrap px-3 py-3 text-[#f0a500]">
                  {"★".repeat(r.rating)}
                  <span className="text-[#d5deec]">{"★".repeat(Math.max(0, 5 - r.rating))}</span>
                </td>
                <td className="max-w-[300px] px-3 py-3 text-[12px] text-[#4a5a73]">{r.text || "—"}</td>
                <td className="whitespace-nowrap px-3 py-3 text-[12px] text-[#4a5a73]">{fmtDateTime(ts(r.created_at))}</td>
                <td className="px-3 py-3">{r.is_approved ? <Badge tone="green">Tasdiqlangan</Badge> : <Badge tone="amber">Moderatsiyada</Badge>}</td>
                <td className="px-3 py-3">
                  <div className="flex justify-end">
                    <button onClick={() => setDel(r)} className="rounded-lg p-2 text-[#c0262d] hover:bg-[#fdecec]" aria-label="O'chirish">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <p className="py-10 text-center text-[13px] text-[#6b7a90]">Yuklanmoqda...</p>}
        {!loading && !error && list.length === 0 && <Empty text="Sharhlar yo'q" />}
      </div>
      <p className="mt-3 text-[12px] text-[#8794aa]">
        Sharhni tasdiqlash (is_approved) API&apos;da faqat o&apos;qish uchun — uni Django admin orqali o&apos;zgartirish kerak. Bu yerdan sharhni o&apos;chirish mumkin.
      </p>
      <Confirm
        open={!!del}
        title="Sharhni o'chirish"
        text="Sharh butunlay o'chiriladi."
        onClose={() => setDel(null)}
        onYes={async () => {
          if (!del) return;
          try {
            await deleteReview(del.id).unwrap();
            toast.success("Sharh o'chirildi");
          } catch (err) {
            toastApiError(err);
          }
        }}
      />
    </>
  );
}

/* =========================
   UMUMIY
========================= */

function RowActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex justify-end gap-1">
      <button onClick={onEdit} className="rounded-lg p-2 text-[#16335f] hover:bg-[#eef2fb]" aria-label="Tahrirlash">
        <Pencil size={16} />
      </button>
      <button onClick={onDelete} className="rounded-lg p-2 text-[#c0262d] hover:bg-[#fdecec]" aria-label="O'chirish">
        <Trash2 size={16} />
      </button>
    </div>
  );
}

function ActiveToggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="mr-auto flex cursor-pointer items-center gap-2 text-[13px] text-[#4a5a73]">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-[#186FD4]" />
      {label}
    </label>
  );
}
