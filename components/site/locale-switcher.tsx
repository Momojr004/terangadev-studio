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

  const visibleText = locale === "fr" ? "FR / EN" : "FR / EN";
  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isPending}
      title={`${visibleText} — switch language`}
      className="text-fg/70 hover:text-teranga-primary font-mono text-xs uppercase tracking-[0.18em] transition-colors duration-200 disabled:opacity-50"
    >
      <span aria-hidden={false}>
        <span className={locale === "fr" ? "text-fg" : "text-fg/60"}>FR</span>
        <span className="text-fg/60"> / </span>
        <span className={locale === "en" ? "text-fg" : "text-fg/60"}>EN</span>
      </span>
    </button>
  );
}
