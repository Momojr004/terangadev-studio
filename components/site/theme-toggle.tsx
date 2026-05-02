"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const t = useTranslations("Nav");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div aria-hidden className="size-9" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={t("ariaToggleTheme")}
      className="text-fg/70 hover:bg-surface hover:text-teranga-primary inline-flex size-9 items-center justify-center rounded-full transition-colors duration-200"
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}
