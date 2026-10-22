"use client";

import type { FormEventHandler } from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

import type { RegistrationFormData } from "./schema";
import { RegisterAgreements, RegisterPasswordField, RegisterTextField } from "./RegisterFields";
import RegisterLoginAside from "./RegisterLoginAside";

/* Asosiy karta: chapda forma, o'ngda «Уже есть аккаунт?» bloki */
export default function RegisterForm({
  register,
  errors,
  onSubmit,
  isLoading,
}: {
  register: UseFormRegister<RegistrationFormData>;
  errors: FieldErrors<RegistrationFormData>;
  onSubmit: FormEventHandler<HTMLFormElement>;
  isLoading: boolean;
}) {
  return (
    <div className="mt-6 overflow-hidden rounded-lg border border-[#e5e8eb] bg-white sm:mt-8">
      <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr]">
        {/* LEFT FORM */}
        <div className="p-5 sm:p-7 md:p-8 lg:p-10">
          <form onSubmit={onSubmit} className="w-full">
            {/* EMAIL + PHONE */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <RegisterTextField
                id="email"
                type="email"
                label="Email"
                placeholder="Введите ваш email адрес"
                registration={register("email")}
                error={errors.email}
              />
              <RegisterTextField
                id="phone"
                type="tel"
                label="Номер телефона"
                placeholder="+7 (___) ___ - __ - __"
                registration={register("phone")}
                error={errors.phone}
              />
            </div>

            <RegisterTextField
              id="fullName"
              label="ФИО"
              placeholder="Ваше полное имя"
              registration={register("fullName")}
              error={errors.fullName}
              className="mt-5"
            />

            <RegisterTextField
              id="region"
              label="Регион"
              placeholder="Ваш регион"
              registration={register("region")}
              error={errors.region}
              className="mt-5"
            />

            <RegisterPasswordField
              id="password"
              label="Пароль"
              placeholder="Введите пароль"
              registration={register("password")}
              error={errors.password}
              className="mt-5"
            />

            <RegisterPasswordField
              id="confirmPassword"
              label="Подтвердите пароль"
              placeholder="Повторите пароль"
              registration={register("confirmPassword")}
              error={errors.confirmPassword}
              className="mt-5"
            />

            <RegisterAgreements
              terms={register("terms")}
              privacy={register("privacy")}
              termsError={errors.terms}
              privacyError={errors.privacy}
            />

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-6 h-12 w-full cursor-pointer rounded-md bg-[#1976d2] px-5 text-xs font-bold uppercase text-white transition hover:bg-[#1264b5] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "РЕГИСТРАЦИЯ..." : "ЗАРЕГИСТРИРОВАТЬСЯ"}
            </button>
          </form>
        </div>

        <RegisterLoginAside />
      </div>
    </div>
  );
}
