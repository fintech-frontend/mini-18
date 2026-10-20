"use client";

import { FormEvent, useState } from "react";

import { useUpdateProfileMutation } from "@/lib/api/userApi";
import type { Profile } from "@/lib/api/userApi";
import { formatApiError } from "@/lib/apiError";
import { normalizePhone } from "@/lib/phone";
import { FIELD_LABELS, asText, inputClass } from "./profileFields";

/* Bo'lim: «Изменить профиль» */
export default function EditProfileSection({ profile }: { profile?: Profile }) {
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const editableKeys = Object.keys(FIELD_LABELS).filter(
    (k) => profile && k in profile
  );

  const values: Record<string, string> = {};
  editableKeys.forEach((k) => (values[k] = edits[k] ?? asText(profile?.[k])));

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);

    try {
      // Telefon serverga faqat "+" va raqamlar bilan ketadi
      const body = { ...values };
      for (const k of ["phone", "phone_number"]) if (body[k]) body[k] = normalizePhone(body[k]);
      await updateProfile(body).unwrap();
      setMessage({ type: "ok", text: "Профиль успешно обновлён" });
    } catch (err) {
      setMessage({ type: "err", text: formatApiError(err) });
    }
  };

  return (
    <div className="bg-white p-5 md:p-6 rounded-xl border border-gray-100 shadow-sm">
      <h3 className="text-base font-semibold text-slate-800 mb-4">Изменить профиль</h3>

      {editableKeys.length === 0 ? (
        <p className="text-sm text-gray-500">Нет данных профиля для редактирования.</p>
      ) : (
        <form onSubmit={onSubmit} className="max-w-xl space-y-4">
          {editableKeys.map((k) => (
            <div key={k}>
              <label htmlFor={k} className="mb-2 block text-xs font-medium text-slate-700">
                {FIELD_LABELS[k]}
              </label>
              <input
                id={k}
                value={values[k] ?? ""}
                onChange={(e) => setEdits((prev) => ({ ...prev, [k]: e.target.value }))}
                className={inputClass}
              />
            </div>
          ))}

          {message && (
            <p
              className={`rounded-md border px-4 py-3 text-xs ${
                message.type === "ok"
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {message.text}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="h-11 rounded-md bg-[#005bff] px-6 text-xs font-bold uppercase text-white transition hover:bg-[#0049cc] disabled:opacity-60"
          >
            {isLoading ? "Сохранение..." : "Сохранить"}
          </button>
        </form>
      )}
    </div>
  );
}
