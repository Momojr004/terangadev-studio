"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Counter } from "@/components/motion/counter";
import { staggerParent, staggerChild } from "@/components/motion/reveal";

export function StatsBar() {
  const t = useTranslations("Stats");

  const stats = [
    { value: 4, suffix: "", label: t("stat1Label"), animate: true },
    { value: 30, suffix: "", label: t("stat2Label"), animate: true },
    { value: 6, suffix: "", label: t("stat3Label"), animate: true },
    { raw: t("stat4Value"), label: t("stat4Label") },
  ];

  return (
    <section
      aria-labelledby="stats-heading"
      className="border-border border-y"
    >
      <div className="mx-auto max-w-6xl px-6 py-14 md:py-16">
        <h2 id="stats-heading" className="sr-only">
          {t("tag")}
        </h2>
        <motion.dl
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerParent}
          className="grid grid-cols-2 gap-y-10 md:grid-cols-4 md:gap-y-0"
        >
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              variants={staggerChild}
              className="flex flex-col gap-2"
            >
              <dt className="font-display text-5xl leading-none font-medium tracking-tight md:text-6xl">
                <span className="from-teranga-secondary to-teranga-primary bg-gradient-to-br bg-clip-text text-transparent">
                  {stat.animate ? (
                    <Counter value={stat.value!} />
                  ) : (
                    stat.raw
                  )}
                </span>
              </dt>
              <dd className="text-muted max-w-[16rem] text-sm leading-relaxed">
                {stat.label}
              </dd>
            </motion.div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
