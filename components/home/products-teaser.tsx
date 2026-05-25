"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  Section,
  SectionTag,
  SectionHeadline,
  SectionSubhead,
} from "@/components/site/section";
import { staggerParent, staggerChild } from "@/components/motion/reveal";
import { cn } from "@/lib/cn";
import { SectionBlobs } from "@/components/site/section-blobs";

export function ProductsTeaser() {
  const t = useTranslations("Products");

  const products = [
    {
      name: t("creneauName"),
      sector: t("creneauSector"),
      status: t("creneauStatus"),
      metric: t("creneauMetric"),
      href: "/produits/creneau",
      live: true,
    },
    {
      name: t("nurapicName"),
      sector: t("nurapicSector"),
      status: t("nurapicStatus"),
      metric: t("nurapicMetric"),
      href: "/produits/nurapic",
      live: true,
    },
    {
      name: t("samaName"),
      sector: t("samaSector"),
      status: t("samaStatus"),
      metric: t("samaMetric"),
      href: "/produits/sama-reservation",
      live: false,
    },
    {
      name: t("ticketName"),
      sector: t("ticketSector"),
      status: t("ticketStatus"),
      metric: t("ticketMetric"),
      href: "/produits/ticket-events",
      live: false,
    },
  ];

  return (
    <Section variant="surface" className="relative overflow-x-clip">
      <SectionBlobs
        blobs={[
          {
            shape: "blob2",
            color: "#F2C94C",
            size: "30vw",
            position: { top: "-15%", left: "-10%" },
            rotation: -22,
            animation: "blobDriftB",
            duration: 17,
            opacity: 0.6,
          },
          {
            shape: "blob3",
            color: "#FB7185",
            size: "24vw",
            position: { bottom: "8%", right: "-10%" },
            rotation: 18,
            animation: "blobDriftD",
            duration: 21,
            delay: -7,
            opacity: 0.5,
          },
        ]}
      />

      <div className="relative flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <SectionTag>{t("tag")}</SectionTag>
          <SectionHeadline>{t("headline")}</SectionHeadline>
          <SectionSubhead>{t("subhead")}</SectionSubhead>
        </div>
      </div>

      <motion.ul
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={staggerParent}
        className="relative mt-16 grid gap-4 md:grid-cols-2"
      >
        {products.map((p, idx) => (
          <motion.li key={idx} variants={staggerChild}>
            <Link
              href={p.href}
              className="border-border bg-bg group relative flex h-full flex-col justify-between gap-10 overflow-hidden rounded-2xl border p-8 transition-all duration-500 [transition-timing-function:var(--ease-expo-out)] hover:-translate-y-0.5 hover:border-teranga-primary/40 md:p-10"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-muted font-mono text-xs uppercase tracking-[0.18em]">
                    {p.sector}
                  </p>
                  <h3 className="font-display mt-2 text-3xl leading-tight font-medium tracking-tight md:text-4xl">
                    {p.name}
                  </h3>
                </div>
                <span
                  className={cn(
                    "rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em]",
                    p.live
                      ? "border-teranga-primary/40 text-teranga-primary"
                      : "border-border text-muted",
                  )}
                >
                  {p.status}
                </span>
              </div>

              <div className="flex items-end justify-between gap-4">
                <p className="text-muted max-w-md text-sm leading-relaxed">
                  {p.metric}
                </p>
                <ArrowUpRight className="text-fg/40 size-5 shrink-0 transition-all duration-500 [transition-timing-function:var(--ease-expo-out)] group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-teranga-primary" />
              </div>
            </Link>
          </motion.li>
        ))}
      </motion.ul>

      <div className="mt-12 flex justify-center">
        <Link
          href="/produits"
          className="border-border bg-bg hover:border-teranga-primary/40 inline-flex h-12 items-center gap-2 rounded-full border px-7 text-sm font-medium transition-colors duration-300"
        >
          {t("viewAll")}
          <ArrowUpRight className="size-4" />
        </Link>
      </div>
    </Section>
  );
}
