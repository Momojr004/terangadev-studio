"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  Section,
  SectionTag,
  SectionHeadline,
} from "@/components/site/section";
import { staggerParent, staggerChild } from "@/components/motion/reveal";

type TestimonialKey = "t1" | "t2" | "t3";

const testimonials: ReadonlyArray<{
  key: TestimonialKey;
  caseRef: string;
}> = [
  { key: "t1", caseRef: "hydrautech" },
  { key: "t2", caseRef: "ndougalma" },
  { key: "t3", caseRef: "creneau" },
];

export function Testimonials() {
  const t = useTranslations("Testimonials");

  return (
    <Section variant="dark">
      <div className="max-w-3xl">
        <SectionTag>{t("tag")}</SectionTag>
        <SectionHeadline className="text-white">{t("headline")}</SectionHeadline>
      </div>

      <motion.ul
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={staggerParent}
        className="mt-16 grid gap-8 md:grid-cols-3"
      >
        {testimonials.map(({ key }) => (
          <motion.li
            key={key}
            variants={staggerChild}
            className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-8"
          >
            <p className="text-teranga-secondary font-mono text-[10px] uppercase tracking-[0.18em]">
              {t(`${key}Company`)}
            </p>
            <blockquote className="font-display text-xl leading-snug font-medium tracking-tight text-white">
              &ldquo;{t(`${key}Quote`)}&rdquo;
            </blockquote>
            <p className="mt-auto text-sm text-white/70">{t(`${key}Role`)}</p>
          </motion.li>
        ))}
      </motion.ul>

      <p className="mt-10 text-white/40 font-mono text-[10px] uppercase tracking-[0.18em]">
        {t("validationNotice")}
      </p>
    </Section>
  );
}
