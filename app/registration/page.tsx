"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useRegisterMutation } from "@/lib/api/authApi";
import type { ApiFieldErrors } from "@/lib/api/authApi";
import { registrationDefaults, registrationSchema, type RegistrationFormData } from "@/components/auth/register/schema";
import RegisterHeader from "@/components/auth/register/RegisterHeader";
import RegisterForm from "@/components/auth/register/RegisterForm";

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
    defaultValues: registrationDefaults,
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
        setServerError(`Ошибка сервера (${error?.status ?? "нет ответа"}). Проверьте адрес API.`);
        return;
      }

      const toText = (v: string[] | string | undefined) => (Array.isArray(v) ? v[0] : v);

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
        <RegisterHeader success={success} serverError={serverError} />
        <RegisterForm register={register} errors={errors} onSubmit={handleSubmit(onSubmit)} isLoading={isLoading} />
      </div>
    </div>
  );
}
