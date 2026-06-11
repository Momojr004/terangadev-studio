"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  Section,
  SectionTag,
  SectionHeadline,
} from "@/components/site/section";
import { staggerParent, staggerChild } from "@/components/motion/reveal";
import { SectionBlobs } from "@/components/site/section-blobs";

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
    <Section className="relative overflow-x-clip">
      <SectionBlobs
        blobs={[
          {
            shape: "blob1",
            color: "#A78BFA",
            size: "24vw",
            position: { top: "-10%", right: "-8%" },
            rotation: 16,
            animation: "blobDriftB",
            duration: 21,
            opacity: 0.5,
          },
          {
            shape: "blob2",
            color: "#7CE891",
            size: "20vw",
            position: { bottom: "5%", left: "-6%" },
            rotation: -14,
            animation: "blobDriftD",
            duration: 19,
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
        className="relative mt-16 grid gap-8 md:grid-cols-3"
      >
        {testimonials.map(({ key }) => (
          <motion.li
            key={key}
            variants={staggerChild}
            className="border-border bg-surface/60 flex flex-col gap-6 rounded-3xl border p-8 backdrop-blur-sm"
          >
            <p className="text-teranga-primary font-mono text-[10px] uppercase tracking-[0.18em]">
              {t(`${key}Company`)}
            </p>
            <blockquote className="font-display text-xl leading-snug font-medium tracking-tight">
              &ldquo;{t(`${key}Quote`)}&rdquo;
            </blockquote>
            <p className="text-muted mt-auto text-sm">{t(`${key}Role`)}</p>
          </motion.li>
        ))}
      </motion.ul>

      <p className="text-muted/70 mt-10 font-mono text-[10px] uppercase tracking-[0.18em]">
        {t("validationNotice")}
      </p>
    </Section>
  );
}
