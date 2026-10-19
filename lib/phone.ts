// Telefon raqami niqobi va tekshiruvi (checkout va manzil formasida ishlatiladi)

/* Telefon niqobi:
   Rossiya    — "+7 (999) 123-45-67"   (+, 7, 8 yoki raqamdan boshlansa)
   O'zbekiston — "+998 (90) 123-45-67" ("+998" yoki "998" bilan boshlansa)
   Boshqa      — "+" va 15 tagacha raqam ("+" va 7 dan boshqa raqam bilan) */
export function formatPhone(raw: string): string {
  const value = raw.trim();
  if (value === "+") return "+";
  let d = value.replace(/\D/g, "");

  if (d.startsWith("998")) {
    d = d.slice(3, 12);
    let out = "+998";
    if (d.length > 0) out += " (" + d.slice(0, 2);
    if (d.length > 2) out += ") " + d.slice(2, 5);
    if (d.length > 5) out += "-" + d.slice(5, 7);
    if (d.length > 7) out += "-" + d.slice(7, 9);
    return out;
  }
  if (value.startsWith("+") && !d.startsWith("7")) {
    return "+" + d.slice(0, 15);
  }

  if (d.startsWith("7") || d.startsWith("8")) d = d.slice(1);
  d = d.slice(0, 10);
  if (!d) return "";
  let out = "+7 (" + d.slice(0, 3);
  if (d.length > 3) out += ") " + d.slice(3, 6);
  if (d.length > 6) out += "-" + d.slice(6, 8);
  if (d.length > 8) out += "-" + d.slice(8, 10);
  return out;
}

// To'liq kiritilganmi: +7 — 11 raqam, +998 — 12 raqam, boshqalari — 10–15 raqam
export function isPhoneComplete(phone: string): boolean {
  const d = phone.replace(/\D/g, "");
  if (phone.startsWith("+998")) return d.length === 12;
  if (phone.startsWith("+7")) return d.length === 11;
  return d.length >= 10 && d.length <= 15;
}

/** To'liq raqam uchun nechta raqam yetishmaydi (0 — yetarli yoki ortiqcha) */
export function phoneMissingDigits(phone: string): number {
  const d = phone.replace(/\D/g, "");
  if (phone.startsWith("+998")) return Math.max(0, 12 - d.length);
  if (phone.startsWith("+7")) return Math.max(0, 11 - d.length);
  return Math.max(0, 10 - d.length);
}

/** "Не хватает 2 цифр. Пример: …" — foydalanuvchiga tushunarli xabar */
export function phoneIncompleteMessage(phone: string): string {
  const n = phoneMissingDigits(phone);
  const word = n % 10 === 1 && n % 100 !== 11 ? "цифры" : "цифр";
  const example = phone.startsWith("+998") ? "+998 (90) 123-45-67" : "+7 (999) 123-45-67";
  return n > 0
    ? `В номере телефона не хватает ${n} ${word}. Пример: ${example}`
    : `Проверьте номер телефона. Пример: ${example}`;
}

/** Serverga yuborish uchun: "+998 (90) 123-45-67" → "+998901234567" */
export function normalizePhone(phone: string): string {
  const d = phone.replace(/\D/g, "");
  return d ? `+${d}` : "";
}
