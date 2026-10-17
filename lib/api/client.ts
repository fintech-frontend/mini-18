/**
 * Backend bilan ishlash uchun yagona fetch funksiyasi.
 * Manzil .env.local dagi NEXT_PUBLIC_API_URL dan olinadi (bo'lmasa — server).
 */

export const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ??
  "https://fixingtools.pythonanywhere.com/api/v1"
).replace(/\/+$/, "");

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export type QueryParams = Record<
  string,
  string | number | boolean | null | undefined
>;

type GetOptions = {
  signal?: AbortSignal;
  /** Server komponentlarida: necha soniya keshda turadi */
  revalidate?: number;
};

export function buildUrl(path: string, params: QueryParams = {}) {
  const url = new URL(`${API_URL}/${path.replace(/^\/+/, "")}`);
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    url.searchParams.set(key, String(value));
  }
  return url.toString();
}

export async function apiGet<T>(
  path: string,
  params?: QueryParams,
  { signal, revalidate = 60 }: GetOptions = {},
): Promise<T> {
  const response = await fetch(buildUrl(path, params), {
    signal,
    headers: { Accept: "application/json" },
    next: { revalidate },
  });

  if (!response.ok) {
    throw new ApiError(
      response.status,
      `API ${response.status}: ${path}`,
    );
  }

  return response.json() as Promise<T>;
}

/** Ro'yxat ba'zan sahifalangan {results}, ba'zan oddiy massiv keladi */
export function toList<T>(data: T[] | { results: T[] }): T[] {
  return Array.isArray(data) ? data : data.results;
}
