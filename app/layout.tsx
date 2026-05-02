import type { Metadata } from "next";
import { Newsreader, Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://terangadev.com"),
  title: {
    default: "TerangaDev — Studio produit dakarois",
    template: "%s · TerangaDev",
  },
  description:
    "Le seul studio à Dakar qui shippe ses propres SaaS depuis 2022 — et qui t'accompagne de l'idée à la maintenance.",
  applicationName: "TerangaDev",
  authors: [{ name: "TerangaDev", url: "https://terangadev.com" }],
  creator: "TerangaDev",
  publisher: "TerangaDev",
  openGraph: {
    type: "website",
    locale: "fr_SN",
    url: "https://terangadev.com",
    siteName: "TerangaDev",
    title: "TerangaDev — Studio produit dakarois",
    description:
      "Le seul studio à Dakar qui shippe ses propres SaaS depuis 2022 — et qui t'accompagne de l'idée à la maintenance.",
  },
  twitter: {
    card: "summary_large_image",
    title: "TerangaDev — Studio produit dakarois",
    description:
      "Le seul studio à Dakar qui shippe ses propres SaaS depuis 2022 — et qui t'accompagne de l'idée à la maintenance.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${newsreader.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-body">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
