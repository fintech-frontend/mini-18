"use client";

import { useSyncExternalStore } from "react";

/* Admin sessiyasi: haqiqiy /auth/login/ API muvaffaqiyatli bo'lgach localStorage'da saqlanadi */
const KEY = "admin-session";

export type Session = { email: string; name: string; role: string } | null;

const listeners = new Set<() => void>();
let cache: { raw: string | null; value: Session } = { raw: null, value: null };

function read(): Session {
  if (typeof window === "undefined") return null;
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    /* ignore */
  }
  if (raw !== cache.raw) {
    let value: Session = null;
    try {
      value = raw ? JSON.parse(raw) : null;
    } catch {
      value = null;
    }
    cache = { raw, value };
  }
  return cache.value;
}

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
};

/** undefined — hali brauzerda tekshirilmagan (SSR / hydration) */
export function useAdminSession(): Session | undefined {
  return useSyncExternalStore(subscribe, read, () => undefined);
}

export function startAdminSession(email: string) {
  const name = email.split("@")[0].replace(/[._-]+/g, " ");
  const s = { email, name: name.charAt(0).toUpperCase() + name.slice(1), role: "Bosh Admin" };
  localStorage.setItem(KEY, JSON.stringify(s));
  listeners.forEach((l) => l());
}

export function adminLogout() {
  localStorage.removeItem(KEY);
  listeners.forEach((l) => l());
}
