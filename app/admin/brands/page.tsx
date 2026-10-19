"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { ImagePlus, Pencil, Plus, Search, Tag, Trash2, X } from "lucide-react";
import { slugify } from "@/lib/admin/slug";
import { Btn, Card, Confirm, Empty, Field, inputCls, Modal, PageHeader } from "@/components/admin/ui";
import {
  useCreateBrandMutation,
  useDeleteBrandMutation,
  useGetAdminBrandsQuery,
  useUpdateBrandMutation,
  useUploadBrandLogoMutation,
} from "@/lib/api/adminApi";
import { formatApiError } from "@/lib/apiError";
import { toastApiError } from "@/lib/admin/notify";
import type { ApiBrand } from "@/types/api";

export default function BrandsPage() {
  const { data: brands = [], isLoading, error } = useGetAdminBrandsQuery();
  const [deleteBrand] = useDeleteBrandMutation();
  const [q, setQ] = useState("");
  const [edit, setEdit] = useState<ApiBrand | "new" | null>(null);
  const [del, setDel] = useState<ApiBrand | null>(null);

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    return [...brands]
      .filter((b) => !s || (b.name + b.slug).toLowerCase().includes(s))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [brands, q]);

  return (
    <>
      <PageHeader
        crumbs={["Asosiy", "Katalog", "Brendlar"]}
        title="Brendlar"
        subtitle="Saytdagi «Популярные бренды» bo'limida va mahsulot kartochkalarida ko'rinadi."
        actions={
          <Btn variant="dark" onClick={() => setEdit("new")}>
            <Plus size={16} /> Yangi brend
          </Btn>
        }
      />

      <Card>
        <div className="relative mb-4 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8794aa]" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Brend nomi bo'yicha qidirish..." className={`${inputCls} pl-9`} />
        </div>

        {error && (
          <p className="mb-3 rounded-lg bg-[#fdecec] px-4 py-3 text-[13px] text-[#c0262d]">
            Brendlarni yuklab bo&apos;lmadi: {formatApiError(error)}
          </p>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-[13px]">
            <thead>
              <tr className="bg-[#f6f8fc] text-[11px] uppercase tracking-wide text-[#6b7a90]">
                {["Brend", "Slug", ""].map((h) => (
                  <th key={h} className="px-3 py-3 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((b) => (
                <tr key={b.id} className="border-b border-[#eef1f6] last:border-0 hover:bg-[#fafbfe]">
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#eef2fb] text-[#186FD4]">
                        {b.logo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={b.logo} alt="" className="h-full w-full object-contain p-1" />
                        ) : (
                          <Tag size={17} />
                        )}
                      </span>
                      <span className="font-semibold">{b.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 font-mono text-[12px] text-[#4a5a73]">{b.slug}</td>
                  <td className="px-3 py-3">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => setEdit(b)} className="rounded-lg p-2 text-[#16335f] hover:bg-[#eef2fb]" aria-label="Tahrirlash">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => setDel(b)} className="rounded-lg p-2 text-[#c0262d] hover:bg-[#fdecec]" aria-label="O'chirish">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {isLoading && <p className="py-10 text-center text-[13px] text-[#6b7a90]">Yuklanmoqda...</p>}
          {!isLoading && !error && rows.length === 0 && <Empty text="Brendlar yo'q" />}
        </div>
      </Card>

      {edit && <BrandModal key={edit === "new" ? "new" : edit.id} brand={edit === "new" ? null : edit} onClose={() => setEdit(null)} />}
      <Confirm
        open={!!del}
        title="Brendni o'chirish"
        text={`"${del?.name}" brendi o'chiriladi. Unga bog'langan mahsulotlar brendsiz qolishi yoki server o'chirishga ruxsat bermasligi mumkin.`}
        onClose={() => setDel(null)}
        onYes={async () => {
          if (!del) return;
          try {
            await deleteBrand(del.id).unwrap();
            toast.success("Brend o'chirildi");
          } catch (err) {
            toastApiError(err);
          }
        }}
      />
    </>
  );
}

function BrandModal({ brand, onClose }: { brand: ApiBrand | null; onClose: () => void }) {
  const isNew = !brand;
  const [name, setName] = useState(brand?.name ?? "");
  const [slug, setSlug] = useState(brand?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [removeLogo, setRemoveLogo] = useState(false);

  const [createBrand, { isLoading: creating }] = useCreateBrandMutation();
  const [updateBrand, { isLoading: updating }] = useUpdateBrandMutation();
  const [uploadLogo, { isLoading: uploading }] = useUploadBrandLogoMutation();
  const saving = creating || updating || uploading;

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const shownLogo = preview ?? (!removeLogo ? brand?.logo ?? null : null);

  const save = async () => {
    const finalSlug = slug.trim() || slugify(name);
    if (!name.trim()) return toast.error("Brend nomini kiriting");
    if (!finalSlug || !/^[-a-zA-Z0-9_]+$/.test(finalSlug)) return toast.error("Slug faqat lotin harflari, raqam, - va _ dan iborat bo'lishi kerak");

    const body = { name: name.trim(), slug: finalSlug };
    try {
      let id = brand?.id;
      if (isNew) id = (await createBrand(body).unwrap()).id;
      else await updateBrand({ id: brand.id, body: removeLogo && !file ? { ...body, logo: null } : body }).unwrap();

      if (file && id) {
        try {
          await uploadLogo({ id, file }).unwrap();
        } catch (err) {
          toastApiError(err, "Brend saqlandi, lekin logo yuklanmadi: ");
          return onClose();
        }
      }
      toast.success(isNew ? "Brend qo'shildi" : "Brend saqlandi");
      onClose();
    } catch (err) {
      toastApiError(err);
    }
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={isNew ? "Yangi brend" : `Tahrirlash: ${brand.name}`}
      footer={
        <>
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
            placeholder="Bosch"
          />
        </Field>
        <Field label="Slug *">
          <input
            className={inputCls}
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugTouched(true);
            }}
            placeholder="bosch"
          />
        </Field>
        <div>
          <div className="mb-1.5 text-[12px] font-medium text-[#4a5a73]">Logo</div>
          <div className="flex items-center gap-3">
            {shownLogo && (
              <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-[#eef2fb]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={shownLogo} alt="" className="h-full w-full object-contain p-2" />
                <button
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                    setRemoveLogo(true);
                  }}
                  className="absolute right-1 top-1 rounded-full bg-white p-0.5 text-[#c0262d] shadow"
                  aria-label="Logoni olib tashlash"
                >
                  <X size={12} />
                </button>
              </div>
            )}
            <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl bg-[#eef2fb] text-[11px] text-[#4a5a73] hover:bg-[#e1e8f7]">
              <ImagePlus size={20} className="text-[#186FD4]" />
              Yuklash
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const picked = e.target.files?.[0];
                  if (!picked) return;
                  if (picked.size > 2_000_000) return toast.error("Logo 2 MB dan katta");
                  setFile(picked);
                  setRemoveLogo(false);
                  e.target.value = "";
                }}
              />
            </label>
          </div>
        </div>
      </div>
    </Modal>
  );
}
