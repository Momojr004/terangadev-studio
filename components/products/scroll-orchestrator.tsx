"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ProductCard } from "./product-card";
import { productSlugs } from "@/lib/products";

export function ScrollOrchestrator() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // 4 cards: translate from 0 to -3 widths to reveal the last one
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-78%"]);

  return (
    <>
      {/* Mobile: stacked vertically */}
      <div className="flex flex-col gap-4 px-6 md:hidden">
        {productSlugs.map((slug, idx) => (
          <ProductCard key={slug} slug={slug} index={idx} variant="stacked" />
        ))}
      </div>

      {/* Desktop: horizontal scroll pinned */}
      <section
        ref={ref}
        aria-label="Produits"
        className="relative hidden md:block"
        style={{ height: `${productSlugs.length * 100}vh` }}
      >
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          <motion.div
            style={{ x }}
            className="flex h-full items-center gap-6 px-6 will-change-transform"
          >
            {productSlugs.map((slug, idx) => (
              <ProductCard
                key={slug}
                slug={slug}
                index={idx}
                variant="horizontal"
              />
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}
