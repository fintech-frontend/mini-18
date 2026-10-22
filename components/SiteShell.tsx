"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/navbar/page";
import FooterWithMenu from "@/components/footer/page";

// Admin panelda saytning header va footer'i ko'rsatilmaydi
export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return <>{children}</>;

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <FooterWithMenu />
    </>
  );
}
