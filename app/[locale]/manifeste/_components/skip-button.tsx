"use client";

import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

export function SkipButton() {
  const t = useTranslations("Manifeste");
  const router = useRouter();

  function handleSkip() {
    document.cookie =
      "terangadev_seen_intro=1; path=/; max-age=31536000; SameSite=Lax";
    router.push("/");
  }

  return (
    <button
      type="button"
      onClick={handleSkip}
      aria-label={t("skipAriaLabel")}
      className="fixed top-6 right-6 z-50 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/80 backdrop-blur-md transition-all duration-300 hover:border-white/60 hover:bg-black/60 hover:text-white md:right-8 md:top-8"
    >
      {t("skipButton")}
      <ArrowRight className="size-3" />
    </button>
  );
}
