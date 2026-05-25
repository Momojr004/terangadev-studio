"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowUpRight, Calendar, MessageCircle, FileText } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  Section,
  SectionTag,
  SectionHeadline,
  SectionSubhead,
} from "@/components/site/section";
import { staggerParent, staggerChild } from "@/components/motion/reveal";
import { siteConfig } from "@/lib/site-config";
import { SectionBlobs } from "@/components/site/section-blobs";

export function ContactCTA() {
  const t = useTranslations("Contact");

  const channels = [
    {
      icon: FileText,
      title: t("channel1Title"),
      body: t("channel1Body"),
      cta: t("channel1Cta"),
      href: "/contact",
    },
    {
      icon: Calendar,
      title: t("channel2Title"),
      body: t("channel2Body"),
      cta: t("channel2Cta"),
      href: "https://cal.com/terangadev",
      external: true,
    },
    {
      icon: MessageCircle,
      title: t("channel3Title"),
      body: t("channel3Body"),
      cta: t("channel3Cta"),
      href: `https://wa.me/${siteConfig.whatsapp}`,
      external: true,
    },
  ];

  return (
    <Section id="contact" className="relative overflow-x-clip">
      <SectionBlobs
        blobs={[
          {
            shape: "blob3",
            color: "#7CE891",
            size: "36vw",
            position: { top: "-20%", left: "-12%" },
            rotation: 15,
            animation: "blobDriftC",
            duration: 16,
            opacity: 0.85,
          },
          {
            shape: "blob1",
            color: "#FB7185",
            size: "32vw",
            position: { bottom: "-25%", right: "-10%" },
            rotation: -22,
            animation: "blobDriftD",
            duration: 15,
            delay: -12,
            opacity: 0.75,
          },
          {
            shape: "blob4",
            color: "#F2C94C",
            size: "22vw",
            position: { top: "45%", right: "30%" },
            rotation: 8,
            animation: "blobDriftA",
            duration: 14,
            delay: -25,
            opacity: 0.4,
          },
        ]}
      />

      <div className="relative max-w-3xl">
        <SectionTag>{t("tag")}</SectionTag>
        <SectionHeadline>{t("headline")}</SectionHeadline>
        <SectionSubhead>{t("subhead")}</SectionSubhead>
      </div>

      <motion.ul
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={staggerParent}
        className="relative mt-16 grid gap-4 md:grid-cols-3"
      >
        {channels.map((c, idx) => {
          const Icon = c.icon;
          const cardClasses =
            "border-border bg-bg hover:border-teranga-primary/40 group flex h-full flex-col justify-between gap-8 rounded-2xl border p-8 transition-all duration-500 [transition-timing-function:var(--ease-expo-out)] hover:-translate-y-0.5 md:p-10";
          const cardInner = (
            <>
              <div className="flex flex-col gap-6">
                <span className="bg-teranga-primary/10 text-teranga-primary inline-flex size-10 items-center justify-center rounded-full">
                  <Icon className="size-5" />
                </span>
                <div>
                  <h3 className="font-display text-2xl leading-tight font-medium tracking-tight">
                    {c.title}
                  </h3>
                  <p className="text-muted mt-3 text-sm leading-relaxed">
                    {c.body}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-teranga-primary text-sm font-medium">
                  {c.cta}
                </span>
                <ArrowUpRight className="text-fg/40 size-5 transition-all duration-500 [transition-timing-function:var(--ease-expo-out)] group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-teranga-primary" />
              </div>
            </>
          );
          return (
            <motion.li key={idx} variants={staggerChild}>
              {c.external ? (
                <a
                  href={c.href}
                  target="_blank"
                  rel="noreferrer"
                  className={cardClasses}
                >
                  {cardInner}
                </a>
              ) : (
                <Link href={c.href as never} className={cardClasses}>
                  {cardInner}
                </Link>
              )}
            </motion.li>
          );
        })}
      </motion.ul>
    </Section>
  );
}
