import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  Newsreader,
  Inter,
  JetBrains_Mono,
  Plus_Jakarta_Sans,
} from "next/font/google";
import { getLocale } from "next-intl/server";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

// Newsreader stays available (used by a few editorial italic moments
// like Ch3 citations), but the main display font is now Plus Jakarta
// Sans — closest open-source match for Google Sans, the typeface used
// across labs.google.
const newsreader = Newsreader({
  subsets: ["latin", "latin-ext"],
  variable: "--font-newsreader",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
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

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description:
    "Studio produit dakarois qui conçoit, lance et maintient des SaaS sur mesure.",
  applicationName: siteConfig.name,
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: [{ url: "/logo.png", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description:
      "Studio produit dakarois qui conçoit, lance et maintient des SaaS sur mesure.",
    images: [
      {
        url: "/logo.png",
        width: 774,
        height: 528,
        alt: "Logo TerangaDev",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description:
      "Studio produit dakarois qui conçoit, lance et maintient des SaaS sur mesure.",
    images: ["/logo.png"],
  },
};

export const viewport = {
  themeColor: "#0a68f7",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const locale = await getLocale();
  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${newsreader.variable} ${inter.variable} ${jetbrainsMono.variable} ${plusJakartaSans.variable}`}
    >
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
