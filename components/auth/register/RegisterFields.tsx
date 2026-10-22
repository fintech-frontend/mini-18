"use client";

import { useState } from "react";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";

const labelClass = "mb-2 block text-xs font-medium text-[#202833]";
const inputBase =
  "h-12 w-full rounded-md border bg-white text-sm text-[#303640] outline-none transition placeholder:text-[#b6bbc2] focus:border-[#1976d2]";

type FieldProps = {
  id: string;
  label: string;
  placeholder: string;
  registration: UseFormRegisterReturn;
  error?: FieldError;
  className?: string;
};

function FieldError({ error }: { error?: FieldError }) {
  if (!error) return null;
  return <p className="mt-1.5 text-xs text-red-500">{error.message}</p>;
}

/* Oddiy maydon: email, telefon, ФИО, hudud */
export function RegisterTextField({ id, label, placeholder, registration, error, className, type = "text" }: FieldProps & { type?: string }) {
  return (
    <div className={className}>
      <label htmlFor={id} className={labelClass}>
        {label} <span className="text-red-500">*</span>
      </label>

      <input
        id={id}
        type={type}
        placeholder={placeholder}
        {...registration}
        className={`${inputBase} px-4 ${error ? "border-red-500" : "border-[#dfe3e7]"}`}
      />

      <FieldError error={error} />
    </div>
  );
}

/* Parol maydoni — ko'rsatish/yashirish tugmasi bilan */
export function RegisterPasswordField({ id, label, placeholder, registration, error, className }: FieldProps) {
  const [show, setShow] = useState(false);

  return (
    <div className={className}>
      <label htmlFor={id} className={labelClass}>
        {label} <span className="text-red-500">*</span>
      </label>

      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          {...registration}
          className={`${inputBase} px-4 pr-12 ${error ? "border-red-500" : "border-[#dfe3e7]"}`}
        />

        <button
          type="button"
          onClick={() => setShow((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#aeb4ba] transition hover:text-[#1976d2]"
          aria-label={show ? "Скрыть пароль" : "Показать пароль"}
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      <FieldError error={error} />
    </div>
  );
}

/* Rozilik belgilari: xizmat shartlari va shaxsiy ma'lumotlar */
export function RegisterAgreements({
  terms,
  privacy,
  termsError,
  privacyError,
}: {
  terms: UseFormRegisterReturn;
  privacy: UseFormRegisterReturn;
  termsError?: FieldError;
  privacyError?: FieldError;
}) {
  return (
    <div className="mt-5 space-y-4">
      <label className="flex cursor-pointer items-start gap-3">
        <input type="checkbox" {...terms} className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-[#1976d2]" />

        <span className="text-xs leading-5 text-[#777d84]">Согласен с условиями обслуживания</span>
      </label>

      {termsError && <p className="-mt-2 text-xs text-red-500">{termsError.message}</p>}

      <label className="flex cursor-pointer items-start gap-3">
        <input type="checkbox" {...privacy} className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-[#1976d2]" />

        <span className="text-xs leading-5 text-[#777d84]">
          Согласен с обработкой персональных данных в соответствии с политикой конфиденциальности
        </span>
      </label>

      {privacyError && <p className="-mt-2 text-xs text-red-500">{privacyError.message}</p>}
    </div>
  );
}
