import type { ReactNode } from "react";
import { Newsreader, Inter, JetBrains_Mono } from "next/font/google";
import { getLocale } from "next-intl/server";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin", "latin-ext"],
  variable: "--font-newsreader",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  weight: ["400", "500", "600"],
});

export default async function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const locale = await getLocale();
  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${newsreader.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
