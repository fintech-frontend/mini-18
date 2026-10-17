"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Megaphone, Pencil, Plus, Tag, Trash2 } from "lucide-react";
import { actions, uid, useDB, type Promo } from "@/lib/admin/db";
import { Badge, Btn, Card, Confirm, Empty, Field, inputCls, Modal, PageHeader, StatCard } from "@/components/admin/ui";

const blank = (): Promo => ({ id: uid("pr"), title: "", code: "", discount: 10, endDate: "", active: true });

export default function MarketingPage() {
  const db = useDB();
  const [edit, setEdit] = useState<Promo | null>(null);
  const [del, setDel] = useState<Promo | null>(null);
  const active = db.promos.filter((p) => p.active);

  return (
    <>
      <PageHeader
        crumbs={["Marketing", "Aksiyalar va promokodlar"]}
        title="Marketing & Kontent"
        subtitle="Saytda ko'rinadigan aksiyalar va chegirma promokodlarini boshqarish"
        actions={
          <Btn variant="dark" onClick={() => setEdit(blank())}>
            <Plus size={16} /> Yangi aksiya
          </Btn>
        }
      />
      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Jami aksiyalar" icon={<Megaphone size={18} />} value={String(db.promos.length)} unit="ta" />
        <StatCard label="Faol aksiyalar" icon={<Tag size={18} />} value={String(active.length)} unit="ta" />
        <StatCard label="O'rtacha chegirma" icon={<Tag size={18} />} value={active.length ? (active.reduce((s, p) => s + p.discount, 0) / active.length).toFixed(1) : "0"} unit="%" />
      </div>

      <Card className="mt-4">
        {db.promos.length === 0 && <Empty text="Aksiyalar yo'q" />}
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {db.promos.map((p) => (
            <div key={p.id} className="rounded-xl border border-[#e8edf5] p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-[15px] font-semibold">{p.title}</div>
                  <div className="mt-1 text-[12px] text-[#6b7a90]">Tugash sanasi: {p.endDate || "—"}</div>
                </div>
                <span className="rounded-lg bg-[#06214a] px-2.5 py-1.5 text-[15px] font-bold text-white">-{p.discount}%</span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(p.code);
                    toast.success("Promokod nusxalandi");
                  }}
                  className="rounded-md border border-dashed border-[#186FD4] bg-[#eef2fb] px-2.5 py-1 font-mono text-[12px] text-[#186FD4]"
                  title="Nusxalash"
                >
                  {p.code}
                </button>
                <button onClick={() => actions.savePromo({ ...p, active: !p.active })}>
                  <Badge tone={p.active ? "green" : "gray"}>{p.active ? "Faol" : "O'chirilgan"}</Badge>
                </button>
              </div>
              <div className="mt-3 flex gap-2">
                <Btn size="sm" variant="soft" onClick={() => setEdit(p)}>
                  <Pencil size={13} /> Tahrirlash
                </Btn>
                <Btn size="sm" variant="danger" onClick={() => setDel(p)}>
                  <Trash2 size={13} /> O&apos;chirish
                </Btn>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {edit && <PromoModal key={edit.id} promo={edit} onClose={() => setEdit(null)} />}
      <Confirm
        open={!!del}
        title="Aksiyani o'chirish"
        text={`"${del?.title}" aksiyasi o'chiriladi.`}
        onClose={() => setDel(null)}
        onYes={() => {
          if (del) {
            actions.deletePromo(del.id);
            toast.success("Aksiya o'chirildi");
          }
        }}
      />
    </>
  );
}

function PromoModal({ promo, onClose }: { promo: Promo; onClose: () => void }) {
  const [f, setF] = useState(promo);
  const save = () => {
    if (!f.title.trim() || !f.code.trim()) return toast.error("Nom va promokodni kiriting");
    if (f.discount <= 0 || f.discount > 90) return toast.error("Chegirma 1–90% oralig'ida bo'lishi kerak");
    actions.savePromo({ ...f, code: f.code.trim().toUpperCase() });
    toast.success("Aksiya saqlandi");
    onClose();
  };
  return (
    <Modal open onClose={onClose} title="Aksiya" footer={<><Btn variant="soft" onClick={onClose}>Bekor qilish</Btn><Btn variant="dark" onClick={save}>Saqlash</Btn></>}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Aksiya nomi *" className="sm:col-span-2">
          <input className={inputCls} value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} />
        </Field>
        <Field label="Promokod *">
          <input className={`${inputCls} uppercase`} value={f.code} onChange={(e) => setF({ ...f, code: e.target.value })} />
        </Field>
        <Field label="Chegirma (%)">
          <input type="number" min={1} max={90} className={inputCls} value={f.discount} onChange={(e) => setF({ ...f, discount: +e.target.value || 0 })} />
        </Field>
        <Field label="Tugash sanasi">
          <input type="date" className={inputCls} value={f.endDate} onChange={(e) => setF({ ...f, endDate: e.target.value })} />
        </Field>
        <Field label="Holat">
          <select className={inputCls} value={f.active ? "1" : "0"} onChange={(e) => setF({ ...f, active: e.target.value === "1" })}>
            <option value="1">Faol</option>
            <option value="0">O&apos;chirilgan</option>
          </select>
        </Field>
      </div>
    </Modal>
  );
}
