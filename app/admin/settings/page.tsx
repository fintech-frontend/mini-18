"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Pencil, Plus, RotateCcw, Trash2 } from "lucide-react";
import { actions, uid, useDB, type Staff } from "@/lib/admin/db";
import { Avatar } from "@/components/admin/shared";
import { Badge, Btn, Card, Confirm, Field, inputCls, Modal, PageHeader } from "@/components/admin/ui";

const ROLES: Staff["role"][] = ["Bosh Admin", "Menejer", "Omborchi", "Logist"];
const blank = (): Staff => ({ id: uid("s"), name: "", email: "", role: "Menejer", active: true });

export default function SettingsPage() {
  const db = useDB();
  const [edit, setEdit] = useState<Staff | null>(null);
  const [del, setDel] = useState<Staff | null>(null);
  const [reset, setReset] = useState(false);

  return (
    <>
      <PageHeader
        crumbs={["Tizim", "Sozlamalar va Xodimlar"]}
        title="Sozlamalar va Xodimlar"
        subtitle="Admin panelga kirish huquqiga ega xodimlar"
        actions={
          <Btn variant="dark" onClick={() => setEdit(blank())}>
            <Plus size={16} /> Yangi xodim
          </Btn>
        }
      />
      <Card>
        <div className="divide-y divide-[#eef1f6]">
          {db.staff.map((s) => (
            <div key={s.id} className="flex flex-wrap items-center justify-between gap-3 py-3.5">
              <div className="flex items-center gap-3">
                <Avatar name={s.name} className="!rounded-full" />
                <div>
                  <div className="text-[14px] font-semibold">{s.name}</div>
                  <div className="text-[12px] text-[#6b7a90]">{s.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone="blue">{s.role}</Badge>
                <button onClick={() => actions.saveStaff({ ...s, active: !s.active })}>
                  <Badge tone={s.active ? "green" : "gray"}>{s.active ? "Faol" : "Bloklangan"}</Badge>
                </button>
                <Btn size="sm" variant="soft" onClick={() => setEdit(s)} aria-label="Tahrirlash"><Pencil size={13} /></Btn>
                <Btn size="sm" variant="danger" disabled={s.role === "Bosh Admin" && db.staff.filter((x) => x.role === "Bosh Admin").length === 1} onClick={() => setDel(s)} aria-label="O'chirish"><Trash2 size={13} /></Btn>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="mt-4" title="Demo ma'lumotlar" subtitle="Barcha mahsulot, buyurtma va mijozlarni boshlang'ich holatga qaytarish (faqat shu brauzerda saqlanadi)">
        <Btn variant="danger" onClick={() => setReset(true)}>
          <RotateCcw size={15} /> Ma&apos;lumotlarni tiklash
        </Btn>
      </Card>

      {edit && <StaffModal key={edit.id} staff={edit} onClose={() => setEdit(null)} />}
      <Confirm open={!!del} title="Xodimni o'chirish" text={`${del?.name} tizimga kirish huquqidan mahrum qilinadi.`} onClose={() => setDel(null)} onYes={() => { if (del) { actions.deleteStaff(del.id); toast.success("Xodim o'chirildi"); } }} />
      <Confirm open={reset} title="Ma'lumotlarni tiklash" text="Barcha o'zgarishlar o'chib, demo ma'lumotlar qayta yuklanadi." yes="Ha, tiklash" onClose={() => setReset(false)} onYes={() => { actions.resetDemo(); toast.success("Demo ma'lumotlar tiklandi"); }} />
    </>
  );
}

function StaffModal({ staff, onClose }: { staff: Staff; onClose: () => void }) {
  const db = useDB();
  const [f, setF] = useState(staff);
  const save = () => {
    if (!f.name.trim()) return toast.error("Ismni kiriting");
    if (!/^\S+@\S+\.\S+$/.test(f.email)) return toast.error("Email noto'g'ri");
    if (db.staff.some((s) => s.email.toLowerCase() === f.email.toLowerCase() && s.id !== f.id)) return toast.error("Bu email band");
    actions.saveStaff({ ...f, name: f.name.trim() });
    toast.success("Xodim saqlandi");
    onClose();
  };
  return (
    <Modal open onClose={onClose} title="Xodim" footer={<><Btn variant="soft" onClick={onClose}>Bekor qilish</Btn><Btn variant="dark" onClick={save}>Saqlash</Btn></>}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="To'liq ism *"><input className={inputCls} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
        <Field label="Email *"><input className={inputCls} value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></Field>
        <Field label="Lavozim">
          <select className={inputCls} value={f.role} onChange={(e) => setF({ ...f, role: e.target.value as Staff["role"] })}>
            {ROLES.map((r) => <option key={r}>{r}</option>)}
          </select>
        </Field>
        <Field label="Holat">
          <select className={inputCls} value={f.active ? "1" : "0"} onChange={(e) => setF({ ...f, active: e.target.value === "1" })}>
            <option value="1">Faol</option>
            <option value="0">Bloklangan</option>
          </select>
        </Field>
      </div>
    </Modal>
  );
}
