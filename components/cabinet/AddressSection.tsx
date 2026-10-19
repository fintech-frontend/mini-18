"use client";

import { FormEvent, useState } from "react";
import { MapPin, Pencil, Star, Trash2 } from "lucide-react";

import {
  useAddAddressMutation,
  useDeleteAddressMutation,
  useGetAddressesQuery,
  useUpdateAddressMutation,
} from "@/lib/api/userApi";
import type { AddressBody, AnyRecord } from "@/lib/api/userApi";
import { formatApiError } from "@/lib/apiError";
import { formatPhone, isPhoneComplete, normalizePhone, phoneIncompleteMessage } from "@/lib/phone";

/* Swagger (Address): company_name, street, house, phone, is_default — shu yerda to'ldiriladi.
   region va city — son (ID), lekin ularni olish uchun API'da endpoint yo'q, shuning uchun yuborilmaydi. */
const ADDRESS_FIELDS = [
  { key: "company_name", label: "Название (Дом, Офис, Компания)", placeholder: "Дом", max: 255 },
  { key: "street", label: "Улица", placeholder: "ул. Октябрьская", max: 255 },
  { key: "house", label: "Дом / квартира", placeholder: "301, кв. 12", max: 100 },
  { key: "phone", label: "Телефон", placeholder: "+7 (___) ___-__-__", max: 20 },
] as const;

type FieldKey = (typeof ADDRESS_FIELDS)[number]["key"];

const inputClass =
  "h-11 w-full rounded-md border border-gray-200 bg-white px-4 text-sm text-slate-800 outline-none transition placeholder:text-gray-300 focus:border-[#005bff]";

const text = (v: unknown) => (v === null || v === undefined ? "" : String(v));

// Manzilni o'qiladigan matnga aylantirish
function addressToText(a: AnyRecord): string {
  const street = [text(a.street), text(a.house)].filter(Boolean).join(", ");
  return [text(a.company_name), street].filter(Boolean).join(" — ");
}

export default function AddressSection() {
  const { data: addresses = [], isLoading, error } = useGetAddressesQuery();
  const [addAddress, { isLoading: adding }] = useAddAddressMutation();
  const [updateAddress, { isLoading: updating }] = useUpdateAddressMutation();
  const [deleteAddress] = useDeleteAddressMutation();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | string | null>(null);
  const [values, setValues] = useState<Record<FieldKey, string>>({ company_name: "", street: "", house: "", phone: "" });
  const [isDefault, setIsDefault] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const openCreate = () => {
    setEditingId(null);
    setValues({ company_name: "", street: "", house: "", phone: "" });
    // Birinchi manzil avtomatik asosiy bo'ladi
    setIsDefault(addresses.length === 0);
    setMessage(null);
    setShowForm(true);
  };

  const openEdit = (address: AnyRecord) => {
    setEditingId(address.id as number | string);
    setValues({
      company_name: text(address.company_name),
      street: text(address.street),
      house: text(address.house),
      phone: formatPhone(text(address.phone)),
    });
    setIsDefault(!!address.is_default);
    setMessage(null);
    setShowForm(true);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const trimmed = Object.fromEntries(Object.entries(values).map(([k, v]) => [k, v.trim()])) as Record<FieldKey, string>;
    if (!trimmed.street && !trimmed.company_name) {
      setMessage("Укажите улицу или название адреса");
      return;
    }
    if (trimmed.phone && !isPhoneComplete(trimmed.phone)) {
      setMessage(phoneIncompleteMessage(trimmed.phone));
      return;
    }

    // Yangi manzilda bo'sh maydon yuborilmaydi ("may not be blank"),
    // tahrirlashda esa bo'shatilgan maydon null bilan tozalanadi (maydonlar nullable)
    const body: AddressBody = { is_default: isDefault };
    (Object.keys(trimmed) as FieldKey[]).forEach((k) => {
      // Telefon serverga "+998901234567" ko'rinishida (bo'sh joy, qavs, chiziqchasiz) ketadi
      if (trimmed[k]) body[k] = k === "phone" ? normalizePhone(trimmed[k]) : trimmed[k];
      else if (editingId !== null) body[k] = null;
    });

    try {
      if (editingId !== null) {
        await updateAddress({ id: editingId, body }).unwrap();
      } else {
        await addAddress(body).unwrap();
      }
      setShowForm(false);
      setEditingId(null);
    } catch (err) {
      setMessage(formatApiError(err));
    }
  };

  const makeDefault = async (id: number | string) => {
    setMessage(null);
    try {
      await updateAddress({ id, body: { is_default: true } }).unwrap();
    } catch (err) {
      setMessage(formatApiError(err));
    }
  };

  const onDelete = async (id: number | string) => {
    if (!window.confirm("Удалить адрес?")) return;
    try {
      await deleteAddress(id).unwrap();
    } catch (err) {
      setMessage(formatApiError(err));
    }
  };

  // Asosiy manzil ro'yxatda birinchi turadi
  const sorted = [...addresses].sort((a, b) => Number(!!b.is_default) - Number(!!a.is_default));

  return (
    <div className="bg-white p-5 md:p-6 rounded-xl border border-gray-100 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-800">Адрес доставки</h3>

        {!showForm && (
          <button
            onClick={openCreate}
            className="h-10 rounded-md bg-[#005bff] px-4 text-xs font-bold uppercase text-white transition hover:bg-[#0049cc]"
          >
            Добавить адрес
          </button>
        )}
      </div>

      {error && (
        <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
          Не удалось загрузить адреса: {formatApiError(error)}
        </p>
      )}

      {showForm && (
        <form onSubmit={onSubmit} className="mb-6 rounded-lg border border-gray-100 p-4 md:p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {ADDRESS_FIELDS.map(({ key, label, placeholder, max }) => (
              <div key={key}>
                <label htmlFor={`addr-${key}`} className="mb-2 block text-xs font-medium text-slate-700">
                  {label}
                </label>
                <input
                  id={`addr-${key}`}
                  type={key === "phone" ? "tel" : "text"}
                  maxLength={max}
                  value={values[key]}
                  placeholder={placeholder}
                  onChange={(e) => {
                    const v = key === "phone" ? formatPhone(e.target.value) : e.target.value;
                    setValues((prev) => ({ ...prev, [key]: v }));
                  }}
                  className={inputClass}
                />
                {key === "phone" && <p className="mt-1.5 text-[11px] text-gray-400">Для номера Узбекистана начните с +998</p>}
              </div>
            ))}
          </div>

          <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="h-4 w-4 accent-[#005bff]"
            />
            Основной адрес доставки
          </label>

          {message && (
            <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">{message}</p>
          )}

          <div className="mt-5 flex gap-3">
            <button
              type="submit"
              disabled={adding || updating}
              className="h-11 rounded-md bg-[#005bff] px-6 text-xs font-bold uppercase text-white transition hover:bg-[#0049cc] disabled:opacity-60"
            >
              {adding || updating ? "Сохранение..." : "Сохранить"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="h-11 rounded-md bg-gray-100 px-6 text-xs font-bold uppercase text-gray-600 transition hover:bg-gray-200"
            >
              Отмена
            </button>
          </div>
        </form>
      )}

      {!showForm && message && (
        <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">{message}</p>
      )}

      {isLoading ? (
        <p className="text-sm text-gray-500">Загрузка...</p>
      ) : addresses.length === 0 && !error ? (
        <p className="py-8 text-center text-sm text-gray-500">У вас пока нет сохранённых адресов.</p>
      ) : (
        <ul className="space-y-3">
          {sorted.map((address, idx) => (
            <li
              key={String(address.id ?? idx)}
              className={`flex items-start justify-between gap-4 rounded-lg border px-4 py-3 ${
                address.is_default ? "border-[#005bff]/40 bg-blue-50/40" : "border-gray-100"
              }`}
            >
              <div className="flex min-w-0 items-start gap-3">
                <MapPin size={18} className={`mt-0.5 shrink-0 ${address.is_default ? "text-[#005bff]" : "text-gray-400"}`} />
                <div className="min-w-0">
                  <p className="text-sm text-slate-800">
                    {addressToText(address) || "Адрес"}
                    {!!address.is_default && (
                      <span className="ml-2 rounded bg-[#005bff] px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">Основной</span>
                    )}
                  </p>
                  {text(address.phone) && <p className="mt-0.5 text-xs text-gray-500">{formatPhone(text(address.phone))}</p>}
                  {!address.is_default && (
                    <button
                      onClick={() => makeDefault(address.id as number | string)}
                      className="mt-1 flex items-center gap-1 text-xs text-[#005bff] hover:underline"
                    >
                      <Star size={12} /> Сделать основным
                    </button>
                  )}
                </div>
              </div>

              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => openEdit(address)}
                  className="rounded-lg bg-gray-100 p-2 text-gray-500 transition hover:bg-blue-50 hover:text-[#005bff]"
                  aria-label="Изменить"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => onDelete(address.id as number | string)}
                  className="rounded-lg bg-gray-100 p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                  aria-label="Удалить"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
