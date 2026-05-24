"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Logo } from "./logo";
import { MainNav } from "./main-nav";
import { MobileNav } from "./mobile-nav";
import { LocaleSwitcher } from "./locale-switcher";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/cn";

export function Header() {
  const t = useTranslations("Nav");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-[background-color,backdrop-filter,border-color] duration-300 [transition-timing-function:var(--ease-expo-out)]",
        scrolled
          ? "bg-bg/85 border-border/60 border-b backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-6 md:h-20">
        <Logo />
        <MainNav className="ml-auto" />
        <div className="ml-auto flex items-center gap-3 md:ml-0 md:gap-4">
          <LocaleSwitcher />
          <ThemeToggle />
          <Link
            href="/contact"
            className="bg-teranga-primary hover:bg-teranga-secondary hidden h-9 items-center rounded-full px-5 text-sm font-medium text-white transition-colors duration-200 md:inline-flex"
          >
            {t("cta")}
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
