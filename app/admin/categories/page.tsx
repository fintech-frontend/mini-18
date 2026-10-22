"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { ExternalLink, Layers, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { slugify } from "@/lib/admin/slug";
import { Badge, Btn, Card, Confirm, Empty, Field, inputCls, Modal, PageHeader } from "@/components/admin/ui";
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetAdminCategoriesQuery,
  useUpdateCategoryMutation,
} from "@/lib/api/adminApi";
import { formatApiError } from "@/lib/apiError";
import { toastApiError } from "@/lib/admin/notify";
import type { ApiCategory } from "@/types/api";

export default function CategoriesPage() {
  const { data: categories = [], isLoading, error } = useGetAdminCategoriesQuery();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [q, setQ] = useState("");
  const [edit, setEdit] = useState<ApiCategory | "new" | null>(null);
  const [del, setDel] = useState<ApiCategory | null>(null);

  const byId = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories]);

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    return [...categories]
      .filter((c) => !s || (c.name + c.slug).toLowerCase().includes(s))
      .sort((a, b) => a.sort - b.sort || a.name.localeCompare(b.name));
  }, [categories, q]);

  const toggleActive = async (c: ApiCategory) => {
    try {
      await updateCategory({ id: c.id, body: { is_active: !c.is_active } }).unwrap();
      toast.success(c.is_active ? "Kategoriya saytdan yashirildi" : "Kategoriya saytda ko'rsatildi");
    } catch (err) {
      toastApiError(err);
    }
  };

  return (
    <>
      <PageHeader
        crumbs={["Asosiy", "Katalog", "Kategoriyalar"]}
        title="Kategoriyalar"
        subtitle="Saytdagi katalog bo'limlari. Faol kategoriyalar bosh sahifada va «Каталог» menyusida ko'rinadi."
        actions={
          <Btn variant="dark" onClick={() => setEdit("new")}>
            <Plus size={16} /> Yangi kategoriya
          </Btn>
        }
      />

      <Card>
        <div className="relative mb-4 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8794aa]" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Nomi yoki slug bo'yicha qidirish..." className={`${inputCls} pl-9`} />
        </div>

        {error && (
          <p className="mb-3 rounded-lg bg-[#fdecec] px-4 py-3 text-[13px] text-[#c0262d]">
            Kategoriyalarni yuklab bo&apos;lmadi: {formatApiError(error)}
          </p>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-[13px]">
            <thead>
              <tr className="bg-[#f6f8fc] text-[11px] uppercase tracking-wide text-[#6b7a90]">
                {["Kategoriya", "Slug", "Ota kategoriya", "Tartib", "Holat", ""].map((h) => (
                  <th key={h} className="px-3 py-3 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id} className="border-b border-[#eef1f6] last:border-0 hover:bg-[#fafbfe]">
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#eef2fb] text-[#186FD4]">
                        <Layers size={17} />
                      </span>
                      <span className="font-semibold">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 font-mono text-[12px] text-[#4a5a73]">{c.slug}</td>
                  <td className="px-3 py-3 text-[12px] text-[#4a5a73]">{c.parent ? byId.get(c.parent)?.name ?? `#${c.parent}` : "—"}</td>
                  <td className="px-3 py-3">{c.sort}</td>
                  <td className="px-3 py-3">
                    <button onClick={() => toggleActive(c)} title="Holatni almashtirish">
                      {c.is_active ? <Badge tone="green">Faol</Badge> : <Badge>Yashirin</Badge>}
                    </button>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex justify-end gap-1">
                      <a href={`/catalog/${c.slug}`} target="_blank" rel="noreferrer" className="rounded-lg p-2 text-[#16335f] hover:bg-[#eef2fb]" aria-label="Saytda ko'rish">
                        <ExternalLink size={16} />
                      </a>
                      <button onClick={() => setEdit(c)} className="rounded-lg p-2 text-[#16335f] hover:bg-[#eef2fb]" aria-label="Tahrirlash">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => setDel(c)} className="rounded-lg p-2 text-[#c0262d] hover:bg-[#fdecec]" aria-label="O'chirish">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {isLoading && <p className="py-10 text-center text-[13px] text-[#6b7a90]">Yuklanmoqda...</p>}
          {!isLoading && !error && rows.length === 0 && <Empty text="Kategoriyalar yo'q" />}
        </div>
      </Card>

      {edit && (
        <CategoryModal
          key={edit === "new" ? "new" : edit.id}
          category={edit === "new" ? null : edit}
          categories={categories}
          onClose={() => setEdit(null)}
        />
      )}
      <Confirm
        open={!!del}
        title="Kategoriyani o'chirish"
        text={`"${del?.name}" kategoriyasi o'chiriladi. Unga bog'langan mahsulotlar bo'lsa, server o'chirishga ruxsat bermasligi mumkin.`}
        onClose={() => setDel(null)}
        onYes={async () => {
          if (!del) return;
          try {
            await deleteCategory(del.id).unwrap();
            toast.success("Kategoriya o'chirildi");
          } catch (err) {
            toastApiError(err);
          }
        }}
      />
    </>
  );
}

function CategoryModal({
  category,
  categories,
  onClose,
}: {
  category: ApiCategory | null;
  categories: ApiCategory[];
  onClose: () => void;
}) {
  const isNew = !category;
  const [name, setName] = useState(category?.name ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [sort, setSort] = useState(String(category?.sort ?? 0));
  const [parent, setParent] = useState(category?.parent ? String(category.parent) : "");
  const [active, setActive] = useState(category?.is_active ?? true);

  const [createCategory, { isLoading: creating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: updating }] = useUpdateCategoryMutation();
  const saving = creating || updating;

  const save = async () => {
    const finalSlug = slug.trim() || slugify(name);
    if (!name.trim()) return toast.error("Kategoriya nomini kiriting");
    if (!finalSlug || !/^[-a-zA-Z0-9_]+$/.test(finalSlug)) return toast.error("Slug faqat lotin harflari, raqam, - va _ dan iborat bo'lishi kerak");

    const body = {
      name: name.trim(),
      slug: finalSlug,
      sort: parseInt(sort) || 0,
      is_active: active,
      parent: parent ? Number(parent) : null,
    };
    try {
      if (isNew) await createCategory(body).unwrap();
      else await updateCategory({ id: category.id, body }).unwrap();
      toast.success(isNew ? "Kategoriya qo'shildi — saytda ko'rinadi" : "Kategoriya saqlandi");
      onClose();
    } catch (err) {
      toastApiError(err);
    }
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={isNew ? "Yangi kategoriya" : `Tahrirlash: ${category.name}`}
      footer={
        <>
          <label className="mr-auto flex cursor-pointer items-center gap-2 text-[13px] text-[#4a5a73]">
            <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="h-4 w-4 accent-[#186FD4]" />
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
      <div className="space-y-4">
        <Field label="Nomi *">
          <input
            className={inputCls}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (!slugTouched) setSlug(slugify(e.target.value));
            }}
            placeholder="Электроинструмент"
          />
        </Field>
        <Field label="Slug (URL) *" hint={`Saytdagi manzil: /catalog/${slug || "slug"}`}>
          <input
            className={inputCls}
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugTouched(true);
            }}
            placeholder="elektroinstrument"
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Ota kategoriya">
            <select className={inputCls} value={parent} onChange={(e) => setParent(e.target.value)}>
              <option value="">— Yo&apos;q (asosiy) —</option>
              {categories
                .filter((c) => c.id !== category?.id)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </Field>
          <Field label="Tartib raqami" hint="Kichik raqam — oldinroq">
            <input className={inputCls} inputMode="numeric" value={sort} onChange={(e) => setSort(e.target.value.replace(/[^\d-]/g, ""))} />
          </Field>
        </div>
      </div>
    </Modal>
  );
}
