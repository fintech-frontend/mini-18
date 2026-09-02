"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { z } from "zod";

// =========================
// ZOD SCHEMA
// =========================

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email yoki loginni kiriting")
    .min(3, "Email yoki login kamida 3 ta belgidan iborat bo'lishi kerak"),

  password: z
    .string()
    .min(1, "Parolni kiriting")
    .min(6, "Parol kamida 6 ta belgidan iborat bo'lishi kerak"),
});

// =========================
// TYPES
// =========================

type FormErrors = {
  email?: string;
  password?: string;
};

// =========================
// COMPONENT
// =========================

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Eski xatolarni tozalash
    setErrors({});

    // =========================
    // ZOD VALIDATION
    // =========================

    const result = loginSchema.safeParse({
      email: email.trim(),
      password,
    });

    // Agar validation xato bo'lsa
    if (!result.success) {
      const newErrors: FormErrors = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0];

        if (field === "email") {
          newErrors.email = issue.message;
        }

        if (field === "password") {
          newErrors.password = issue.message;
        }
      });

      setErrors(newErrors);

      return;
    }

    // =========================
    // LOADING
    // =========================

    setLoading(true);

    try {
      // =========================
      // JSON SERVER
      // =========================

      const response = await fetch("http://localhost:5000/users", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email: email.trim(),
          password,
          remember,
        }),
      });

      if (!response.ok) {
        throw new Error("Ma'lumot yuborishda xatolik");
      }

      const data = await response.json();

      console.log("Yuborilgan ma'lumot:", data);

      alert("Muvaffaqiyatli avtorizatsiya qilindi!");

      // Formani tozalash
      setEmail("");
      setPassword("");
      setRemember(false);
      setErrors({});
    } catch (error) {
      console.error(error);

      alert(
        "Server bilan bog'lanib bo'lmadi. json-server ishlayotganini tekshiring!"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // RETURN
  // =========================

  return (
    <main className="min-h-screen bg-white">
      {/* CONTAINER */}
      <div className="mx-auto w-[90%] max-w-[1620px]">
        {/* =========================
            BREADCRUMB
        ========================= */}

        <div className="pt-5 text-[12px] text-[#7B8794]">
          <Link
            href="/"
            className="text-[#2F3640] transition hover:text-[#1E73E8]"
          >
            Стройоптторг
          </Link>

          <span className="mx-4">/</span>

          <span>Авторизация</span>
        </div>

        {/* =========================
            TITLE
        ========================= */}

        <h1 className="mt-7 text-[36px] font-bold leading-tight text-[#2F3640] sm:text-[44px] md:text-[52px]">
          Авторизация
        </h1>

        {/* =========================
            MAIN CARD
        ========================= */}

        <section className="mx-auto mt-16 mb-20 rounded-xl border border-[#E5E7EB] bg-white p-6 sm:p-8 md:mt-20 md:p-10 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-16">
            {/* =========================
                LEFT
            ========================= */}

            <div className="w-full lg:pr-10">
              <form onSubmit={handleSubmit}>
                {/* =========================
                    EMAIL
                ========================= */}

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-[13px] font-medium text-[#2F3640]"
                  >
                    Email или логин:
                    <span className="text-red-500"> *</span>
                  </label>

                  <input
                    id="email"
                    type="text"
                    name="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);

                      if (errors.email) {
                        setErrors((prev) => ({
                          ...prev,
                          email: undefined,
                        }));
                      }
                    }}
                    placeholder="Введите данные для авторизации"
                    className={`h-11 w-full rounded-md border bg-white px-4 text-[12px] text-[#2F3640] outline-none transition placeholder:text-[#B8BDC3] ${
                      errors.email
                        ? "border-red-500 focus:border-red-500"
                        : "border-[#E2E5E8] focus:border-[#1E73E8]"
                    }`}
                  />

                  {/* EMAIL ERROR */}

                  {errors.email && (
                    <p className="mt-1 text-[11px] text-red-500">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* =========================
                    PASSWORD
                ========================= */}

                <div className="mt-4">
                  <label
                    htmlFor="password"
                    className="mb-2 block text-[13px] font-medium text-[#2F3640]"
                  >
                    Пароль:
                    <span className="text-red-500"> *</span>
                  </label>

                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);

                        if (errors.password) {
                          setErrors((prev) => ({
                            ...prev,
                            password: undefined,
                          }));
                        }
                      }}
                      placeholder="Введите пароль"
                      className={`h-11 w-full rounded-md border bg-white px-4 pr-12 text-[12px] text-[#2F3640] outline-none transition placeholder:text-[#B8BDC3] ${
                        errors.password
                          ? "border-red-500 focus:border-red-500"
                          : "border-[#E2E5E8] focus:border-[#1E73E8]"
                      }`}
                    />

                    {/* =========================
                        EYE BUTTON
                    ========================= */}

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#2F3640]"
                      aria-label={
                        showPassword
                          ? "Скрыть пароль"
                          : "Показать пароль"
                      }
                    >
                      {showPassword ? (
                        // Eye off
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <path d="M3 3l18 18" />

                          <path d="M10.58 10.58a2 2 0 002.83 2.83" />

                          <path d="M9.88 4.24A10.94 10.94 0 0112 4c5 0 8.27 4 9.5 6a11.9 11.9 0 01-3.02 3.72" />

                          <path d="M6.61 6.61C4.65 7.74 3.28 9.48 2.5 10.5c1.23 2 4.5 6 9.5 6a10.9 10.9 0 003.39-.54" />
                        </svg>
                      ) : (
                        // Eye
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z" />

                          <circle cx="12" cy="12" r="2.5" />
                        </svg>
                      )}
                    </button>
                  </div>

                  {/* PASSWORD ERROR */}

                  {errors.password && (
                    <p className="mt-1 text-[11px] text-red-500">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* =========================
                    FORGOT PASSWORD
                ========================= */}

                <button
                  type="button"
                  className="mt-4 h-11 w-full rounded-md bg-[#F5F7FA] text-[12px] font-medium text-[#0877DD] transition hover:bg-[#EDF2F7]"
                >
                  Восстановить пароль
                </button>

                {/* =========================
                    LOGIN BUTTON
                ========================= */}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 h-11 w-full rounded-md bg-[#1E73E8] text-[11px] font-bold text-white transition hover:bg-[#1667D6] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "ОТПРАВКА..." : "АВТОРИЗОВАТЬСЯ"}
                </button>

                {/* =========================
                    REMEMBER
                ========================= */}

                <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 text-[12px] text-[#59636E] sm:justify-start sm:pl-28 lg:pl-28">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-[18px] w-[18px] rounded border-[#D9DEE5] accent-[#1E73E8]"
                  />

                  <span>Запомнить меня</span>
                </label>
              </form>
            </div>

            {/* =========================
                RIGHT
            ========================= */}

            <div className="mt-10 border-t border-[#E5E7EB] pt-10 lg:mt-0 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
              <div className="flex items-start gap-5">
                {/* ICON */}

                <div className="shrink-0 text-[#FF3B00]">
                  <svg
                    width="32"
                    height="40"
                    viewBox="0 0 32 40"
                    fill="none"
                  >
                    <circle
                      cx="16"
                      cy="9"
                      r="7"
                      stroke="currentColor"
                      strokeWidth="1.7"
                    />

                    <path
                      d="M5 37C5 28.7 9.9 23 16 23C22.1 23 27 28.7 27 37"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />

                    <path
                      d="M25 25V37"
                      stroke="currentColor"
                      strokeWidth="1.7"
                    />

                    <path
                      d="M19 31H31"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                {/* TEXT */}

                <div className="flex-1">
                  <h2 className="text-[22px] font-bold text-[#2F3640] sm:text-[24px]">
                    Еще нет аккаунта?
                  </h2>

                  <p className="mt-6 text-[12px] leading-6 text-[#555E68] sm:text-[13px]">
                    <b>Регистрация на сайте</b> позволяет получить
                    доступ к статусу и истории вашего заказа.
                    Просто заполните поля ниже, и вы получите
                    учетную запись.
                  </p>

                  <p className="mt-5 text-[12px] leading-6 text-[#555E68] sm:text-[13px]">
                    Мы запрашиваем у вас только информацию,
                    необходимую для того, чтобы сделать процесс
                    покупки более быстрым и легким.
                  </p>

                  {/* REGISTER */}

                  <Link
                    href="/registration"
                    className="mt-5 flex h-11 w-fit items-center gap-5 rounded-md bg-[#071522] px-5 text-[10px] font-bold text-white transition hover:bg-[#152534]"
                  >
                    ЗАРЕГИСТРИРОВАТЬСЯ

                    <span className="text-lg leading-none">›</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}