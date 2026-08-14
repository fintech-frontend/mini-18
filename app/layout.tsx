import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const helvetica = localFont({
  src: [
    {
      path: "./fonts/helveticaneuecyr-thin.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "./fonts/helveticaneuecyr-light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/helveticaneuecyr-roman.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/helveticaneuecyr-medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/helveticaneuecyr-bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/helveticaneuecyr-heavy.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "./fonts/helveticaneuecyr-black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-helvetica",
});

export const metadata: Metadata = {
  title: "Стройоптторг",
  description: "Стройоптторг",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={helvetica.className}>
        {children}
      </body>
    </html>
  );
}