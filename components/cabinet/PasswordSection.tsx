"use client";

import { FormEvent, useState } from "react";

import { useChangePasswordMutation } from "@/lib/api/userApi";
import { formatApiError } from "@/lib/apiError";
import { inputClass } from "./profileFields";

/* Bo'lim: «Сменить пароль» */
export default function PasswordSection() {
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword.length < 6) {
      setMessage({ type: "err", text: "Пароль должен содержать минимум 6 символов" });
      return;
    }
    if (newPassword !== confirm) {
      setMessage({ type: "err", text: "Пароли не совпадают" });
      return;
    }

    try {
      await changePassword({
        old_password: oldPassword,
        new_password: newPassword,
        new_password_confirm: confirm,
        confirm_password: confirm,
        password_confirm: confirm,
      }).unwrap();

      setMessage({ type: "ok", text: "Пароль успешно изменён" });
      setOldPassword("");
      setNewPassword("");
      setConfirm("");
    } catch (err) {
      setMessage({ type: "err", text: formatApiError(err) });
    }
  };

  return (
    <div className="bg-white p-5 md:p-6 rounded-xl border border-gray-100 shadow-sm">
      <h3 className="text-base font-semibold text-slate-800 mb-4">Сменить пароль</h3>

      <form onSubmit={onSubmit} className="max-w-xl space-y-4">
        <div>
          <label htmlFor="old" className="mb-2 block text-xs font-medium text-slate-700">
            Текущий пароль
          </label>
          <input
            id="old"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="new" className="mb-2 block text-xs font-medium text-slate-700">
            Новый пароль
          </label>
          <input
            id="new"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="confirm" className="mb-2 block text-xs font-medium text-slate-700">
            Подтвердите новый пароль
          </label>
          <input
            id="confirm"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className={inputClass}
          />
        </div>

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
          {isLoading ? "Сохранение..." : "Изменить пароль"}
        </button>
      </form>
    </div>
  );
}
