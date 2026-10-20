"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { registrationDefaults, registrationSchema, type RegistrationFormData } from "@/components/auth/register/schema";
import RegisterHeader from "@/components/auth/register/RegisterHeader";
import RegisterForm from "@/components/auth/register/RegisterForm";

/* =========================
   COMPONENT
========================= */

export default function RegistrationPage() {
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: registrationDefaults,
  });

  /* =========================
     SUBMIT
  ========================= */

  const onSubmit = async (data: RegistrationFormData) => {
    try {
      console.log("Registration data:", data);

      /*
        Bu yerga API POST so'rovini qo'yishingiz mumkin:

        await fetch("/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
      */

      setSuccess(true);
      reset();

      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full">
        <RegisterHeader success={success} />
        <RegisterForm register={register} errors={errors} onSubmit={handleSubmit(onSubmit)} isLoading={isSubmitting} />
      </div>
    </div>
  );
}
