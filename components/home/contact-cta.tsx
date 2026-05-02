"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowUpRight, Calendar, MessageCircle, FileText } from "lucide-react";
import {
  Section,
  SectionTag,
  SectionHeadline,
  SectionSubhead,
} from "@/components/site/section";
import { staggerParent, staggerChild } from "@/components/motion/reveal";
import { siteConfig } from "@/lib/site-config";

export function ContactCTA() {
  const t = useTranslations("Contact");

  const channels = [
    {
      icon: FileText,
      title: t("channel1Title"),
      body: t("channel1Body"),
      cta: t("channel1Cta"),
      href: "#form",
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
    <Section id="contact">
      <div className="max-w-3xl">
        <SectionTag>{t("tag")}</SectionTag>
        <SectionHeadline>{t("headline")}</SectionHeadline>
        <SectionSubhead>{t("subhead")}</SectionSubhead>
      </div>

      <motion.ul
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={staggerParent}
        className="mt-16 grid gap-4 md:grid-cols-3"
      >
        {channels.map((c, idx) => {
          const Icon = c.icon;
          return (
            <motion.li key={idx} variants={staggerChild}>
              <a
                href={c.href}
                target={c.external ? "_blank" : undefined}
                rel={c.external ? "noreferrer" : undefined}
                className="border-border bg-bg hover:border-teranga-primary/40 group flex h-full flex-col justify-between gap-8 rounded-2xl border p-8 transition-all duration-500 [transition-timing-function:var(--ease-expo-out)] hover:-translate-y-0.5 md:p-10"
              >
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
              </a>
            </motion.li>
          );
        })}
      </motion.ul>
    </Section>
  );
}
