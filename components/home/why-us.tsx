"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Section,
  SectionTag,
  SectionHeadline,
  SectionSubhead,
} from "@/components/site/section";
import { staggerParent, staggerChild } from "@/components/motion/reveal";
import { SectionBlobs } from "@/components/site/section-blobs";

export function WhyUs() {
  const t = useTranslations("WhyUs");

  const pillars = [
    { title: t("pillar1Title"), body: t("pillar1Body") },
    { title: t("pillar2Title"), body: t("pillar2Body") },
    { title: t("pillar3Title"), body: t("pillar3Body") },
    { title: t("pillar4Title"), body: t("pillar4Body") },
  ];

  return (
    <Section variant="surface" className="relative overflow-x-clip">
      <SectionBlobs
        blobs={[
          {
            shape: "blob2",
            color: "#4EA8F9",
            size: "32vw",
            position: { top: "-15%", right: "-10%" },
            rotation: 18,
            animation: "blobDriftB",
            duration: 17,
            opacity: 0.8,
          },
          {
            shape: "blob4",
            color: "#F2C94C",
            size: "26vw",
            position: { bottom: "-18%", left: "-8%" },
            rotation: -28,
            animation: "blobDriftA",
            duration: 16,
            delay: -15,
            opacity: 0.7,
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
        className="relative mt-16 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-4"
      >
        {pillars.map((p, idx) => (
          <motion.li
            key={idx}
            variants={staggerChild}
            className="border-border flex flex-col gap-3 border-t pt-6"
          >
            <span className="text-teranga-primary font-mono text-xs">
              0{idx + 1}
            </span>
            <h3 className="font-display text-xl leading-tight font-medium tracking-tight">
              {p.title}
            </h3>
            <p className="text-muted text-sm leading-relaxed">{p.body}</p>
          </motion.li>
        ))}
      </motion.ul>
    </Section>
  );
}
