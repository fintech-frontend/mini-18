"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import Checkbox from "@/components/ui/Checkbox";
import {
  FieldError,
  inputClassName,
  isValidEmail,
} from "@/components/ui/FormField";
import { cn } from "@/lib/utils";

/**
 * "Подпишитесь на рассылку" bloki.
 * 360 va 1024+ da ustma-ust, 768 da input va tugma yonma-yon (maketdagidek).
 */
export default function SubscribeCard() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; consent?: string }>(
    {},
  );
  const [isDone, setIsDone] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const nextErrors: typeof errors = {};
    if (!email.trim()) nextErrors.email = "Укажите email";
    else if (!isValidEmail(email)) nextErrors.email = "Некорректный email";
    if (!consent) nextErrors.consent = "Необходимо согласие";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    // TODO: obuna API ulanadi
    setIsDone(true);
  };

  return (
    <section
      aria-labelledby="subscribe-title"
      className="rounded-[8px] bg-[#F6F8FA] px-[15px] py-5 text-center lg:p-[25px]"
    >
      <h2
        id="subscribe-title"
        className="text-[18px] leading-[26px] font-medium text-[#2C333D]"
      >
        Подпишитесь на рассылку
      </h2>
      <p className="mx-auto mt-[13px] text-[14px] leading-[19px] text-[#6A6F75]">
        Регулярные скидки и спецпредложения, а так же новости компании.
      </p>

      {isDone ? (
        <p
          role="status"
          className="mt-5 flex items-center justify-center gap-2 text-[15px] font-medium text-[#1AA36F]"
        >
          <CheckCircle2 className="size-5" />
          Вы подписались на рассылку
        </p>
      ) : (
        <form noValidate onSubmit={handleSubmit} className="mt-[13px]">
          <div className="flex flex-col gap-[13px] md:flex-row lg:flex-col">
            <div className="flex-1 text-left">
              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="Email"
                aria-label="Email для рассылки"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email)
                    setErrors((p) => ({ ...p, email: undefined }));
                }}
                aria-invalid={!!errors.email || undefined}
                aria-describedby={
                  errors.email ? "subscribe-email-error" : undefined
                }
                className={cn(inputClassName(!!errors.email), "h-[61px]")}
              />
              <FieldError id="subscribe-email-error" message={errors.email} />
            </div>

            <button
              type="submit"
              className="h-[61px] w-full shrink-0 rounded-[7px] bg-[#186FD4] px-6 text-[14px] font-bold tracking-wide text-white uppercase transition-colors hover:bg-[#0F5BB5] md:w-[239px] lg:w-full"
            >
              Подписаться
            </button>
          </div>

          <div className="mt-[13px] flex flex-col text-left md:items-center lg:items-stretch">
            <Checkbox
              size="md"
              checked={consent}
              invalid={!!errors.consent}
              onChange={(checked) => {
                setConsent(checked);
                if (checked) setErrors((p) => ({ ...p, consent: undefined }));
              }}
              labelClassName="text-[12px] leading-[18px]"
            >
              Согласен с обработкой персональных данных в соответствии с{" "}
              <Link
                href="/privacy-policy"
                className="underline underline-offset-2 hover:text-[#186FD4]"
              >
                политикой конфиденциальности
              </Link>
            </Checkbox>
            <FieldError id="subscribe-consent-error" message={errors.consent} />
          </div>
        </form>
      )}
    </section>
  );
}
