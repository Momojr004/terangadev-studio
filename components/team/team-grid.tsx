"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { teamMembers } from "@/lib/team";
import { staggerParent, staggerChild } from "@/components/motion/reveal";
import { cn } from "@/lib/cn";

function SilhouettePlaceholder() {
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

function TeamMemberCard({ member }: { member: (typeof teamMembers)[number] }) {
  const t = useTranslations(member.namespace);
  return (
    <motion.li variants={staggerChild} className="flex flex-col gap-5">
      <div className="group relative aspect-[4/5] overflow-hidden rounded-3xl bg-neutral-900">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,#1f1f24_0%,#0a0a0c_70%)] grayscale"
        />
        <div
          aria-hidden
          className="from-teranga-primary/30 to-teranga-secondary/40 absolute inset-0 bg-gradient-to-br opacity-0 mix-blend-overlay transition-opacity duration-700 group-hover:opacity-100 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]"
        />
        <SilhouettePlaceholder />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/85 via-black/40 to-transparent"
        />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
          <h3 className="font-display text-2xl leading-tight font-medium tracking-tight text-white drop-shadow">
            {t("name")}
          </h3>
          <span className="text-white/50 font-mono text-[10px] uppercase tracking-[0.18em]">
            {member.initials}
          </span>
        </div>
      </div>
      <div>
        <p className="text-teranga-primary font-mono text-xs uppercase tracking-[0.18em]">
          {t("role")}
        </p>
        <p className="text-muted mt-3 text-sm leading-relaxed">{t("body")}</p>
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {member.stack.map((tech) => (
            <li
              key={tech}
              className="border-border text-muted rounded-full border px-2.5 py-0.5 font-mono text-[10px]"
            >
              {tech}
            </li>
          ))}
        </ul>
      </div>
    </motion.li>
  );
}

export function TeamGrid({ className }: { className?: string }) {
  return (
    <motion.ul
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={staggerParent}
      className={cn(
        "grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {teamMembers.map((member) => (
        <TeamMemberCard key={member.id} member={member} />
      ))}
    </motion.ul>
  );
}
