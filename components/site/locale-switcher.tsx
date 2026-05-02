"use client";

import { useLocale } from "next-intl";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

export function LocaleSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function toggle() {
    const next: Locale = locale === "fr" ? "en" : "fr";
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isPending}
      aria-label={`Switch to ${locale === "fr" ? "English" : "Français"}`}
      className="text-fg/70 hover:text-teranga-primary font-mono text-xs uppercase tracking-[0.18em] transition-colors duration-200 disabled:opacity-50"
    >
      {locale === "fr" ? "FR / en" : "fr / EN"}
    </button>
  );
}
