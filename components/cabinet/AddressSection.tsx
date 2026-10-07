"use client";

import { FormEvent, useState } from "react";
import { MapPin, Pencil, Trash2 } from "lucide-react";

import {
  useAddAddressMutation,
  useDeleteAddressMutation,
  useGetAddressesQuery,
  useUpdateAddressMutation,
} from "@/lib/api/userApi";
import type { AnyRecord } from "@/lib/api/userApi";
import { formatApiError } from "@/lib/apiError";

/* =========================================================
   MANZIL MAYDONLARI
   Swagger'dagi POST /api/users/addresses/ body'iga moslang.
   Server "kalit: This field is required" desa, shu yerga
   o'sha kalitni qo'shing.
========================================================= */
const ADDRESS_FIELDS = [
  { key: "title", label: "Название (Дом, Офис)" },
  { key: "city", label: "Город" },
  { key: "street", label: "Улица" },
  { key: "house", label: "Дом" },
  { key: "apartment", label: "Квартира" },
];

const HIDDEN_KEYS = ["id", "user", "created_at", "updated_at", "is_default"];

const inputClass =
  "h-11 w-full rounded-md border border-gray-200 bg-white px-4 text-sm text-slate-800 outline-none transition placeholder:text-gray-300 focus:border-[#005bff]";

// Manzilni o'qiladigan matnga aylantirish (maydon nomlaridan qat'i nazar)
function addressToText(address: AnyRecord): string {
  return Object.entries(address)
    .filter(
      ([k, v]) =>
        !HIDDEN_KEYS.includes(k) &&
        (typeof v === "string" || typeof v === "number") &&
        String(v) !== ""
    )
    .map(([, v]) => String(v))
    .join(", ");
}

export default function AddressSection() {
  const { data: addresses = [], isLoading, error } = useGetAddressesQuery();
  const [addAddress, { isLoading: adding }] = useAddAddressMutation();
  const [updateAddress, { isLoading: updating }] = useUpdateAddressMutation();
  const [deleteAddress] = useDeleteAddressMutation();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | string | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);

  const openCreate = () => {
    setEditingId(null);
    setValues({});
    setMessage(null);
    setShowForm(true);
  };

  const openEdit = (address: AnyRecord) => {
    const initial: Record<string, string> = {};
    ADDRESS_FIELDS.forEach(({ key }) => {
      initial[key] = address[key] === undefined ? "" : String(address[key]);
    });
    setEditingId(address.id as number | string);
    setValues(initial);
    setMessage(null);
    setShowForm(true);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      if (editingId !== null) {
        await updateAddress({ id: editingId, body: values }).unwrap();
      } else {
        await addAddress(values).unwrap();
      }
      setShowForm(false);
      setValues({});
      setEditingId(null);
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
        <form
          onSubmit={onSubmit}
          className="mb-6 max-w-xl space-y-4 rounded-lg border border-gray-100 p-4"
        >
          {ADDRESS_FIELDS.map(({ key, label }) => (
            <div key={key}>
              <label
                htmlFor={`addr-${key}`}
                className="mb-2 block text-xs font-medium text-slate-700"
              >
                {label}
              </label>
              <input
                id={`addr-${key}`}
                value={values[key] ?? ""}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, [key]: e.target.value }))
                }
                className={inputClass}
              />
            </div>
          ))}

          {message && (
            <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
              {message}
            </p>
          )}

          <div className="flex gap-3">
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
        <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
          {message}
        </p>
      )}

      {isLoading ? (
        <p className="text-sm text-gray-500">Загрузка...</p>
      ) : addresses.length === 0 && !error ? (
        <p className="py-8 text-center text-sm text-gray-500">
          У вас пока нет сохранённых адресов.
        </p>
      ) : (
        <ul className="space-y-3">
          {addresses.map((address, idx) => (
            <li
              key={String(address.id ?? idx)}
              className="flex items-start justify-between gap-4 rounded-lg border border-gray-100 px-4 py-3"
            >
              <div className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-gray-400" />
                <p className="text-sm text-slate-800">
                  {addressToText(address) || "Адрес"}
                </p>
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