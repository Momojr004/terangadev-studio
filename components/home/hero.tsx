import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { HeroHeadline } from "@/components/home/hero-headline";
import { SectionBlobs } from "@/components/site/section-blobs";
import { Magnetic } from "@/components/motion/magnetic";

export function Hero() {
  const t = useTranslations("Home");
  return (
    <section className="relative overflow-x-clip">
      {/* Decorative organic blobs (labs.google language) — large
          saturated shapes anchored at viewport edges, slow drift+rotate. */}
      <SectionBlobs
        blobs={[
          {
            shape: "blob1",
            color: "#F2C94C",
            size: "42vw",
            position: { top: "-18%", right: "-12%" },
            rotation: 24,
            animation: "blobDriftA",
            duration: 16,
            opacity: 0.9,
          },
          {
            shape: "blob3",
            color: "#7CE891",
            size: "36vw",
            position: { bottom: "-22%", left: "-14%" },
            rotation: -12,
            animation: "blobDriftB",
            duration: 19,
            delay: -10,
            opacity: 0.85,
          },
          {
            shape: "blob2",
            color: "#4EA8F9",
            size: "28vw",
            position: { top: "35%", right: "8%" },
            rotation: 38,
            animation: "blobDriftC",
            duration: 14,
            delay: -20,
            opacity: 0.55,
          },
          {
            shape: "blob4",
            color: "#FB7185",
            size: "20vw",
            position: { top: "12%", left: "38%" },
            rotation: 8,
            animation: "blobDriftD",
            duration: 15,
            delay: -30,
            opacity: 0.35,
          },
        ]}
      />

      {/* Dark mode uses the same layout as light mode — labs.google
          design language applied uniformly across themes. The WebGL
          sphere & keyword constellation that previously lived here
          have been removed for parity. */}

      <div className="relative mx-auto flex min-h-[calc(100dvh-5rem)] max-w-6xl flex-col items-start justify-center gap-10 px-6 py-24">
        <p className="text-teranga-primary font-mono text-xs uppercase tracking-[0.2em]">
          {t("tag")}
        </p>

        <HeroHeadline
          first={t("headlineFirst")}
          second={t("headlineSecond")}
        />

        <p className="text-muted max-w-xl text-lg leading-relaxed md:text-xl">
          {t("subhead")}
        </p>

        <div className="flex flex-wrap gap-4">
          <Magnetic strength={0.35} radius={140}>
            <Link
              href="/contact"
              className="bg-teranga-primary hover:bg-teranga-secondary inline-flex h-12 items-center rounded-full px-7 text-sm font-medium text-white transition-colors duration-300 [transition-timing-function:var(--ease-expo-out)]"
            >
              {t("ctaPrimary")}
            </Link>
          </Magnetic>
          <Magnetic strength={0.28} radius={140}>
            <a
              href="https://cal.com/terangadev"
              target="_blank"
              rel="noreferrer"
              className="border-border hover:bg-surface bg-bg/60 inline-flex h-12 items-center rounded-full border px-7 text-sm font-medium backdrop-blur-sm transition-colors duration-300 [transition-timing-function:var(--ease-expo-out)]"
            >
              {t("ctaSecondary")}
            </a>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
