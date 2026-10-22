"use client";

import { useRouter } from "next/navigation";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Tarix bo'lmasa (havola yangi tabda ochilgan) — shu manzilga o'tiladi */
  fallbackHref?: string;
};

/** "Вернуться назад": oldingi sahifaga, tarix bo'lmasa — fallbackHref ga */
export default function BackButton({
  children,
  className,
  fallbackHref = "/",
}: Props) {
  const router = useRouter();

  const handleClick = () => {
    if (window.history.length > 1) router.back();
    else router.push(fallbackHref);
  };

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
