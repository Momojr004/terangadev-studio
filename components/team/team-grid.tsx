"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { teamMembers } from "@/lib/team";
import { staggerParent, staggerChild } from "@/components/motion/reveal";
import { cn } from "@/lib/cn";

function TeamMemberCard({ member }: { member: (typeof teamMembers)[number] }) {
  const t = useTranslations(member.namespace);
  return (
    <motion.li
      variants={staggerChild}
      className="flex flex-col gap-5"
    >
      <div className="border-border bg-surface relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-3xl border">
        <div
          aria-hidden
          className="from-teranga-secondary/20 to-teranga-primary/30 absolute inset-0 bg-gradient-to-br"
        />
        <span className="relative font-display text-7xl font-medium tracking-tight text-fg/30 md:text-8xl">
          {member.initials}
        </span>
      </div>
      <div>
        <h3 className="font-display text-2xl leading-tight font-medium tracking-tight">
          {t("name")}
        </h3>
        <p className="text-teranga-primary mt-1 font-mono text-xs uppercase tracking-[0.18em]">
          {t("role")}
        </p>
        <p className="text-muted mt-3 text-sm leading-relaxed">
          {t("body")}
        </p>
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
