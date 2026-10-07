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
    return `Сервер вернул не JSON (HTTP ${e.originalStatus ?? "?"}). Проверьте адрес API.`;
  }

  if (e.status === "FETCH_ERROR") {
    return "Ошибка соединения с сервером. Попробуйте позже.";
  }

  if (e.data && typeof e.data === "object") {
    const parts = Object.entries(e.data as Record<string, unknown>).map(
      ([key, value]) => {
        const text = Array.isArray(value) ? String(value[0]) : String(value);
        return key === "error" || key === "detail" ? text : `${key}: ${text}`;
      }
    );
    if (parts.length > 0) return parts.join(" | ");
  }

  return `Ошибка сервера (${e.status ?? "нет ответа"})`;
}