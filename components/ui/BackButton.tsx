"use client";

import { useRouter } from "next/navigation";

type Props = {
  className?: string;
  children: React.ReactNode;
  /** Orqada saytning sahifasi bo'lmasa (yangi tab, tashqi havola) shu manzilga o'tadi */
  fallbackHref?: string;
};

type WindowWithNavigation = Window & {
  navigation?: { canGoBack?: boolean };
};

/** Orqaga qaytish faqat shu sayt ichida bo'lsa */
function canGoBackInApp() {
  const nav = (window as WindowWithNavigation).navigation;
  // Navigation API faqat shu origin'dagi yozuvlarni hisoblaydi
  if (nav && typeof nav.canGoBack === "boolean") return nav.canGoBack;

  if (document.referrer) {
    try {
      return new URL(document.referrer).origin === window.location.origin;
    } catch {
      return false;
    }
  }

  return false;
}

export default function BackButton({
  className,
  children,
  fallbackHref = "/",
}: Props) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        if (canGoBackInApp()) router.back();
        else router.push(fallbackHref);
      }}
      className={className}
    >
      {children}
    </button>
  );
}
