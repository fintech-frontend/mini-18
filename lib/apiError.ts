// RTK Query xatosini o'qiladigan matnga aylantiradi.
// { error: "..." }, { detail: "..." }, { email: ["..."] } formatlarini qo'llab-quvvatlaydi.
export function formatApiError(err: unknown): string {
  const e = err as {
    status?: number | string;
    originalStatus?: number;
    data?: unknown;
  };

  if (!e) return "Неизвестная ошибка";

  // Server JSON emas (masalan, 404 HTML sahifa) qaytardi
  if (e.status === "PARSING_ERROR") {
    if ((e.originalStatus ?? 0) >= 500) {
      return `Ошибка на сервере (HTTP ${e.originalStatus}). Попробуйте позже.`;
    }
    return `Сервер вернул не JSON (HTTP ${e.originalStatus ?? "?"}). Проверьте адрес API.`;
  }

  if (e.status === "FETCH_ERROR") {
    return "Ошибка соединения с сервером. Попробуйте позже.";
  }

  if (e.data && typeof e.data === "object") {
    const parts = flatten(e.data);
    if (parts.length > 0) return parts.join(" | ");
  }

  return `Ошибка сервера (${e.status ?? "нет ответа"})`;
}

// Ichma-ich javoblarni ({ success:false, errors:{ phone:["..."] } }) tekis matnga aylantiradi
const PLAIN_KEYS = ["error", "detail", "message", "errors", "data", "non_field_errors"];
const IGNORED_KEYS = ["success", "status_code", "status"];

// DRF'ning standart inglizcha xabarlari
const TRANSLATIONS: Record<string, string> = {
  "Authentication credentials were not provided.":
    "Требуется авторизация: сервер не получил или не принял токен. Войдите в аккаунт заново.",
  "Given token not valid for any token type": "Сессия истекла. Войдите в аккаунт заново.",
  "You do not have permission to perform this action.": "Недостаточно прав для этого действия.",
  "Not found.": "Не найдено.",
  "This field is required.": "Обязательное поле.",
  "This field may not be blank.": "Поле не может быть пустым.",
  "Enter a valid phone number, for example +998901234567.":
    "Введите корректный номер телефона, например +998 (90) 123-45-67.",
  "Enter a valid email address.": "Введите корректный email.",
};

// Maydon nomlari xabarda ruscha ko'rinadi ("phone: ..." → "Телефон: ...")
const FIELD_LABELS: Record<string, string> = {
  phone: "Телефон",
  email: "Email",
  password: "Пароль",
  first_name: "Имя",
  last_name: "Фамилия",
  street: "Улица",
  house: "Дом",
  company_name: "Название",
  region: "Регион",
  city: "Город",
};

function flatten(value: unknown, key = ""): string[] {
  if (typeof value === "string" || typeof value === "number") {
    if (value === "") return [];
    const text = TRANSLATIONS[String(value)] ?? String(value);
    return [!key || PLAIN_KEYS.includes(key) ? text : `${FIELD_LABELS[key] ?? key}: ${text}`];
  }
  if (Array.isArray(value)) return value.flatMap((v) => flatten(v, key));
  if (value && typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .filter(([k]) => !IGNORED_KEYS.includes(k))
      .flatMap(([k, v]) => flatten(v, k));
  }
  return [];
}