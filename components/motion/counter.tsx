"use client";

import {
  animate,
  useInView,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useEffect, useRef } from "react";

export function Counter({
  value,
  suffix = "",
  prefix = "",
  duration = 1.6,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) =>
    Math.round(latest).toLocaleString("fr-FR"),
  );

  useEffect(() => {
    if (!inView) return;
    const controls = animate(motionValue, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
    });
    return controls.stop;
  }, [inView, motionValue, value, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {/* @ts-expect-error motion value renders as text */}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}
