"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  Section,
  SectionTag,
  SectionHeadline,
  SectionSubhead,
} from "@/components/site/section";
import { staggerParent, staggerChild } from "@/components/motion/reveal";
import { teamMembers } from "@/lib/team";

function Silhouette() {
  return (
    <svg
      viewBox="0 0 200 250"
      preserveAspectRatio="xMidYMax meet"
      aria-hidden
      className="absolute inset-x-0 bottom-0 h-[88%] w-full text-white/15 transition-colors duration-700 group-hover:text-white/25 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]"
    >
      <circle cx="100" cy="78" r="36" fill="currentColor" />
      <path
        d="M28 250 C 28 175, 60 142, 100 142 C 140 142, 172 175, 172 250 Z"
        fill="currentColor"
      />
    </svg>
  );
}

function MemberCard({ member }: { member: (typeof teamMembers)[number] }) {
  const t = useTranslations(member.namespace);
  return (
    <motion.li variants={staggerChild} className="flex flex-col gap-4">
      <div className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-neutral-900">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,#1f1f24_0%,#0a0a0c_70%)] grayscale"
        />
        <div
          aria-hidden
          className="from-teranga-primary/30 to-teranga-secondary/40 absolute inset-0 bg-gradient-to-br opacity-0 mix-blend-overlay transition-opacity duration-700 group-hover:opacity-100 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]"
        />
        <Silhouette />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/85 via-black/40 to-transparent"
        />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="font-display text-lg leading-tight font-medium tracking-tight text-white drop-shadow">
            {t("name")}
          </p>
          <p className="text-white/60 font-mono mt-1 text-[10px] uppercase tracking-[0.18em]">
            {t("role")}
          </p>
        </div>
      </div>
    </motion.li>
  );
}

export function TeamTeaser() {
  const t = useTranslations("TeamTeaser");

  return (
    <Section>
      <div className="flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <SectionTag>{t("tag")}</SectionTag>
          <SectionHeadline>{t("headline")}</SectionHeadline>
          <SectionSubhead>{t("subhead")}</SectionSubhead>
        </div>
        <Link
          href="/studio"
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
        className="mt-16 grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-3 lg:grid-cols-6"
      >
        {teamMembers.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </motion.ul>
    </Section>
  );
}
