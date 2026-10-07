"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, UserRoundPlus, ChevronRight } from "lucide-react";

import { useRegisterMutation } from "@/lib/api/authApi";
import type { ApiFieldErrors } from "@/lib/api/authApi";

/* =========================
   ZOD SCHEMA
========================= */

const registrationSchema = z
  .object({
    email: z
      .string()
      .min(1, "Введите ваш email адрес")
      .email("Введите корректный email"),

    phone: z
      .string()
      .min(1, "Введите номер телефона")
      .min(10, "Введите корректный номер телефона"),

    fullName: z
      .string()
      .min(1, "Введите ваше полное имя")
      .min(2, "Имя должно содержать минимум 2 символа"),

    region: z.string().min(1, "Введите ваш регион"),

    password: z
      .string()
      .min(1, "Введите пароль")
      .min(6, "Пароль должен содержать минимум 6 символов"),

    confirmPassword: z.string().min(1, "Подтвердите пароль"),

    terms: z.boolean().refine((value) => value === true, {
      message: "Необходимо принять условия обслуживания",
    }),

    privacy: z.boolean().refine((value) => value === true, {
      message: "Необходимо согласиться с обработкой персональных данных",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

type RegistrationFormData = z.infer<typeof registrationSchema>;

/* =========================
   BACKEND FIELD -> FORM FIELD
========================= */

const fieldMap: Record<string, keyof RegistrationFormData> = {
  email: "email",
  username: "email",
  phone: "phone",
  phone_number: "phone",
  full_name: "fullName",
  fullname: "fullName",
  name: "fullName",
  first_name: "fullName",
  last_name: "fullName",
  region: "region",
  address: "region",
  password: "password",
  password_confirm: "confirmPassword",
  password2: "confirmPassword",
  confirm_password: "confirmPassword",
};

/* =========================
   COMPONENT
========================= */

export default function RegistrationPage() {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("token") ?? sessionStorage.getItem("token")) {
      router.replace("/profile");
    }
  }, [router]);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // RTK Query mutation
  const [registerUser, { isLoading }] = useRegisterMutation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      email: "",
      phone: "",
      fullName: "",
      region: "",
      password: "",
      confirmPassword: "",
      terms: false,
      privacy: false,
    },
  });

  /* =========================
     SUBMIT
  ========================= */

  const onSubmit = async (data: RegistrationFormData) => {
    setServerError(null);

    try {
      // "Иванов Иван Иванович" -> first_name: "Иванов", last_name: "Иван Иванович"
      const [firstName, ...restName] = data.fullName.trim().split(/\s+/);

      await registerUser({
        username: data.email,
        email: data.email,
        phone: data.phone,
        full_name: data.fullName,
        name: data.fullName,
        first_name: firstName,
        last_name: restName.join(" "),
        region: data.region,
        password: data.password,
        password_confirm: data.confirmPassword,
      }).unwrap();

      setSuccess(true);
      reset();

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err) {
      const error = err as { status?: number | string; data?: ApiFieldErrors };

      // Tarmoq xatosi yoki JSON bo'lmagan javob (masalan 404 HTML)
      if (!error?.data || typeof error.data !== "object") {
        setServerError(
          `Ошибка сервера (${error?.status ?? "нет ответа"}). Проверьте адрес API.`
        );
        return;
      }

      const toText = (v: string[] | string | undefined) =>
        Array.isArray(v) ? v[0] : v;

      const unknown: string[] = [];

      for (const [key, value] of Object.entries(error.data)) {
        const message = toText(value);
        if (!message) continue;

        const field = fieldMap[key];

        if (field) {
          setError(field, { type: "server", message });
        } else if (key === "error" || key === "detail" || key === "message") {
          unknown.push(message);
        } else {
          unknown.push(`${key}: ${message}`);
        }
      }

      if (unknown.length > 0) {
        setServerError(unknown.join(" | "));
      } else if (Object.keys(error.data).length === 0) {
        setServerError("Не удалось зарегистрироваться");
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full">
        {/* BREADCRUMB */}
        <div className="pt-6 text-xs text-[#8c9299] sm:pt-8 sm:text-sm">
          <Link
            href="/"
            className="text-[#303640] transition hover:text-[#1976d2]"
          >
            Стройоптторг
          </Link>

          <span className="mx-3 text-[#c5c8cc]">/</span>

          <span>Регистрация</span>
        </div>

        {/* TITLE */}
        <h1 className="mt-7 text-4xl font-bold leading-tight text-[#303640] sm:mt-8 sm:text-5xl lg:text-[48px]">
          Регистрация
        </h1>

        {/* SUCCESS MESSAGE */}
        {success && (
          <div className="mt-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            Регистрация успешно выполнена!
          </div>
        )}

        {/* SERVER ERROR MESSAGE */}
        {serverError && (
          <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {serverError}
          </div>
        )}

        {/* MAIN CARD */}
        <div className="mt-6 overflow-hidden rounded-lg border border-[#e5e8eb] bg-white sm:mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr]">
            {/* LEFT FORM */}
            <div className="p-5 sm:p-7 md:p-8 lg:p-10">
              <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                {/* EMAIL + PHONE */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {/* EMAIL */}
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-xs font-medium text-[#202833]"
                    >
                      Email <span className="text-red-500">*</span>
                    </label>

                    <input
                      id="email"
                      type="email"
                      placeholder="Введите ваш email адрес"
                      {...register("email")}
                      className={`h-12 w-full rounded-md border bg-white px-4 text-sm text-[#303640] outline-none transition placeholder:text-[#b6bbc2] focus:border-[#1976d2] ${
                        errors.email ? "border-red-500" : "border-[#dfe3e7]"
                      }`}
                    />

                    {errors.email && (
                      <p className="mt-1.5 text-xs text-red-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* PHONE */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-xs font-medium text-[#202833]"
                    >
                      Номер телефона <span className="text-red-500">*</span>
                    </label>

                    <input
                      id="phone"
                      type="tel"
                      placeholder="+7 (___) ___ - __ - __"
                      {...register("phone")}
                      className={`h-12 w-full rounded-md border bg-white px-4 text-sm text-[#303640] outline-none transition placeholder:text-[#b6bbc2] focus:border-[#1976d2] ${
                        errors.phone ? "border-red-500" : "border-[#dfe3e7]"
                      }`}
                    />

                    {errors.phone && (
                      <p className="mt-1.5 text-xs text-red-500">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* FULL NAME */}
                <div className="mt-5">
                  <label
                    htmlFor="fullName"
                    className="mb-2 block text-xs font-medium text-[#202833]"
                  >
                    ФИО <span className="text-red-500">*</span>
                  </label>

                  <input
                    id="fullName"
                    type="text"
                    placeholder="Ваше полное имя"
                    {...register("fullName")}
                    className={`h-12 w-full rounded-md border bg-white px-4 text-sm text-[#303640] outline-none transition placeholder:text-[#b6bbc2] focus:border-[#1976d2] ${
                      errors.fullName ? "border-red-500" : "border-[#dfe3e7]"
                    }`}
                  />

                  {errors.fullName && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                {/* REGION */}
                <div className="mt-5">
                  <label
                    htmlFor="region"
                    className="mb-2 block text-xs font-medium text-[#202833]"
                  >
                    Регион <span className="text-red-500">*</span>
                  </label>

                  <input
                    id="region"
                    type="text"
                    placeholder="Ваш регион"
                    {...register("region")}
                    className={`h-12 w-full rounded-md border bg-white px-4 text-sm text-[#303640] outline-none transition placeholder:text-[#b6bbc2] focus:border-[#1976d2] ${
                      errors.region ? "border-red-500" : "border-[#dfe3e7]"
                    }`}
                  />

                  {errors.region && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.region.message}
                    </p>
                  )}
                </div>

                {/* PASSWORD */}
                <div className="mt-5">
                  <label
                    htmlFor="password"
                    className="mb-2 block text-xs font-medium text-[#202833]"
                  >
                    Пароль <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Введите пароль"
                      {...register("password")}
                      className={`h-12 w-full rounded-md border bg-white px-4 pr-12 text-sm text-[#303640] outline-none transition placeholder:text-[#b6bbc2] focus:border-[#1976d2] ${
                        errors.password ? "border-red-500" : "border-[#dfe3e7]"
                      }`}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#aeb4ba] transition hover:text-[#1976d2]"
                      aria-label={
                        showPassword ? "Скрыть пароль" : "Показать пароль"
                      }
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {errors.password && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* CONFIRM PASSWORD */}
                <div className="mt-5">
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-xs font-medium text-[#202833]"
                  >
                    Подтвердите пароль <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Повторите пароль"
                      {...register("confirmPassword")}
                      className={`h-12 w-full rounded-md border bg-white px-4 pr-12 text-sm text-[#303640] outline-none transition placeholder:text-[#b6bbc2] focus:border-[#1976d2] ${
                        errors.confirmPassword
                          ? "border-red-500"
                          : "border-[#dfe3e7]"
                      }`}
                    />

                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#aeb4ba] transition hover:text-[#1976d2]"
                      aria-label={
                        showConfirmPassword
                          ? "Скрыть пароль"
                          : "Показать пароль"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>

                  {errors.confirmPassword && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* CHECKBOXES */}
                <div className="mt-5 space-y-4">
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      {...register("terms")}
                      className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-[#1976d2]"
                    />

                    <span className="text-xs leading-5 text-[#777d84]">
                      Согласен с условиями обслуживания
                    </span>
                  </label>

                  {errors.terms && (
                    <p className="-mt-2 text-xs text-red-500">
                      {errors.terms.message}
                    </p>
                  )}

                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      {...register("privacy")}
                      className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-[#1976d2]"
                    />

                    <span className="text-xs leading-5 text-[#777d84]">
                      Согласен с обработкой персональных данных в соответствии
                      с политикой конфиденциальности
                    </span>
                  </label>

                  {errors.privacy && (
                    <p className="-mt-2 text-xs text-red-500">
                      {errors.privacy.message}
                    </p>
                  )}
                </div>

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

            {/* RIGHT LOGIN BLOCK */}
            <div className="border-t border-[#e5e8eb] lg:border-l lg:border-t-0">
              <div className="flex h-full flex-col justify-start p-6 sm:p-8 md:p-10 lg:p-10">
                <div className="mb-5">
                  <UserRoundPlus
                    size={42}
                    strokeWidth={1.5}
                    className="text-[#ff2b1a]"
                  />
                </div>

                <h2 className="text-2xl font-bold text-[#303640] sm:text-3xl">
                  Уже есть аккаунт?
                </h2>

                <p className="mt-6 max-w-125 text-sm leading-6 text-[#777d84]">
                  Перейдите в{" "}
                  <Link
                    href="/login"
                    className="font-semibold text-[#303640] transition hover:text-[#1976d2]"
                  >
                    авторизацию
                  </Link>{" "}
                  если у вас уже есть зарегистрированный аккаунт.
                </p>

                <Link
                  href="/login"
                  className="mt-6 inline-flex w-fit items-center gap-3 rounded-md bg-[#071522] px-5 py-4 text-xs font-bold uppercase text-white transition hover:bg-[#1976d2]"
                >
                  АВТОРИЗОВАТЬСЯ

                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}