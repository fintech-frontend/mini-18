const BASE_URL = "https://fixingtools.pythonanywhere.com/api";

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });

  if (!res.ok) {
    throw new Error(`API xatosi: ${res.status} ${res.statusText}`);
  }

  return res.json();
}
 
export { apiFetch, BASE_URL }; 