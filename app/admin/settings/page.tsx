"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { KeyRound, UserCog } from "lucide-react";
import { Btn, Card, Field, inputCls, PageHeader } from "@/components/admin/ui";
import { ApiMissing, Avatar } from "@/components/admin/shared";
import { useChangePasswordMutation, useGetProfileQuery, useUpdateProfileMutation } from "@/lib/api/userApi";
import { fmtDate } from "@/lib/admin/format";
import { formatApiError } from "@/lib/apiError";
import { toastApiError } from "@/lib/admin/notify";

const s = (v: unknown) => (v === null || v === undefined ? "" : String(v));

export default function SettingsPage() {
  const { data: profile, isLoading, error } = useGetProfileQuery();

  return (
    <>
      <PageHeader crumbs={["Asosiy", "Sozlamalar"]} title="Sozlamalar va Xodimlar" subtitle="Joriy admin profili (/api/auth/profile/) va parol." />

      {error && <p className="mb-4 rounded-lg bg-[#fdecec] px-4 py-3 text-[13px] text-[#c0262d]">Profilni yuklab bo&apos;lmadi: {formatApiError(error)}</p>}

      <div className="grid gap-4 xl:grid-cols-2">
        <Card title="Mening profilim" action={<UserCog size={18} className="text-[#186FD4]" />}>
          {isLoading ? (
            <p className="py-8 text-center text-[13px] text-[#6b7a90]">Yuklanmoqda...</p>
          ) : profile ? (
            <ProfileForm key={s(profile.id)} profile={profile} />
          ) : null}
        </Card>

        <Card title="Parolni almashtirish" action={<KeyRound size={18} className="text-[#186FD4]" />}>
          <PasswordForm />
        </Card>
      </div>

      <Card className="mt-4" title="Xodimlar va rollar">
        <ApiMissing
          title="Xodimlar ro'yxati uchun API yo'q"
          text="Backend xodimlar, rollar va ruxsatlarni boshqarish uchun endpoint bermaydi. Hozircha xodim qo'shish va admin huquqini (is_staff) berish Django admin panelida qilinadi."
          endpoint="GET/POST /api/staff/  (faqat admin uchun)"
        />
      </Card>
    </>
  );
}

function ProfileForm({ profile }: { profile: Record<string, unknown> }) {
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [firstName, setFirstName] = useState(s(profile.first_name));
  const [lastName, setLastName] = useState(s(profile.last_name));
  const [phone, setPhone] = useState(s(profile.phone));
  const name = [firstName, lastName].filter(Boolean).join(" ") || s(profile.email);

  const save = async () => {
    try {
      await updateProfile({ first_name: firstName.trim(), last_name: lastName.trim(), phone: phone.trim() }).unwrap();
      toast.success("Profil saqlandi");
    } catch (err) {
      toastApiError(err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Avatar name={name} className="!h-12 !w-12" />
        <div>
          <div className="font-semibold">{name}</div>
          <div className="text-[12px] text-[#6b7a90]">
            {s(profile.email)}
            {profile.created_at ? ` • ${fmtDate(new Date(s(profile.created_at)).getTime())} dan beri` : ""}
          </div>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Ism">
          <input className={inputCls} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </Field>
        <Field label="Familiya">
          <input className={inputCls} value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Email" hint="Email'ni o'zgartirib bo'lmaydi">
          <input className={`${inputCls} opacity-70`} value={s(profile.email)} readOnly />
        </Field>
        <Field label="Telefon">
          <input className={inputCls} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+998 90 123 45 67" />
        </Field>
      </div>
      <div className="flex justify-end">
        <Btn variant="dark" onClick={save} disabled={isLoading}>
          {isLoading ? "Saqlanmoqda..." : "Saqlash"}
        </Btn>
      </div>
    </div>
  );
}

function PasswordForm() {
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const [oldPassword, setOld] = useState("");
  const [newPassword, setNew] = useState("");
  const [confirm, setConfirm] = useState("");

  const save = async () => {
    if (!oldPassword || !newPassword) return toast.error("Parollarni kiriting");
    if (newPassword.length < 8) return toast.error("Yangi parol kamida 8 belgidan iborat bo'lishi kerak");
    if (newPassword !== confirm) return toast.error("Yangi parollar mos kelmadi");
    try {
      await changePassword({
        old_password: oldPassword,
        new_password: newPassword,
        new_password_confirm: confirm,
        confirm_password: confirm,
        password_confirm: confirm,
      }).unwrap();
      toast.success("Parol almashtirildi");
      setOld("");
      setNew("");
      setConfirm("");
    } catch (err) {
      toastApiError(err);
    }
  };

  return (
    <div className="space-y-4">
      <Field label="Joriy parol">
        <input type="password" autoComplete="current-password" className={inputCls} value={oldPassword} onChange={(e) => setOld(e.target.value)} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Yangi parol" hint="Kamida 8 belgi">
          <input type="password" autoComplete="new-password" className={inputCls} value={newPassword} onChange={(e) => setNew(e.target.value)} />
        </Field>
        <Field label="Yangi parolni takrorlang">
          <input type="password" autoComplete="new-password" className={inputCls} value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </Field>
      </div>
      <div className="flex justify-end">
        <Btn variant="dark" onClick={save} disabled={isLoading}>
          {isLoading ? "Saqlanmoqda..." : "Parolni almashtirish"}
        </Btn>
      </div>
    </div>
  );
}
