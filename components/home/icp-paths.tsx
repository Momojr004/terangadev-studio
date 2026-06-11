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
import { SectionBlobs } from "@/components/site/section-blobs";

export function ICPPaths() {
  const t = useTranslations("ICP");

  const cards = [
    {
      title: t("card1Title"),
      body: t("card1Body"),
      link: t("card1Link"),
      href: "/realisations/hydrautech",
    },
    {
      title: t("card2Title"),
      body: t("card2Body"),
      link: t("card2Link"),
      href: "/realisations/ndougalma",
    },
    {
      title: t("card3Title"),
      body: t("card3Body"),
      link: t("card3Link"),
      href: "/produits",
    },
  ];

  return (
    <Section className="relative overflow-x-clip">
      <SectionBlobs
        blobs={[
          {
            shape: "blob4",
            color: "#A78BFA",
            size: "28vw",
            position: { top: "10%", right: "-12%" },
            rotation: 20,
            animation: "blobDriftC",
            duration: 18,
            opacity: 0.55,
          },
          {
            shape: "blob1",
            color: "#7CE891",
            size: "22vw",
            position: { bottom: "-12%", left: "5%" },
            rotation: -10,
            animation: "blobDriftA",
            duration: 22,
            delay: -8,
            opacity: 0.45,
          },
        ]}
      />

      <div className="relative max-w-3xl">
        <SectionTag>{t("tag")}</SectionTag>
        <SectionHeadline>{t("headline")}</SectionHeadline>
      </div>

      <motion.ul
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={staggerParent}
        className="relative mt-16 grid gap-6 md:grid-cols-3"
      >
        {cards.map((card, idx) => (
          <motion.li
            key={idx}
            variants={staggerChild}
            className="border-border bg-bg group relative flex flex-col gap-4 rounded-2xl border p-8 transition-colors duration-300 [transition-timing-function:var(--ease-expo-out)] hover:border-teranga-primary/40"
          >
            <span className="text-teranga-primary font-mono text-xs">
              0{idx + 1}
            </span>
            <h3 className="font-display text-2xl leading-tight font-medium tracking-tight">
              {card.title}
            </h3>
            <p className="text-muted text-sm leading-relaxed">{card.body}</p>
            <Link
              href={card.href}
              className="text-teranga-primary mt-2 inline-flex items-center gap-1.5 text-sm font-medium"
            >
              {card.link}
              <ArrowUpRight className="size-4 transition-transform duration-300 [transition-timing-function:var(--ease-expo-out)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </motion.li>
        ))}
      </motion.ul>
    </Section>
  );
}
