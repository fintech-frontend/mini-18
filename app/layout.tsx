import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

import CartDiscountBanner from "@/components/CartDiscountBanner";
import Header from "@/components/navbar/page";
import FooterWithMenu from "@/components/footer/page";
import { styles } from "@/styles/index.styles";

const helvetica = localFont({
  src: [
    {
      path: "./fonts/helveticaneuecyr-roman.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-helvetica",
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Next App",
  description: "Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${helvetica.variable}`}
    >
      {/* Barcha visual komponentlar <body> va </body> oralig'ida bo'lishi shart:
      */}
      <body className={`${styles.container}min-h-screen flex flex-col antialiased`}>
        <Header />
        <CartDiscountBanner />
        
        <main className="flex-1">
          {children}
        </main>

        <FooterWithMenu />
      </body>
    </html>
  );
}