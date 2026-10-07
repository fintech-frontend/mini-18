"use client";

import { useState } from "react";
import Link from "next/link";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * "Подпишитесь на рассылку".
 * 360 / 1024+ — ustma-ust, 768 — input va tugma yonma-yon (maketdagidek).
 */
export default function DeliverySubscribe() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; consent?: string }>(
    {},
  );
  const [isDone, setIsDone] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const next: typeof errors = {};
    if (!email.trim()) next.email = "Укажите email";
    else if (!EMAIL_RE.test(email.trim())) next.email = "Некорректный email";
    if (!consent) next.consent = "Необходимо согласие";

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    // TODO: obuna API ulanadi
    setIsDone(true);
  };

  return (
    <section
      aria-labelledby="delivery-subscribe-title"
      className="rounded-lg bg-[#F6F8FA] px-[15px] py-5 text-center lg:p-[25px]"
    >
      <h2
        id="delivery-subscribe-title"
        className="text-[18px] leading-[26px] font-medium text-[#2C333D]"
      >
        Подпишитесь на рассылку
      </h2>
      <p className="mt-[13px] text-[14px] leading-[19px] text-[#6A6F75]">
        Регулярные скидки и спецпредложения, а так же новости компании.
      </p>

      {isDone ? (
        <p
          role="status"
          className="mt-5 text-[15px] font-medium text-[#1AA36F]"
        >
          ✓ Вы подписались на рассылку
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
                className={`h-[61px] w-full rounded-[7px] border bg-white px-5 text-[15px] text-[#2C333D] outline-none transition-colors placeholder:text-[#A0A5AC] focus:border-[#186FD4] ${
                  errors.email ? "border-[#E5484D]" : "border-[#E5E7EB]"
                }`}
              />
              {errors.email && (
                <p role="alert" className="mt-1.5 text-[13px] text-[#E5484D]">
                  {errors.email}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="h-[61px] w-full shrink-0 rounded-[7px] bg-[#186FD4] px-6 text-[14px] font-bold tracking-wide text-white uppercase transition-colors hover:bg-[#0F5BB5] md:w-[239px] lg:w-full"
            >
              Подписаться
            </button>
          </div>

          <div className="mt-[13px] flex flex-col text-left md:items-center lg:items-stretch">
            <label className="group flex cursor-pointer items-start gap-3 select-none">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => {
                  setConsent(e.target.checked);
                  if (e.target.checked)
                    setErrors((p) => ({ ...p, consent: undefined }));
                }}
                className="peer sr-only"
              />
              <span
                aria-hidden
                className={`flex size-[26px] shrink-0 items-center justify-center rounded-[5px] border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-[#186FD4]/40 ${
                  consent
                    ? "border-[#186FD4] bg-[#186FD4] text-white"
                    : errors.consent
                      ? "border-[#E5484D] bg-white"
                      : "border-[#D9DDE3] bg-white group-hover:border-[#186FD4]"
                }`}
              >
                {consent && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2.5 6L5 8.5L9.5 3.5"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
              <span className="pt-[2px] text-[12px] leading-[18px] text-[#8A9098]">
                Согласен с обработкой персональных данных в соответствии с{" "}
                <Link
                  href="/privacy-policy"
                  className="underline underline-offset-2 hover:text-[#186FD4]"
                >
                  политикой конфиденциальности
                </Link>
              </span>
            </label>
            {errors.consent && (
              <p role="alert" className="mt-1.5 text-[13px] text-[#E5484D]">
                {errors.consent}
              </p>
            )}
          </div>
        </form>
      )}
    </section>
  );
}
