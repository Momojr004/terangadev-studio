"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  Section,
  SectionTag,
  SectionHeadline,
} from "@/components/site/section";
import { staggerParent, staggerChild } from "@/components/motion/reveal";

export function WorkTeaser() {
  const t = useTranslations("Work");

  const cases = [
    {
      title: t("case1Title"),
      sector: t("case1Sector"),
      metric: t("case1Metric"),
      href: "/realisations/hydrautech",
    },
    {
      title: t("case2Title"),
      sector: t("case2Sector"),
      metric: t("case2Metric"),
      href: "/realisations/ndougalma",
    },
    {
      title: t("case3Title"),
      sector: t("case3Sector"),
      metric: t("case3Metric"),
      href: "/realisations/creneau",
    },
  ];

  return (
    <Section>
      <div className="flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <SectionTag>{t("tag")}</SectionTag>
          <SectionHeadline>{t("headline")}</SectionHeadline>
        </div>
        <Link
          href="/realisations"
          className="text-teranga-primary inline-flex items-center gap-1.5 text-sm font-medium"
        >
          {t("viewAll")}
          <ArrowUpRight className="size-4" />
        </Link>
      </div>

      <motion.ul
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={staggerParent}
        className="mt-16 divide-border border-border divide-y border-y"
      >
        {cases.map((c, idx) => (
          <motion.li key={idx} variants={staggerChild}>
            <Link
              href={c.href}
              className="group flex items-baseline gap-6 py-8 transition-colors duration-300 md:gap-12 md:py-10"
            >
              <span className="text-muted hidden font-mono text-xs uppercase tracking-[0.2em] md:block md:w-12">
                0{idx + 1}
              </span>
              <div className="flex flex-1 flex-col gap-2 md:flex-row md:items-baseline md:gap-12">
                <h3 className="font-display text-3xl leading-tight font-medium tracking-tight transition-colors group-hover:text-teranga-primary md:text-4xl md:flex-1">
                  {c.title}
                </h3>
                <p className="text-muted font-mono text-xs uppercase tracking-[0.15em] md:w-72">
                  {c.sector}
                </p>
                <p className="text-muted max-w-md text-sm leading-relaxed md:flex-1">
                  {c.metric}
                </p>
              </div>
              <ArrowUpRight className="text-fg/40 size-5 shrink-0 transition-all duration-500 [transition-timing-function:var(--ease-expo-out)] group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-teranga-primary" />
            </Link>
          </motion.li>
        ))}
      </motion.ul>
    </Section>
  );
}
