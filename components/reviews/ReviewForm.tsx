"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2 } from "lucide-react";

import Checkbox from "@/components/ui/Checkbox";
import {
  FieldError,
  FieldLabel,
  inputClassName,
  isValidEmail,
} from "@/components/ui/FormField";
import {
  REVIEW_NAME_MAX_LENGTH,
  REVIEW_TEXT_MAX_LENGTH,
  REVIEW_TEXT_MIN_LENGTH,
} from "@/data/reviewsConfig";
import { createStoreReview, ReviewSubmitError } from "@/lib/api/storeReviews";
import { cn } from "@/lib/utils";
import type { ReviewFormField, ReviewFormValues } from "@/types/reviewTypes";
import PhotoUpload, { type UploadedPhoto } from "./PhotoUpload";

type Values = ReviewFormValues;

type Errors = Partial<Record<ReviewFormField | "consent", string>>;

const EMPTY: Values = { name: "", email: "", text: "" };
const MIN_TEXT_LENGTH = REVIEW_TEXT_MIN_LENGTH;

function validate(values: Values, consent: boolean): Errors {
  const errors: Errors = {};

  if (values.name.trim().length < 2) errors.name = "Укажите ваше имя";

  if (!values.email.trim()) errors.email = "Укажите email";
  else if (!isValidEmail(values.email)) errors.email = "Некорректный email";

  if (!values.text.trim()) errors.text = "Напишите текст отзыва";
  else if (values.text.trim().length < MIN_TEXT_LENGTH)
    errors.text = `Минимум ${MIN_TEXT_LENGTH} символов`;

  if (!consent) errors.consent = "Необходимо согласие на обработку данных";

  return errors;
}

/**
 * "Оставить отзыв" — /store-reviews/ ga yuboriladi.
 * Sharh admin tasdiqlaguncha saytda ko'rinmaydi.
 */
export default function ReviewForm() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const setField = (key: keyof Values, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const nextErrors = validate(values, consent);
    setErrors(nextErrors);

    const firstInvalid = Object.keys(nextErrors)[0];
    if (firstInvalid) {
      document.getElementById(`review-${firstInvalid}`)?.focus();
      return;
    }

    setStatus("sending");
    setSubmitError(null);

    try {
      await createStoreReview(
        values,
        photos.map((photo) => photo.file),
      );
    } catch (error) {
      setStatus("idle");
      if (error instanceof ReviewSubmitError) {
        setErrors(error.fieldErrors);
        setSubmitError(error.message);
        const firstServerError = Object.keys(error.fieldErrors)[0];
        if (firstServerError) document.getElementById(`review-${firstServerError}`)?.focus();
      } else {
        setSubmitError("Не удалось отправить отзыв. Попробуйте ещё раз.");
      }
      return;
    }

    photos.forEach((photo) => URL.revokeObjectURL(photo.previewUrl));
    setValues(EMPTY);
    setPhotos([]);
    setConsent(false);
    setStatus("sent");
  };

  if (status === "sent") {
    return (
      <div
        role="status"
        className="flex max-w-[736px] flex-col items-start gap-4 rounded-[8px] border border-[#CDEBDD] bg-[#F2FBF6] p-5 md:flex-row md:items-center md:p-[25px]"
      >
        <CheckCircle2 className="size-8 shrink-0 text-[#1AA36F]" />
        <div className="flex-1">
          <p className="text-[17px] font-semibold text-[#2C333D]">
            Спасибо за ваш отзыв!
          </p>
          <p className="mt-1 text-[15px] text-[#555B63]">
            Он появится на сайте после проверки модератором.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="text-[14px] font-medium text-[#186FD4] hover:underline"
        >
          Написать ещё
        </button>
      </div>
    );
  }

  const isSending = status === "sending";

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="flex max-w-[736px] flex-col gap-[30px]"
    >
      <div className="grid grid-cols-1 gap-[30px] md:grid-cols-2">
        <div>
          <FieldLabel htmlFor="review-name" required>
            Ваше имя
          </FieldLabel>
          <input
            id="review-name"
            type="text"
            autoComplete="name"
            maxLength={REVIEW_NAME_MAX_LENGTH}
            placeholder="Введите ваше имя"
            value={values.name}
            onChange={(e) => setField("name", e.target.value)}
            aria-invalid={!!errors.name || undefined}
            aria-describedby={errors.name ? "review-name-error" : undefined}
            className={cn(inputClassName(!!errors.name), "h-[61px]")}
          />
          <FieldError id="review-name-error" message={errors.name} />
        </div>

        <div>
          <FieldLabel htmlFor="review-email" required>
            Email
          </FieldLabel>
          <input
            id="review-email"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="Введите ваш электронный адрес"
            value={values.email}
            onChange={(e) => setField("email", e.target.value)}
            aria-invalid={!!errors.email || undefined}
            aria-describedby={errors.email ? "review-email-error" : undefined}
            className={cn(inputClassName(!!errors.email), "h-[61px]")}
          />
          <FieldError id="review-email-error" message={errors.email} />
        </div>
      </div>

      <div>
        <FieldLabel htmlFor="review-text" required>
          Текст отзыва
        </FieldLabel>
        <textarea
          id="review-text"
          placeholder="Ваш отзыв"
          rows={3}
          maxLength={REVIEW_TEXT_MAX_LENGTH}
          value={values.text}
          onChange={(e) => setField("text", e.target.value)}
          aria-invalid={!!errors.text || undefined}
          aria-describedby={errors.text ? "review-text-error" : undefined}
          className={cn(
            inputClassName(!!errors.text),
            "block min-h-[89px] resize-y py-[18px] leading-[24px]",
          )}
        />
        <div className="flex items-start justify-between gap-4">
          <FieldError id="review-text-error" message={errors.text} />
          <span
            aria-hidden
            className="ml-auto shrink-0 pt-1.5 text-[12px] text-[#A0A5AC] tabular-nums"
          >
            {values.text.length} / {REVIEW_TEXT_MAX_LENGTH}
          </span>
        </div>
      </div>

      <div>
        <FieldLabel>Прикрепить фото</FieldLabel>
        <PhotoUpload
          photos={photos}
          onChange={(next) => {
            setPhotos(next);
            if (errors.images) setErrors((prev) => ({ ...prev, images: undefined }));
          }}
        />
        <FieldError id="review-images-error" message={errors.images} />
      </div>

      <div className="flex flex-col items-center gap-[30px] lg:flex-row">
        <button
          type="submit"
          disabled={isSending}
          className="flex h-[62px] w-[209px] shrink-0 items-center justify-center gap-2 rounded-[7px] bg-[#186FD4] text-[14px] font-bold tracking-wide text-white uppercase transition-colors hover:bg-[#0F5BB5] disabled:cursor-wait disabled:opacity-80"
        >
          {isSending && <Loader2 className="size-4 animate-spin" />}
          {isSending ? "Отправка…" : "Отправить"}
        </button>

        <div className="w-full md:w-auto">
          <Checkbox
            id="review-consent"
            size="md"
            checked={consent}
            invalid={!!errors.consent}
            aria-describedby={
              errors.consent ? "review-consent-error" : undefined
            }
            onChange={(checked) => {
              setConsent(checked);
              if (checked)
                setErrors((prev) => ({ ...prev, consent: undefined }));
            }}
            labelClassName="max-w-[460px]"
          >
            Согласен с обработкой персональных данных в соответствии с{" "}
            <Link
              href="/privacy-policy"
              className="underline underline-offset-2 hover:text-[#186FD4]"
            >
              политикой конфиденциальности
            </Link>
          </Checkbox>
          <FieldError id="review-consent-error" message={errors.consent} />
        </div>
      </div>

      {submitError && (
        <p
          role="alert"
          className="rounded-[7px] border border-[#F3C4BE] bg-[#FFF4F3] px-5 py-[15px] text-[14px] text-[#B4231A]"
        >
          {submitError}
        </p>
      )}
    </form>
  );
}
