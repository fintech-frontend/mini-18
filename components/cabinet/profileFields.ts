import type { Profile } from "@/lib/api/userApi";

/* Kabinet: profil maydonlari (serverdan kelganlari ko'rsatiladi) va umumiy yordamchilar */

export const FIELD_LABELS: Record<string, string> = {
  first_name: "Имя",
  last_name: "Фамилия",
  full_name: "ФИО",
  name: "Имя",
  email: "Email",
  phone: "Телефон",
  phone_number: "Телефон",
  region: "Регион",
  address: "Адрес",
};

export const asText = (v: unknown) => (v === null || v === undefined ? "" : String(v));

export function getDisplayName(profile?: Profile): string {
  if (!profile) return "";
  return (
    asText(profile.first_name) ||
    asText(profile.full_name) ||
    asText(profile.name) ||
    asText(profile.username) ||
    ""
  );
}

export const inputClass =
  "h-11 w-full rounded-md border border-gray-200 bg-white px-4 text-sm text-slate-800 outline-none transition placeholder:text-gray-300 focus:border-[#005bff]";
