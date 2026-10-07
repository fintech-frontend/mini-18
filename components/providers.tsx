"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/lib/store";
import { hydrate } from "@/lib/authSlice";

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    store.dispatch(hydrate());
  }, []);

  return <Provider store={store}>{children}</Provider>;
}