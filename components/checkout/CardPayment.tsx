"use client";

import { FormEvent, useState } from "react";
import { CreditCard, Lock } from "lucide-react";
import {
  paymentErrorNote,
  pickField,
  useCardPaymentMutation,
  useCardRequestMutation,
  useCardVerifyMutation,
} from "@/lib/api/paymentsApi";
import { formatApiError } from "@/lib/apiError";

/* Buyurtmani karta bilan to'lash: karta → SMS kod → to'lov (/api/payments/card/*) */

const inputClass =
  "h-11 w-full rounded-md border border-gray-200 bg-white px-4 text-sm text-slate-800 outline-none transition placeholder:text-gray-300 focus:border-[#2563EB]";

const formatPrice = (value: number) => `${value.toLocaleString("ru-RU")} ₽`;

// "8600123412341234" → "8600 1234 1234 1234"
const formatCard = (v: string) =>
  v.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");

// "1228" → "12/28"
const formatExpiry = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};

const paymentError = (err: unknown) => {
  const status = (err as { status?: number }).status;
  if (status === 502 || status === 503 || status === 504) {
    return "Платёжный сервис временно недоступен. Заказ сохранён — вы можете оплатить его позже или при получении.";
  }
  return formatApiError(err);
};

interface Props {
  orderNumber: string;
  amount: number;
  onPaid: () => void;
  onSkip: () => void;
}

export default function CardPayment({ orderNumber, amount, onPaid, onSkip }: Props) {
  const [cardRequest, { isLoading: requesting }] = useCardRequestMutation();
  const [cardVerify, { isLoading: verifying }] = useCardVerifyMutation();
  const [cardPayment, { isLoading: paying }] = useCardPaymentMutation();

  const [step, setStep] = useState<"card" | "otp">("card");
  const [card, setCard] = useState("");
  const [expiry, setExpiry] = useState("");
  const [otp, setOtp] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState<string | null>(null);

  const busy = requesting || verifying || paying;

  const submitCard = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const digits = card.replace(/\D/g, "");
    const exp = expiry.replace(/\D/g, "");
    if (digits.length !== 16) return setError("Введите номер карты полностью (16 цифр)");
    if (exp.length !== 4 || Number(exp.slice(0, 2)) < 1 || Number(exp.slice(0, 2)) > 12) {
      return setError("Введите срок действия карты в формате ММ/ГГ");
    }

    try {
      const res = await cardRequest({ card_number: digits, expiry: exp, amount }).unwrap();
      const note = paymentErrorNote(res);
      if (note) return setError(note);
      const cardToken = pickField(res, "card_token", "token");
      if (!cardToken) return setError("Платёжный сервис не вернул токен карты. Попробуйте позже.");
      setToken(cardToken);
      setStep("otp");
    } catch (err) {
      setError(paymentError(err));
    }
  };

  const submitOtp = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!/^\d{4,8}$/.test(otp.trim())) return setError("Введите код из SMS");

    try {
      const verified = await cardVerify({ card_token: token, otp: otp.trim() }).unwrap();
      const verifyNote = paymentErrorNote(verified);
      if (verifyNote) return setError(verifyNote);

      const paid = await cardPayment({ card_token: token, amount }).unwrap();
      const payNote = paymentErrorNote(paid);
      if (payNote) return setError(payNote);

      onPaid();
    } catch (err) {
      setError(paymentError(err));
    }
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-xl border border-gray-100 p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EFF6FF] text-[#2563EB]">
          <CreditCard size={20} />
        </span>
        <div>
          <h2 className="text-lg font-medium text-gray-900">Оплата картой</h2>
          <p className="text-xs text-gray-500">
            Заказ № {orderNumber} · <b className="text-[#1B365D]">{formatPrice(amount)}</b>
          </p>
        </div>
      </div>

      {step === "card" ? (
        <form onSubmit={submitCard} className="space-y-4">
          <div>
            <label htmlFor="pay-card" className="mb-2 block text-xs text-slate-700">
              Номер карты
            </label>
            <input
              id="pay-card"
              inputMode="numeric"
              autoComplete="cc-number"
              value={card}
              onChange={(e) => setCard(formatCard(e.target.value))}
              placeholder="0000 0000 0000 0000"
              className={inputClass}
            />
          </div>
          <div className="w-32">
            <label htmlFor="pay-exp" className="mb-2 block text-xs text-slate-700">
              Срок действия
            </label>
            <input
              id="pay-exp"
              inputMode="numeric"
              autoComplete="cc-exp"
              value={expiry}
              onChange={(e) => setExpiry(formatExpiry(e.target.value))}
              placeholder="ММ/ГГ"
              className={inputClass}
            />
          </div>

          {error && <ErrorBox text={error} />}

          <button
            type="submit"
            disabled={busy}
            className="h-12 w-full cursor-pointer rounded-md bg-[#2563EB] text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {requesting ? "Отправка..." : `Оплатить ${formatPrice(amount)}`}
          </button>
        </form>
      ) : (
        <form onSubmit={submitOtp} className="space-y-4">
          <p className="text-xs text-gray-600">
            Мы отправили SMS с кодом подтверждения на номер, привязанный к карте{" "}
            <b>•••• {card.replace(/\D/g, "").slice(-4)}</b>.
          </p>
          <div>
            <label htmlFor="pay-otp" className="mb-2 block text-xs text-slate-700">
              Код из SMS
            </label>
            <input
              id="pay-otp"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 8))}
              placeholder="______"
              className={`${inputClass} tracking-[0.3em]`}
            />
          </div>

          {error && <ErrorBox text={error} />}

          <button
            type="submit"
            disabled={busy}
            className="h-12 w-full cursor-pointer rounded-md bg-[#2563EB] text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {verifying || paying ? "Оплата..." : "Подтвердить оплату"}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              setStep("card");
              setOtp("");
              setToken("");
              setError(null);
            }}
            className="w-full cursor-pointer text-xs text-[#2563EB] underline"
          >
            Изменить карту
          </button>
        </form>
      )}

      <button
        type="button"
        onClick={onSkip}
        disabled={busy}
        className="mt-4 w-full cursor-pointer rounded-md bg-gray-100 py-3 text-xs font-bold uppercase tracking-wider text-gray-700 hover:bg-gray-200 disabled:opacity-50"
      >
        Оплатить позже
      </button>

      <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
        <Lock size={12} /> Данные карты передаются в защищённом режиме
      </p>
    </div>
  );
}

function ErrorBox({ text }: { text: string }) {
  return (
    <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">{text}</p>
  );
}
