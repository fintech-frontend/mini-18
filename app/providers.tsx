"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/lib/store";
import { hydrate } from "@/lib/authSlice";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    store.dispatch(hydrate());

    // Boshqa tabda login/logout bo'lsa (token o'zgarsa) — shu tab ham yangilanadi,
    // aks holda eski token bilan yoki tokensiz so'rov ketib qoladi
    const onStorage = (e: StorageEvent) => {
      if (e.key === null || e.key === "token" || e.key === "refresh") store.dispatch(hydrate());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
